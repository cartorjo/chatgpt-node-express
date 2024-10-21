"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.zendeskAuthMiddleware = void 0;
const zendeskAuthMiddleware = (req, res, next) => {
    if (!process.env.ZENDESK_USER || !process.env.ZENDESK_API_TOKEN) {
        return res.status(403).json({ error: 'Zendesk credentials not provided' });
    }
    next();
};
exports.zendeskAuthMiddleware = zendeskAuthMiddleware;
