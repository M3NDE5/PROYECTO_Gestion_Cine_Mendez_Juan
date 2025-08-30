import { Router } from 'express';
import { db } from '../../conexionMongo.js';

const pelicula = Router();



pelicula.post('/crearPelicula',async(req, res) =>{
    try{
        const pelicula = await db.collection('peliculas').insertOne(req.body);
        res.json(pelicula)
    }catch(err){
        res.status(500).json({message: 'Error al ingresar los cines'})
    }
})



pelicula.get('/obtenerPeliculas', async (req, res) => {
  try {
    const peliculas = await db.collection('peliculas').find().toArray();
    res.json(peliculas);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener las películas', error: err.message });
  }
});


pelicula.delete('/eliminarPelicula', async(req, res) => {
    try{
        const result = await db.collection('peliculas').deleteOne(req.body)
        res.json(result);
    }catch(err){
        res.status(500).json({ message: 'Error al eliminar las películas', error: err.message });
    }
})


pelicula.put('/actualizarPelicula', async (req, res) => {
  try {
    const {
      codigo,
      titulo,
      sinopsis,
      poster,
      trailer,
      reparto,
      clasificacion,
      idioma,
      director,
      duracion,
      genero,
      fechaEstreno,
    } = req.body;

    const result = await db.collection('peliculas').updateOne(
      { codigo }, // Buscar por el código
      {
        $set: {
          titulo,
          sinopsis,
          poster,
          trailer,
          reparto,
          clasificacion,
          idioma,
          director,
          duracion,
          genero,
          fechaEstreno,
        }
      }
    );

    if (result.matchedCount === 0) {
      return res.status(404).send('Película no encontrada');
    }

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: 'Error al actualizar la película', error: err.message });
  }
});






export default pelicula;