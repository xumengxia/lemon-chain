// RSA非对称加密
// 公钥（所有人都知道）   私钥（自己知道）
// 用私钥加密信息 用公钥验证信息是否合法
// {
//     msg:'hello',
//     sign:'用私钥加密后的信息',
//     公钥:'',
// }

// 1.公私钥对
// 2.公钥直接当成地址使用(或者截取公钥的前20个字符)
// 3.公钥可以通过私钥计算出来
let fs = require('fs')
let EC = require('elliptic').ec;

// Create and initialize EC context
// (better do it once and reuse it)
let ec = new EC('secp256k1');

// Generate keys
let keypair = ec.genKeyPair();


function getPub(prv) {
    //  根据私钥算出公钥
    return ec.keyFromPrivate(prv).getPublic('hex').toString();
}
const keys = generateKeys()
// 1.获取公钥对持久化
function generateKeys() {
    const fileName = "./wallet.json"
    try {
        let res = JSON.parse(fs.readFileSync(fileName))
        if (res.prv && res.pub && getPub(res.prv) == res.pub) {
            keypair = ec.keyFromPrivate(res.prv)
            return res
        } else {
            // 验证失败重新生成
            throw 'not valid wallet.json'
        }

    } catch (error) {
        // 文件内容不存在或者文件不合法，重新生成
        const res = {
            prv: keypair.getPrivate('hex').toString(),
            pub: keypair.getPublic('hex').toString()
        }
        fs.writeFileSync(fileName, JSON.stringify(res))
        return res
    }
}

// 2.签名
function sign({ from, to, amount }) {
    const bufferMsg = Buffer.from(`${from}-${to}-${amount}`)
    let signature = Buffer.from(keypair.sign(bufferMsg).toDER()).toString('hex')
    return signature
}
// 3.校验签名
function verify({ from, to, amount, signature }, pub) {
    // 校验是没有私钥
    const keypairTemp = ec.keyFromPublic(pub, 'hex')
    const bufferMsg = Buffer.from(`${from}-${to}-${amount}`)
    return keypairTemp.verify(bufferMsg, signature)
}
// 测试签名
// const trans = { from: 'lemon', to: 'uu', amount: 10 }
// const trans1 = { from: 'lemon1', to: 'uu', amount: 10 }
// trans.signature = sign(trans)
// trans1.signature = sign(trans)
// const verifyFlag = verify(trans1, keys.pub) // 签名是trans的所以是false
// console.log(verifyFlag, 'verifyFlag');
module.exports = {
    sign, verify, keys
}

