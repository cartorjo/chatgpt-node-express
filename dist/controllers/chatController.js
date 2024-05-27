"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.chatController = void 0;
const openaiConfig_1 = __importDefault(require("../config/openaiConfig"));
const path_1 = __importDefault(require("path"));
const promises_1 = __importDefault(require("fs/promises"));
const langdetect_1 = require("langdetect"); // Importing a language detection library
// Memoize loaded Q&A data
const qaCache = {};
// Function to load Q&A data based on the language code
const loadQAData = (langCode) => __awaiter(void 0, void 0, void 0, function* () {
    if (qaCache[langCode]) {
        return qaCache[langCode];
    }
    try {
        const dataPath = path_1.default.join(__dirname, `../../data/json/${langCode}.json`);
        const data = yield promises_1.default.readFile(dataPath, 'utf-8');
        const parsedData = JSON.parse(data);
        qaCache[langCode] = parsedData.qa;
        return parsedData.qa;
    }
    catch (err) {
        console.error(`Error loading Q&A data for language ${langCode}:`, err);
        return [];
    }
});
// Improved language mapping
const getLanguageCode = (detectedLang) => {
    const languageMap = {
        'ca': 'ca-ES', // Catalan
        'es': 'es-ES', // Spanish
        'en': 'en-US', // English
        'fr': 'fr-FR', // French
        'it': 'it-IT', // Italian
        'de': 'de-DE', // German
        'pt': 'pt-PT', // Portuguese
        'ru': 'ru-RU', // Russian
        'zh': 'zh-CN', // Chinese
        'ar': 'ar-SA', // Arabic
        'nl': 'nl-NL', // Dutch
        'uk': 'uk-UA', // Ukrainian
        'ja': 'ja-JP', // Japanese
        'sv': 'sv-SE', // Swedish
        'ko': 'ko-KR', // Korean
        'pl': 'pl-PL', // Polish
        'hi': 'hi-IN', // Hindi
        'tr': 'tr-TR', // Turkish
        'vi': 'vi-VN', // Vietnamese
        'th': 'th-TH', // Thai
        'fa': 'fa-IR' // Persian
    };
    return languageMap[detectedLang] || 'ca-ES'; // Default to Catalan if detection fails
};
// Function to handle TTS response
const handleTTSResponse = (voice, botReply) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const ttsResponse = yield openaiConfig_1.default.audio.speech.create({
            model: 'tts-1',
            voice: voice,
            input: botReply,
            response_format: 'mp3',
            speed: 1.0,
        });
        const audioFileName = `speech-${Date.now()}.mp3`;
        const audioFilePath = path_1.default.resolve(__dirname, '../public', audioFileName);
        const buffer = Buffer.from(yield ttsResponse.arrayBuffer());
        yield promises_1.default.writeFile(audioFilePath, buffer);
        return audioFileName;
    }
    catch (err) {
        console.error('Error generating TTS response:', err);
        throw new Error('Failed to generate TTS response');
    }
});
// Main controller function
const chatController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const { message, enableTTS, voice = 'nova' } = req.body;
    try {
        // Detect language of the input message
        const detectedLang = (0, langdetect_1.detect)(message)[0].length > 1 ? (0, langdetect_1.detect)(message)[0] : 'en';
        const languageCode = getLanguageCode(detectedLang);
        // Load Q&A data for the detected language
        const qaData = yield loadQAData(languageCode);
        // Check if the message matches any predefined questions
        const matchedQA = qaData.find(qa => qa.question.toLowerCase() === message.toLowerCase());
        let botReply = matchedQA ? matchedQA.answer : '';
        // If no predefined answer, query OpenAI API
        if (!botReply) {
            const completion = yield openaiConfig_1.default.chat.completions.create({
                model: 'gpt-4',
                messages: [{ role: 'user', content: message }],
                max_tokens: 300,
                temperature: 0.7,
            });
            botReply = ((_b = (_a = completion.choices[0].message) === null || _a === void 0 ? void 0 : _a.content) === null || _b === void 0 ? void 0 : _b.trim()) || 'No response from AI';
        }
        // Handle TTS response if enabled
        if (enableTTS) {
            const audioFileName = yield handleTTSResponse(voice, botReply);
            res.json({ reply: botReply, audioUrl: `/${audioFileName}` });
        }
        else {
            res.json({ reply: botReply });
        }
    }
    catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
        next(error);
    }
});
exports.chatController = chatController;
