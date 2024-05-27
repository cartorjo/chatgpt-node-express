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
const pdfUtils_1 = require("../utils/pdfUtils");
const langdetect_1 = require("langdetect");
const express_1 = __importDefault(require("express"));
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
    const audioFileName = `speech-${Date.now()}.mp3`;
    const audioFilePath = path_1.default.resolve(__dirname, '../public', audioFileName);
    const buffer = Buffer.from(yield ttsResponse.arrayBuffer());
    yield promises_1.default.writeFile(audioFilePath, buffer);
    return audioFileName;
});
const chatController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const { message, enableTTS, voice = 'nova', fineTune } = req.body;
    try {
        const detectedLang = (0, langdetect_1.detect)(message); // Use detect function from langdetect
        const langCode = getLanguageCode(detectedLang);
        const selectedVoice = voice;
        // Load the appropriate Q&A data
        const qaData = yield loadQAData(langCode);
        // Check if the message matches any predefined questions
        const matchedQA = qaData.find(qa => qa.question.toLowerCase() === message.toLowerCase());
        if (matchedQA) {
            const botReply = matchedQA.answer;
            if (enableTTS) {
                const audioFileName = yield handleTTSResponse(selectedVoice, botReply);
                res.json({ reply: botReply, audioUrl: `/public/${audioFileName}` });
            }
            else {
                res.json({ reply: botReply });
            }
            return;
        }
        // If no match, call the OpenAI API
        const completion = yield openaiConfig_1.default.chat.completions.create({
            model: 'gpt-4',
            messages: [{ role: 'user', content: message }],
            max_tokens: 300,
            temperature: 0.7,
        });
        const botReply = ((_b = (_a = completion.choices[0].message) === null || _a === void 0 ? void 0 : _a.content) === null || _b === void 0 ? void 0 : _b.trim()) || 'No response from AI';
        if (fineTune) {
            const pdfFolder = path_1.default.resolve(__dirname, '../../data/sample_pdfs');
            const fineTuningDataPath = yield (0, pdfUtils_1.prepareDataForFineTuning)(pdfFolder);
            yield (0, pdfUtils_1.fineTuneModel)(fineTuningDataPath);
        }
        if (enableTTS) {
            const audioFileName = yield handleTTSResponse(selectedVoice, botReply);
            res.json({ reply: botReply, audioUrl: `/public/${audioFileName}` });
        }
        else {
            res.json({ reply: botReply });
        }
    }
    catch (error) {
        console.error('Error:', error);
        next(error);
    }
});
exports.chatController = chatController;
// Serve static files
const app = (0, express_1.default)();
app.use('/public', express_1.default.static(path_1.default.join(__dirname, '../../public')));
// Add other middleware and routes as needed
exports.default = app;
