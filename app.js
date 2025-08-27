import express from 'express';
import 'dotenv/config';
import usuario from './src/routes/usuarios.route.js';


const app = express();

app.use(express.json());
app.use('/usuarios', usuario);



app.listen({
    port : process.env.APP_PORT,
    hostname: process.env.APP_HOSTNAME
}, ()=>{
    console.log(`Corriendo desde: ${process.env.APP_HOSTNAME}:${process.env.APP_PORT}`)
});