import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { db } from '../../conexionMongo.js';
import send from 'send';

const usuario = Router()


// LOGIN
usuario.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await db.collection('usuarios').find({ email }).toArray();


    if (!result.length) {
      return res.status(401).json({ message: 'Usuario no encontrado' });
    }

    const user = result[0];

    if (user['password'] !== password) {
      return res.status(401).json({ message: 'Contraseña incorrecta' });
    }

    const token = jwt.sign(
      { nombre: user.email, id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: 'Error en el servidor', error: err.message });
  }

});

usuario.get('/obtener', async (req, res) => {
  try {
    const usuarios = await db.collection('usuarios').find().toArray(); 
    res.json(usuarios);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener los usuarios', error: err.message });
  } 
});


usuario.post('/registro', async(req, res) =>{
  try{
    const result = await db.collection('usuarios').insertOne(req.body)
    res.send('usuario agregado con exito')
  }catch(err){
    res.status(500).json({ message: 'Error al obtener los usuarios', error: err.message });
  }
})

usuario.delete('/eliminar', async (req, res) => {
  try {
    const { email } = req.body;
    const result = await db.collection('usuarios').deleteOne({ email });

    if (result.deletedCount === 0) {
      return res.status(404).send('Usuario no encontrado');
    }

    res.send('Usuario eliminado con éxito');
  } catch (err) {
    res.status(500).json({ message: 'Error al eliminar el usuario', error: err.message });
  }
});



usuario.put('/actualizar', async (req, res) => {
  try {
    const { actualEmail, nuevoEmail } = req.body;

    const result = await db.collection('usuarios').updateOne(
      { email: actualEmail },
      { $set: { email: nuevoEmail } }
    );

    if (result.modifiedCount === 0) {
      return res.status(404).send('No se encontró el usuario para actualizar');
    }

    res.send('Usuario actualizado con éxito');
  } catch (err) {
    res.status(500).json({ message: 'Error al actualizar usuario', error: err.message });
  }
});



export default usuario

