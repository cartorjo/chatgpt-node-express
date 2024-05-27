import { Request, Response, NextFunction } from 'express';
import openai from '../config/openaiConfig';
import { detect } from 'langdetect';
import { getLanguageCode, loadQAData } from '../utils/languageUtils';
import { handleTTSResponse } from '../utils/ttsUtils';

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
