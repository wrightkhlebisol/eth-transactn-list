const { ethers } = require("ethers");
const express = require('express');
require('dotenv').config()


const app = express();
const port = process.env.PORT || 3020
const network = "rinkeby"

const provider = new ethers.getDefaultProvider(
    network, {
    infura: process.env.INFURA_KEY,
    alchemy: process.env.ALCHEMY_KEY,
    etherscan: process.env.ETHERSCAN_KEY,
    pocket: process.env.POCKET_KEY

    // infura: '4fc321310eee40b1b9c1310aaf30f40f',
    // alchemy: '1d_mknGG0lVXylQ1kBQq3wW9ERUkl8ef',
    // etherscan: 'HT6UZMHG65VX3S3Q8NBFGMDNK2TBVHS8FR',
    // pocket: '786541ca50ed286bcb3f0d3524cab29f'
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

// GET BLOCK TRANSACTIONS BY BLOCK NUMBER and ADDRESS
app.get('/block/:blockNumber/transactions/:address', async (req, res) => {
    try {

        let { blockNumber, address } = req.params;

        // let currentBlockNumber = await provider.getBlockNumber();

        let blocktransactions = await provider.getBlockWithTransactions(parseInt(blockNumber));

        if (!blocktransactions) {
            return res.status(200).json({
                status: 'failed',
                message: 'block transactions request failed'
            });
        }
        let { transactions } = blocktransactions;


        const from = transactions.filter(transaction => transaction.from === address
            || transaction.to === address
        );

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
    console.log(`ETH TX Crawler listening at http://localhost:${port}`)
})