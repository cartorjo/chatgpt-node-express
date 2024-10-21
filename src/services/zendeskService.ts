import axios from 'axios';
import logger from '../config/logger';

const zendeskBaseUrl = `https://${process.env.ZENDESK_SUBDOMAIN}.zendesk.com/api/v2`;
const zendeskAuth = Buffer.from(`${process.env.ZENDESK_USER}/token:${process.env.ZENDESK_API_TOKEN}`).toString('base64');
const headers = { 'Authorization': `Basic ${zendeskAuth}`, 'Content-Type': 'application/json' };

// In-memory cache structure
const cache: { [key: string]: { data: any, expiry: number } } = {};

// Helper to get cached data
const getCachedData = (key: string) => {
    const cachedItem = cache[key];
    if (cachedItem && cachedItem.expiry > Date.now()) {
        return cachedItem.data;
    }
    return null;
};

// Helper to cache data with expiration
const cacheData = (key: string, data: any, ttl = 3600) => {
    cache[key] = { data, expiry: Date.now() + ttl * 1000 };
};

// Fetch categories
export const fetchCategories = async () => {
    const cacheKey = 'zendesk:categories';
    const cachedData = getCachedData(cacheKey);
    if (cachedData) return cachedData;

    try {
        const response = await axios.get(`${zendeskBaseUrl}/help_center/categories.json`, { headers });
        if (response.status !== 200) {
            throw new Error(`Received status code ${response.status}`);
        }
        cacheData(cacheKey, response.data);
        return response.data;
    } catch (error) {
        // Type guard to check if error is an instance of Error
        if (error instanceof Error) {
            logger.error(`Zendesk API Error (Categories): ${error.message}`);
            throw new Error(`Zendesk API Error (Categories): ${error.message}`);
        } else {
            logger.error('An unknown error occurred while fetching categories.');
            throw new Error('An unknown error occurred while fetching categories.');
        }
    }
};

// Fetch tickets
export const fetchTickets = async () => {
    const cacheKey = 'zendesk:tickets';
    const cachedData = getCachedData(cacheKey);
    if (cachedData) return cachedData;

    try {
        const response = await axios.get(`${zendeskBaseUrl}/tickets.json`, { headers });
        if (response.status !== 200) {
            throw new Error(`Received status code ${response.status}`);
        }
        cacheData(cacheKey, response.data);
        return response.data;
    } catch (error) {
        // Type guard to check if error is an instance of Error
        if (error instanceof Error) {
            logger.error(`Zendesk API Error (Tickets): ${error.message}`);
            throw new Error(`Zendesk API Error (Tickets): ${error.message}`);
        } else {
            logger.error('An unknown error occurred while fetching tickets.');
            throw new Error('An unknown error occurred while fetching tickets.');
        }
    }
};