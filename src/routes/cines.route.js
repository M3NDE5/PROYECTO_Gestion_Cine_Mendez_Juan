import { Router } from 'express';
import { db } from '../../conexionMongo.js';


const cine = Router()


cine.post('/ingresarCine', async(req, res) =>{
    try{
        const cine = await db.collection('cines').insertOne(req.body);
        res.send('Cine ingresado con exito...')
    }catch(err){
        res.status(500).json({message: 'Error al ingresar los cines'})
    }
})


cine.get('/obtener', async (req, res) =>{
    try{
        const cine = await db.collection('cines').find().toArray();
        res.json(cine)
    }catch(err){
        res.status(500).json({message: 'Error al tratar de cargar los cines'})
    }
})

cine.delete('/eliminar', async (req, res) => {
  try {
    const { codigo } = req.body;

    if (!codigo) {
      return res.status(400).send('Código del cine no proporcionado');
    }

    const result = await db.collection('cines').deleteOne({ codigo });

    if (result.deletedCount === 0) {
      return res.status(404).send('Cine no encontrado');
    }

    res.send('Cine eliminado con éxito');
  } catch (err) {
    res.status(500).json({ message: 'Error al tratar de eliminar el cine', error: err.message });
  }
});


cine.put('/actualizar', async (req, res) => {
  try {
    const { codigo, nombreCine, direccionCine, ciudadCine } = req.body;

    if (!codigo) {
      return res.status(400).send('Código del cine es obligatorio');
    }

    const result = await db.collection('cines').updateOne(
      { codigo },
      { $set: { nombreCine, direccionCine, ciudadCine } }
    );

    if (result.matchedCount === 0) {
      return res.status(404).send('Cine no encontrado');
    }

    res.send('Cine actualizado con éxito');
  } catch (err) {
    res.status(500).json({ message: 'Error al actualizar el cine', error: err.message });
  }
});


export default cine