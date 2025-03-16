const API_URL = "http://localhost:4001"; // Cambia si tu servidor corre en otro puerto

async function makeRequest(endpoint, method = "GET", body = null) {
    const options = {
        method,
        headers: { "Content-Type": "application/json" }
    };
    if (body) options.body = JSON.stringify(body);

    try {
        const response = await fetch(`${API_URL}${endpoint}`, options);
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error(`Error on ${endpoint}:`, error);
    }
}

async function createClient(clientData) {
    return await makeRequest("/create-client", "POST", clientData);
}

async function createProduct(productData) {
    return await makeRequest("/create-product", "POST", productData);
}

async function createOrder(orderData) {
    return await makeRequest("/create-order", "POST", orderData);
}

async function testAPI() {
    const clients = [
        { name: "Alice", email: "alice@example.com", phone: "+521234567890", street: "Street 1", city: "City A", zip: "01001", country_id: 156 },
        { name: "Bob", email: "bob@example.com", phone: "+521234567891", street: "Street 2", city: "City B", zip: "01002", country_id: 156 },
        { name: "Charlie", email: "charlie@example.com", phone: "+521234567892", street: "Street 3", city: "City C", zip: "01003", country_id: 156 }
    ];

    const products = [
        { name: "Julian", type: 'consu', list_price: 1, standard_price: 1, categ_id: 1, uom_id: 1, uom_po_id: 1, description: `Weapon: SWORD, Distance: 1, Winged: FALSE`, barcode: "1234567890123", default_code: 'SP001', weight: 1.0, volume: 0.5 },
        { name: "Juan", type: 'consu', list_price: 1, standard_price: 1, categ_id: 1, uom_id: 1, uom_po_id: 1, description: `Weapon: BOW, Distance: 2, Winged: FALSE`, barcode: "1234567890124", default_code: 'SP002', weight: 1.0, volume: 0.5 },
        { name: "Clemente", type: 'consu', list_price: 1, standard_price: 1, categ_id: 1, uom_id: 1, uom_po_id: 1, description: `Weapon: MAGIC, Distance: 3, Winged: FALSE`, barcode: "1234567890125", default_code: 'SP003', weight: 1.0, volume: 0.5 },
        { name: "Alfonso", type: 'consu', list_price: 1, standard_price: 1, categ_id: 1, uom_id: 1, uom_po_id: 1, description: `Weapon: SPEAR, Distance: 4, Winged: FALSE`, barcode: "1234567890126", default_code: 'SP004', weight: 1.0, volume: 0.5 }
    ];

    console.log("🔹 Creando clientes...");
    const createdClients = [];
    for (const clientData of clients) {
        const client = await createClient(clientData);
        if (client && client.id) createdClients.push(client.id);
    }

    console.log("🔹 Creando productos...");
    const createdProducts = [];
    for (const productData of products) {
        const product = await createProduct(productData);
        if (product && product.id) createdProducts.push(product.id);
    }

    console.log("🔹 Creando órdenes...");
    for (const clientId of createdClients) {
        for (const productId of createdProducts) {
            const orderData = {
                "partner_id": clientId,
                "order_line": [
                    [0, 0, { "product_id": productId, "product_uom_qty": 2, "price_unit": 100 }]
                ],
                "note": "This is a test order"
            };
            const order = await createOrder(orderData);
            if (!order) console.error("❌ Error creando orden", orderData);
        }
    }

    console.log("🔹 Listando clientes...");
    const clientsList = await makeRequest("/get-clients");
    console.log(clientsList);

    console.log("🔹 Listando productos...");
    const productsList = await makeRequest("/get-products");
    console.log(productsList);

    console.log("🔹 Listando órdenes...");
    const ordersList = await makeRequest("/get-orders");
    console.log(ordersList);
}

testAPI();