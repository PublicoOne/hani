// Importar las dependencias necesarias
const express = require('express');  // Framework web para manejar peticiones HTTP
const axios = require('axios');     // Librería para hacer solicitudes HTTP
const fs = require('fs');           // Sistema de archivos de Node.js para leer y escribir archivos
const path = require('path');       // Utilidad para manejar rutas de archivos
const AdmZip = require('adm-zip');  // Librería para trabajar con archivos ZIP

// Crear una instancia de la aplicación Express
const app = express();
const port = 3000;  // Puerto en el que el servidor escuchará las peticiones

// Ruta para manejar la descarga y extracción del archivo ZIP
app.get('/download', async (req, res) => {
    const zipUrl = 'https://www.nhc.noaa.gov/gis/forecast/archive/';  // URL donde está el archivo ZIP (ajustar si es necesario)
    const zipPath = path.join(__dirname, 'forecast.zip');            // Ruta donde se guardará el archivo ZIP descargado
    const extractToPath = path.join(__dirname, 'extracted');         // Ruta donde se extraerán los archivos

    try {
        // Descargar el archivo ZIP
        const response = await axios({
            url: zipUrl,
            method: 'GET',
            responseType: 'arraybuffer'  // Especificamos que la respuesta será un buffer de bytes
        });

        // Guardar el archivo ZIP descargado en el sistema de archivos
        fs.writeFileSync(zipPath, response.data);

        // Extraer el contenido del archivo ZIP
        const zip = new AdmZip(zipPath);
        zip.extractAllTo(extractToPath, true);  // Extrae todos los archivos del ZIP

        // Leer los archivos extraídos y tomar el último
        const files = fs.readdirSync(extractToPath);
        const lastFile = files[files.length - 1];  // Seleccionar el último archivo
        const lastFilePath = path.join(extractToPath, lastFile);

        // Leer el contenido del último archivo extraído
        const fileContent = fs.readFileSync(lastFilePath, 'utf8');

        // Enviar la respuesta con el contenido del archivo procesado
        res.json({ message: 'Archivo procesado y guardado como JSON', content: fileContent });
    } catch (error) {
        console.error('Error al procesar el archivo:', error);
        res.status(500).send('Hubo un error al procesar el archivo.');
    }
});

// Iniciar el servidor para escuchar peticiones en el puerto especificado
app.listen(port, () => {
    console.log(`Servidor ejecutándose en http://localhost:${port}`);
});
