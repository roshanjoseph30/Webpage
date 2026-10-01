const API_URL = "https://fakestoreapi.com/products";

const productsContainer = document.querySelector("#products");
const loadMoreButton = document.querySelector("#load-more");
const categoryFilter = document.querySelector("#category1");
const searchInput = document.querySelector("#search");

let allProducts = [];
let filteredProducts = [];

let productsToShow = 8;
const productsPerLoad = 4;


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

        createCategoryOptions();

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


function createCategoryOptions() {
    const categories = [...new Set(
        allProducts.map(product => product.category)
    )];

    categories.forEach(category => {
        const option = document.createElement("option");

        option.value = category;
        option.textContent = category;

        categoryFilter.appendChild(option);
    });
}



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
            <button class="heart-icon" 
             aria-label="Add ${product.title} to favorites">♡</button>

            <div class="badge">Featured</div>

            <img
                src="${product.image}"
                alt="${product.title}"
            >

            <h2>${product.title}</h2>

            <div class="rating">
                <div class="stars" aria-hidden="true">
                    ${getStars(product.rating.rate)}
                </div>

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

categoryFilter.addEventListener("change", () => {
    const selectedCategory = categoryFilter.value;

    if (selectedCategory === "") {
        filteredProducts = allProducts;
    } else {
        filteredProducts = allProducts.filter(product => {
            return product.category === selectedCategory;
        });
    }

    productsToShow = 8;
    renderProducts();
});


productsContainer.addEventListener("click", (event) => {
    if (event.target.classList.contains("heart-icon")) {
        event.target.classList.toggle("active");

        if (event.target.classList.contains("active")) {
            event.target.textContent = "♥";
            event.target.setAttribute("aria-pressed", "true");
        } else {
            event.target.textContent = "♡";
            event.target.setAttribute("aria-pressed", "false");
        }
    }
});



let searchTimeout;

searchInput.addEventListener("input", () => {
    clearTimeout(searchTimeout);

    searchTimeout = setTimeout(() => {
        const searchTerm = searchInput.value.toLowerCase().trim();

        filteredProducts = allProducts.filter(product => {
            return (
                product.title.toLowerCase().includes(searchTerm) ||
                product.category.toLowerCase().includes(searchTerm)
            );
        });

        productsToShow = 8;
        renderProducts();

    }, 300);
});



loadMoreButton.addEventListener("click", () => {

    productsToShow += productsPerLoad;

    renderProducts();
});

function getStars(rating) {
    const roundedRating = Math.round(rating);

    const fullStars = "★".repeat(roundedRating);
    const emptyStars = "☆".repeat(5 - roundedRating);

    return fullStars + emptyStars;
}