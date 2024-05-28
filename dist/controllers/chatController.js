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
const languageUtils_1 = require("../utils/languageUtils");
const ttsUtils_1 = require("../utils/ttsUtils");
const DEFAULT_VOICE = 'nova';
const DEFAULT_ERROR_MESSAGE = 'No response from AI';
const chatController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const { message, enableTTS, voice = DEFAULT_VOICE, language } = req.body;
    try {
        if (!message) {
            res.status(400).json({ error: 'Message is required.' });
            return;
        }
        // Use the provided language code or default to 'en-UK'
        const languageCode = language || 'en-UK';
        console.log(`Selected language code: ${languageCode}`);
        // Load Q&A data for the detected language
        const qaData = yield (0, languageUtils_1.loadQAData)(languageCode);
        console.log(`Loaded Q&A data for ${languageCode}`);
        // Check if the message matches any predefined questions
        const matchedQA = qaData.find((qa) => qa.question.toLowerCase() === message.toLowerCase());
        let botReply = matchedQA ? matchedQA.answer : '';
        // If no predefined answer, query OpenAI API
        if (!botReply) {
            const completion = yield openaiConfig_1.default.chat.completions.create({
                model: 'gpt-4',
                messages: [{ role: 'user', content: message }],
                max_tokens: 300,
                temperature: 0.7,
            });
            botReply = ((_b = (_a = completion.choices[0].message) === null || _a === void 0 ? void 0 : _a.content) === null || _b === void 0 ? void 0 : _b.trim()) || DEFAULT_ERROR_MESSAGE;
            console.log('Queried OpenAI API');
        }
        else {
            console.log('Matched predefined Q&A');
        }
        // Handle TTS response if enabled
        if (enableTTS) {
            const audioFileName = yield (0, ttsUtils_1.handleTTSResponse)(voice, botReply);
            console.log(`Generated TTS audio: ${audioFileName}`);
            res.json({ reply: botReply, audioUrl: `/${audioFileName}` });
        }
        else {
            res.json({ reply: botReply });
        }
    }
    catch (err) {
        const error = err;
        console.error('Error:', error.message);
        res.status(500).json({ error: error.message || 'Internal Server Error' });
        next(error);
    }
});
exports.chatController = chatController;
