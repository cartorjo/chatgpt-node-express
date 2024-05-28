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
exports.loadQAData = exports.getLanguageCode = void 0;
const path_1 = __importDefault(require("path"));
const promises_1 = __importDefault(require("fs/promises"));
const getLanguageCode = (detectedLang) => {
    const languageMap = {
        'ca': 'ca-ES', // Catalan
        'es': 'es-ES', // Spanish
        'en': 'en-UK', // English
        'fr': 'fr-FR', // French
        'it': 'it-IT', // Italian
        'de': 'de-DE', // German
        'pt': 'pt-PT', // Portuguese
        'ru': 'ru-RU', // Russian
        'zh': 'zh-CN', // Chinese
        'ar': 'ar-SA', // Arabic
        'ma': 'ar-MA', // Arabic (Morocco)
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
exports.getLanguageCode = getLanguageCode;
const qaCache = {};
const loadQAData = (langCode) => __awaiter(void 0, void 0, void 0, function* () {
    if (qaCache[langCode]) {
        return qaCache[langCode];
    }
    try {
        const dataPath = path_1.default.join(__dirname, `../../data/json/${langCode}.json`);
        console.log(`Loading Q&A data from: ${dataPath}`); // Debugging log
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
exports.loadQAData = loadQAData;
