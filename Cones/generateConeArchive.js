import fs from 'fs';
import path from 'path';
import axios from 'axios';
import AdmZip from 'adm-zip';

// Función para descargar el archivo ZIP
async function downloadZip(url, outputPath) {
    const response = await axios({
        url,
        method: 'GET',
        responseType: 'arraybuffer'
    });
    fs.writeFileSync(outputPath, response.data);
}

// Función para extraer los archivos del ZIP
function extractZip(zipPath, extractToPath) {
    const zip = new AdmZip(zipPath);
    zip.extractAllTo(extractToPath, true);
}

// Función para convertir el archivo extraído a JSON
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

// Función para generar el GeoJSON
function generateGjson(data) {
    const features = data.map(cyclone => ({
        type: "Feature",
        geometry: {
            type: "Point",
            coordinates: [cyclone.longitude, cyclone.latitude] // Coordenadas del ciclón
        },
        properties: {
            name: cyclone.name,
            status: cyclone.status,
            date: cyclone.date
        }
    }));

    const geoJson = {
        type: "FeatureCollection",
        features: features
    };

    return geoJson;
}

// Función para guardar el archivo GeoJSON
function saveGeoJsonToFile(geoJson) {
    const filePath = path.join(__dirname, 'tropicalCyclones', 'newCyclones.geojson');

    if (!fs.existsSync(path.dirname(filePath))) {
        fs.mkdirSync(path.dirname(filePath), { recursive: true });
    }

    fs.writeFile(filePath, JSON.stringify(geoJson, null, 2), (err) => {
        if (err) {
            console.error('Error al guardar el archivo GeoJSON:', err);
        } else {
            console.log('Archivo GeoJSON guardado exitosamente en:', filePath);
        }
    });
}

// Función principal para procesar el archivo ZIP y generar el GeoJSON
export async function newTropical() {
    const zipUrl = 'https://www.nhc.noaa.gov/gis/forecast/archive/';  // Actualiza con la URL del archivo ZIP correcto.
    const zipPath = path.join(__dirname, 'forecast.zip');
    const extractToPath = path.join(__dirname, 'extracted');
    const jsonOutputPath = path.join(__dirname, 'output.json');

    try {
        // Descargamos y extraemos el ZIP
        await downloadZip(zipUrl, zipPath);
        extractZip(zipPath, extractToPath);

        // Leemos los archivos extraídos
        const files = fs.readdirSync(extractToPath);
        const lastFile = files[files.length - 1];
        const lastFilePath = path.join(extractToPath, lastFile);

        // Convertimos el archivo extraído a JSON
        const jsonData = convertFileToJson(lastFilePath);

        if (jsonData) {
            // Generamos el GeoJSON a partir de los datos
            const geoJson = generateGjson(jsonData);

            // Guardamos el archivo GeoJSON
            saveGeoJsonToFile(geoJson);
        } else {
            console.error("No se pudo convertir el archivo a JSON.");
        }
    } catch (error) {
        console.error('Error en el proceso:', error);
    }
}

