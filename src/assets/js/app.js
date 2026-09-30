const API_URL = "https://fakestoreapi.com/products";

const productsContainer = document.querySelector("#products");
const loadMoreButton = document.querySelector("#load-more");

let allProducts = [];
let productsToShow = 8;
const productsPerLoad = 4;

fetch(API_URL)
    .then(response => response.json())
    .then(products => {
        allProducts = products;

        renderProducts();
    })
    .catch(error => {
        console.error("Failed to fetch products:", error);
    });


function renderProducts() {

    productsContainer.innerHTML = "";

    const visibleProducts = allProducts.slice(0, productsToShow);

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


    if (productsToShow >= allProducts.length) {
        loadMoreButton.style.display = "none";
    } else {
        loadMoreButton.style.display = "block";
    }
}


loadMoreButton.addEventListener("click", () => {

    productsToShow += productsPerLoad;

    renderProducts();

});