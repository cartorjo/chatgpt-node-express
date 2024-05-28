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
exports.handleTTSResponse = void 0;
const path_1 = __importDefault(require("path"));
const promises_1 = __importDefault(require("fs/promises"));
const openaiConfig_1 = __importDefault(require("../config/openaiConfig"));
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
exports.handleTTSResponse = handleTTSResponse;
