import { Request, Response, NextFunction } from 'express';
import openai from '../config/openaiConfig';
import { getLanguageCode, loadQAData } from '../utils/languageUtils';
import { handleTTSResponse } from '../utils/ttsUtils';

const DEFAULT_VOICE = 'nova';
const DEFAULT_ERROR_MESSAGE = 'No response from AI';

export const chatController = async (req: Request, res: Response, next: NextFunction) => {
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
        const qaData = await loadQAData(languageCode);
        console.log(`Loaded Q&A data for ${languageCode}`);

        // Check if the message matches any predefined questions
        const matchedQA = qaData.find((qa: { question: string }) => qa.question.toLowerCase() === message.toLowerCase());

        let botReply = matchedQA ? matchedQA.answer : '';

        // If no predefined answer, query OpenAI API
        if (!botReply) {
            const completion = await openai.chat.completions.create({
                model: 'gpt-4',
                messages: [{ role: 'user', content: message }],
                max_tokens: 300,
                temperature: 0.7,
            });

            botReply = completion.choices[0].message?.content?.trim() || DEFAULT_ERROR_MESSAGE;
            console.log('Queried OpenAI API');
        } else {
            console.log('Matched predefined Q&A');
        }

        // Handle TTS response if enabled
        if (enableTTS) {
            const audioFileName = await handleTTSResponse(voice, botReply);
            console.log(`Generated TTS audio: ${audioFileName}`);
            res.json({ reply: botReply, audioUrl: `/${audioFileName}` });
        } else {
            res.json({ reply: botReply });
        }
    } catch (err) {
        const error = err as Error;
        console.error('Error:', error.message);
        res.status(500).json({ error: error.message || 'Internal Server Error' });
        next(error);
    }
};