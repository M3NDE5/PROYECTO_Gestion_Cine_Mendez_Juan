import { Router } from 'express';
import { db } from '../../conexionMongo.js';

const salas = Router();

// Crear sala
salas.post('/crear', async (req, res) => {
    try {
        const { codigoSala, nombreSala, numSillas, codigoCine } = req.body;

        const result = await db.collection('cines').updateOne(
            { codigo: codigoCine },
            { $push: { salas: { codigoSala, nombreSala, numSillas } } }
        );

        if (result.modifiedCount === 0) {
            return res.status(404).send('Cine no encontrado');
        }

        res.send('Sala creada con éxito');
    } catch (err) {
        res.status(500).json({ message: 'Error al crear la sala', error: err.message });
    }
});

// Obtener todas las salas con su cine
salas.get('/obtener', async (req, res) => {
    try {
        const cines = await db.collection('cines').find().toArray();
        const salas = [];
        cines.forEach(cine => {
            if (cine.salas) {
                cine.salas.forEach(sala => {
                    salas.push({
                        ...sala,
                        cine: {
                            nombreCine: cine.nombreCine,
                            codigo: cine.codigo
                        }
                    });
                });
            }
        });

        res.json(salas);
    } catch (err) {
        res.status(500).json({ message: 'Error al obtener salas', error: err.message });
    }
});

// OBTENER SALAS

salas.get('/obtenerSalas', async (req, res) => {
    try {
        const cines = await db.collection('cines').find().toArray();
        let arraySalas = [];
        for (let cine of cines) {
            arraySalas.push(cine.salas)
        }
        res.json(arraySalas)
    } catch (err) {
        res.status(500).json({ message: 'Error al obtener salas', error: err.message });
    }
})

// Eliminar sala
salas.delete('/eliminar', async (req, res) => {
    try {
        const { codigoSala, codigoCine } = req.body;

        const result = await db.collection('cines').updateOne(
            { codigo: codigoCine },
            { $pull: { salas: { codigoSala } } }
        );

        if (result.modifiedCount === 0) {
            return res.status(404).send('Sala o cine no encontrados');
        }

        res.send('Sala eliminada con éxito');
    } catch (err) {
        res.status(500).json({ message: 'Error al eliminar sala', error: err.message });
    }
});

// Actualizar sala
salas.put('/actualizar', async (req, res) => {
    try {
        const { codigoSala, nuevoNombreSala, nuevoNumSillas, nuevoCodigoCine } = req.body;

        // Buscar el cine actual que contiene la sala
        const cineOriginal = await db.collection('cines').findOne({ "salas.codigoSala": codigoSala });

        if (!cineOriginal) {
            return res.status(404).send('Sala no encontrada');
        }

        // Si se va a mover la sala a otro cine
        if (nuevoCodigoCine && nuevoCodigoCine !== cineOriginal.codigo) {
            const sala = cineOriginal.salas.find(s => s.codigoSala === codigoSala);

            // Eliminar de cine original
            await db.collection('cines').updateOne(
                { codigo: cineOriginal.codigo },
                { $pull: { salas: { codigoSala } } }
            );

            
            await db.collection('cines').updateOne(
                { codigo: nuevoCodigoCine },
                {
                    $push: {
                        salas: {
                            ...sala,
                            nombreSala: nuevoNombreSala || sala.nombreSala,
                            numSillas: nuevoNumSillas || sala.numSillas
                        }
                    }
                }
            );
        } else {
            
            await db.collection('cines').updateOne(
                { "salas.codigoSala": codigoSala },
                {
                    $set: {
                        "salas.$.nombreSala": nuevoNombreSala,
                        "salas.$.numSillas": nuevoNumSillas
                    }
                }
            );
        }

        res.send('Sala actualizada con éxito');
    } catch (err) {
        res.status(500).json({ message: 'Error al actualizar sala', error: err.message });
    }
});


export default salas;