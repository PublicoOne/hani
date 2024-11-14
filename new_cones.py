import time
import geopandas as gpd
from fastkml import kml
import zipfile
import io
import requests
import os
from shapely.geometry import shape

url = "https://www.nhc.noaa.gov/storm_graphics/api/AL192024_CONE_latest.kmz"
name = "forteen"

def kmz_to_geojson(kmz_url, output_geojson_path):
    # Descargar el archivo KMZ
    response = requests.get(kmz_url)
    if response.status_code != 200:
        print("Error al descargar el archivo KMZ.")
        return

    # Extraer el archivo KML del KMZ
    with zipfile.ZipFile(io.BytesIO(response.content)) as kmz:
        kml_filename = kmz.namelist()[0]
        with kmz.open(kml_filename, 'r') as kml_file:
            kml_data = kml_file.read()

    # Leer el archivo KML con fastkml
    k = kml.KML()
    k.from_string(kml_data)

    # Crear listas para almacenar nombres y geometrías
    nombres = []
    geometrias = []

    # Obtener todos los Placemarks y sus geometrías
    for feature in k.features():
        for placemark in feature.features():
            nombres.append(placemark.name)
            geometrias.append(shape(placemark.geometry))

    # Crear un GeoDataFrame
    gdf = gpd.GeoDataFrame({'name': nombres, 'geometry': geometrias}, crs="EPSG:4326")

    # Exportar a GeoJSON
    gdf.to_file(output_geojson_path, driver="GeoJSON")
    print(f"Archivo GeoJSON guardado en: {output_geojson_path}")

# Llamar a la función continuamente con tiempo de espera
vear = 0
while True:
    if name not in os.listdir("Cones/"):
        kmz_to_geojson(url, os.path.join("Cones", name + ".geojson"))
        vear = vear + 1
        print(vear)
    else:
        os.remove("Cones", name + ".geojson")
        kmz_to_geojson(url, os.path.join("Cones", name + ".geojson"))
        vear = vear + 1
        print(vear)
    time.sleep(100)
