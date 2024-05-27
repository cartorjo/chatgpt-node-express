"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateFineTuneData = void 0;
const path_1 = __importDefault(require("path"));
const pdfUtils_1 = require("../utils/pdfUtils");
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
const generateFineTuneData = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const pdfFolder = path_1.default.resolve(__dirname, '../../data/sample_pdfs');
        const fineTuningDataPath = yield (0, pdfUtils_1.prepareDataForFineTuning)(pdfFolder, exampleData);
        res.json({ message: `Fine-tuning data has been generated and saved to ${fineTuningDataPath}` });
    }
    catch (error) {
        console.error('Error generating fine-tuning data:', error);
        res.status(500).json({ error: 'Internal Server Error' });
        next(error);
    }
});
exports.generateFineTuneData = generateFineTuneData;
