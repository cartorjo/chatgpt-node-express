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
exports.fetchTickets = exports.fetchCategories = void 0;
const axios_1 = __importDefault(require("axios"));
const logger_1 = __importDefault(require("../config/logger"));
const zendeskBaseUrl = `https://${process.env.ZENDESK_SUBDOMAIN}.zendesk.com/api/v2`;
const zendeskAuth = Buffer.from(`${process.env.ZENDESK_USER}/token:${process.env.ZENDESK_API_TOKEN}`).toString('base64');
const headers = { 'Authorization': `Basic ${zendeskAuth}`, 'Content-Type': 'application/json' };
// In-memory cache structure
const cache = {};
// Helper to get cached data
const getCachedData = (key) => {
    const cachedItem = cache[key];
    if (cachedItem && cachedItem.expiry > Date.now()) {
        return cachedItem.data;
    }
    return null;
};
// Helper to cache data with expiration
const cacheData = (key, data, ttl = 3600) => {
    cache[key] = { data, expiry: Date.now() + ttl * 1000 };
};
// Fetch categories
const fetchCategories = () => __awaiter(void 0, void 0, void 0, function* () {
    const cacheKey = 'zendesk:categories';
    const cachedData = getCachedData(cacheKey);
    if (cachedData)
        return cachedData;
    try {
        const response = yield axios_1.default.get(`${zendeskBaseUrl}/help_center/categories.json`, { headers });
        if (response.status !== 200) {
            throw new Error(`Received status code ${response.status}`);
        }
        cacheData(cacheKey, response.data);
        return response.data;
    }
    catch (error) {
        // Type guard to check if error is an instance of Error
        if (error instanceof Error) {
            logger_1.default.error(`Zendesk API Error (Categories): ${error.message}`);
            throw new Error(`Zendesk API Error (Categories): ${error.message}`);
        }
        else {
            logger_1.default.error('An unknown error occurred while fetching categories.');
            throw new Error('An unknown error occurred while fetching categories.');
        }
    }
});
exports.fetchCategories = fetchCategories;
// Fetch tickets
const fetchTickets = () => __awaiter(void 0, void 0, void 0, function* () {
    const cacheKey = 'zendesk:tickets';
    const cachedData = getCachedData(cacheKey);
    if (cachedData)
        return cachedData;
    try {
        const response = yield axios_1.default.get(`${zendeskBaseUrl}/tickets.json`, { headers });
        if (response.status !== 200) {
            throw new Error(`Received status code ${response.status}`);
        }
        cacheData(cacheKey, response.data);
        return response.data;
    }
    catch (error) {
        // Type guard to check if error is an instance of Error
        if (error instanceof Error) {
            logger_1.default.error(`Zendesk API Error (Tickets): ${error.message}`);
            throw new Error(`Zendesk API Error (Tickets): ${error.message}`);
        }
        else {
            logger_1.default.error('An unknown error occurred while fetching tickets.');
            throw new Error('An unknown error occurred while fetching tickets.');
        }
    }
});
exports.fetchTickets = fetchTickets;
