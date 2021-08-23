const { ethers } = require("ethers");
const express = require('express');
let app = express();

const network = "rinkeby"


const provider = new ethers.getDefaultProvider(
    //     network, {
    //     infura: YOUR_INFURA_PROJECT_ID,
    //     alchemy: YOUR_ALCHEMY_API_KEY,
    // }
);

async function getBlockNumber() {
    let currentBlockNumber = await provider.getBlockNumber();
    console.log(currentBlockNumber);
}

getBlockNumber();