import express, { Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import dotenv from 'dotenv';
import { chatController } from './controllers/chatController';
import { speakController } from './controllers/speakController';
import { generateFineTuneData } from './controllers/fineTuneController';
import { errorHandler } from './middlewares/errorHandler';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req: Request, res: Response) => {
    res.render('index');
});

app.post('/api/chat', chatController);
app.post('/api/text-to-speech', speakController);
app.post('/api/generate-fine-tune-data', generateFineTuneData);

app.use(errorHandler);

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});