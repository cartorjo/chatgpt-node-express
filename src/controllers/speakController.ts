import { Request, Response, NextFunction } from 'express';
import fs from 'fs';
import path from 'path';
import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY, // Ensure your API key is set in the environment variables
});

export const speakController = async (req: Request, res: Response, next: NextFunction) => {
    const { text, voice = 'nova', response_format = 'mp3', speed = 1.0 } = req.body;

    try {
        // Create the speech using OpenAI API
        const response = await openai.audio.speech.create({
            model: 'tts-1',
            voice: voice,
            input: text,
            response_format: response_format,
            speed: speed,
        });

        // Define the path to save the audio file
        const audioFileName = `speech-${Date.now()}.${response_format}`;
        const audioFilePath = path.resolve(`./public/${audioFileName}`);

        // Write the audio file to the filesystem
        const buffer = Buffer.from(await response.arrayBuffer());
        await fs.promises.writeFile(audioFilePath, buffer);

        // Send the audio file URL as a response
        res.json({ audioUrl: `/${audioFileName}` });
    } catch (error) {
        next(error); // Pass the error to the error handling middleware
    }
};