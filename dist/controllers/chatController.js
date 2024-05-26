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
const fs_1 = __importDefault(require("fs"));
const chatController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const { message, enableTTS, voice = 'nova', language = 'ca-ES' } = req.body;
    try {
        const completion = yield openaiConfig_1.default.chat.completions.create({
            model: 'gpt-4',
            messages: [{ role: 'user', content: message }],
            max_tokens: 300,
            temperature: 0.7,
        });
        // Ensure to get the full response from OpenAI
        const botReply = ((_b = (_a = completion.choices[0].message) === null || _a === void 0 ? void 0 : _a.content) === null || _b === void 0 ? void 0 : _b.trim()) || 'No response from AI';
        if (enableTTS) {
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
            yield fs_1.default.promises.writeFile(audioFilePath, buffer);
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
