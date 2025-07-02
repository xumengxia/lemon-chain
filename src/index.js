const vorpal = require('vorpal')();
const Blockchain = require('./blockchain');
const Table = require('cli-table');
const blockchain = new Blockchain();
// 格式化输出
function formatLog(data) {
    if (!Array.isArray(data)) {
        data = [data]
    }
    const first = data[0]
    const head = Object.keys(first) // 获取键值name,age {name: '柠檬', age: 18}
    const table = new Table({
        head: head,
        colWidths: new Array(head.length).fill(15) //[10, 20]
    });
    const res = data.map((v) => {
        return head.map((h) => v[h]) // 获取键值对应的value v={name: '柠檬', age: 18} v[name]='柠檬'
    })
    table.push(...res);
    console.log(table.toString());
}

vorpal
    .command('mine', '挖矿')
    .action(function (args, callback) {
        const newBlock = blockchain.mine()
        if (newBlock) {
            console.log(formatLog(newBlock));
        }
        // this.log('你好啊，柠檬链');
        callback();
    });
vorpal
    .command('chain', '查看区块链')
    .action(function (args, callback) {
        blockchain.blockchain
        this.log(formatLog(blockchain.blockchain));
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

