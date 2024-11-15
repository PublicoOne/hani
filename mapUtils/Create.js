export function createMapNormal(){
    var map = L.map('map', {
        center: [0, 0],
        zoom: 2,
        maxBounds: [
            [-100, -Infinity], 
            [100, Infinity]    
        ],
        maxBoundsViscosity: 0  
    });
    
    
    var Esri_WorldGrayCanvas = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ',
        minZoom: 2,
        maxZoom: 22,
    }).addTo(map);

}