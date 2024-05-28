import fs from 'fs';
import fsp from 'fs/promises';
import path from 'path';
import pdf from 'pdf-parse';
import openai from '../config/openaiConfig';

const extractTextFromPDF = async (pdfPath: string): Promise<string> => {
    try {
        const dataBuffer = await fsp.readFile(pdfPath);
        const data = await pdf(dataBuffer);
        return data.text;
    } catch (error) {
        console.error(`Error extracting text from PDF ${pdfPath}:`, error);
        throw error;
    }
};

export const extractTextsFromPDFs = async (pdfFolder: string): Promise<Record<string, string>> => {
    try {
        const pdfTexts: Record<string, string> = {};
        const files = await fsp.readdir(pdfFolder);

        await Promise.all(files.map(async (file) => {
            if (file.endsWith('.pdf')) {
                const filePath = path.join(pdfFolder, file);
                pdfTexts[file] = await extractTextFromPDF(filePath);
            }
        }));

        return pdfTexts;
    } catch (error) {
        console.error(`Error reading PDF folder ${pdfFolder}:`, error);
        throw error;
    }
};

interface FineTuneData {
    messages: { role: string; content: string }[];
}

const createMessageData = (role: string, content: string) => ({ role, content });

const convertToFineTuneData = (pdfTexts: Record<string, string>, intentData?: any): FineTuneData[] => {
    const fineTuneData: FineTuneData[] = [];

    for (const [file, text] of Object.entries(pdfTexts)) {
        fineTuneData.push({
            messages: [
                createMessageData('system', `Extracted from ${file}`),
                createMessageData('user', text),
                createMessageData('assistant', 'Ideal response or further completion text.')
            ]
        });
    }

    if (intentData) {
        intentData.examples.forEach((example: any) => {
            fineTuneData.push({
                messages: [
                    createMessageData('user', example.text),
                    createMessageData('assistant', intentData.responses[0].text)
                ]
            });
        });
    }

    return fineTuneData;
};

export const prepareDataForFineTuning = async (pdfFolder: string, intentData?: any): Promise<string> => {
    const pdfTexts = await extractTextsFromPDFs(pdfFolder);
    const fineTuningData = convertToFineTuneData(pdfTexts, intentData);

    const fineTuningDataPath = path.resolve(__dirname, '../../data/fine_tuning_data.jsonl');
    await fsp.writeFile(fineTuningDataPath, fineTuningData.map(record => JSON.stringify(record)).join('\n'), 'utf-8');
    return fineTuningDataPath;
};

const uploadFile = async (filePath: string): Promise<string> => {
    const file = fs.createReadStream(filePath);
    const response = await openai.files.create({
        purpose: 'fine-tune',
        file
    });
    return response.id;
};

export const fineTuneModel = async (fineTuningDataPath: string): Promise<void> => {
    try {
        const trainingFileId = await uploadFile(fineTuningDataPath);
        await openai.fineTuning.jobs.create({
            training_file: trainingFileId,
            model: 'gpt-3.5-turbo-0125',
            hyperparameters: {
                n_epochs: 3
            }
        });
        console.log(`Fine-tune job created with training file ID: ${trainingFileId}`);
    } catch (error) {
        console.error('Error fine-tuning the model:', error);
        throw error;
    }
};