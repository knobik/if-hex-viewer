<template>
    <div id="hexview" @wheel="scroll" @mouseleave="hoverPosition = null">
        <div class="column address">
            <div class="address-row text-right" v-for="(row, index) in viewPort" :key="index">
                <template v-if="hexAddress">{{ ((binary.getStartRow() + index) * 16) | hex(8) }}
                </template>
                <template v-else>{{ (binary.getStartRow() + index) * 16 }}</template>
            </div>
        </div>
        <div class="column data" @selectstart="cancelSelection">
            <div class="data-row" v-for="(row, rowIndex) in viewPort" :key="rowIndex">
                <span
                        v-for="(column, index) in row"
                        :key="column.position"
                        :class="{ 'byte': true, spacer: index === 7, 'hovering':  hoverPosition === column.position, 'selection': isSelection(column.position) }"
                        :style="{ background: binary.getPositionMarkerColor(column.position) }"
                        @mouseenter="updatePosition(column.position)"
                        @mousedown="selectionStart(column.position)"
                        @mouseup="selectionEnd(column.position)"
                >{{ column.byte | hex }}</span>
            </div>
        </div>
        <div class="column ascii" @selectstart="cancelSelection">
            <div class="ascii-row" v-for="(row, rowIndex) in viewPort" :key="rowIndex">
                <span
                        class="ascii"
                        :class="{'hovering':  hoverPosition === column.position, 'selection': isSelection(column.position) }"
                        v-for="column in row"
                        :key="column.position"
                        @mouseenter="updatePosition(column.position)"
                        @mousedown="selectionStart(column.position)"
                        @mouseup="selectionEnd(column.position)"
                >{{ column.byte | ascii }}</span>
            </div>
        </div>
        <scroll
                v-if="this.showRows < binary.countAllRows()"
                @up="up"
                @down="down"
                @update="updateViewPort"
                :position="binary.getStartRow()"
                :visible="this.showRows"
                :all="binary.countAllRows()"
        ></scroll>
    </div>
</template>

<script>
  import ByteBuffer from './ByteBuffer'
  import Scroll from './Scroll'

  export default {
    components: { Scroll },
    props: {
      binary: { required: true, type: ByteBuffer },
      hexAddress: { type: Boolean, default: true }
    },
    data: function () {
      return {
        showRows: 40,
        hoverPosition: null,
        selecting: false,
        selectionEndedOnViewport: false,
        selectStart: null,
        selectEnd: null
      }
    },
    computed: {
      viewPort: function () {
        return this.binary.viewPort(this.showRows)
      }
    },
    methods: {
      selectionPosition () {
        return {
          first: Math.min(this.selectStart, this.selectEnd),
          last: Math.max(this.selectStart, this.selectEnd)
        }
      },
      setMarkerAtSelection (color) {
        let position = this.selectionPosition()
        for (let i = position.first; i < position.last + 1; i++) {
          this.binary.setMarker(i, color)
        }

        this.selectStart = null
        this.selectEnd = null
      },
      emitNewSelection () {
        let position = this.selectionPosition()

        let data = {
          buffer: this.binary.slice(position.first, position.last + 1),
          positionStart: position.first,
          positionEnd: position.last
        }

        this.$emit('selection', data)
      },
      isSelection (position) {
        if (this.selectStart !== null && this.selectEnd !== null) {

          let selectionPosition = this.selectionPosition()

          if (position >= selectionPosition.first && position <= selectionPosition.last) {
            return true
          }
        }

        return false
      },
      updatePosition (position) {
        this.hoverPosition = position
        if (this.selecting) {
          this.selectEnd = position
        }

        this.emitNewSelection()
      },
      selectionStart (position) {
        this.selectStart = position
        this.selectEnd = null
        this.selecting = true
        this.selectionEndedOnViewport = false
      },
      selectionEnd (position) {
        this.selectEnd = position
        this.selectionEndedOnViewport = true

        this.emitNewSelection()
      },
      stopSelection () {
        this.selecting = false
        if (!this.selectionEndedOnViewport) {
          this.selectStart = null
          this.selectEnd = null
        }
      },
      cancelSelection (event) {
        event.preventDefault()
      },
      up () {
        this.binary.setStartRow(this.binary.getStartRow() - 1)
      },
      down () {
        this.binary.setStartRow(this.binary.getStartRow() + 1)

        if (this.binary.getStartRow() + this.showRows > this.binary.countAllRows()) {
          this.binary.setStartRow(this.binary.countAllRows() - this.showRows)
        }
      },
      updateViewPort (position) {
        this.binary.setStartRow(position)
      },
      scroll (event) {
        if (event.deltaY < 0) {
          this.up()
        } else {
          this.down()
        }
      }
    },
    filters: {
      /**
       * @param {number} value
       * @param {number} length
       * @returns {string}
       */
      hex: function (value, length = 2) {
        return value.toString(16).toUpperCase().padStart(length, '0')
      },
      ascii: function (value) {
        return value > 32 && value < 127 ? String.fromCharCode(value) : '.'
      }
    },
    mounted () {
      window.addEventListener('mouseup', this.stopSelection)
    }
  }
</script>

<style lang="scss" scoped>
    @import url('https://fonts.googleapis.com/css?family=Source+Code+Pro&display=swap');

    .scroller {
        height: 100%;
    }

    #hexview {
        font-family: 'Source Code Pro', monospace;
        font-size: 14px;

        display: flex;
        position: relative;
        border: 1px solid rgba(#000, 0.125);
        border-radius: .25rem;
    }

    .column {
        border-right: 1px solid rgba(#000, 0.125);
        padding: 0.4em;
        align-content: center;

        &.address {
            padding: 0.4em 0.8em;
        }

        &.ascii {
            border-right: 0;
            padding-left: 0.8em;
        }

        &.data, &.ascii {
            cursor: default;
        }
    }

    span {
        margin: 0;
        padding: 0;

        &.byte {
            padding: 0.1em 0.3em;
        }

        &.hovering {
            background: #ededed;
        }

        &.selection {
            background: #ededed !important;
        }

        &.spacer {
            margin-right: 1em;
        }
    }
</style>
<!-- Add "scoped" attribute to limit CSS to this component only -->
