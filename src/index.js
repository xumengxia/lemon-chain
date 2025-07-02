const vorpal = require('vorpal')();
const Blockchain = require('./blockchain');
const blockchain = new Blockchain();
vorpal
    .command('mine', '挖矿')
    .action(function (args, callback) {
        const newBlock = blockchain.mine()
        if (newBlock) {
            console.log(newBlock);
        }
        // this.log('你好啊，柠檬链');
        callback();
    });
vorpal
    .command('chain', '查看区块链')
    .action(function (args, callback) {
        blockchain.blockchain
        this.log(blockchain.blockchain);
        callback();
    });
// vorpal
//     .command('hello', '你好啊')
//     .action(function (args, callback) {
//         this.log('你好啊，柠檬链');
//         callback();
//     });
console.log('welcome to lemon-chain');
vorpal.exec('hello');
vorpal.delimiter("lemon-chain =>").show();

