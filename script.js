// Inicializar el mapa centrado en una ubicación de ejemplo
const map = L.map('map').setView([25.7617, -80.1918], 5);

// Añadir capa de mapa base de OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18,
    attribution: 'Map data © <a href="https://openstreetmap.org">OpenStreetMap</a>'
}).addTo(map);

// Cargar el archivo GeoJSON y añadirlo al mapa
fetch('trayectoria.geojson')
    .then(response => response.json())
    .then(data => {
        // Añadir la capa GeoJSON al mapa
        const geoLayer = L.geoJSON(data, {
            style: feature => {
                // Definir estilos según el tipo de geometría
                if (feature.properties.type === 'trayectoria') {
                    return { color: 'blue', weight: 3, opacity: 0.7 };
                } else if (feature.properties.type === 'cono') {
                    return { color: 'orange', fillColor: '#ff9f00', fillOpacity: 0.3 };
                }
            }
        }).addTo(map);

        // Ajustar la vista para encajar el contenido de la capa GeoJSON
        map.fitBounds(geoLayer.getBounds());
    })
    .catch(error => console.error('Error cargando el GeoJSON:', error));
