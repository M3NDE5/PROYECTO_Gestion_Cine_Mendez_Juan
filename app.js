import express from 'express';
import 'dotenv/config';
import usuario from './src/routes/usuarios.route.js';
import cine from './src/routes/cines.route.js';
import salas from './src/routes/salas.route.js';
import pelicula from './src/routes/peliculas.route.js';
import funciones from './src/routes/examen.route.js';
import path from 'path';
import { fileURLToPath } from 'url';







const app = express();


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);



app.use(express.json());

app.use('/usuarios', usuario);
app.use('/cines', cine);
app.use('/salas', salas);
app.use('/peliculas', pelicula)
app.use('/funciones', funciones);

app.use('/src', express.static(path.join(__dirname, 'src')));


app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'src','views', 'login.html'));
});
app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'src','views', 'dashboard.html'));
});
app.use('/css', express.static(path.join(__dirname, 'src', 'css')));

app.use('/js', express.static(path.join(__dirname, 'src', 'js')));

app.use('/partials', express.static(path.join(__dirname, 'src', 'views', 'partials')));


app.get('/', (req, res) => {
  res.redirect('/login');
});

app.listen({
    port : process.env.APP_PORT,
    hostname: process.env.APP_HOSTNAME
}, ()=>{
    console.log(`Corriendo desde: ${process.env.APP_HOSTNAME}:${process.env.APP_PORT}`)
});