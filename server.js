const fs = require('fs');
const csv = require('csv-parser');
const { MongoClient } = require('mongodb');
const fileCSV = 'file.csv';

async function process(file) {
    try {
        const data = await readFile(file);
        console.log('Archivo CSV - Datos:', data);
        const result = await saveMongo(data);
        console.log('Datos guardados en MongoDB:', result);
    } catch (error) {
        console.error('Error:', error);
    }
}

process(fileCSV);

function readFile(file) {
    return new Promise((resolve, reject) => {
        const result = [];
        fs.createReadStream(file)
            .pipe(csv())
            .on('data', (data) => {
                result.push(data);
            })
            .on('end', () => {
                resolve(result);
            })
            .on('error', (error) => {
                reject(error);
            });
    });
}

async function saveMongo(data) {
    const url = 'mongodb://localhost:27017';
    const dbName = 'ebitware';
    const collectionName = 'file';
    try {
        const client = await MongoClient.connect(url, { useUnifiedTopology: true });
        const db = client.db(dbName);
        const collection = db.collection(collectionName);
        const result = await collection.insertMany(data);
        client.close();
        return result;
    } catch (error) {
        throw error;
    }
}
