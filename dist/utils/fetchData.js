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
exports.fetchArticleTranslations = exports.fetchArticleById = exports.fetchArticlesBySection = exports.fetchSectionsByCategory = exports.fetchCategories = void 0;
const axios_1 = __importDefault(require("axios"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const ZENDESK_BASE_URL = 'https://yourzendeskapi.com/api/v2/help_center';
const headers = { Authorization: `Bearer ${process.env.ZENDESK_API_KEY}` };
const saveData = (fileName, data) => __awaiter(void 0, void 0, void 0, function* () {
    const filePath = path.join(__dirname, '../../data', fileName);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
});
// Fetch Categories
const fetchCategories = () => __awaiter(void 0, void 0, void 0, function* () {
    const url = `${ZENDESK_BASE_URL}/categories.json`;
    const response = yield axios_1.default.get(url, { headers });
    yield saveData('categories.json', response.data);
});
exports.fetchCategories = fetchCategories;
// Fetch Sections within a Category
const fetchSectionsByCategory = (categoryId) => __awaiter(void 0, void 0, void 0, function* () {
    const url = `${ZENDESK_BASE_URL}/categories/${categoryId}/sections.json`;
    const response = yield axios_1.default.get(url, { headers });
    yield saveData(`sections_category_${categoryId}.json`, response.data);
});
exports.fetchSectionsByCategory = fetchSectionsByCategory;
// Fetch Articles within a Section
const fetchArticlesBySection = (sectionId) => __awaiter(void 0, void 0, void 0, function* () {
    const url = `${ZENDESK_BASE_URL}/sections/${sectionId}/articles.json`;
    const response = yield axios_1.default.get(url, { headers });
    yield saveData(`articles_section_${sectionId}.json`, response.data);
});
exports.fetchArticlesBySection = fetchArticlesBySection;
// Fetch a Single Article by ID
const fetchArticleById = (articleId) => __awaiter(void 0, void 0, void 0, function* () {
    const url = `${ZENDESK_BASE_URL}/articles/${articleId}.json`;
    const response = yield axios_1.default.get(url, { headers });
    yield saveData(`article_${articleId}.json`, response.data);
});
exports.fetchArticleById = fetchArticleById;
// Fetch Translations for an Article
const fetchArticleTranslations = (articleId) => __awaiter(void 0, void 0, void 0, function* () {
    const url = `${ZENDESK_BASE_URL}/articles/${articleId}/translations.json`;
    const response = yield axios_1.default.get(url, { headers });
    yield saveData(`article_${articleId}_translations.json`, response.data);
});
exports.fetchArticleTranslations = fetchArticleTranslations;
