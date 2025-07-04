
# 项目说明
```
 1.迷你区块链--lemon-chain
 2.区块链的生成，新增，校验
 3.交易
 4.非对称加密
 5.挖矿
 6.P2P网络
``` 

### 操作流程
```
1.npm run dev
2.先挖矿后才有收益  mine lemon
3.操作交易之后要继续挖矿才算一次完整的交易流程
  trans lemon uu 10 
  mine lemon
4.之后才可以查看上一次的余额
blance lemon    

```

### 命令行工具vorpal
```
 npm install vorpal --save
```

### cli-table 格式化输出
```
 npm install cli-table
```
### RSA非对称加密
```
 npm install elliptic --save
```
### P2P
```
p2p peer to peer 点对点
udp协议
只管发不管你有没有收到
dgram自带模块处理udp
```
# 传统记账
  1. 村长负责记账
  2. 谁收入多少
  3. 谁给谁转账

# 区块链记账
  1. 每个人都有记账的权利
  2. 每个交易都会全网广播 一起记录
  3. 账本每一页是一个区块
  4. 区块上有一个数 指向前一个区块
  5. 什么时候同步：挖矿（竞争获得记账权）
