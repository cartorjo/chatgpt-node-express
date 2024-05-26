import { Request, Response, NextFunction } from 'express';
import openai from '../config/openaiConfig';

export const chatController = async (req: Request, res: Response, next: NextFunction) => {
    const userMessage = req.body.message;

    try {
        const completion = await openai.chat.completions.create({
            model: 'gpt-4',
            messages: [
                { role: 'user', content: userMessage },
            ],
            temperature: 0.7,
            max_tokens: 150,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0,
        });

        const botReply = completion.choices?.[0]?.message?.content?.trim() ?? 'No response from AI';
        res.json({ reply: botReply });
    } catch (error) {
        next(error); // Pass the error to the error handling middleware
    }
};