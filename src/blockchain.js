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

const { log } = require('console');
const crypto = require('crypto');
const dgram = require('dgram')
const { sign, verify, keys } = require('./rsa')
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
        this.peers = [] // 所有的网络节点信息，adress port
        this.seed = { port: 8001, address: 'localhost' } // 种子节点
        this.remote = {}
        this.udp = dgram.createSocket('udp4')
        this.init()
    }

    init() {
        this.bindP2p()
        this.bindExit()
    }

    bindP2p() {
        // 网络发来的消息
        this.udp.on('message', (data, remote) => {
            const { address, port } = remote
            const action = JSON.parse(data)
            // {
            //     type: '要干啥',
            //     data: '具体传递的信息'
            // }
            if (action.type) {
                this.dispatch(action, { address, port })
            }
        })
        // 监听信息
        this.udp.on('listening', () => {
            const address = this.udp.address()
            console.log('[信息]：udp监听完毕 端口号是' + address.port);

        })
        // 区分种子节点和普通节点
        // console.log(process.argv);
        const port = Number(process.argv[2]) || 0
        this.startNode(port)

    }

    dispatch(action, remote) {
        // console.log('接收到p2p网络的消息', action);
        switch (action.type) {
            case 'newpeer':
                // 种子节点要做的事情
                // 1.你的公网ip和port是啥
                this.send({
                    type: 'remoteAddress',
                    data: remote
                }, remote.port, remote.address)
                // 2.现在的全部节点的列表
                this.send({
                    type: 'peerList',
                    data: this.peers
                }, remote.port, remote.address)
                // 3.告诉所有的已知节点 来了个新朋友 快打招呼
                this.boardcast({ type: 'sayhi', data: remote })
                // 4.告诉你现在的区块链数据
                this.send(
                    {
                        type: 'blockchain',
                        data: JSON.stringify({
                            blockchain: this.blockchain,

                        })
                    }, remote.port, remote.address
                )

                this.addPeers(remote)
                console.log('你好，新朋友', remote);
                break
            case 'blockchain':
                // 同步本地链
                let allData = JSON.parse(action.data)
                let newChain = allData.blockchain
                this.replaceChain(newChain)
                break
            case 'remoteAddress':
                // 存储远程消息，退出的时候使用
                this.remote = action.data
                break
            case 'peerList':
                // 远程告诉我现在的节点列表
                const newPeers = action.data
                this.addPeers(newPeers)
                break
            case 'sayhi':
                let remotePeer = action.data
                this.addPeers(remotePeer)
                console.log('你好，新朋友');
                this.send({
                    type: 'hi',
                    data: 'hi'
                }, remote.port, remote.address)
                break
            case 'hi':
                console.log(`${remote.address}:${remote.port}:${action.data}`);
                break
            case 'mine':
                // 网络上有人挖矿成功
                const lastBlock = this.getLastBlock()
                if (lastBlock.hash == action.data.hash) {
                    // 重复的信息
                    return
                }
                if (this.isValidBlock(action.data, lastBlock)) {
                    console.log('[信息]： 有朋友挖矿成功，祝贺他，放烟花');
                    this.blockchain.push(action.data)
                    this.data = []
                    this.boardcast({
                        type: 'mine',
                        data: action.data
                    })
                } else {
                    console.log('挖矿失败');

                }
                break
            default:
                console.log('这个action不认识');
        }
    }
    isEqualPeer(peer1, peer2) {
        return peer1.port === peer2.port && peer1.address === peer2.address
    }
    addPeers(peers) {
        // 统一转换为数组处理
        const peersArray = Array.isArray(peers) ? peers : [peers];

        peersArray.forEach(peer => {
            // 检查是否已存在相同的peer
            const isExist = this.peers.some(existingPeer =>
                this.isEqualPeer(peer, existingPeer)
            );

            // 如果不存在，则添加
            if (!isExist) {
                this.peers.push(peer);
            }
        });
    }
    // 退出
    bindExit() {
        process.on('exit', () => {
            console.log('【信息】：再见,期待下一次的见面');

        })
    }


    startNode(port) {
        this.udp.bind(port)
        // 如果不是种子节点，需要发送一个消息告诉种子 我来了
        if (port !== 8001) {
            this.send({
                type: 'newpeer'
            }, this.seed.port, this.seed.address)
        }
        // 把种子节点加入到本地的节点中
        this.addPeers(this.seed)
        // console.log('当前节点列表：', this.peers);
    }

    send(message, port, address) {
        // console.log(message, port, address);
        this.udp.send(JSON.stringify(message), port, address)
    }

    // 广播 全场
    boardcast(action) {
        this.peers.forEach((v) => {
            this.send(action, v.port, v.address)
        })
    }
    // 获取最新区块
    getLastBlock() {
        return this.blockchain[this.blockchain.length - 1]
    }
    // 交易
    transfer(from, to, amount) {
        if (from !== '0') {
            // 交易非挖矿
            const blance = this.blance(from)
            if (blance < amount) {
                console.log('not enough blance', from, blance, amount)
                return
            }
        }
        // 签名
        const sig = sign({ from, to, amount })
        // console.log(sig);

        const sigTrans = { from, to, amount, sig }
        this.data.push(sigTrans)
        return sigTrans
    }
    // 查看余额
    blance(address) {
        let blance = 0
        this.blockchain.forEach((block) => {
            // console.log(block, 'block');

            if (!Array.isArray(block.data)) {
                // 创世区块是字符串排除
                return
            }
            block.data.forEach((trans) => {
                if (address == trans.from) {
                    // from转账出去的人
                    blance -= trans.amount
                }
                if (address == trans.to) {
                    // to收到钱的人
                    blance += trans.amount
                }
            })
        })

        // console.log(blance, 'blance');
        return blance
    }

    // 校验交易
    isvalidTrans(trans) {
        // 是不是合法的转账
        // 地址就是公钥
        return verify({ trans })
    }

    // 挖矿
    mine(address) {
        // 校验所有的消息合法性
        //  只要有不合法的就报错
        // if (!this.data.every((v) => this.isvalidTrans(v))) {
        //     console.log('trans not valid');
        //     return
        // }
        // 过滤不合法的
        this.data = this.data.filter((v) => this.data.every((v) => this.isvalidTrans(v)))
        // 生成新的区块 -- 一页新的记账加入了区块链
        // 不停地算hash,直到计算出否和条件的哈希值，获取记账权
        // 挖矿结束 矿工奖励 成功给100
        this.transfer('0', address, 100)
        const newBlock = this.generateNewBlock()
        // 测试区块链是否合法，区块链和方法，新增一下
        if (this.isValidBlock(newBlock) && this.isValidChain(this.blockchain)) {
            this.blockchain.push(newBlock)
            this.data = []
            console.log('[信息] 挖矿成功');
            this.boardcast({
                type: 'mine',
                data: newBlock
            })
            return newBlock
        } else {
            console.log('Error, Invalid Block', newBlock);
        }
    }
    // 生成新区块
    generateNewBlock() {
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
        return {
            index, data, prevHash, timestamp, nonce, hash
        }

    }
    // 计算哈希
    computebHush(index, prevHash, timestamp, data, nonce) {
        return crypto.createHash('sha256').update(index + prevHash + timestamp + data + nonce).digest('hex')
    }
    computedHashForBlock({ index, prevHash, timestamp, data, nonce }) {
        return this.computebHush(index, prevHash, timestamp, data, nonce)
    }
    // 校验区块
    isValidBlock(newBlock, lastBlock = this.getLastBlock()) {
        // const lastBlock = this.getLastBlock()
        // 1.区块的index是否等于最后区块的index+1
        // 2.区块的time大于最新区块
        // 3.最新区块的prevhash 等于最新区块的hash
        // 4.区块的hash符合难度要求
        // 5.哈希值的
        if (newBlock.index !== lastBlock.index + 1) {
            return false
        } else if (newBlock.timestamp <= lastBlock.timestamp) {
            return false
        } else if (newBlock.prevHash !== lastBlock.hash) {
            return false
        } else if (newBlock.hash.slice(0, this.difficulty) !== '0'.repeat(this.difficulty)) {
            return false
        } else if (newBlock.hash !== this.computedHashForBlock(newBlock)) {
            return false
        }
        return true
    }
    // 校验区块链
    isValidChain(chain = this.blockchain) {
        // 除创始区块链外的校验
        for (let i = chain.length - 1; i >= 1; i = i - 1) {
            if (!this.isValidBlock(chain[i], chain[i - 1])) {
                return false
            }
        }
        // 创始区块链的校验
        if (JSON.stringify(chain[0]) !== JSON.stringify(initBlock)) {
            return false
        }
        return true
    }

    // 替换链
    replaceChain(newChain) {
        if (!newChain || !Array.isArray(newChain)) {
            console.log('[错误]：无效的区块链数据');
            return;
        }

        if (newChain.length === 1) {
            // 创世链不用校验
            return;
        }

        // 验证新链的合法性
        if (this.isValidChain(newChain)) {
            if (newChain.length > this.blockchain.length) {
                console.log('[信息]：接收到更长的链，正在更新本地区块链...');
                // 替换深拷贝
                this.blockchain = JSON.parse(JSON.stringify(newChain));
                // 清空当前的交易数据，因为可能已经被打包到新链中
                this.data = [];
                console.log('[信息]：区块链更新完成，当前区块数量：', this.blockchain.length);
            } else {
                console.log('[信息]：接收到的链不比本地链长，无需更新');
            }
        } else {
            console.log('[错误]：接收到的区块链数据不合法');
        }
    }
}
module.exports = Blockchain
// 测试代码
// let bc = new Blockchain()
// bc.mine()
// bc.mine()
// bc.blockchain[2].prevHash = 'prevHash'
// bc.mine()
// bc.mine()
// console.log(bc.blockchain);
