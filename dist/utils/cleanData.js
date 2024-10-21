"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cleanZendeskData = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const readData = (fileName) => {
    const filePath = path.join(__dirname, '../../data', fileName);
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
};
const cleanText = (text) => {
    return text.replace(/<[^>]*>/g, '').toLowerCase();
};
const cleanZendeskData = () => {
    const data = readData('zendesk.json');
    const cleanedData = data.map((ticket) => ({
        id: ticket.id,
        subject: cleanText(ticket.subject),
        description: cleanText(ticket.description)
    }));
    fs.writeFileSync(path.join(__dirname, '../../data/cleaned/zendesk.json'), JSON.stringify(cleanedData, null, 2));
};
exports.cleanZendeskData = cleanZendeskData;
