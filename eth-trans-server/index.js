const { ethers } = require("ethers");
const express = require('express');
require('dotenv').config()


const app = express();
const port = 3020
const network = "rinkeby"

const provider = new ethers.getDefaultProvider(
    network, {
    infura: process.env.INFURA_KEY,
    alchemy: process.env.ALCHEMY_KEY,
    etherscan: process.env.ETHERSCAN_KEY,
    pocket: process.env.POCKET_KEY
});

// parse request bodies (req.body)
app.use(express.urlencoded({ extended: true }))

app.get('/', async (req, res) => {
    res.status(200).send('<h2 style="color: red;">B⛓⛓⛓⛓L⛓⛓⛓⛓O⛓⛓⛓⛓C⛓⛓⛓⛓K⛓⛓⛓⛓C⛓⛓⛓⛓H⛓⛓⛓⛓A⛓⛓⛓⛓I⛓⛓⛓⛓N <br><br> T⛓⛓⛓⛓R⛓⛓⛓⛓A⛓⛓⛓⛓N⛓⛓⛓⛓S⛓⛓⛓⛓X <br><br> C⛓⛓⛓⛓R⛓⛓⛓⛓A⛓⛓⛓⛓W⛓⛓⛓⛓L⛓⛓⛓⛓E⛓⛓⛓⛓R</h2>');
})

// GET LATEST BLOCK NUMBER
// Not extracting to controllers yet since the project structure isnt very large
app.get('/latestblock', async (req, res) => {
    try {
        let currentBlockNumber = await provider.getBlockNumber();
        res.status(200).json({
            status: 'success',
            message: 'block number request successful',
            body: currentBlockNumber
        })
    } catch (error) {
        console.error(error)
        res.status(400).json({
            status: 'failed',
            message: 'block number request failed',
            error: error.message
        })
    }
})

// GET BLOCK BY NUMBER
app.get('/block/:blockNumber/transactions/:address', async (req, res) => {
    try {

        let { blockNumber, address } = req.params;

        let blocktransactions = await provider.getBlockWithTransactions(parseInt(blockNumber));

        let { transactions } = blocktransactions;

        // console.log(transactions)

        const from = transactions.filter(transaction => { return transaction.from === address || transaction.to === address });

        if (from.length <= 0) {
            return res.status(200).json({
                status: 'success',
                message: `No transactions for address ${address} in block ${blockNumber}`,
                body: []
            })
        }

        res.status(200).json({
            status: 'success',
            message: 'block transactions request successful',
            body: from
        })
    } catch (error) {
        console.error(error);
        res.status(400).json({
            status: 'failed',
            message: 'block transactions request failed',
            error: error.message
        })
    }

})

app.listen(port, () => {
    console.log(`Crawler listening at http://localhost:${port}`)
})