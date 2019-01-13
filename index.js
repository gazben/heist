const util = require('util');
let ethLib = require('ethereumjs-wallet');
let Web3 = require('web3');

let finished = false;
let web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));

async function getBalance(address) {
    let wei = util.promisify(cb => web3.eth.getBalance(address, cb))
    try {
        return (await wei());
    } catch (error) {
        console.log(error);
        return null;
    }
}

const run = async function() {
    while(!finished) {
        let wallet = ethLib.generate();
        let currentBalance = await getBalance(wallet.getChecksumAddressString());
        console.log(wallet.getChecksumAddressString() + " | Balance: " + currentBalance);

        if(currentBalance > 0) {
            const fs = require('fs');
            let stream = fs.createWriteStream('./result/' + wallet.getChecksumAddressString());
            stream.once('open', function(fd) {
                stream.write('Address: ' + wallet.getChecksumAddressString() + '\n\n');
                stream.write(wallet.getPrivateKeyString() + '\n\n');
                stream.write(wallet.getPublicKeyString());
                stream.end();
            });
        }
    }
};

run();