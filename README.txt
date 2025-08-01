MAPA INTERACTIVO ZONAS DE INTERVENCIÓN ARBITRIUM

Primer intento de crear el mapa interactivo en done se muestren las zonas de intervención de arbitrium. 
Se utiliza leaftlet junto con bootstrap


Se utilizaron archivos de Shape base de los municipios y departamentos. Se simplificaron las geometrías para reducir
la carga de renderizado en el navegador y se creó un Geojson aparte que contiene todos los departamentos intervenidos y 
tiene información adicional en un Array en donde se muestran todos los municipios intervenidos en cada departamento.
El archivo geojson creado se llama Dep.geojson. 
Esto se realiza para poder ponerle la información de los municipios intervenidos en cada uno de los departamentos de forma 
interactiva en el mapa.
