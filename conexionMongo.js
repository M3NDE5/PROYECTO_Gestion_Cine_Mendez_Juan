import { MongoClient } from 'mongodb';
import 'dotenv/config';
const Bdname = process.env.BD_NAME
const client = new MongoClient(process.env.MONGO_URI);
export const db = client.db(Bdname);

async function Conexiondb(Bdname){
    await client.connect()
};

