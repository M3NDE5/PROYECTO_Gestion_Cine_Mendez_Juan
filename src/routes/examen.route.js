import { Router } from 'express';
import { db } from '../../conexionMongo.js';

const funciones = Router();


function lecturaCsv(textoCSV) {
  const lineas = textoCSV.trim().split('\n');
  const headers = lineas[0].split(',').map(h => h.trim());

  const registros = lineas.slice(1).map(linea => {
    const valores = linea.split(',').map(v => v.trim());
    const obj = {};
    headers.forEach((key, idx) => {
      obj[key] = valores[idx];
    });
    return obj;
  });

  return registros;
}


funciones.post('/cargar', async (req, res) => {
  try {
    const { contenidoCSV } = req.body;

    if (!contenidoCSV) {
      return res.status(400).json({ message: 'No se recibió el contenido del archivo.' });
    }

    const registros = lecturaCsv(contenidoCSV);
    if (!registros.length) {
      return res.status(400).json({ message: 'No se encontraron registros válidos en el archivo.' });
    }

    const resultado = await db.collection('funciones').insertMany(registros);

    res.json({
      message: 'Carga exitosa',
      cantidad: resultado.insertedCount
    });
  } catch (err) {
    console.error('Error al cargar CSV:', err);
    res.status(500).json({ message: 'Error al cargar funciones', error: err.message });
  }
});

export default funciones;
