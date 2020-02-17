import * as dgram from "dgram"

export default class Listener {
  constructor (port) {
    this.server = dgram.createSocket('udp4');

    this.server.on('error', (err) => {
      console.log(`server error:\n${err.stack}`);
      this.server.close();
    });

    this.server.on('listening', () => {
      const address = this.server.address();
      console.log(`server listening ${address.address}:${address.port}`);
    });

    this.server.bind(port);
  }

  onMessage(callback) {
    this.server.on('message', (msg, rinfo) => callback(msg, rinfo));
  }
}

