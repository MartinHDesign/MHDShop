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
// order script
async function createCustomerForm() {
    document.getElementById("myForm").addEventListener("submit", function (event) {
        event.preventDefault();
        let isValid = true;

        const nameInput = document.getElementById("name");
        const phoneNumberInput = document.getElementById("phone-number");
        const emailInput = document.getElementById("exampleInputEmail1");
        const streetNameInput = document.getElementById("streetName");
        const zipCodeInput = document.getElementById("zipCode");
        const cityInput = document.getElementById("city");

        const fullNamePattern = /^(?=.{2,50}$)(?:[a-zA-Z]+(?:\s[a-zA-Z]+){1,})$/;
        if (!fullNamePattern.test(nameInput.value.trim())) {
            isValid = false;
            nameInput.value = "";
            nameInput.placeholder = "Please enter first and last name";
            nameInput.classList.add("red-placeholder");
        }

        const phonePattern = /^[\d()-]{0,50}$/;
        if (!phonePattern.test(phoneNumberInput.value.trim()) || phoneNumberInput.value.trim().length == 0) {
            isValid = false;
            phoneNumberInput.value = "";
            phoneNumberInput.placeholder = "Please enter correct phone number";
            phoneNumberInput.classList.add("red-placeholder");
        }

        const emailPattern = /^[A-Za-z0-9\._%+\-]+@[A-Za-z0-9\.\-]+\.[A-Za-z]{2,}$/;
        if (!emailPattern.test(emailInput.value.trim())) {
            isValid = false;
            emailInput.value = "";
            emailInput.placeholder = "Please enter correct Email";
            emailInput.classList.add("red-placeholder");
        }

        if (streetNameInput.value.trim().length < 2 || streetNameInput.value.trim().length > 50) {
            isValid = false;
            streetNameInput.value = "";
            streetNameInput.placeholder = "Please enter a valid street name";
            streetNameInput.classList.add("red-placeholder");
        }
        const digitPattern = /^\d+$/;
        if (zipCodeInput.value.toString().trim().length !== 5 || !digitPattern.test(zipCodeInput.value.toString().trim())) {
            isValid = false;
            zipCodeInput.value = "";
            zipCodeInput.placeholder = "Please enter a valid zipcode (5 digits)";
            zipCodeInput.classList.add("red-placeholder");
        }

        if (cityInput.value.trim().length < 2 || cityInput.value.trim().length > 50) {
            isValid = false;
            cityInput.value = "";
            cityInput.placeholder = "Please enter a city";
            cityInput.classList.add("red-placeholder");
        }

        if (isValid) {
            localStorage.removeItem("cartData")
            localStorage.customerName = nameInput.value;
            window.location.href = "confirm.html";

        }
    });
}

//render products
const storageData = JSON.parse(localStorage.getItem('cartData'));
const storedProducts = storageData.items;
const storedQuantities = storageData.quantities;
const orderItemsContainer = document.getElementById('orderItems');

let totalPrice = 0;
function renderProducts() {
    storedProducts.forEach((product) => {
        const quantity = storedQuantities[product.id];
        const itemDiv = document.createElement('div');
        itemDiv.classList.add('container');
        itemDiv.innerHTML = `
                    <div id="orderItemsDiv" class="row">
                        <div class='col-lg-2 col-md-2 col-sm-4'>
                            <img src="${product.image}" alt="${product.title}" style="width: 100%; margin-bottom: 10%;">
                        </div>
                        <div class='col-lg-2 col-md-6 col-sm-4'>
                            <h5>${product.title}</h5>
                        </div>
                        <div class='col-lg-6 col-md-12 col-sm-12'>
                            <p>${product.description}</p>
                        </div>
                        <div class='col-lg-1 col-md-6 col-sm-4'>
                            <p>Price: ${product.price * quantity}€</p>
                        </div>
                        <div class='col-lg-1 col-md-6 col-sm-4'>
                            <p>Quantity: ${quantity}</p>
                        </div>
                    </div>   
                    `;
        orderItemsContainer.appendChild(itemDiv);
        totalPrice += product.price * quantity

    });
    document.getElementById("totalOrderPrice").innerHTML = `Total: ${totalPrice} €`
}

function getName() {
    const receiptDiv = document.getElementById("receipt");
    receiptDiv.innerHTML = `
    <div class="card text-white bg-primary mb-3" style="max-width: 20rem;">
    <div class="card-header">Order confirmed</div>
    <div class="card-body">
      <h4 class="card-title">Thank you for your order ${localStorage.customerName}</h4>
      <p class="card-text">Products will be shipped in three days</p>
    </div>
  </div>`
}