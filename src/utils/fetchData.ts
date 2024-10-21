import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const ZENDESK_BASE_URL = 'https://yourzendeskapi.com/api/v2/help_center';
const headers = { Authorization: `Bearer ${process.env.ZENDESK_API_KEY}` };

const saveData = async (fileName: string, data: any) => {
    const filePath = path.join(__dirname, '../../data', fileName);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};

// Fetch Categories
export const fetchCategories = async () => {
    const url = `${ZENDESK_BASE_URL}/categories.json`;
    const response = await axios.get(url, { headers });
    await saveData('categories.json', response.data);
};

// Fetch Sections within a Category
export const fetchSectionsByCategory = async (categoryId: number) => {
    const url = `${ZENDESK_BASE_URL}/categories/${categoryId}/sections.json`;
    const response = await axios.get(url, { headers });
    await saveData(`sections_category_${categoryId}.json`, response.data);
};

// Fetch Articles within a Section
export const fetchArticlesBySection = async (sectionId: number) => {
    const url = `${ZENDESK_BASE_URL}/sections/${sectionId}/articles.json`;
    const response = await axios.get(url, { headers });
    await saveData(`articles_section_${sectionId}.json`, response.data);
};

// Fetch a Single Article by ID
export const fetchArticleById = async (articleId: number) => {
    const url = `${ZENDESK_BASE_URL}/articles/${articleId}.json`;
    const response = await axios.get(url, { headers });
    await saveData(`article_${articleId}.json`, response.data);
};

// Fetch Translations for an Article
export const fetchArticleTranslations = async (articleId: number) => {
    const url = `${ZENDESK_BASE_URL}/articles/${articleId}/translations.json`;
    const response = await axios.get(url, { headers });
    await saveData(`article_${articleId}_translations.json`, response.data);
};