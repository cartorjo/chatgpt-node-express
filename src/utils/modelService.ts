import * as fs from 'fs';
import * as path from 'path';

const loadModel = () => {
    const filePath = path.join(__dirname, '../models/model.json');
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
};

const model = loadModel();

export const getResponse = (query: string): string => {
    // Placeholder for model logic
    return `Model response for: ${query}`;
};