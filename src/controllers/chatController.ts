import { Request, Response, NextFunction } from 'express';
import openai from '../config/openaiConfig';
import path from 'path';
import fs from 'fs/promises';
import { detect } from 'langdetect'; // Importing a language detection library

// Define the possible voices as a union type
type VoiceType = 'alloy' | 'echo' | 'fable' | 'onyx' | 'nova' | 'shimmer';

// Interface for Q&A data
interface QAData {
    question: string;
    answer: string;
}

// Memoize loaded Q&A data
const qaCache: { [key: string]: QAData[] } = {};

// Function to load Q&A data based on the language code
const loadQAData = async (langCode: string): Promise<QAData[]> => {
    if (qaCache[langCode]) {
        return qaCache[langCode];
    }

    try {
        const dataPath = path.join(__dirname, `../../data/json/${langCode}.json`);
        const data = await fs.readFile(dataPath, 'utf-8');
        const parsedData: { qa: QAData[] } = JSON.parse(data);
        qaCache[langCode] = parsedData.qa;
        return parsedData.qa;
    } catch (err) {
        console.error(`Error loading Q&A data for language ${langCode}:`, err);
        return [];
    }
};

// Improved language mapping
const getLanguageCode = (detectedLang: string): string => {
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

// Function to handle TTS response
const handleTTSResponse = async (voice: VoiceType, botReply: string): Promise<string> => {
    try {
        const ttsResponse = await openai.audio.speech.create({
            model: 'tts-1',
            voice: voice,
            input: botReply,
            response_format: 'mp3',
            speed: 1.0,
        });

        const audioFileName = `speech-${Date.now()}.mp3`;
        const audioFilePath = path.resolve(__dirname, '../public', audioFileName);
        const buffer = Buffer.from(await ttsResponse.arrayBuffer());
        await fs.writeFile(audioFilePath, buffer);

        return audioFileName;
    } catch (err) {
        console.error('Error generating TTS response:', err);
        throw new Error('Failed to generate TTS response');
    }
};

// Main controller function
export const chatController = async (req: Request, res: Response, next: NextFunction) => {
    const { message, enableTTS, voice = 'nova' } = req.body;

    try {
        // Detect language of the input message
        const detectedLang = detect(message)[0].length > 1 ? detect(message)[0] : 'en';
        const languageCode = getLanguageCode(detectedLang);

        // Load Q&A data for the detected language
        const qaData = await loadQAData(languageCode);

        // Check if the message matches any predefined questions
        const matchedQA = qaData.find(qa => qa.question.toLowerCase() === message.toLowerCase());

        let botReply = matchedQA ? matchedQA.answer : '';

        // If no predefined answer, query OpenAI API
        if (!botReply) {
            const completion = await openai.chat.completions.create({
                model: 'gpt-4',
                messages: [{ role: 'user', content: message }],
                max_tokens: 300,
                temperature: 0.7,
            });

            botReply = completion.choices[0].message?.content?.trim() || 'No response from AI';
        }

        // Handle TTS response if enabled
        if (enableTTS) {
            const audioFileName = await handleTTSResponse(voice, botReply);
            res.json({ reply: botReply, audioUrl: `/${audioFileName}` });
        } else {
            res.json({ reply: botReply });
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
        next(error);
    }
};