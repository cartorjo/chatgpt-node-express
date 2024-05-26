import { Request, Response, NextFunction } from 'express';
import openai from '../config/openaiConfig';
import path from 'path';
import fs from 'fs';

export const chatController = async (req: Request, res: Response, next: NextFunction) => {
    const { message, enableTTS, voice = 'nova', language = 'en-US' } = req.body;

    try {
        const completion = await openai.chat.completions.create({
            model: 'gpt-4',
            messages: [{ role: 'user', content: message }],
            max_tokens: 150,
            temperature: 0.7,
        });

        const botReply = completion.choices?.[0]?.message?.content?.trim() ?? 'No response from AI';

        if (enableTTS) {
            const ttsResponse = await openai.audio.speech.create({
                model: 'tts-1',
                voice: voice,
                input: botReply,
                response_format: 'mp3',
                speed: 1.0,
            });

            const audioFileName = `speech-${Date.now()}.mp3`;
            const audioFilePath = path.resolve(__dirname, '../../public', audioFileName);
            const buffer = Buffer.from(await ttsResponse.arrayBuffer());
            await fs.promises.writeFile(audioFilePath, buffer);

            res.json({ reply: botReply, audioUrl: `/${audioFileName}` });
        } else {
            res.json({ reply: botReply });
        }
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
        next(error);
    }
};