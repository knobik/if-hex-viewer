<template>
    <div class="card mb-3">
        <div class="card-header">
            Buffer ({{ binary.buffer.length }} bytes)
        </div>
        <div class="card-body">
            <form>
                <div class="form-group">
                    <div class="input-group">
                        <textarea class="form-control" @blur="updateFromHex" @keydown.enter.prevent="updateFromHex" v-model="hexBuffer"></textarea>
                    </div>
                </div>
            </form>
        </div>
    </div>
</template>
<script>
  import ByteBuffer from './HexView/ByteBuffer'

  export default {
    props: {
      binary: { Required: true, Type: ByteBuffer }
    },
    methods: {
      updateFromHex (event) {
        event.stopPropagation()
        this.$emit('update', this.hexToBuffer(event.target.value))
      },
      hexToBuffer (hex) {
        let bytes = []
        for (let c = 0; c < hex.length; c += 2) {
          bytes.push(parseInt(hex.substr(c, 2), 16))
        }
        return bytes
      }
    },
    computed: {
      hexBuffer() {
        let result = ''
        for (let i = 0; i < this.binary.buffer.length; i++) {
          result += this.binary.buffer[i].toString(16).padStart(2, '0').toUpperCase()
        }

        return result
      },
    }
  }
</script>
