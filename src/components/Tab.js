import ByteBuffer from './HexEditor/HexView/ByteBuffer'

export default class Tab {
  constructor (name, bytes, active = false) {
    this.name = name
    this.buffer = new ByteBuffer(new Buffer(bytes))
    this.active = active
    this.selection = {
      buffer: new Buffer([]),
      positionStart: 0,
      positionEnd: 0
    }
  }
}
