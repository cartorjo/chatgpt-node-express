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
exports.fineTuneModel = exports.prepareDataForFineTuning = exports.extractTextsFromPDFs = void 0;
const fs_1 = __importDefault(require("fs"));
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
const pdf_parse_1 = __importDefault(require("pdf-parse"));
const openaiConfig_1 = __importDefault(require("../config/openaiConfig"));
const extractTextFromPDF = (pdfPath) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const dataBuffer = yield promises_1.default.readFile(pdfPath);
        const data = yield (0, pdf_parse_1.default)(dataBuffer);
        return data.text;
    }
    catch (error) {
        console.error(`Error extracting text from PDF ${pdfPath}:`, error);
        throw error;
    }
});
const extractTextsFromPDFs = (pdfFolder) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const pdfTexts = {};
        const files = yield promises_1.default.readdir(pdfFolder);
        yield Promise.all(files.map((file) => __awaiter(void 0, void 0, void 0, function* () {
            if (file.endsWith('.pdf')) {
                const filePath = path_1.default.join(pdfFolder, file);
                pdfTexts[file] = yield extractTextFromPDF(filePath);
            }
        })));
        return pdfTexts;
    }
    catch (error) {
        console.error(`Error reading PDF folder ${pdfFolder}:`, error);
        throw error;
    }
});
exports.extractTextsFromPDFs = extractTextsFromPDFs;
const createMessageData = (role, content) => ({ role, content });
const convertToFineTuneData = (pdfTexts, intentData) => {
    const fineTuneData = [];
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
        intentData.examples.forEach((example) => {
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
const prepareDataForFineTuning = (pdfFolder, intentData) => __awaiter(void 0, void 0, void 0, function* () {
    const pdfTexts = yield (0, exports.extractTextsFromPDFs)(pdfFolder);
    const fineTuningData = convertToFineTuneData(pdfTexts, intentData);
    const fineTuningDataPath = path_1.default.resolve(__dirname, '../../data/fine_tuning_data.jsonl');
    yield promises_1.default.writeFile(fineTuningDataPath, fineTuningData.map(record => JSON.stringify(record)).join('\n'), 'utf-8');
    return fineTuningDataPath;
});
exports.prepareDataForFineTuning = prepareDataForFineTuning;
const uploadFile = (filePath) => __awaiter(void 0, void 0, void 0, function* () {
    const file = fs_1.default.createReadStream(filePath);
    const response = yield openaiConfig_1.default.files.create({
        purpose: 'fine-tune',
        file
    });
    return response.id;
});
const fineTuneModel = (fineTuningDataPath) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const trainingFileId = yield uploadFile(fineTuningDataPath);
        yield openaiConfig_1.default.fineTuning.jobs.create({
            training_file: trainingFileId,
            model: 'gpt-3.5-turbo-0125',
            hyperparameters: {
                n_epochs: 3
            }
        });
        console.log(`Fine-tune job created with training file ID: ${trainingFileId}`);
    }
    catch (error) {
        console.error('Error fine-tuning the model:', error);
        throw error;
    }
});
exports.fineTuneModel = fineTuneModel;
