import * as fs from 'fs';
import * as path from 'path';

const readData = (fileName: string) => {
    const filePath = path.join(__dirname, '../../data', fileName);
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
};

const cleanText = (text: string) => {
    return text.replace(/<[^>]*>/g, '').toLowerCase();
};

export const cleanZendeskData = () => {
    const data = readData('zendesk.json');
    const cleanedData = data.map((ticket: any) => ({
        id: ticket.id,
        subject: cleanText(ticket.subject),
        description: cleanText(ticket.description)
    }));
    fs.writeFileSync(path.join(__dirname, '../../data/cleaned/zendesk.json'), JSON.stringify(cleanedData, null, 2));
};