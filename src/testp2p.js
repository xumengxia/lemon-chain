const { log } = require('console');
const dgram = require('dgram')
const udp = dgram.createSocket('udp4')
// 新节点给所有已知节点发消息，新节点的网件上把所有的节点都加上白名单
// 已知节点给新节点发消息，同理增加白名单
// udp不可靠可能会发送失败，需要粗暴的挖矿和交易都加一个全局广播的逻辑
// udp收信息
udp.on('message', (data, remote) => {
    console.log('accept message' + data.toString());
    console.log(remote, 'remote');

})
udp.on('listening', function () {
    const adress = udp.address()
    console.log('udp server is running on ' + adress.address + ':' + adress.port);
})

udp.bind(0)
// 发送消息
function send(message, port, host) {
    console.log('send message', message, port, host);
    udp.send(Buffer.from(message), port, host)
}
console.log(process.argv);
const port = Number(process.argv[2])
const host = process.argv[3]
if (port && host) {
    send('hello', port, host)
}






