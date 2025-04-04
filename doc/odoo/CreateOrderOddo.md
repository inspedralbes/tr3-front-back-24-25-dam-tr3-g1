# Tutorial d'Insercions a Odoo

Per crear una nova ordre a Odoo, s'utilitza l'endpoint `/new-order`. El format que s'ha d'enviar és el següent:

```json
{
    "partner_id": 22,
    "order_line": [
        [
            0,
            0,
            {
                "product_id": 1,
                "product_uom_qty": 2,
                "price_unit": 100
            }
        ]
    ],
    "note": "This is a test order"
}
```

Aquest JSON inclou la identificació del soci (`partner_id`), les línies de comanda (`order_line`) amb detalls del producte, quantitat i preu, i una nota opcional (`note`).