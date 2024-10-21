import { Request, Response, NextFunction } from 'express';
import { fetchCategories, fetchTickets } from '../services/zendeskService';
import logger from '../config/logger';

// Fetch categories from Zendesk
export const getCategories = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = await fetchCategories();
        res.status(200).json(data);
        logger.info('Categories fetched successfully.');
    } catch (error) {
        // Type guard to check if 'error' is an instance of Error
        if (error instanceof Error) {
            logger.error(`Error fetching categories: ${error.message}`);
            next(error);
        } else {
            logger.error('Unknown error occurred while fetching categories.');
            next(new Error('Unknown error occurred while fetching categories.'));
        }
    }
};

// Fetch tickets from Zendesk
export const getTickets = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = await fetchTickets();
        res.status(200).json(data);
        logger.info('Tickets fetched successfully.');
    } catch (error) {
        // Type guard to check if 'error' is an instance of Error
        if (error instanceof Error) {
            logger.error(`Error fetching tickets: ${error.message}`);
            next(error);
        } else {
            logger.error('Unknown error occurred while fetching tickets.');
            next(new Error('Unknown error occurred while fetching tickets.'));
        }
    }
};