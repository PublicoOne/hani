// Inicializar el mapa centrado en una ubicación de ejemplo (Miami)
const map = L.map('map').setView([25.7617, -80.1918], 5);

// Añadir capa de mapa base de OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18,
    attribution: 'Map data © <a href="https://openstreetmap.org">OpenStreetMap</a>'
}).addTo(map);

// Simulación de puntos de trayectoria
const trackPoints = [
    [25.7617, -80.1918],  // Punto inicial
    [26.5, -81.0],
    [27.0, -82.0],
    [28.0, -83.0],         // Punto final
];

// Simulación de coordenadas para el cono de incertidumbre
const coneCoordinates = [
    [
        [25.7617, -80.1918],
        [26.5, -81.5],
        [28, -82],
        [26.5, -78],
        [25.7617, -80.1918]
    ]
];

// Dibujar la línea de trayectoria en el mapa
const trackLine = L.polyline(trackPoints, {
    color: 'blue',
    weight: 3,
    opacity: 0.7
}).addTo(map);

// Dibujar el cono de incertidumbre en el mapa
const conePolygon = L.polygon(coneCoordinates, {
    color: 'orange',
    fillColor: '#ff9f00',
    fillOpacity: 0.3
}).addTo(map);

// Ajustar la vista al área de trayectoria y cono
map.fitBounds(conePolygon.getBounds());
