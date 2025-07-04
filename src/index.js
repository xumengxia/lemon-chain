const vorpal = require('vorpal')();
const Blockchain = require('./blockchain');
const Table = require('cli-table');
const blockchain = new Blockchain();
const { keys } = require('./rsa')
// 格式化输出
function formatLog(data) {
    if (!Array.isArray(data)) {
        data = [data]
    }
    const first = data[0]
    const head = Object.keys(first) // 获取键值name,age {name: '柠檬', age: 18}
    const table = new Table({
        head: head,
        colWidths: new Array(head.length).fill(20) //[10, 20]
    });
    const res = data.map((v) => {
        return head.map((h) =>
            // 优化一下输出
            JSON.stringify(v[h], null, 1)) // 获取键值对应的value v={name: '柠檬', age: 18} v[name]='柠檬',
    })
    table.push(...res);
    console.log(table.toString());
}
vorpal
    .command('blance <adress>', '查看余额')
    .action(function (args, callback) {
        const blance = blockchain.blance(args.adress)
        if (blance) {
            formatLog({ blance, adress: args.adress })
        }
        callback();
    });
vorpal
    .command('detail <index>', '查看区块详情')
    .action(function (args, callback) {
        const block = blockchain.blockchain[args.index]
        this.log(JSON.stringify(block, null, 2));
        callback();
    });
vorpal
    .command('mine', '挖矿')
    .action(function (args, callback) {
        // 给自己挖矿不需要地址
        const newBlock = blockchain.mine(keys.pub)
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
vorpal
    .command('pub', '查看本地地址')
    .action(function (args, callback) {
        this.log(keys.pub, '本地地址');
        callback();
    });
vorpal
    .command('trans  <to> <amount>', '转账')
    .action(function (args, callback) {
        // 使用本地公钥当做转出地址
        let trans = blockchain.transfer(keys.pub, args.to, args.amount)
        formatLog(trans)
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

