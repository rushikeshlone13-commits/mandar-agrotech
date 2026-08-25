// ==========================================
// MANDAR AGROTECH JAVASCRIPT
// ==========================================


// ---------- PRODUCT ORDER BUTTON ----------

const productButtons =
    document.querySelectorAll(".order-product");


productButtons.forEach(function(button) {

    button.addEventListener("click", function() {

        const name =
            button.getAttribute("data-name");

        const price =
            Number(button.getAttribute("data-price"));


        let cart =
            JSON.parse(
                localStorage.getItem("cart")
            ) || [];


        cart.push({

            name: name,

            price: price,

            quantity: 1

        });


        localStorage.setItem(
            "cart",
            JSON.stringify(cart)
        );


        alert(
            name +
            " added to your order!"
        );


        window.location.href =
            "order.html";

    });

});



// ==========================================
// ORDER PAGE
// ==========================================


let cart =
    JSON.parse(
        localStorage.getItem("cart")
    ) || [];


function displayCart() {

    const cartItems =
        document.getElementById("cartItems");

    const totalAmount =
        document.getElementById("totalAmount");


    if (!cartItems || !totalAmount) {
        return;
    }


    if (cart.length === 0) {

        cartItems.innerHTML =
            `<p class="empty-cart">
                No products added.
             </p>`;

        totalAmount.innerText =
            "₹0";

        return;
    }


    cartItems.innerHTML = "";


    let total = 0;


    cart.forEach(function(item, index) {

        const itemTotal =
            item.price *
            item.quantity;


        total += itemTotal;


        cartItems.innerHTML += `

        <div class="cart-item">

            <div>

                <h3>
                    ${item.name}
                </h3>

                <p>
                    ₹${item.price} ×
                    ${item.quantity}
                </p>

            </div>


            <div>

                <strong>
                    ₹${itemTotal}
                </strong>

                <br>

                <button
                    onclick="removeItem(${index})"
                    class="remove-btn">

                    Remove

                </button>

            </div>

        </div>

        `;

    });


    totalAmount.innerText =
        "₹" + total;

}



function removeItem(index) {

    cart.splice(index, 1);


    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );


    displayCart();

}



// ---------- ADD PRODUCT ----------

const addProductBtn =
    document.getElementById(
        "addProductBtn"
    );


if (addProductBtn) {

    addProductBtn.addEventListener(
        "click",
        function() {

            const select =
                document.getElementById(
                    "productSelect"
                );


            const quantity =
                Number(
                    document.getElementById(
                        "quantity"
                    ).value
                );


            if (!select.value) {

                alert(
                    "Please select a product."
                );

                return;

            }


            if (quantity < 1) {

                alert(
                    "Quantity must be at least 1."
                );

                return;

            }


            const parts =
                select.value.split("|");


            cart.push({

                name: parts[0],

                price: Number(parts[1]),

                quantity: quantity

            });


            localStorage.setItem(
                "cart",
                JSON.stringify(cart)
            );


            displayCart();


            alert(
                "Product added successfully!"
            );

        }
    );

}



// ==========================================
// PLACE ORDER
// ==========================================


const placeOrderBtn =
    document.getElementById(
        "placeOrderBtn"
    );


if (placeOrderBtn) {

    placeOrderBtn.addEventListener(
        "click",
        function() {


            const shopName =
                document.getElementById(
                    "shopName"
                ).value.trim();


            const ownerName =
                document.getElementById(
                    "ownerName"
                ).value.trim();


            const mobile =
                document.getElementById(
                    "mobile"
                ).value.trim();


            const address =
                document.getElementById(
                    "address"
                ).value.trim();


            if (
                !shopName ||
                !ownerName ||
                !mobile ||
                !address
            ) {

                alert(
                    "Please fill all customer details."
                );

                return;

            }


            if (cart.length === 0) {

                alert(
                    "Please add at least one product."
                );

                return;

            }


            let total = 0;


            cart.forEach(function(item) {

                total +=
                    item.price *
                    item.quantity;

            });


            const orderID =
                "MAT" +
                Date.now()
                    .toString()
                    .slice(-6);


            const order = {

                id: orderID,

                shop:
                    shopName,

                owner:
                    ownerName,

                mobile:
                    mobile,

                address:
                    address,

                products:
                    cart,

                total:
                    total,

                status:
                    "Pending",

                date:
                    new Date()
                        .toLocaleString()

            };


            let orders =
                JSON.parse(
                    localStorage.getItem(
                        "orders"
                    )
                ) || [];


            orders.push(order);


            localStorage.setItem(
                "orders",
                JSON.stringify(
                    orders
                )
            );


            localStorage.removeItem(
                "cart"
            );


            alert(
                "Order placed successfully!\n\n" +
                "Order ID: " +
                orderID
            );


            window.location.href =
                "index.html";

        }
    );

}


displayCart();



// ==========================================
// ADMIN DASHBOARD
// ==========================================


function loadAdminDashboard() {

    const table =
        document.getElementById(
            "ordersTable"
        );


    if (!table) {
        return;
    }


    const orders =
        JSON.parse(
            localStorage.getItem(
                "orders"
            )
        ) || [];


    let pending = 0;

    let accepted = 0;

    let sales = 0;


    table.innerHTML = "";


    orders.forEach(function(order) {


        if (
            order.status ===
            "Pending"
        ) {

            pending++;

        }


        if (
            order.status ===
            "Accepted"
        ) {

            accepted++;

            sales += order.total;

        }


        const productNames =
            order.products
                .map(
                    item =>
                    item.name +
                    " × " +
                    item.quantity
                )
                .join(", ");


        table.innerHTML += `

        <tr>

            <td>
                <strong>
                    ${order.id}
                </strong>
            </td>

            <td>
                ${order.shop}
            </td>

            <td>
                ${order.mobile}
            </td>

            <td>
                ${productNames}
            </td>

            <td>
                ₹${order.total}
            </td>

            <td>

                <span class="
                    status
                    ${order.status.toLowerCase()}
                ">

                    ${order.status}

                </span>

            </td>

            <td>

                ${
                    order.status === "Pending"

                    ?

                    `

                    <button
                        class="accept-btn"
                        onclick="updateOrder(
                            '${order.id}',
                            'Accepted'
                        )">

                        Accept

                    </button>


                    <button
                        class="reject-btn"
                        onclick="updateOrder(
                            '${order.id}',
                            'Rejected'
                        )">

                        Reject

                    </button>

                    `

                    :

                    "Completed"

                }

            </td>

        </tr>

        `;

    });


    document.getElementById(
        "totalOrders"
    ).innerText =
        orders.length;


    document.getElementById(
        "pendingOrders"
    ).innerText =
        pending;


    document.getElementById(
        "acceptedOrders"
    ).innerText =
        accepted;


    document.getElementById(
        "totalSales"
    ).innerText =
        "₹" + sales;


    displayHistory(orders);

    displayTransactions(orders);

}



// ==========================================
// ACCEPT / REJECT ORDER
// ==========================================


function updateOrder(
    orderID,
    newStatus
) {


    let orders =
        JSON.parse(
            localStorage.getItem(
                "orders"
            )
        ) || [];


    orders =
        orders.map(function(order) {


            if (
                order.id ===
                orderID
            ) {

                order.status =
                    newStatus;

            }


            return order;

        });


    localStorage.setItem(
        "orders",
        JSON.stringify(
            orders
        )
    );


    loadAdminDashboard();


    alert(
        "Order " +
        newStatus +
        " successfully!"
    );

}



// ==========================================
// ORDER HISTORY
// ==========================================


function displayHistory(orders) {


    const container =
        document.getElementById(
            "historyContainer"
        );


    if (!container) {
        return;
    }


    const completed =
        orders.filter(function(order) {

            return (
                order.status ===
                "Accepted" ||
                order.status ===
                "Rejected"
            );

        });


    if (completed.length === 0) {

        container.innerHTML =
            "<p>No completed orders yet.</p>";

        return;

    }


    container.innerHTML = `

    <div class="table-container">

        <table>

            <tr>

                <th>Order ID</th>

                <th>Shop</th>

                <th>Amount</th>

                <th>Status</th>

                <th>Date</th>

            </tr>

            ${

                completed.map(
                    order => `

                    <tr>

                        <td>
                            ${order.id}
                        </td>

                        <td>
                            ${order.shop}
                        </td>

                        <td>
                            ₹${order.total}
                        </td>

                        <td>
                            ${order.status}
                        </td>

                        <td>
                            ${order.date}
                        </td>

                    </tr>

                    `
                ).join("")

            }

        </table>

    </div>

    `;

}



// ==========================================
// TRANSACTIONS
// ==========================================


function displayTransactions(
    orders
) {


    const container =
        document.getElementById(
            "transactionsContainer"
        );


    if (!container) {
        return;
    }


    const accepted =
        orders.filter(function(order) {

            return (
                order.status ===
                "Accepted"
            );

        });


    if (accepted.length === 0) {

        container.innerHTML =
            "<p>No transactions yet.</p>";

        return;

    }


    container.innerHTML = `

    <div class="table-container">

        <table>

            <tr>

                <th>Transaction ID</th>

                <th>Order ID</th>

                <th>Customer</th>

                <th>Amount</th>

                <th>Status</th>

            </tr>

            ${

                accepted.map(
                    (order, index) => `

                    <tr>

                        <td>
                            TXN${1000 + index}
                        </td>

                        <td>
                            ${order.id}
                        </td>

                        <td>
                            ${order.shop}
                        </td>

                        <td>
                            ₹${order.total}
                        </td>

                        <td>
                            <span class="status accepted">
                                Successful
                            </span>
                        </td>

                    </tr>

                    `
                ).join("")

            }

        </table>

    </div>

    `;

}



// ==========================================
// CONTACT ENQUIRY
// ==========================================


function sendEnquiry() {


    const name =
        document.getElementById(
            "contactName"
        ).value;


    const mobile =
        document.getElementById(
            "contactMobile"
        ).value;


    const message =
        document.getElementById(
            "contactMessage"
        ).value;


    if (
        !name ||
        !mobile ||
        !message
    ) {

        alert(
            "Please fill all required fields."
        );

        return;

    }


    alert(
        "Thank you " +
        name +
        "! Your enquiry has been submitted."
    );

}


loadAdminDashboard();