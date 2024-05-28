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
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveCompletionToDatabase = exports.savePromptToDatabase = void 0;
const savePromptToDatabase = (prompt) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Implement the actual database save logic here
        console.log('Saving prompt to database:', prompt);
        // Example: await db.collection('prompts').insertOne({ prompt });
    }
    catch (error) {
        console.error('Error saving prompt to database:', error);
    }
});
exports.savePromptToDatabase = savePromptToDatabase;
const saveCompletionToDatabase = (completion) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Implement the actual database save logic here
        console.log('Saving completion to database:', completion);
        // Example: await db.collection('completions').insertOne({ completion });
    }
    catch (error) {
        console.error('Error saving completion to database:', error);
    }
});
exports.saveCompletionToDatabase = saveCompletionToDatabase;
