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
                                    res.send(`Client created and updated with ID: ${result}`);
                                }
                            }
                        );
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
                        res.send(`Product created with ID: ${result}`);
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

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
