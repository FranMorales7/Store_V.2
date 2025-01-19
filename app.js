// VARIABLES
const opcTiendas = document.querySelector('#selectStores'); // Dropdown for store options
const btList = document.querySelector('#buttonList'); // Button list container for filters
let url = ``; // API URL to be dynamically updated
const saveTienda = document.querySelector('#guardarTienda'); // Button to save selected store
const search = document.querySelector('#search'); // Search input
let actualPrice = document.getElementById('actualPrice'); // Element displaying selected price
const rangePrice = document.getElementById('priceSelected'); // Price range slider
const divTabla = document.querySelector('#divTienda'); // Container for displaying game data
let actualRating = document.querySelector('#actualRating'); // Element displaying selected rating
let titleSelected = document.querySelector('#titleSelected'); // Input for game title
let lastPage = document.getElementById('lastPage'); // Button for navigating to the previous page
let currentPage = document.getElementById('currentPage'); // Current page display
let nextPage = document.getElementById('nextPage'); // Button for navigating to the next page
let sortOrder = 'asc'; // Default sort order (ascending)

// METHODS

// Generate store options from API data
function optionStore() {
    const urlAux = 'https://www.cheapshark.com/api/1.0/stores'; // API URL for stores
    fetch(urlAux)
        .then(resp => resp.json())
        .then(datos => {
            // Add active stores as dropdown options
            datos.map((dato) => {
                if (dato.isActive === 1) {
                    opcTiendas.innerHTML += `<option value="${dato.storeID}">${dato.storeName}</option>`;
                }
            });
        })
        .catch(error => console.error('Error:', error)); // Log errors if fetch fails
}

// Call method to populate store options
optionStore();

// Generate filter buttons dynamically
function makeFilter() {
    // Reset button list to default
    btList.innerHTML = '<button id="btLinks" type="button" class="btn btn-link text-white text-decoration-none small" data-bs-toggle="modal" data-bs-target="#storesModal">Store</button> ';
    // Add other filter buttons
    btList.innerHTML += `
        / <button id="btLinks" type="button" class="btn btn-link text-white text-decoration-none small" data-bs-toggle="modal" data-bs-target="#priceModal">Price</button> / 
        <button id="btLinks" type="button" class="btn btn-link text-white text-decoration-none small" data-bs-toggle="modal" data-bs-target="#titleModal">Title</button> / 
        <button id="btLinks" type="button" class="btn btn-link text-white text-decoration-none small" data-bs-toggle="modal" data-bs-target="#classModal">Genre</button> 
        <button id="sortButton" type="button" class="btn btn-link text-white text-decoration-none small">Sort by Price: Ascending</button>
    `;

    // Add event listener for the sorting button
    document.getElementById('sortButton').addEventListener('click', () => {
        // Toggle sort order
        sortOrder = (sortOrder === 'asc') ? 'desc' : 'asc'; 
        document.getElementById('sortButton').textContent = `Sort by Price: ${sortOrder === 'asc' ? 'Ascending' : 'Descending'}`;
        
        // Re-fetch and sort the data based on the selected order
        makeData(0, 15, sortOrder);
    });
}

// Fetch and display games for the selected store
function store() {
    saveTienda.addEventListener('click', () => {
        console.log('Store:', opcTiendas.value);
        url = `https://www.cheapshark.com/api/1.0/deals?storeID=${opcTiendas.value}`; // Update API URL
        console.log('URL =', url);

        // Display filter buttons
        makeFilter();

        // Activate search filters
        searchBYPrice();
        searchByTitle();

        // Fetch and display data with pagination and default sorting order
        makeData(0, 15, sortOrder);

        currentPage.textContent = '1'; // Reset to the first page
    });
}

// Initialize the store method
store();

// Apply price filter to the API URL
function searchBYPrice() {
    rangePrice.addEventListener('input', () => {
        actualPrice.textContent = rangePrice.value; // Update displayed price
    });

    document.getElementById('guardarPrecio').addEventListener('click', () => {
        url += `&lowerPrice=0&upperPrice=${rangePrice.value}`; // Update URL with price filter
        console.log('URL with Price:', url);
        makeData(0, 15); // Fetch filtered data
    });
}

// Apply title filter to the API URL
function searchByTitle() {
    document.getElementById('guardarTitulo').addEventListener('click', () => {
        url += `&title=${titleSelected.value}`; // Update URL with title filter
        console.log('URL with Title:', url);
        makeData(0, 15); // Fetch filtered data
    });
}

// Pagination - Next page
nextPage.addEventListener('click', () => {
    switch (currentPage.textContent) {
        case '1':
            store();
            makeData(16, 30);
            currentPage.textContent = '2';
            return;
        case '2':
            store();
            makeData(31, 45);
            currentPage.textContent = '3';
            return;
        case '3':
            store();
            makeData(46, 60);
            currentPage.textContent = '4';
            return;
    }
});

// Pagination - Previous page
lastPage.addEventListener('click', () => {
    switch (currentPage.textContent) {
        case '2':
            store();
            makeData(0, 15);
            currentPage.textContent = '1';
            return;
        case '3':
            store();
            makeData(16, 30);
            currentPage.textContent = '2';
            return;
        case '4':
            store();
            makeData(31, 45);
            currentPage.textContent = '3';
            return;
    }
});

// Fetch and structure game data for display
function makeData(min, max, sortOrder='asc') {
    fetch(url)
        .then(resp => resp.json())
        .then(datos => {
            console.log('DATA:', datos);
            // Sort data based on price and order
            if (sortOrder === 'asc') {
                datos.sort((a, b) => a.salePrice - b.salePrice); // Sort by price ascending
            } else {
                datos.sort((a, b) => b.salePrice - a.salePrice); // Sort by price descending
            }

            crearTabla(datos, min, max); // Call function to structure data
        })
        .catch(error => console.error('Error:', error)); // Log fetch errors
}

// Generate HTML structure for game data
function crearTabla(datos, min, max) {
    const resultado = document.querySelector('#resBusqueda'); // Span for displaying results count
    let contador = min; // Initialize counter
    divTabla.innerHTML = ''; // Clear previous data

    while (contador < max) {
        divTabla.innerHTML += `
            <div class="col-6 col-md-3 mb-2">
                <img src="${datos[contador].thumb}" class="img-fluid rounded mb-3">
                <p class="text-secondary">${datos[contador].title}</p>
                <div class="d-flex">
                    <small class="px-3"><s>${datos[contador].normalPrice}</s></small> 
                    <h4>${datos[contador].salePrice}</h4>
                </div>
                <p>Savings: ${getAhorro(datos[contador].normalPrice, datos[contador].salePrice)}%</p>
                <p>Score: ${datos[contador].steamRatingPercent}%</p>
            </div>`;
        contador++; // Increment counter
        resultado.textContent = contador; // Update results count
    }
}

// Calculate percentage savings
function getAhorro(precioAntes, precioActual) {
    const res = ((precioAntes - precioActual) / precioAntes) * 100; // Calculate savings
    return Math.round(res); // Return rounded value
}
