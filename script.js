const products = {
    details1: {
        id: "football-shirt",
        name: "Football Shirt",
        price: 15000,
        image: "images/jersey shirt.jpg",
        alt: "Football shirt"
    },
    details2: {
        id: "goalkeepers-gloves",
        name: "Goalkeepers Gloves",
        price: 25000,
        image: "images/gk gloves.jpg",
        alt: "Goalkeepers gloves"
    },
    details3: {
        id: "shin-guards",
        name: "Shin Guards",
        price: 10000,
        image: "images/shin guards.jpg",
        alt: "Shin guards"
    },
    details4: {
        id: "football-boots",
        name: "Football Boots",
        price: 50000,
        image: "images/boots.jpg",
        alt: "Football boots"
    }
};

const emailJsConfig = {
    publicKey: "DMn7y1o2NCgPD2Kl8",
    serviceId: "service_pfmomjs",
    templateId: "template_lke7789"
};

function formatNaira(amount) {
    return "\u20a6" + amount.toLocaleString();
}

function getCartItems() {
    return JSON.parse(localStorage.getItem("cartItems")) || [];
}

function saveCartItems(cartItems) {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
}

function getProductFromButton(addToCartButton) {
    const productContainer = addToCartButton.closest("article");
    const productLink = productContainer?.querySelector('a[href^="details"]');
    const productKey = productLink?.getAttribute("href")?.replace(".html", "");

    return products[productKey] || null;
}

function addProductToCart(product) {
    const cartItems = getCartItems();
    const existingItem = cartItems.find(function (item) {
        return item.id === product.id;
    });

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cartItems.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            alt: product.alt,
            quantity: 1
        });
    }

    saveCartItems(cartItems);
}

function setupAddToCartButtons() {
    const addToCartButtons = document.querySelectorAll('a[href="cart.html"]');

    addToCartButtons.forEach(function (button) {
        if (button.textContent.trim().toLowerCase() !== "add to cart") {
            return;
        }

        button.addEventListener("click", function () {
            const product = getProductFromButton(button);

            if (product) {
                addProductToCart(product);
            }
        });
    });
}

function calculateCartTotal(cartItems) {
    return cartItems.reduce(function (total, item) {
        return total + item.price * item.quantity;
    }, 0);
}

function renderEmptyCart(cartTable) {
    cartTable.innerHTML = `
        <tr>
            <th>Remove</th>
            <th>Image</th>
            <th>Product</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Subtotal</th>
        </tr>
        <tr>
            <td colspan="6" align="center">Your cart is empty.</td>
        </tr>
    `;
}

function renderCart() {
    const cartTable = document.querySelector(".page-cart main section:nth-of-type(2) table");

    if (!cartTable) {
        return;
    }

    const cartItems = getCartItems();

    if (cartItems.length === 0) {
        renderEmptyCart(cartTable);
        return;
    }

    let cartHTML = `
        <tr>
            <th>Remove</th>
            <th>Image</th>
            <th>Product</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Subtotal</th>
        </tr>
    `;

    cartItems.forEach(function (item) {
        const subtotal = item.price * item.quantity;

        cartHTML += `
            <tr>
                <td align="center"><button type="button" class="remove-cart-item" data-id="${item.id}">X</button></td>
                <td align="center"><img src="${item.image}" width="160" height="180" alt="${item.alt}"></td>
                <td align="center"><h3>${item.name}</h3></td>
                <td align="center"><h4>${formatNaira(item.price)}</h4></td>
                <td align="center"><input type="number" class="cart-quantity" data-id="${item.id}" min="1" max="10" value="${item.quantity}"></td>
                <td align="center"><h4>${formatNaira(subtotal)}</h4></td>
            </tr>
        `;
    });

    cartHTML += `
        <tr>
            <td colspan="5" align="right"><strong>Total</strong></td>
            <td align="center"><strong>${formatNaira(calculateCartTotal(cartItems))}</strong></td>
        </tr>
    `;

    cartTable.innerHTML = cartHTML;
    setupCartActions();
}

function setupCartActions() {
    const removeButtons = document.querySelectorAll(".remove-cart-item");
    const quantityInputs = document.querySelectorAll(".cart-quantity");

    removeButtons.forEach(function (button) {
        button.addEventListener("click", function () {
            const productId = button.dataset.id;
            const updatedCart = getCartItems().filter(function (item) {
                return item.id !== productId;
            });

            saveCartItems(updatedCart);
            renderCart();
        });
    });

    quantityInputs.forEach(function (input) {
        input.addEventListener("change", function () {
            const productId = input.dataset.id;
            const newQuantity = Number(input.value);
            const cartItems = getCartItems();
            const cartItem = cartItems.find(function (item) {
                return item.id === productId;
            });

            if (cartItem && newQuantity >= 1) {
                cartItem.quantity = newQuantity;
                saveCartItems(cartItems);
                renderCart();
            }
        });
    });
}

function renderCheckoutSummary() {
    const checkoutSummaryTable = document.querySelector(".page-checkout form td:nth-of-type(2) table");

    if (!checkoutSummaryTable) {
        return;
    }

    const cartItems = getCartItems();

    let summaryHTML = "<caption><h3>Order Summary</h3></caption>";

    if (cartItems.length === 0) {
        summaryHTML += `
            <tr>
                <td colspan="2" align="center">Your cart is empty.</td>
            </tr>
            <tr>
                <td><strong>Total</strong></td>
                <td align="right"><strong>${formatNaira(0)}</strong></td>
            </tr>
        `;
    } else {
        cartItems.forEach(function (item) {
            const subtotal = item.price * item.quantity;

            summaryHTML += `
                <tr>
                    <td>${item.name} x ${item.quantity}</td>
                    <td align="right">${formatNaira(subtotal)}</td>
                </tr>
            `;
        });

        summaryHTML += `
            <tr>
                <td><strong>Total</strong></td>
                <td align="right"><strong>${formatNaira(calculateCartTotal(cartItems))}</strong></td>
            </tr>
        `;
    }

    summaryHTML += `
        <tr>
            <td colspan="2" align="center">
                <input type="submit" value="Place Order">
            </td>
        </tr>
    `;

    checkoutSummaryTable.innerHTML = summaryHTML;
}

function setupCheckoutValidation() {
    const checkoutForm = document.querySelector(".page-checkout form");

    if (!checkoutForm) {
        return;
    }

    const requiredFields = [
        document.getElementById("fullname"),
        document.getElementById("email"),
        document.getElementById("phone"),
        document.getElementById("address")
    ];

    requiredFields.forEach(function (field) {
        field.addEventListener("input", function () {
            if (field.value.trim() !== "") {
                field.style.border = "";
                field.style.backgroundColor = "";
            }
        });
    });

    checkoutForm.addEventListener("submit", function (event) {
        let hasEmptyField = false;
        const paymentMethod = document.getElementById("payment").value;

        requiredFields.forEach(function (field) {
            if (field.value.trim() === "") {
                field.style.border = "2px solid red";
                field.style.backgroundColor = "#fff0f0";
                hasEmptyField = true;
            }
        });

        if (hasEmptyField) {
            event.preventDefault();
            alert("Please fill in all information before you can proceed to checkout.");
            return;
        }

        event.preventDefault();

        if (paymentMethod === "Card Payment") {
            window.location.href = "card-payment.html";
        } else if (paymentMethod === "Bank Transfer") {
            window.location.href = "bank-transfer.html";
        } else if (paymentMethod === "Pay on Delivery") {
            window.location.href = "pay-on-delivery.html";
        }
    });
}

function showPaymentMessage(message) {
    let paymentMessage = document.getElementById("payment-message");
    const checkoutForm = document.querySelector(".page-checkout form");

    if (!checkoutForm) {
        return;
    }

    if (!paymentMessage) {
        paymentMessage = document.createElement("p");
        paymentMessage.id = "payment-message";
        paymentMessage.style.textAlign = "center";
        paymentMessage.style.fontWeight = "bold";
        paymentMessage.style.color = "green";
        checkoutForm.appendChild(paymentMessage);
    }

    paymentMessage.textContent = message;
    alert(message);
}

function setupCardPaymentValidation() {
    const cardPaymentForm = document.querySelector(".page-card-payment form");

    if (!cardPaymentForm) {
        return;
    }

    const requiredFields = [
        document.getElementById("card-number"),
        document.getElementById("expiry-month"),
        document.getElementById("expiry-year"),
        document.getElementById("cvv")
    ];

    requiredFields.forEach(function (field) {
        field.addEventListener("input", function () {
            if (field.value.trim() !== "") {
                field.style.border = "";
                field.style.backgroundColor = "";
            }
        });
    });

    cardPaymentForm.addEventListener("submit", function (event) {
        let hasEmptyField = false;

        requiredFields.forEach(function (field) {
            if (field.value.trim() === "") {
                field.style.border = "2px solid red";
                field.style.backgroundColor = "#fff0f0";
                hasEmptyField = true;
            }
        });

        event.preventDefault();

        if (hasEmptyField) {
            alert("Please fill in all card information before you can make payment.");
        } else {
            alert("Payment successful.");
        }
    });
}

function isEmailJsConfigured() {
    return emailJsConfig.publicKey !== "YOUR_PUBLIC_KEY" &&
        emailJsConfig.serviceId !== "YOUR_SERVICE_ID" &&
        emailJsConfig.templateId !== "YOUR_TEMPLATE_ID";
}

function setupContactForm() {
    const contactForm = document.getElementById("contact");

    if (!contactForm) {
        return;
    }

    const requiredFields = [
        document.getElementById("firstname"),
        document.getElementById("lastname"),
        document.getElementById("contact-phone"),
        document.getElementById("contact-email"),
        document.getElementById("message")
    ];
    const submitButton = contactForm.querySelector('input[type="submit"]');

    requiredFields.forEach(function (field) {
        field.addEventListener("input", function () {
            if (field.value.trim() !== "") {
                field.style.border = "";
                field.style.backgroundColor = "";
            }
        });
    });

    contactForm.addEventListener("submit", function (event) {
        event.preventDefault();

        let hasEmptyField = false;

        requiredFields.forEach(function (field) {
            if (field.value.trim() === "") {
                field.style.border = "2px solid red";
                field.style.backgroundColor = "#fff0f0";
                hasEmptyField = true;
            }
        });

        if (hasEmptyField) {
            alert("Please fill in all contact information before sending your message.");
            return;
        }

        if (!window.emailjs || !isEmailJsConfigured()) {
            alert("EmailJS is not configured yet. Add your Public Key, Service ID, and Template ID in script.js.");
            return;
        }

        submitButton.value = "Sending...";
        submitButton.disabled = true;

        emailjs.sendForm(emailJsConfig.serviceId, emailJsConfig.templateId, contactForm, {
            publicKey: emailJsConfig.publicKey
        }).then(function () {
            alert("Your message has been sent successfully.");
            contactForm.reset();
        }).catch(function (error) {
            console.log("EmailJS error:", error);
            alert("Sorry, your message could not be sent. EmailJS says: " + (error.text || error.message || "Please check your EmailJS settings."));
        }).finally(function () {
            submitButton.value = "Send Now";
            submitButton.disabled = false;
        });
    });
}

setupAddToCartButtons();
renderCart();
renderCheckoutSummary();
setupCheckoutValidation();
setupCardPaymentValidation();
setupContactForm();
