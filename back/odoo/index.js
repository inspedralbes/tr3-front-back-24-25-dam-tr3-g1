import express from "express";
import xmlrpc from "xmlrpc";
import dotenv from "dotenv";
import cors from 'cors';

const app = express();
dotenv.config();

const port = process.env.PORT || 4001;

const url = process.env.ODOO_URL;
const db = process.env.ODOO_DB;
const username = process.env.ODOO_USERNAME;
const password = process.env.ODOO_PASSWORD;

const common = xmlrpc.createClient({ url: `${url}/xmlrpc/2/common` });
const object = xmlrpc.createClient({ url: `${url}/xmlrpc/2/object` });

app.use(express.json());
app.use(cors({
    origin: 'http://localhost:5173'
}));

app.post("/create-client", (req, res) => {
    const clientData = req.body;

    // Authentication
    common.methodCall(
        "authenticate",
        [db, username, password, {}],
        (error, uid) => {
            if (error) {
                console.error("Authentication error:", error);
                res.status(500).send("Authentication error");
                return;
            }

            console.log("Authenticated with UID:", uid);

            // Create Client
            object.methodCall(
                "execute_kw",
                [db, uid, password, "res.partner", "create", [clientData]],
                (err, result) => {
                    if (err) {
                        console.error("Error creating client:", err);
                        res.status(500).send("Error creating client");
                    } else {
                        console.log("Client created with ID:", result);

                        // Update client to be visible in sales list
                        object.methodCall(
                            "execute_kw",
                            [
                                db,
                                uid,
                                password,
                                "res.partner",
                                "write",
                                [[result], { customer_rank: 1 }],
                            ],
                            (updateErr, updateResult) => {
                                if (updateErr) {
                                    console.error("Error updating client:", updateErr);
                                    res.status(500).send("Error updating client");
                                } else {
                                    console.log("Client updated:", updateResult);
                                // Fetch full client details
                                object.methodCall(
                                    "execute_kw",
                                    [
                                        db,
                                        uid,
                                        password,
                                        "res.partner",
                                        "search_read",
                                        [[["id", "=", result]], ["id", "name", "email", "phone", "street", "city", "zip", "country_id"]],
                                    ],
                                    (fetchErr, fetchResult) => {
                                        if (fetchErr) {
                                            console.error("Error fetching client details:", fetchErr);
                                            res.status(500).send("Error fetching client details");
                                        } else {
                                            console.log("Full client details fetched:", fetchResult);
                                            res.json(fetchResult);
                                        }
                                    }
                                );
                                }
                            }
                        );
                    }
                }
            );
        }
    );
});

app.get("/get-client/:id", (req, res) => {
    const clientId = parseInt(req.params.id);

    // Authentication
    common.methodCall(
        "authenticate",
        [db, username, password, {}],
        (error, uid) => {
            if (error) {
                console.error("Authentication error:", error);
                res.status(500).send("Authentication error");
                return;
            }

            console.log("Authenticated with UID:", uid);

            // Get client details from res.partner table
            object.methodCall(
                "execute_kw",
                [
                    db,
                    uid,
                    password,
                    "res.partner",
                    "search_read",
                    [[["id", "=", clientId]], ["id", "name", "email", "phone", "street", "city", "zip", "country_id"]],
                ],
                (err, result) => {
                    if (err) {
                        console.error("Error fetching client details:", err);
                        res.status(500).send("Error fetching client details");
                    } else {
                        console.log("Client details fetched:", result);
                        res.json(result);
                    }
                }
            );
        }
    );
});

app.get("/get-clients", (req, res) => {
    // Authentication
    common.methodCall(
        "authenticate",
        [db, username, password, {}],
        (error, uid) => {
            if (error) {
                console.error("Authentication error:", error);
                res.status(500).send("Authentication error");
                return;
            }

            console.log("Authenticated with UID:", uid);

            // Get all clients from res.partner table
            object.methodCall(
                "execute_kw",
                [
                    db,
                    uid,
                    password,
                    "res.partner",
                    "search_read",
                    [[], ["id", "name", "email"]],
                ],
                (err, result) => {
                    if (err) {
                        console.error("Error fetching clients:", err);
                        res.status(500).send("Error fetching clients");
                    } else {
                        console.log("Clients fetched:", result);
                        res.json(result);
                    }
                }
            );
        }
    );
});

app.post("/create-product", (req, res) => {
    const productData = req.body;
    console.log(productData);

    // Authentication
    common.methodCall(
        "authenticate",
        [db, username, password, {}],
        (error, uid) => {
            if (error) {
                console.error("Authentication error:", error);
                res.status(500).send("Authentication error");
                return;
            }

            console.log("Authenticated with UID:", uid);

            // Create a product
            object.methodCall(
                "execute_kw",
                [db, uid, password, "product.product", "create", [productData]],
                (err, result) => {
                    if (err) {
                        console.error("Error creating product:", err);
                        res.status(500).send("Error creating product");
                    } else {
                        console.log("Product created with ID:", result);
                        // Fetch full product details
                        object.methodCall(
                            "execute_kw",
                            [
                                db,
                                uid,
                                password,
                                "product.product",
                                "search_read",
                                [[["id", "=", result]], ["id", "name", "list_price", "default_code", "type"]],
                            ],
                            (fetchErr, fetchResult) => {
                                if (fetchErr) {
                                    console.error("Error fetching product details:", fetchErr);
                                    res.status(500).send("Error fetching product details");
                                } else {
                                    console.log("Full product details fetched:", fetchResult);
                                    res.json(fetchResult);
                                }
                            }
                        );
                    }
                }
            );
        }
    );
});

app.get("/get-products", (req, res) => {
    // Authentication
    common.methodCall(
        "authenticate",
        [db, username, password, {}],
        (error, uid) => {
            if (error) {
                console.error("Authentication error:", error);
                res.status(500).send("Authentication error");
                return;
            }

            console.log("Authenticated with UID:", uid);

            // Get all products from product.product table
            object.methodCall(
                "execute_kw",
                [
                    db,
                    uid,
                    password,
                    "product.product",
                    "search_read",
                    [[], ["id", "name", "list_price"]],
                ],
                (err, result) => {
                    if (err) {
                        console.error("Error fetching products:", err);
                        res.status(500).send("Error fetching products");
                    } else {
                        console.log("Products fetched:", result);
                        res.json(result);
                    }
                }
            );
        }
    );
});

app.post("/create-order", (req, res) => {
    const orderData = req.body;

    // Authentication
    common.methodCall(
        "authenticate",
        [db, username, password, {}],
        (error, uid) => {
            if (error) {
                console.error("Authentication error:", error);
                res.status(500).send("Authentication error");
                return;
            }

            console.log("Authenticated with UID:", uid);

            // Create an order
            object.methodCall(
                "execute_kw",
                [db, uid, password, "sale.order", "create", [orderData]],
                (err, result) => {
                    if (err) {
                        console.error("Error creating order:", err);
                        res.status(500).send("Error creating order");
                    } else {
                        console.log("Order created with ID:", result);
                        res.send(`Order created with ID: ${result}`);
                    }
                }
            );
        }
    );
});

app.get("/get-orders", (req, res) => {
    // Authentication
    common.methodCall(
        "authenticate",
        [db, username, password, {}],
        (error, uid) => {
            if (error) {
                console.error("Authentication error:", error);
                res.status(500).send("Authentication error");
                return;
            }

            console.log("Authenticated with UID:", uid);

            // Get all orders from sale.order table
            object.methodCall(
                "execute_kw",
                [
                    db,
                    uid,
                    password,
                    "sale.order",
                    "search_read",
                    [[], ["id", "name", "partner_id", "amount_total"]],
                ],
                (err, result) => {
                    if (err) {
                        console.error("Error fetching orders:", err);
                        res.status(500).send("Error fetching orders");
                    } else {
                        console.log("Orders fetched:", result);
                        res.json(result);
                    }
                }
            );
        }
    );
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
