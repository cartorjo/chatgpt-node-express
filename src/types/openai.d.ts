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
                const text = await extractTextFromPDF(filePath);
                pdfTexts[file] = text;
            }
        }));

        return pdfTexts;
    } catch (error) {
        console.error(`Error reading PDF folder ${pdfFolder}:`, error);
        throw error;
    }
};

interface FineTuneData {
    prompt: string;
    completion: string;
}

export const prepareDataForFineTuning = async (pdfTexts: Record<string, string>): Promise<string> => {
    const fineTuningData: FineTuneData[] = Object.entries(pdfTexts).map(([pdfFile, text]) => ({
        prompt: `Document from ${pdfFile}:\n\n`,
        completion: text.trim() + '\n'
    }));

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
        await openai.fineTunes.create({
            training_file: trainingFileId,
            model: 'gpt-4'  // or 'gpt-3.5-turbo'
        });
        console.log(`Fine-tune job created with training file ID: ${trainingFileId}`);
    } catch (error) {
        console.error('Error fine-tuning the model:', error);
        throw error;
    }
};