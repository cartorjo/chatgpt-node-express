import path from 'path';
import fs from 'fs/promises';

export const getLanguageCode = (detectedLang: string): string => {
    const languageMap: { [key: string]: string } = {
        'ca': 'ca-ES',  // Catalan
        'es': 'es-ES',  // Spanish
        'en': 'en-UK',  // English
        'fr': 'fr-FR',  // French
        'it': 'it-IT',  // Italian
        'de': 'de-DE',  // German
        'pt': 'pt-PT',  // Portuguese
        'ru': 'ru-RU',  // Russian
        'zh': 'zh-CN',  // Chinese
        'ar': 'ar-SA',  // Arabic
        'ma': 'ar-MA',  // Arabic (Morocco)
        'nl': 'nl-NL',  // Dutch
        'uk': 'uk-UA',  // Ukrainian
        'ja': 'ja-JP',  // Japanese
        'sv': 'sv-SE',  // Swedish
        'ko': 'ko-KR',  // Korean
        'pl': 'pl-PL',  // Polish
        'hi': 'hi-IN',  // Hindi
        'tr': 'tr-TR',  // Turkish
        'vi': 'vi-VN',  // Vietnamese
        'th': 'th-TH',  // Thai
        'fa': 'fa-IR'   // Persian
    };
    return languageMap[detectedLang] || 'ca-ES';  // Default to Catalan if detection fails
};

interface QAData {
    question: string;
    answer: string;
}

const qaCache: { [key: string]: QAData[] } = {};

export const loadQAData = async (langCode: string): Promise<QAData[]> => {
    if (qaCache[langCode]) {
        return qaCache[langCode];
    }

    try {
        const dataPath = path.join(__dirname, `../../data/json/${langCode}.json`);
        console.log(`Loading Q&A data from: ${dataPath}`);  // Debugging log
        const data = await fs.readFile(dataPath, 'utf-8');
        const parsedData: { qa: QAData[] } = JSON.parse(data);
        qaCache[langCode] = parsedData.qa;
        return parsedData.qa;
    } catch (err) {
        console.error(`Error loading Q&A data for language ${langCode}:`, err);
        return [];
    }
};