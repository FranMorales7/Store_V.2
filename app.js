/** Parametros de busqueda:
 * -->Por tienda(id)<--
 * -->Por precio de menor a mayor
 * -->Por tener descuento
 * -->Por Titulo
 * -->Por genero
 */

//VARIABLES necesarias
const opcTiendas = document.querySelector('#selectStores');
let url =``;
const saveTienda = document.querySelector('#guardarTienda');
let minValue = document.getElementById('minValue');
let maxValue = document.getElementById('maxValue');
const rangePrice =  document.getElementById('rangePrice');


//METODOS necesarios

//Generar opciones de tiendas
function opcionesTiendas(){
    //URL a emplear
    const urlAux = 'https://www.cheapshark.com/api/1.0/stores'
    fetch(urlAux)
        .then(resp => resp.json())

        .then(datos => {

            // Seleccionar tienda a tienda aquellas que esten activas para poder incluirlas como opciones
            datos.map((dato) => {
                if(dato.isActive === 1){
                opcTiendas.innerHTML+=
                `
                <option value="${dato.storeID}">${dato.storeName}</option>
                `;    
                }
            });
            }
        )

        //En caso de fallo, se mostrara el correspondiente mensaje
        .catch(error => console.error('Error:', error));
}

//LLamada al metodo para que se generen las opciones con las tiendas disponibles
opcionesTiendas();


//Obtener la tienda seleccionada
function tienda() {
    //Al hacer click sobre el boton "Guardar tienda"...
    saveTienda.addEventListener('click', () => {
        console.log('Tienda: ',opcTiendas.value);

        //La url que se va a emplear cambiara segun la opcion elegida
        url = `https://www.cheapshark.com/api/1.0/deals?storeID=${opcTiendas.value}`;
        console.log('URL = ', url);

        //Obtener los datos de la url establecida anteriormente
        fetch(url)
            .then(resp => resp.json())

            .then(datos => {
                //LLamada a la funcion para generar la estructura de datos en el DOM
                crearTabla(datos)
            })

            //En caso de fallo, se mostrara el correspondiente mensaje
            .catch(error => console.error('Error:', error));
            })
};

//Llamada a la funcion para generar los datos de la tienda elegida
tienda();

//Metodo para averiguar el porcentaje de ahorro
function getAhorro(precioAntes, precioActual){
    const res = ((precioAntes-precioActual)/precioAntes)*100;
    return Math.round(res); //Devuelve un redondeo aproximado
}

//Metodo para obtener los datos estructurados
function crearTabla(datos){
    //Variables a emplear
    const resultado = document.querySelector('#resBusqueda');//selecciona el <span> cuyo id es "resBusqueda"
    let contador = 0; //contador iniciado a 0  
    const divTabla = document.querySelector('#divTienda');//selecciona el <div> cuyo id es "tablaJuegos"
    divTabla.innerHTML=''; //se limpia el divTabla del DOM

    //Solo se mostraran doce elementos por pagina
    while(contador < 16){
    // Generar la estructura HTML combinada con clases de bootstrap y estilo css propio
    const listadoHTML =
        `
        <div class="col-md-6 col-lg-6">
            <img src="${datos[contador].thumb}" class="img-fluid rounded mb-3">
            <p class="text-secondary">${datos[contador].title}</p>
            <div class="d-flex">
            <small class="px-3"><s>${datos[contador].normalPrice}</s></small> 
            <h4>${datos[contador].salePrice}</h4>
            </div>
            <p>savings: ${getAhorro(datos[contador].normalPrice, datos[contador].salePrice)}%</p>
            <p>Calification: ${datos[contador].salePrice}</p>
            <p>Link: ${datos[contador].salePrice}</p>
        </div>`;

    //La estructura creada se pasa al contenedor del HTML
    divTabla.innerHTML += listadoHTML;
    contador++;//aumenta en uno el contador
    resultado.textContent=contador;//Se indica la cantidad de elementos encontrados
    }
}

//Generar obtener precio
function obtenerPrecio(){
    //URL a emplear
    //url += `&lowerPrice=${minValue}&upperPrice=${maxValue}`;
    
    //Validar precio
    function validatePrice(){
        const inputElements = document.querySelectorAll('.range-fill');
        let minPrice = parseInt(inputElements[0].value);
        let maxPrice = parseInt(inputElements[1].value);

        //Si el valor de precio minimo es mayor que del precio maximo, se intercambian los valores
        if(minPrice>maxPrice){
            let auxPrice = maxPrice;
            maxPrice = minPrice;
            minPrice = auxPrice;
        }

        minValue.textContent=`${minPrice}`;
        maxValue.textContent=`${maxPrice}`;
    }

    inputElements.forEach(price => {
        price.addEventListener('input', validatePrice)
    });
}

obtenerPrecio();
