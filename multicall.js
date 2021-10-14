const { MultiCall } = require('@indexed-finance/multicall')
const { abi } = require('./AggregatorV3Interface.json')
const priceFeedAddress = "0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419"
const ethers = require('ethers')
require("dotenv").config()

async function main() {
    let provider = new ethers.providers.JsonRpcProvider(process.env.ALCHEMY_MAINNET_RPC_URL)
    const multi = new MultiCall(provider)
    const inputs = []
    numberOfRounds = 10
    priceFeed = new ethers.Contract(priceFeedAddress, abi, provider)
    latestRound = (await priceFeed.latestRoundData())[0]
    for (let round = latestRound.sub(numberOfRounds); round.lt(latestRound); round = round.add(1)) {
        inputs.push({ target: priceFeedAddress, function: 'getRoundData', args: [round.toString()] })
    }
    const roundData = await multi.multiCall(abi, inputs)
    console.log(roundData)
    return roundData
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
