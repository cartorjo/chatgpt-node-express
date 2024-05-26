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
exports.speakController = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const openai_1 = __importDefault(require("openai"));
const openai = new openai_1.default({
    apiKey: process.env.OPENAI_API_KEY, // Ensure your API key is set in the environment variables
});
const speakController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { text, voice = 'nova', response_format = 'mp3', speed = 1.0 } = req.body;
    try {
        // Create the speech using OpenAI API
        const response = yield openai.audio.speech.create({
            model: 'tts-1',
            voice: voice,
            input: text,
            response_format: response_format,
            speed: speed,
        });
        // Define the path to save the audio file
        const audioFileName = `speech-${Date.now()}.${response_format}`;
        const audioFilePath = path_1.default.resolve(`./public/${audioFileName}`);
        // Write the audio file to the filesystem
        const buffer = Buffer.from(yield response.arrayBuffer());
        yield fs_1.default.promises.writeFile(audioFilePath, buffer);
        // Send the audio file URL as a response
        res.json({ audioUrl: `/${audioFileName}` });
    }
    catch (error) {
        next(error); // Pass the error to the error handling middleware
    }
});
exports.speakController = speakController;
