<template>
    <div>
        <h1>Create Product</h1>
        <button @click="createProduct">Create Product</button>
    </div>
</template>

<script>
export default {
    name: 'TestDeUnFechMadafaka',
    methods: {
        async createProduct() {
            const url = 'http://localhost:4001/create-order';
            const body = {
                "partner_id": 7,
                "order_line": [
                    [
                        0,
                        0,
                        {
                            "product_id": 6,
                            "product_uom_qty": 1,
                            "price_unit": 0
                        }
                    ]
                ],
                "note": "This is a test order"
            };

            try {
                const response = await fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(body)
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const data = await response.json();
                console.log('Product created:', data);
            } catch (error) {
                console.error('There was a problem with the fetch operation:', error);
            }
        }
    }
};
</script>

<style scoped>
h1 {
    color: #333;
}

button {
    padding: 10px 20px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
}

button:hover {
    background-color: #0056b3;
}
</style>