import fs from 'fs';
import path from 'path';
import openai from '../config/openaiConfig';

const translate = async (text: string, targetLanguage: string): Promise<string> => {
    const prompt = `Translate the following text to ${targetLanguage}: ${text}`;
    const response = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [{role: 'user', content: prompt}],
        max_tokens: 512,
        temperature: 0.5,
    });

    const translatedText = response.choices[0].message?.content?.trim();
    if (!translatedText) {
        throw new Error('No translation received from OpenAI');
    }
    return translatedText;
};

const readJsonFile = (filePath: string): Promise<any> => {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                reject(err);
            } else {
                try {
                    resolve(JSON.parse(data));
                } catch (parseErr) {
                    reject(parseErr);
                }
            }
        });
    });
};

const writeJsonFile = (filePath: string, data: any): Promise<void> => {
    return new Promise((resolve, reject) => {
        fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8', err => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
};

const translateJson = async (inputFilePath: string, outputFilePath: string, targetLanguage: string) => {
    try {
        const data = await readJsonFile(inputFilePath);
        const translatedData: any = {};

        for (const key in data) {
            if (data.hasOwnProperty(key)) {
                const value = data[key];
                if (typeof value === 'string') {
                    translatedData[key] = await translate(value, targetLanguage);
                } else {
                    translatedData[key] = value;
                }
            }
        }

        await writeJsonFile(outputFilePath, translatedData);
        console.log(`Translation complete. Translated file saved to ${outputFilePath}`);
    } catch (error) {
        console.error('Error translating JSON file:', error);
    }
};

export const translateToMultipleLanguages = async (inputFilePath: string, languages: {
    code: string,
    name: string
}[]) => {
    for (const lang of languages) {
        const outputFilePath = path.join(__dirname, `${lang.code}.json`);
        await translateJson(inputFilePath, outputFilePath, lang.name);
    }
};