const BYTES_PER_ROW = 16

export default class ByteBuffer {
  /**
   * @param {Buffer} buffer
   */
  constructor (buffer) {
    this.buffer = buffer
    this.startRow = 0
    this.markers = {}

    // debug colors
    // for (let i = 0; i < buffer.length; i++) {
    //   this.setMarker(i, DEBUG_COLORS[Math.floor(Math.random()*DEBUG_COLORS.length)])
    // }
  }

  /**
   * @param {number} start
   * @param {number} end
   * @returns {Buffer}
   */
  slice (start, end) {
    return this.buffer.slice(start, end)
  }

  setMarker (position, color) {
    this.markers[position] = color
  }

  /**
   * @param position
   * @returns {{color, position}|null}
   */
  getPositionMarkerColor (position) {
    if (typeof this.markers[position] !== 'undefined') {
      return this.markers[position]
    }

    return null
  }

  /**
   * @returns {number}
   */
  getStartRow () {
    return this.startRow
  }

  /**
   * @param {number} startRow
   */
  setStartRow (startRow) {
    if (startRow < 0) {
      startRow = 0
    }

    this.startRow = startRow
  }

  /**
   * @returns {number}
   */
  countAllRows () {
    return Math.ceil(this.length() / BYTES_PER_ROW)
  }

  /**
   * @returns {number}
   */
  length () {
    return this.buffer.length
  }

  viewPort (showRows) {
    let rows = []

    for (let row = this.startRow; row < this.startRow + showRows; row++) {
      let bytes = []
      for (let byteIndex = 0; byteIndex < BYTES_PER_ROW; byteIndex++) {
        let position = (row * BYTES_PER_ROW) + byteIndex
        if (typeof this.buffer[position] === 'undefined') {
          break
        }
        bytes.push({
          position: position,
          byte: this.buffer[position]
        })
      }

      if (bytes.length > 0) {
        rows.push(bytes)
      }
    }

    return rows
  }

}
