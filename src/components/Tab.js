import ByteBuffer from './HexEditor/HexView/ByteBuffer'

export default class Tab {
  constructor (name, bytes, active = false) {
    this.name = name
    this.buffer = new ByteBuffer(Buffer.from(bytes))
    this.active = active
    this.selection = {
      buffer: Buffer.from([]),
      positionStart: 0,
      positionEnd: 0
    }
  }
}
