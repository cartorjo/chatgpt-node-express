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
exports.translateToMultipleLanguages = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const openaiConfig_1 = __importDefault(require("../config/openaiConfig"));
const translate = (text, targetLanguage) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const prompt = `Translate the following text to ${targetLanguage}: ${text}`;
    const response = yield openaiConfig_1.default.chat.completions.create({
        model: 'gpt-4',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 512,
        temperature: 0.5,
    });
    const translatedText = (_b = (_a = response.choices[0].message) === null || _a === void 0 ? void 0 : _a.content) === null || _b === void 0 ? void 0 : _b.trim();
    if (!translatedText) {
        throw new Error('No translation received from OpenAI');
    }
    return translatedText;
});
const readJsonFile = (filePath) => {
    return new Promise((resolve, reject) => {
        fs_1.default.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                reject(err);
            }
            else {
                try {
                    resolve(JSON.parse(data));
                }
                catch (parseErr) {
                    reject(parseErr);
                }
            }
        });
    });
};
const writeJsonFile = (filePath, data) => {
    return new Promise((resolve, reject) => {
        fs_1.default.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8', err => {
            if (err) {
                reject(err);
            }
            else {
                resolve();
            }
        });
    });
};
const translateJson = (inputFilePath, outputFilePath, targetLanguage) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield readJsonFile(inputFilePath);
        const translatedData = {};
        for (const key in data) {
            if (data.hasOwnProperty(key)) {
                const value = data[key];
                if (typeof value === 'string') {
                    translatedData[key] = yield translate(value, targetLanguage);
                }
                else {
                    translatedData[key] = value;
                }
            }
        }
        yield writeJsonFile(outputFilePath, translatedData);
        console.log(`Translation complete. Translated file saved to ${outputFilePath}`);
    }
    catch (error) {
        console.error('Error translating JSON file:', error);
    }
});
const translateToMultipleLanguages = (inputFilePath, languages) => __awaiter(void 0, void 0, void 0, function* () {
    for (const lang of languages) {
        const outputFilePath = path_1.default.join(__dirname, `${lang.code}.json`);
        yield translateJson(inputFilePath, outputFilePath, lang.name);
    }
});
exports.translateToMultipleLanguages = translateToMultipleLanguages;
