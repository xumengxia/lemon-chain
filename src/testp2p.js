const { log } = require('console');
const dgram = require('dgram')
const udp = dgram.createSocket('udp4')

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






