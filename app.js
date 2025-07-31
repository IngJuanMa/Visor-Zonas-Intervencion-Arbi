var mapa = L.map('mapa', { preferCanvas: true }).setView([4.5709, -74.2973], 5);
L.tileLayer('https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 8,
    minZoom: 5,
    opacity: 0.8,
    className: 'mapa-base'
}).addTo(mapa);


//Pane para organizar capas 
// var PaneDepartamento = mapa.createPane('departamento');
// PaneDepartamento.style.zIndex = 300; // Asegurarse de que esté por encima

// var PaneMunicipio = mapa.createPane('municipio');
// PaneMunicipio.style.zIndex = 400; // Asegurarse de que esté por encima

// listado  Municipios intervenidos
var MunDestacados = [
    //Mps Huila
    'La Plata', 'Garzón', 'Paicol', 'Neiva', 'Rivera', 'Gigante', 'Aipe', 'Baraya', 'Pitalito','Santa María', 'Acevedo', 'Tello','Timaná','Campoalegre','Hobo','Tesalia','Nátaga','Íquira', 'Yaguará','Agrado','Pital','La Argentina','Colombia','Oporapa',
    //mps Tolima
    'Ibagué','Melgar',
    //Mps Vichada
    'La Primavera',
    //Mps Caldas
    'Samaná', 'Marulanda', 'Pensilvania', 'La Dorada', 'Manzanares', 'Norcasia', 'Chinchiná', 'Palestina','Salamina.', 'La Merced','Marquetalia', 'Supia',
    //Mps Santander
    'Bucaramanga', 'Lebrija', 'Girón', 'Puente Nacional', 'San Vicente de Chucurí', 'Jesús María', 'La Pazz', 'Simacota', 'Vélez','Socorro','Floridablanca','Barrancabermeja','Cimitarra', 'Barbosa',
    //Mps Risaralda
    'Dosquebradas', 'Pereira', 'Santa Rosa De Cabal',
    //Mps Meta
    'Villavicencio','Puerto López',
    //Mps Antioquia
    'Medellín', 'Bello', 'San Juan De Urabá', 'San Pedro De Urabá', 'Arboletes', 'Necoclí',
    //Mps Putumayo
    'Valle Del Guamuez', 'Mocoa', 'Sibundoy','Villagarzón',
    //mps Quindio
    'Armenia', 'Circasia',
    //Mps Nariño
    'Pasto', 'Ipiales', 'Leiva','La Uniónnn', 
    //Mps Sucre
    'La Uniónn',
    //Mps Cordoba
    'Montería', 'Pueblo Nuevo',
    //Mps Boyacá
    'Saboyá', 'Chiquinquirá', 'Guateque', 'Macanal', 'Chivor', 'Tausa', 'Tenza', 'Sutatenza',
    //Mps Cundinamarca
    'Chocontá', 'Bogotá', 'Machetá', 'San Antonio Del Tequendama', 'Suesca', 'Zipaquirá', 'Tibirita', 'Supatá',
    'Ubalá', 'Chipaque', 'Cajicá', 'Cogua', 'Nemocón', 'Tocancipá', 'Zipaquirá', 'Zipacón', 'La Mesa', 'Cachipay',
    'Tena', 'Tausa', 'Fusagasugá', 'Girardot', 'Sibaté', 'Silvania', 'La Mesa', 'Soacha', 'Sopó', 'Tibacuy', 'Granadaa',
];

// variable de renderizado en canvas
var CanvasRender = L.canvas();


//Fubción para definir estilos de la capa Geojson de departamentos intervenidos:
function styles(feature) {
    return {
        color: '#020e189d',
        fillColor: '#002f559d',
        weight: 1,
        opacity: 1,
        fillOpacity: 0.6,
        dashArray: '2'
    };
}



fetch('./data/DepartamentosOp.geojson')
    .then(response => response.json())
    .then(data => {
        console.log(data);
        L.geoJSON(data, {
            renderer: CanvasRender, // Usar el renderer de canvas
            // pane: 'departamento', // Asignar al pane de departamentos
            style: {
                color: '#002f559d',
                weight: 1,
                opacity: 0.8,
                fillOpacity: 0
            },
        })


            // .bindPopup(function (layer) {
            //     return "Departamento: " + layer.feature.properties.DeNombre;
            // })

            .addTo(mapa);

    })
    .catch(error => {
        console.error('Error cargando el archivo GeoJSON:', error);
    });

// ---------------------------------------------------------------------------------------------------------
//get para los departamentos con intervención

fetch('./data/Dep.geojson')
    .then(response => response.json())
    .then(data => {
        console.log(data);


        data.features.forEach(feature => {
            var municipiosIntervenidos = feature.properties.MunicipiosInter || []; // Acceder a MunicipiosInter
            console.log(`Municipios Intervenidos en ${feature.properties.DeNombre}:`, municipiosIntervenidos);
        });

        var geojson;

        // Función para resaltar el feature al pasar el mouse 
        function Resaltar(e) {
            var layer = e.target;
            console.log("se accedió al arrya" + layer)

            layer.setStyle({
                weight: 3,
                color: '#002F55',
                dashArray: '',
                fillOpacity: 0.7
            });

            // layer.bringToFront();
            infoControl.update(layer.feature.properties); // Actualizar el control de información
            // Mostrar popup al pasar el mouse
        }

        // Función para restaurar el estilo original al quitar el mouse 
        function ResetResaltar(e) {
            geojson.resetStyle(e.target);
            infoControl.update(); // Limpiar el control de información
        };

        //Función para hacer un pequeño zoom al dar click en el departamento
        function ClickZoom(e) {
            mapa.fitBounds(e.target.getBounds());
        }

        function onEachFeature(feature, layer) {
            layer.on({
                mouseover: Resaltar,
                mouseout: ResetResaltar,
                click: ClickZoom
            });
        }

        geojson = L.geoJSON(data, {
            style: styles,
            onEachFeature: onEachFeature
        })
            //  .bindPopup(function (layer) {
            //      return "Departamento: " + layer.feature.properties.DeNombre + "<br>" +
            //          "Municipios Intervenidos: " + layer.feature.properties.MunicipiosInter.join(', ');
            //  })

            .addTo(mapa);

    })
    .catch(error => {
        console.error('Error cargando el archivo GeoJSON:', error);
    });


// -------------------------------------------------------------------------------------------------------------
//get para los municipios


// fetch('./data/MunicipiosOp.geojson')
//     .then(response => response.json())
//     .then(dato => {
//         console.log(dato);

//         //Filtrar solo los municipios destacados
//         var municipiosFiltrados = {
//             type: "FeatureCollection",
//             features: dato.features.filter(feature => {
//                 var nombreMun = feature.properties.MpNombre;
//                 return MunDestacados.includes(nombreMun);
//             })
//         };

//         console.log(`Municipios filtrados: ${municipiosFiltrados.features.length} de ${dato.features.length}`);

//         L.geoJSON(municipiosFiltrados, {
//             style: function (feature) {
//                 //Como todos son destacados, solo necesitas un estilo
//                 return {
//                     color: "#002F55",
//                     fillColor: '#ffee00ff',
//                     weight: 0.5,
//                     opacity: 0.8,
//                     fillOpacity: 0.8
//                 };
//             },
//             onEachFeature: function (feature, layer) {
//                 //Agregar popup con información del municipio
//                 layer.bindPopup(`
//                     <strong>Municipio:</strong> ${feature.properties.MpNombre}<br>
//                     <strong>Departamento:</strong> ${feature.properties.Depto || 'N/A'}
//                 `);
//             }
//         }).addTo(mapa);
//     })
//     .catch(error => {
//         console.error('Error cargando el archivo GeoJSON:', error);
//     });

// var Iconoarbi = L.icon({
//     iconUrl: '/Frame.png',
// });

//var MarkerArbi = L.marker([5.25059244734198, -74.30118294909731], { icon: Iconoarbi }).addTo(mapa);
// var MarkerArbi = L.marker([2.2374711042635576, -75.80416518335129], { icon: Iconoarbi }).addTo(mapa);
// var MarkerArbi = L.marker([6.689442034486474, -75.60977494021826], { icon: Iconoarbi }).addTo(mapa);
// var MarkerArbi = L.marker([1.9273374891898298, -77.96340122482337], { icon: Iconoarbi }).addTo(mapa);
//var MarkerArbi = L.marker([0.5393863183507195, -75.8306468218662], { icon: Iconoarbi }).addTo(mapa);


// ----------------------------------------------------------
// Añadir la leyenda de información de intervención al mapa.
// -----------------------------------------------------------


var legend = L.control({ position: 'bottomleft' });

legend.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'info legend');

    // HTML de la leyenda
    div.innerHTML = `
    <section class="legend-section">
    <h4>Área Intervenida</h4>
    <section/>
    <div class="legend-item">
            <span class="legend-text">30.926.175 Predios intervenidos</span>
        </div>
        <div class="legend-item">
            <span class="legend-color" style="background-color: #002F55; opacity: 0.8;"></span>
            <span class="legend-text">1.926.175 Hectáreas</span>
        </div>
        <div class="legend-item">
            <span class="legend-color" style="background-color: #002f559d; opacity: 0.8; border: 1px solid #000;"></span>
            <span class="legend-text">15 Departamentos</span>
        </div>
        <div class="legend-item">
            <span class="legend-color" style="background-color: #FFC107; border: 1px solid #000;"></span>
            <span class="legend-text">35 Municipios</span>
        </div>
    `;

    return div;
};

legend.addTo(mapa);



//------------------------------------------------------------------------------------------------
// Control interactivo que va mostrando los municipios intervenidos en cada departamento
//------------------------------------------------------------------------------------------------

var infoControl = L.control({ position: 'topright' });

infoControl.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'info-control');
    this.update();
    return this._div;
};

// ----------------------------------------------------------
// función para controlar la información que se muestra en el infoControl
// ----------------------------------------------------------

infoControl.update = function (props) {
    if (props && props.MunicipiosInter && props.MunicipiosInter.length > 0) {
        // Crear lista HTML con los municipios
        var listaMunicipios = props.MunicipiosInter
            .sort() // Ordenar alfabéticamente (puedes cambiar por .sort().reverse() para orden descendente)
            .map(municipio => '<li class="info-control-Listitem">' + municipio + '</li>')
            .join('');

        this._div.innerHTML = '<h4 class="info-control-title">Municipios intervenidos</h4>' +
            '<b class="info-control-departamento">' + props.DeNombre + '</b><br />' +
            '<ul style="margin: 10px 0; list-style: none; padding-left: 0;">' + listaMunicipios + '</ul>';
    } else {
        this._div.innerHTML = '<h4 class="info-control-title">Municipios intervenidos</h4>' +
            ' <p class="info-control-Listitem">Pasa el mouse sobre un departamento</p>';
    }
};

infoControl.addTo(mapa);

// ---------------------------------------------------------------
// función para el botón de home para regresar al zoom inicial
// ---------------------------------------------------------------

var HomeButton = L.control({ position: 'topleft' });

HomeButton.onAdd = function (map) {
    var button = L.DomUtil.create('button', 'btn btn-light border shadow btn-sm');
    button.innerHTML = '<i class="bi bi-house-door-fill"></i>';
    button.title = 'Regresar al zoom inicial';
    button.onclick = function () {
        mapa.setView([4.5709, -74.2973], 5); // Coordenadas y zoom inicial
    };
    return button;
};

HomeButton.addTo(mapa);

// ------------------------------------------------------
//Botón para añadir capa de municipios intervenidos --> Permite mostrar la capa de municipios destacados
//-------------------------------------------------------


// Variable global para guardar la capa de municipios
var capaMunicipios = null;
var municipiosActivos = false;

var MunicipalButton = L.control({ position: 'topleft' });

MunicipalButton.onAdd = function (map) {
    var button = L.DomUtil.create('button', 'btn btn-light border shadow btn-sm');
    button.innerHTML = '<i class="bi bi-layers-fill"></i>';
    button.title = 'Añadir capa de municipios intervenidos';

    button.onclick = function () {
        if (!municipiosActivos) {
            // Activar capa de municipios
            fetch('./data/MunicipiosOp.geojson')
                .then(response => response.json())
                .then(dato => {
                    console.log(dato);

                    //Filtrar solo los municipios destacados
                    var municipiosFiltrados = {
                        type: "FeatureCollection",
                        features: dato.features.filter(feature => {
                            var nombreMun = feature.properties.MpNombre;
                            return MunDestacados.includes(nombreMun);
                        })
                    };

                    console.log(`Municipios filtrados: ${municipiosFiltrados.features.length} de ${dato.features.length}`);

                    capaMunicipios = L.geoJSON(municipiosFiltrados, {
                        renderer: CanvasRender, // Usar el renderer de canvas
                        // pane: 'municipio', // Asignar al pane de municipios
                        style: function (feature) {
                            return {
                                color: "#000406ff",
                                fillColor: '#FFC107',
                                weight: 0.7,
                                opacity: 0.8,
                                fillOpacity: 1

                            };
                        },
                        onEachFeature: function (feature, layer) {
                            layer.bindPopup(`
                                <strong>Municipio:</strong> ${feature.properties.MpNombre}<br>
                                <strong>Departamento:</strong> ${feature.properties.Depto || 'N/A'}
                            `);
                        }
                    }).addTo(mapa);



                    // Cambiar estado y apariencia del botón
                    municipiosActivos = true;
                    button.classList.remove('btn-light');
                    button.classList.add('btn-warning');
                    button.title = 'Ocultar capa de municipios intervenidos';
                })
                .catch(error => {
                    console.error('Error cargando el archivo GeoJSON:', error);
                });
        } else {
            // Desactivar capa de municipios
            if (capaMunicipios) {
                mapa.removeLayer(capaMunicipios);
                capaMunicipios = null;
            }

            // Cambiar estado y apariencia del botón
            municipiosActivos = false;
            button.classList.remove('btn-primary');
            button.classList.add('btn-light');
            button.title = 'Añadir capa de municipios intervenidos';
        }
    };

    return button;
};

MunicipalButton.addTo(mapa);