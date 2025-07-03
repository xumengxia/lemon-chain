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
var EC = require('elliptic').ec;

// Create and initialize EC context
// (better do it once and reuse it)
var ec = new EC('secp256k1');

// Generate keys
var keypair = ec.genKeyPair();
const res = {
    prv: keypair.getPrivate('hex').toString(),
    pub: keypair.getPublic('hex').toString()
}
console.log(res);


