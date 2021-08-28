const { ethers } = require("ethers");
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config()


const app = express();

const port = process.env.PORT || 3020
const network = "rinkeby"



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

async function getHistoricBlockByTimestamp(historicTimestamp, provider) {

    let lowerBound = 0;
    let upperBound = await provider.getBlockNumber();

    // Binary Search
    // Midpoint = Left + (right - left)/2
    let midPoint = 0;

    while (lowerBound <= upperBound) {
        midPoint = Math.floor(lowerBound + ((upperBound - lowerBound) / 2));
        // Get the block details using midPoint
        let blockDetails = await provider.getBlock(midPoint);

        // Compare timestamp from block with given timestamp
        if (blockDetails.timestamp === historicTimestamp) {
            continue;
        } else if (blockDetails.timestamp > historicTimestamp) {
            upperBound = midPoint - 1;
        } else {
            lowerBound = midPoint + 1;
        }
    }

    return midPoint;

}

// GET BLOCK TRANSACTIONS BY BLOCK NUMBER and ADDRESS
app.get('/block/:blockNumber/transactions/:address/network/:network', async (req, res) => {

    let { blockNumber, address, network } = req.params;

    const provider = new ethers.getDefaultProvider(
        network, {
        infura: process.env.INFURA_KEY,
        alchemy: process.env.ALCHEMY_KEY,
        etherscan: process.env.ETHERSCAN_KEY,
        pocket: process.env.POCKET_KEY
    });

    const etherscanProvider = new ethers.providers.EtherscanProvider(network, process.env.ETHERSCAN_KEY);

    try {
        let currentBlockNumber = await provider.getBlockNumber();
        let balanceAtTimestamp = 0;
        if (req.query.timestamp) {
            let historicQueryTimestamp = req.query.timestamp;

            let blockAtTimestamp = await getHistoricBlockByTimestamp(historicQueryTimestamp, provider);
            let oldBlock = await provider.getBlock(blockAtTimestamp);

            let balanceAtTimestampBigNumber = await provider.getBalance(address, blockAtTimestamp);
            balanceAtTimestamp = balanceAtTimestampBigNumber.toString() / 10 ** 18;
        }



        let balance = await provider.getBalance(address);
        let balanceInETH = balance.toString() / 10 ** 18;

        let blocktransactions = await etherscanProvider.getHistory(address, parseInt(blockNumber));

        if (!blocktransactions) {
            return res.status(200).json({
                status: 'failed',
                message: 'block transactions request failed'
            });
        }

        if (blocktransactions.length <= 0) {
            return res.status(200).json({
                status: 'success',
                message: `No transactions for address ${address} in block ${blockNumber}`,
                body: []
            })
        }

        res.status(200).json({
            status: 'success',
            message: 'block transactions request successful',
            body: { blocktransactions, balanceInETH, currentBlockNumber, balanceAtTimestamp }
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