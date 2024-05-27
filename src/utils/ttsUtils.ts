import path from 'path';
import fs from 'fs/promises';
import openai from '../config/openaiConfig';

type VoiceType = 'alloy' | 'echo' | 'fable' | 'onyx' | 'nova' | 'shimmer';

export const handleTTSResponse = async (voice: VoiceType, botReply: string): Promise<string> => {
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
