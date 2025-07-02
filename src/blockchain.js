// 1.迷你区块链--lemon-chain
// 2.区块链的生成，新增，校验
// 3.交易
// 4.非对称加密
// 5.挖矿
// 6.P2P网络
// [{
//     "index": 0,//索引
//     "timestamp": 1719859200,//时间戳
//     "data": {},//区块链的具体信息，主要是交易信息
//     "hash": "0",//当前区块的,哈希值1
//     "prevHash": "0",//上一个区块的,哈希值0
//     "nonce": "0"// 随机数
// },{
//     "index": 0,//索引
//     "timestamp": 1719859200,//时间戳
//     "data": {},//区块链的具体信息，主要是交易信息
//     "hash": "0",//当前区块的哈希值2
//     "prevHash": "0",//上一个区块的,哈希值1
//     "nonce": "0"// 随机数
// }]

const crypto = require('crypto')
class Blockchain {
    constructor() {
        this.blockchain = [];
        this.data = []
        this.difficulty = 4
        const hash = this.computebHush(0, '0', new Date().getTime(), 'hello lemonChain', 1)
        console.log(hash);

    }
    // 挖矿
    mine() {
        // 生成新的区块
        // 不停地算hash,知道符合难度的条件 新增区块
    }
    // 生成新区块
    generateNewBlock() {

    }
    // 计算哈希
    computebHush(index, prevHash, timestamp, data, nonce) {
        return crypto.createHash('sha256').update(index + prevHash + timestamp + data + nonce).digest('hex')
    }
    // 校验区块
    isValidBlock() { }
    // 校验区块链
    isValidChain() { }
}
let bc = new Blockchain()