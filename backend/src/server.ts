import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 3000;
const app = express();


app.use(express.json());

app.get('/health' , (request , response) => {
    response.json({status: 'ok'});
});

app.listen(PORT , () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});