const API_URL = "https://fakestoreapi.com/products";

const productsContainer = document.querySelector("#products");
const loadMoreButton = document.querySelector("#load-more");
const searchInput = document.querySelector("#search");

let allProducts = [];
let filteredProducts = [];

let productsToShow = 8;
const productsPerLoad = 4;


// Fetch products
fetch(API_URL)
    .then(response => {
        if (!response.ok) {
            throw new Error("Failed to fetch products");
        }

        return response.json();
    })
    .then(products => {
        allProducts = products;
        filteredProducts = products;

        renderProducts();
    })
    .catch(error => {
        console.error("Failed to fetch products:", error);

        productsContainer.innerHTML = `
            <p class="error-message">
                Failed to load products. Please try again later.
            </p>
        `;

        loadMoreButton.style.display = "none";
    });


// Render products
function renderProducts() {

    productsContainer.innerHTML = "";

    // No products found
    if (filteredProducts.length === 0) {

        productsContainer.innerHTML = `
            <p class="no-products">
                No products found.
            </p>
        `;

        loadMoreButton.style.display = "none";

        return;
    }

    const visibleProducts = filteredProducts.slice(0, productsToShow);

    visibleProducts.forEach(product => {

        const article = document.createElement("article");

        article.classList.add("product-card");

        article.innerHTML = `
            <button class="heart-icon">♡</button>

            <div class="badge">Featured</div>

            <img
                src="${product.image}"
                alt="${product.title}"
            >

            <h2>${product.title}</h2>

            <div class="rating">
                <span>★</span>
                <span>★</span>
                <span>★</span>
                <span>★</span>
                <span>★</span>

                <p>(${product.rating.count} reviews)</p>
            </div>

            <div class="price">
                <p>$${product.price}</p>
                <button>Add to Cart</button>
            </div>
        `;

        productsContainer.appendChild(article);
    });


    // Load More button
    if (productsToShow >= filteredProducts.length) {
        loadMoreButton.style.display = "none";
    } else {
        loadMoreButton.style.display = "block";
    }
}


// Search
searchInput.addEventListener("input", () => {

    const searchTerm = searchInput.value.toLowerCase().trim();

    filteredProducts = allProducts.filter(product => {

        return (
            product.title.toLowerCase().includes(searchTerm) ||
            product.category.toLowerCase().includes(searchTerm)
        );

    });

    // Reset number of products
    productsToShow = 8;

    renderProducts();
});


// Load More
loadMoreButton.addEventListener("click", () => {

    productsToShow += productsPerLoad;

    renderProducts();
});