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
let fs = require('fs');

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
function sign(data) {
    try {
        const { from, to, amount, timestamp } = data;
        // 挖矿奖励交易不需要签名
        if (from === '0') {
            return '0';
        }
        const message = Buffer.from(`${timestamp}-${amount}-${from}-${to}`);
        return Buffer.from(keypair.sign(message).toDER()).toString('hex');
    } catch (error) {
        console.log('[错误] 生成签名失败:', error.message);
        return null;
    }
}

// 3.校验签名
function verify(data) {
    try {
        const { from, to, amount, timestamp, signature } = data;

        // 挖矿奖励交易不需要验证签名
        if (from === '0') {
            return signature === '0';  // 确保挖矿交易的签名是'0'
        }

        // 检查必要的字段
        if (!from || !to || amount === undefined || !timestamp || !signature) {
            console.log('[错误] 交易数据不完整' + JSON.stringify(data));
            return false;
        }

        try {
            // 使用发送方的公钥（from就是公钥）
            const keypairTemp = ec.keyFromPublic(from, 'hex');
            const message = Buffer.from(`${timestamp}-${amount}-${from}-${to}`);
            // 将十六进制字符串转换回Buffer，然后转换为DER格式
            const signatureBuffer = Buffer.from(signature, 'hex');
            return keypairTemp.verify(message, signatureBuffer);
        } catch (error) {
            console.log('[错误] 签名格式错误:', error.message);
            return false;
        }
    } catch (error) {
        console.log('[错误] 验证签名失败:', error.message);
        return false;
    }
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

