"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
const chatController_1 = require("./controllers/chatController");
const speakController_1 = require("./controllers/speakController");
const errorHandler_1 = require("./middlewares/errorHandler");
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
// Middleware
app.use(body_parser_1.default.urlencoded({ extended: false }));
app.use(body_parser_1.default.json());
app.set('view engine', 'ejs');
app.set('views', path_1.default.join(__dirname, 'views'));
app.use(express_1.default.static(path_1.default.join(__dirname, 'public')));
// Routes
app.get('/', (req, res) => {
    res.render('index');
});
app.post('/api/chat', chatController_1.chatController);
app.post('/api/text-to-speech', speakController_1.speakController);
// Error handling middleware
app.use(errorHandler_1.errorHandler);
// Start server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
