const allProducts = [];

const productsByCategory = {
    electronics: [],
    jewelery: [],
    mensClothing: [],
    womensClothing: []
};

let cartItems = [];

async function getAllProducts() {
    await fetch('https://fakestoreapi.com/products')
        .then(res => res.json())
        .then(json => {
            json.forEach(product => {
                allProducts.push(product);
                categorizeProduct(product);
            });
            console.log(productsByCategory);
            displayProductCards('allproducts');
        });
}

function categorizeProduct(product) {
    switch (product.category) {
        case 'electronics':
            productsByCategory.electronics.push(product);
            break;
        case 'jewelery':
            productsByCategory.jewelery.push(product);
            break;
        case "men's clothing":
            productsByCategory.mensClothing.push(product);
            break;
        case "women's clothing":
            productsByCategory.womensClothing.push(product);
            break;
        default:
            console.log("error invalid category");
            break;
    }
}

function displayProductCards(category) {
    const cardRow = document.getElementById('displayProducts');
    cardRow.innerHTML = '';
    let products = [];

    switch (category.toLowerCase()) {
        case 'allproducts':
            products = allProducts;
            break;
        case 'electronics':
            products = productsByCategory.electronics;
            break;
        case 'jewelry':
            products = productsByCategory.jewelery;
            break;
        case "men":
            products = productsByCategory.mensClothing;
            break;
        case "women":
            products = productsByCategory.womensClothing;
            break;
        default:
            products = allProducts;
            break;
    }

    products.forEach(product => {
        try {
            const cardColumn = document.createElement('div');
            cardColumn.classList.add('col-12', 'col-sm-6', 'col-md-5', 'col-lg-4', 'col-xl-3', 'mb-2');

            const card = document.createElement('div');
            card.classList.add('card', 'custom-card');

            const cardBody = document.createElement('div');
            cardBody.classList.add('card-body');

            const img = document.createElement('img');
            img.src = product.image;
            img.alt = "Image"
            img.classList.add('card-img-top');
            cardBody.appendChild(img);

            const cardText = document.createElement('p');
            cardText.classList.add('card-text', 'mt-auto');
            cardText.textContent = product.title;
            cardBody.appendChild(cardText);

            const price = document.createElement('p');
            price.textContent = product.price + "€";
            cardBody.appendChild(price);

            const buyButton = document.createElement('button');
            buyButton.addEventListener('click', function () {
                addItemToCart(product.id);
            })
            buyButton.textContent = 'Add to cart';
            cardBody.appendChild(buyButton);

            card.appendChild(cardBody);

            cardColumn.appendChild(card);
            cardRow.appendChild(cardColumn);
        } catch (error) {
            console.error(`Error fetching product data for ID ${product.id}:`, error);
        }
    });
}

const categoryButtons = document.querySelectorAll('.categoryButtons');

categoryButtons.forEach(button => {
    button.addEventListener('click', function () {
        const text = this.textContent;
        displayProductCards(text);
    });
});

function toggleCart() {
    if (cartTab.style.display === 'none' || cartTab.style.display === '') {
        cartTab.style.display = 'block';
    } else {
        cartTab.style.display = 'none';
    }
}

const cartIcon = document.getElementById("cartButton");
if (cartIcon !== null) {
    cartIcon.addEventListener('click', toggleCart)
}

function setNavbarWidth() {
    const productCardsContainer = document.getElementById('productCardsContainer');
    const navbar = document.querySelector('.navbar');
    const navbarWidth = productCardsContainer.clientWidth + 'px';
    navbar.style.width = navbarWidth;
}

const closeButton = document.getElementById("closeButton");

if (closeButton !== null) {
    closeButton.addEventListener("click", () => toggleCart());
}


window.addEventListener('resize', setNavbarWidth);
setNavbarWidth();


window.addEventListener("load", getAllProducts);




// Lyssna på klick på "Add to cart" -knapparna och lägg till produkten i varukorgen
const addToCartButtons = document.querySelectorAll('.addToCartButton');
addToCartButtons.forEach(button => {
    button.addEventListener('click', function () {
        const productId = this.dataset.productId;
        addItemToCart(productId);
    });
});


function addItemToCart(id) {
    const product = allProducts.find(product => product.id === id);

    if (product) {
        const existingItem = cartItems.find(item => item.id === id);

        if (existingItem) {
            existingItem.quantity++;
            updateCart()
        } else {
            product.quantity = 1;
            cartItems.push(product);
            updateCart()
        }
        updateTotalPrice();
        updateCartCounter();
    }
}

function updateCartView() {
    const cartRow = document.getElementById('cartRow');
    cartRow.innerHTML = ''; // Rensa varukorgen

    // Uppdatera varukorgen på nytt
    cartItems.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.classList.add('row', 'cart-item');

        // Bildkolumn
        const imageColumn = document.createElement('div');
        imageColumn.classList.add('col-1');
        const img = document.createElement('img');
        img.src = item.image;
        img.alt = "Product Image";
        img.style.width = "50px";
        img.style.height = "50px";
        imageColumn.appendChild(img);
        cartItem.appendChild(imageColumn);

        // Priskolumn
        const priceColumn = document.createElement('div');
        priceColumn.classList.add('col-2');
        const totalPrice = item.price * item.quantity; // Beräkna det totala priset för produkten
        priceColumn.textContent = totalPrice + "€"; // Visa det totala priset
        cartItem.appendChild(priceColumn);

        // Knapp1 kolumn (Remove button)
        const button1Column = document.createElement('div');
        button1Column.classList.add('col-1');
        const removeButton = document.createElement('button');
        removeButton.textContent = "-";
        removeButton.classList.add('btn', 'btn-dark');
        removeButton.addEventListener('click', function () {
            if (item.quantity > 1) {
                item.quantity--;
                const newPrice = item.price * item.quantity; // Beräkna det nya priset
                priceColumn.textContent = newPrice + "€"; // Uppdatera priset i varukorgen
            } else {
                // Om antalet är 1 eller mindre, ta bort produkten från listan
                const cartItem = removeButton.closest('.cart-item');
                cartItem.remove();
                // Ta bort produkten från cartItems-arrayen
                const itemIndex = cartItems.findIndex(cartItem => cartItem.id === item.id);
                cartItems.splice(itemIndex, 1);
            }
            updateTotalPrice();
            updateCartCounter();
            updateCart()
        });
        button1Column.appendChild(removeButton);
        cartItem.appendChild(button1Column);

        // Antalkolumn
        const quantityColumn = document.createElement('div');
        quantityColumn.classList.add('col-1');
        const quantityText = document.createElement('span');
        quantityText.textContent = item.quantity; // Antal produkter
        quantityColumn.appendChild(quantityText);
        cartItem.appendChild(quantityColumn);

        // Knapp2 kolumn (Confirm button)
        const button2Column = document.createElement('div');
        button2Column.classList.add('col-1');
        const confirmButton = document.createElement('button');
        confirmButton.textContent = "+";
        confirmButton.classList.add('btn', 'btn-dark');
        confirmButton.addEventListener('click', function () {
            item.quantity++;
            const newPrice = item.price * item.quantity; // Beräkna det nya priset
            priceColumn.textContent = newPrice + "€"; // Uppdatera priset i varukorgen
            quantityText.textContent = item.quantity; // Uppdatera antal i visningen
            updateCartCounter();
            updateTotalPrice();
            updateCart()
        });
        button2Column.appendChild(confirmButton);
        cartItem.appendChild(button2Column);

        // Knapp3 kolumn (Delete button with icon)
        const button3Column = document.createElement('div');
        button3Column.classList.add('col-1');
        const deleteButton = document.createElement('button');
        deleteButton.classList.add('btn', 'btn-dark', 'delete-button'); // Lägg till en klass för delete-knappen
        const trashIcon = document.createElement('img');
        trashIcon.src = "https://img.icons8.com/ios/452/trash--v1.png";
        trashIcon.alt = "Delete Icon";
        trashIcon.style.width = "20px";
        deleteButton.appendChild(trashIcon);
        deleteButton.addEventListener('click', function () {

            const cartItem = deleteButton.closest('.cart-item');
            cartItem.remove();
            const itemIndex = cartItems.findIndex(cartItem => cartItem.id === item.id);
            cartItems.splice(itemIndex, 1);
            updateTotalPrice();
            updateCartCounter();
        });
        button3Column.appendChild(deleteButton);
        cartItem.appendChild(button3Column);

        cartRow.appendChild(cartItem);
    });
}

const deleteAllCartItems = document.getElementById("removeButton");
deleteAllCartItems.addEventListener("click", removeAllItemsFromCart);

function removeAllItemsFromCart() {
    while (cartItems.length > 0) {
        const item = cartItems[0];
        const itemIndex = cartItems.findIndex(cartItem => cartItem.id === item.id);
        cartItems.splice(itemIndex, 1);
    }
    updateTotalPrice();
    updateCart()
    updateCartCounter();
}

function updateCartCounter() {
    const cartCounter = document.querySelector('#cartButton span');
    if (cartCounter) {
        const totalQuantity = cartItems.reduce((acc, curr) => acc + curr.quantity, 0);
        cartCounter.textContent = totalQuantity.toString();
    }
}

function updateTotalPrice() {
    const totalPriceElement = document.getElementById('totalPrice');
    const totalPrice = calculateTotalPrice();
    totalPriceElement.innerHTML = `<p id="totalPrice"> Total:  ${totalPrice}€</p>`;
}

function calculateTotalPrice() {
    let totalPrice = 0;
    cartItems.forEach(item => {
        totalPrice += item.price * item.quantity;
    });
    return totalPrice.toFixed(2);
}

// Funktion för att spara varukorgen till localStorage
function saveCartToLocalStorage() {
    const cartData = {
        items: cartItems,
        quantities: {}
    };

    cartItems.forEach(item => {
        cartData.quantities[item.id] = item.quantity;
    });

    localStorage.setItem('cartData', JSON.stringify(cartData));
}

// Funktion för att hämta varukorgen från localStorage
function loadCartFromLocalStorage() {
    const cartDataJSON = localStorage.getItem('cartData');
    if (cartDataJSON) {
        const cartData = JSON.parse(cartDataJSON);
        cartItems = cartData.items;

        // Update quantities for each item
        cartItems.forEach(item => {
            if (cartData.quantities[item.id]) {
                item.quantity = cartData.quantities[item.id];
            }
        });
    }
}

// Ladda varukorgen från localStorage när sidan laddas
window.addEventListener('load', function () {
    loadCartFromLocalStorage();
    updateCartCounter();
    updateCartView(); // Uppdatera varukorgen på nytt efter att ha hämtat från localStorage
    updateTotalPrice();
});

// Spara varukorgen till localStorage varje gång den uppdateras
function updateCart() {
    saveCartToLocalStorage();
    updateCartView(); // Uppdatera varukorgen på nytt efter att ha sparat till localStorage
}

const confirmOrder = document.getElementById("confirmButton");
confirmOrder.addEventListener("click", () => {
    if (cartItems.length > 0) {
        location.href = "order.html";
    } else {
        message.style.display = 'block';
        setTimeout(() => {
            message.style.display = 'none';
        }, 3000);
    }
})