"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const zendeskController_1 = require("../controllers/zendeskController");
const zendeskAuthMiddleware_1 = require("../middlewares/zendeskAuthMiddleware");
const router = express_1.default.Router();
// Apply middleware
router.use(zendeskAuthMiddleware_1.zendeskAuthMiddleware);
// Define routes
router.get('/categories', zendeskController_1.getCategories);
router.get('/tickets', zendeskController_1.getTickets);
exports.default = router;
