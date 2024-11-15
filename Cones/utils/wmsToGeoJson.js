const axios = require('axios');
const fs = require('fs');
const AdmZip = require('adm-zip');
const path = require('path');

async function downloadZip(url, outputPath) {
    const response = await axios({
        url,
        method: 'GET',
        responseType: 'arraybuffer'
    });
    fs.writeFileSync(outputPath, response.data);
}

function extractZip(zipPath, extractToPath) {
    const zip = new AdmZip(zipPath);
    zip.extractAllTo(extractToPath, true);
}

function convertFileToJson(filePath) {
    const fileContent = fs.readFileSync(filePath, 'utf8');
    try {
        const jsonData = JSON.parse(fileContent); // Intentamos convertirlo directamente a JSON si es posible.
        return jsonData;
    } catch (error) {
        console.error("Error al parsear el archivo como JSON:", error);
        return null;
    }
}

async function processZip() {
    const zipUrl = 'https://www.nhc.noaa.gov/gis/forecast/archive/';  // Actualiza esta URL con la correcta.
    const zipPath = path.join(__dirname, 'forecast.zip');
    const extractToPath = path.join(__dirname, 'extracted');
    const jsonOutputPath = path.join(__dirname, 'output.json');

    try {
        await downloadZip(zipUrl, zipPath);
        extractZip(zipPath, extractToPath);

        const files = fs.readdirSync(extractToPath);
        const lastFile = files[files.length - 1];
        const lastFilePath = path.join(extractToPath, lastFile);

        const jsonData = convertFileToJson(lastFilePath);

        if (jsonData) {
            fs.writeFileSync(jsonOutputPath, JSON.stringify(jsonData, null, 2));
            console.log("Archivo JSON guardado en:", jsonOutputPath);
        } else {
            console.error("No se pudo convertir el archivo a JSON.");
        }
    } catch (error) {
        console.error('Error en el proceso:', error);
    }
}

processZip();
