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
// 创世区块
const initBlock = {
    index: 0,
    data: 'hello lemonChain',
    prevHash: '0',
    timestamp: 1751421855211,
    nonce: 55982,
    hash: '0000ab7c2978af9e832d6fb3de03e39ec53f4a6f21136d6e97bfecb99f847068'
}
class Blockchain {
    constructor() {
        this.blockchain = [
            initBlock // 创世区块
        ];
        this.data = []
        this.difficulty = 4
        // const hash = this.computebHush(0, '0', 1751421855211, 'hello lemonChain', 1)
        // console.log(hash);

    }
    // 获取最新区块
    getLastBlock() {
        return this.blockchain[this.blockchain.length - 1]
    }
    // 挖矿
    mine() {
        // 生成新的区块 -- 一页新的记账加入了区块链
        // 不停地算hash,直到计算出否和条件的哈希值，获取记账权
        let nonce = 0
        const index = this.blockchain.length
        const data = this.data
        const prevHash = this.getLastBlock().hash
        let timestamp = new Date().getTime()
        let hash = this.computebHush(index, prevHash, timestamp, data, nonce)
        while (hash.slice(0, this.difficulty) !== '0'.repeat(this.difficulty)) {
            nonce += 1
            hash = this.computebHush(index, prevHash, timestamp, data, nonce)
        }
        console.log('mine over', {
            index, data, prevHash, timestamp, nonce, hash
        }
        );

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
bc.mine()