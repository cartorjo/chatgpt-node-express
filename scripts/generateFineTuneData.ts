import path from 'path';
import { prepareDataForFineTuning } from '../src/utils/pdfUtils';

const exampleData = {
    "intent": "update_email",
    "examples": [
        {
            "text": "Hi, I need to update my email address associated with my T-mobilitat account. How can I do that?",
            "entities": []
        }
    ],
    "responses": [
        {
            "text": "Sure, I can help you with that. You can update your email address through the TPW-Agent. Here’s how:\n1. Update the email in the existing user’s profile on TPW-Agent.\n2. Unlink the T-mobilitat account from JoTMBé (either via the app if you do it yourself or through backoffice.clients.tmb if an agent assists).\n3. Create a new user on the website with the correct email address.\n4. Enter the TMB app with the new details and link the JoTMBé account with T-mobilitat:\n   - Go to Configuration > Linked Services > T-mobilitat Account > Link Account."
        }
    ]
};

const run = async () => {
    try {
        const pdfFolder = path.resolve(__dirname, '../data/sample_pdfs');
        const fineTuningDataPath = await prepareDataForFineTuning(pdfFolder, exampleData);
        console.log(`Fine-tuning data has been generated and saved to ${fineTuningDataPath}`);
    } catch (error) {
        console.error('Error generating fine-tuning data:', error);
    }
};

run();