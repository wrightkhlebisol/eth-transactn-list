const { ethers } = require("ethers");
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
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
});

// Logging requests
app.use(morgan('tiny'));

// Allow cors request
app.use(cors());

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
app.get('/block/:blockNumber/transactions/:address/network/:network', async (req, res) => {
    try {

        let { blockNumber, address, network } = req.params;

        const etherscanProvider = new ethers.providers.EtherscanProvider(network, process.env.ETHERSCAN_KEY);

        let balance = await provider.getBalance(address);
        let balanceInETH = balance.toString() / 10 ** 18;

        let currentBlockNumber = await provider.getBlockNumber();
        let blocktransactions = await etherscanProvider.getHistory(address, parseInt(blockNumber));

        if (!blocktransactions) {
            return res.status(200).json({
                status: 'failed',
                message: 'block transactions request failed'
            });
        }

        // Filter by from and to address

        if (blocktransactions.length <= 0) {
            return res.status(200).json({
                status: 'success',
                message: `No transactions for address ${address} in block ${blockNumber}`,
                body: []
            })
        }

        if (blocktransactions[0].hash) {
            // let reponseAsArrayLength = blocktransactions.length;

            // while (bloctransactions.length) {

            // }
            console.log(blocktransactions)
        }

        res.status(200).json({
            status: 'success',
            message: 'block transactions request successful',
            body: { blocktransactions, balanceInETH, currentBlockNumber }
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



app.listen(port, async () => {
    console.log(`ETH TX Crawler listening at http://localhost:${port}`)
})