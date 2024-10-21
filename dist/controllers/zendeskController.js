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
exports.getTickets = exports.getCategories = void 0;
const zendeskService_1 = require("../services/zendeskService");
const logger_1 = __importDefault(require("../config/logger"));
// Fetch categories from Zendesk
const getCategories = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield (0, zendeskService_1.fetchCategories)();
        res.status(200).json(data);
        logger_1.default.info('Categories fetched successfully.');
    }
    catch (error) {
        // Type guard to check if 'error' is an instance of Error
        if (error instanceof Error) {
            logger_1.default.error(`Error fetching categories: ${error.message}`);
            next(error);
        }
        else {
            logger_1.default.error('Unknown error occurred while fetching categories.');
            next(new Error('Unknown error occurred while fetching categories.'));
        }
    }
});
exports.getCategories = getCategories;
// Fetch tickets from Zendesk
const getTickets = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield (0, zendeskService_1.fetchTickets)();
        res.status(200).json(data);
        logger_1.default.info('Tickets fetched successfully.');
    }
    catch (error) {
        // Type guard to check if 'error' is an instance of Error
        if (error instanceof Error) {
            logger_1.default.error(`Error fetching tickets: ${error.message}`);
            next(error);
        }
        else {
            logger_1.default.error('Unknown error occurred while fetching tickets.');
            next(new Error('Unknown error occurred while fetching tickets.'));
        }
    }
});
exports.getTickets = getTickets;
