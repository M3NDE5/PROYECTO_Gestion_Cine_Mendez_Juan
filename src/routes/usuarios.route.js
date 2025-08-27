import { Router } from 'express';
import { db } from '../../conexionMongo.js';
import send from 'send';

const usuario = Router()



// INGRESAR USUARIOS A LA BASE DE DATOS
usuario.post('/ingreso', async (req, res)=>{
  const userIngreso = req.body;
  try{
    const result = await db.collection('usuarios').insertOne(userIngreso)
    res.send('Usuario ingresado con exito en la base de datos...')
  }catch(err){
    res.send('Error al ingresar el usuario en la base de datos... ' + err)
  }
})

// OBTENER USUARIOS DE LA BASE DE DATOS
usuario.get('/obtener/:nombre', async(req, res)=>{
    try{
        const result = await db.collection('usuarios').find({usuario: req.params.nombre}).toArray();
        res.send(result)
    }catch(error){
        res.send(`Error al obtener el usuario: ${error}`)
    }
})




export default usuario

