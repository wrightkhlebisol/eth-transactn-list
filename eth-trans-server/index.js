const { ethers } = require("ethers");
const express = require('express');

const app = express();
const port = 3020
const network = "rinkeby"


const provider = new ethers.getDefaultProvider(
    //     network, {
    //     infura: YOUR_INFURA_PROJECT_ID,
    //     alchemy: YOUR_ALCHEMY_API_KEY,
    // }
);

// parse request bodies (req.body)
app.use(express.urlencoded({ extended: true }))

app.get('/', async (req, res) => {
    res.status(200).send('⛓⛓⛓⛓ ⛓⛓⛓⛓ ⛓⛓⛓⛓ ⛓⛓⛓⛓ ⛓⛓⛓⛓ ⛓⛓⛓⛓ ⛓⛓⛓⛓ ⛓⛓⛓⛓ ⛓⛓⛓⛓ ⛓⛓⛓⛓ ⛓⛓⛓⛓ ⛓⛓⛓⛓ ⛓⛓⛓⛓ ⛓⛓⛓⛓ ⛓⛓⛓⛓ ⛓⛓⛓⛓');
})

// GET LATEST BLOCK NUMBER
// Not extracting to controllers yet since the project structure isnt very large
app.get('/latestblock', async (req, res) => {
    try {
        let currentBlockNumber = await provider.getBlockNumber();
        res.status(200).send({
            status: 'success',
            message: 'block number request successful',
            body: currentBlockNumber
        })
    } catch (error) {
        console.error(error)
        res.status(400).send({
            status: 'failed',
            message: 'block number request failed',
            error: error.message
        })
    }
})

// GET BLOCK BY NUMBER
app.get('/block/:id/transactions', async (req, res) => {
    try {
        let blocktransactions = await provider.getBlockWithTransactions(13082128);
        res.status(200).send({
            status: 'success',
            message: 'block transactions request successful',
            body: blocktransactions
        })
    } catch (error) {
        console.error(error);
        res.status(400).send({
            status: 'failed',
            message: 'block transactions request failed',
            error: error.message
        })
    }

})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})