import * as dgram from 'dgram'

const PAYLOAD_SIMPLE = 0x01;
const PAYLOAD_EXTENDED = 0x02;

export default class Listener {
  constructor (port) {
    this.server = dgram.createSocket('udp4')

    this.server.on('error', (err) => {
      console.log(`server error:\n${err.stack}`)
      this.server.close()
    })

    this.server.on('listening', () => {
      const address = this.server.address()
      console.log(`server listening ${address.address}:${address.port}`)
    })

    this.server.bind(port)
  }

  onMessage (callback) {
    this.server.on('message', (msg, rinfo) => {

      let payload = Buffer.from(msg)
      let meta = {}
      let data

      // simple payload
      if (payload[0] === PAYLOAD_SIMPLE) {
        data = payload.slice(1, payload.byteLength - 1)

        // extended payload
      } else if (payload[0] === PAYLOAD_EXTENDED) {
        let metaLength = 0
        for (let i = 0; i < payload.byteLength; i++) {
          if (payload[i] === 0) {
            metaLength = i
            break
          }
        }
        meta = JSON.parse(payload.slice(1, metaLength).toString())
        data = payload.slice(metaLength + 1)

        // fallback
      } else {
        data = payload;
      }

      callback(data, meta, rinfo)
    })
  }
}

