<template>
    <div class="card mb-3">
        <div class="card-header">
            Calculator (0x{{ position.toString(16).padStart(8, '0') }} ... 0x{{ (position+buffer.length-1).toString(16).padStart(8, '0') }})
        </div>
        <div class="card-body">
            <form>
                <div class="form-group">
                    <div class="input-group">
                        <div class="input-group-prepend">
                            <span class="input-group-text">dec</span>
                        </div>
                        <input type="text" class="form-control" :value="dec" @blur="updateFromDec" @keyup.enter="updateFromDec">
                    </div>
                </div>
                <div class="form-group">
                    <div class="input-group">
                        <div class="input-group-prepend">
                            <span class="input-group-text">hex</span>
                        </div>
                        <input type="text" class="form-control" :value="hex" @blur="updateFromHex" @keyup.enter="updateFromHex">
                    </div>
                </div>
                <div class="form-group">
                    <div class="input-group">
                        <div class="input-group-prepend">
                            <span class="input-group-text">bin</span>
                        </div>
                        <input type="text" class="form-control" :value="bin" @blur="updateFromBin" @keyup.enter="updateFromBin">
                    </div>
                </div>
                <hr>
                <div class="form-group">
                    <div class="input-group">
                        <div class="input-group-prepend">
                            <span class="input-group-text">bytes</span>
                        </div>
                        <input type="text" class="form-control" readonly :value="buffer.length">
                    </div>
                </div>
                <div class="form-group">
                    <div class="input-group">
                        <div class="input-group-prepend">
                            <span class="input-group-text">buffer</span>
                        </div>
                        <input type="text" class="form-control" readonly :value="hexBuffer">
                    </div>
                </div>
            </form>
        </div>
    </div>
</template>
<script>
  export default {
    props: {
      buffer: { required: true, type: Buffer },
      position: { required: true, type: Number }
    },
    methods: {
      updateFromHex (event) {
        this.buffer = this.hexToBuffer(event.target.value)
      },
      updateFromDec (event) {
        this.buffer = this.decToBuffer(event.target.value)
      },
      updateFromBin (event) {
        this.buffer = this.binToBuffer(event.target.value)
      },
      bufferToLong (buffer) {
        let value = 0
        for (let i = 0; i < buffer.length; i++  ) {
          value = (value * 256) + buffer[i]
        }

        return value
      },
      hexToBuffer (hex) {
        let bytes = []
        for (let c = hex.length; c > 0; c -= 2) {
          bytes.push(parseInt(hex.substr(c - 2, 2), 16))
        }
        return new Buffer(bytes)
      },
      decToBuffer (dec) {
        let hex = parseInt(dec).toString(16)
        if (hex.length % 2) {
          hex = '0' + hex
        }

        return this.hexToBuffer(hex.toString())
      },
      binToBuffer (bin) {
        let dec = parseInt(bin.split(' ').join(''), 2);
        return this.decToBuffer(dec)
      }
    },
    computed: {
      hexBuffer() {
        let result = ''
        for (let i = 0; i < this.buffer.length; i++) {
          result += this.buffer[i].toString(16).padStart(2, '0').toUpperCase() + ' '
        }

        return result
      },
      hex () {
        let result = ''
        for (let i = this.buffer.length - 1; i >= 0; i--) {
          result += this.buffer[i].toString(16).padStart(2, '0').toUpperCase()
        }

        return result
      },
      dec () {
        return this.bufferToLong(this.buffer)
      },
      bin () {
        let result = ''
        for (let i = this.buffer.length - 1; i >= 0; i--) {
          result += this.buffer[i].toString(2).padStart(8, '0') + ' '
        }

        return result
      }
    }
  }
</script>

<style lang="scss">
    .input-group-prepend {
        width: 15%;
    }

    .input-group-text {
        width: 100%;
    }
</style>
