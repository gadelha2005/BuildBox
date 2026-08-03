import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import {errorHandler} from './middlewares/errorHandler';

dotenv.config();

const PORT = process.env.PORT || 3000;
const app = express();

app.use(cors);
app.use(express.json());

app.get('/health' , (request , response) => {
    response.json({status: 'ok'});
});

app.use(errorHandler);

app.listen(PORT , () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});