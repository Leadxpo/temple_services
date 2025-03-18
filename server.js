const express = require('express');
const axios = require('axios');
const app = express();

app.use(express.json());

const { TAKEPAYMENTS_MERCHANT_ID, TAKEPAYMENTS_PASSWORD } = process.env;

app.post('/pay', async (req, res) => {
    const { amount, currency, cardDetails } = req.body;

    try {
        const response = await axios.post('https://api.takepayments.com/v1/payments', {
            amount,
            currency,
            cardDetails,
            merchantId: TAKEPAYMENTS_MERCHANT_ID,
            password: TAKEPAYMENTS_PASSWORD
        });

        res.json(response.data);
    } catch (error) {
        console.error('Payment error:', error.response ? error.response.data : error.message);
        res.status(500).send('Payment processing failed');
    }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
