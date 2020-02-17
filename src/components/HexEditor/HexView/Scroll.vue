<template>
    <div class="scrollbar">
        <div class="button up" :class="{ disabled: position <= 0 }" @click="up"></div>
        <div class="track" ref="track">
            <div
                    class="thumb"
                    ref="thumb"
                    :style="{ height: height + 'px', top: top + 'px' }"
                    @mousedown="startDrag"
            ></div>
        </div>
        <div class="button down" :class="{ disabled: position+visible === all }" @click="down"></div>
    </div>
</template>

<script>
  export default {
    props: {
      position: { required: true, type: Number },
      visible: { required: true, type: Number },
      all: { required: true, type: Number }
    },
    data () {
      return {
        isMounted: false,
        dragging: false,
        startY: 0,
        startTop: 0,
        YOffset: 0
      }
    },
    methods: {
      up: function () {
        if (this.position > 0) {
          this.$emit('up')
        }
      },
      down: function () {
        if (this.position + this.visible <= this.all) {
          this.$emit('down')
        }
      },
      update () {
        let newPosition = Math.round(this.map(this.top, 0, this.$refs.track.clientHeight, 0, this.all))

        if (newPosition + this.visible > this.all) {
          newPosition = this.all - this.visible
        }

        if (newPosition < 0) {
          newPosition = 0
        }

        this.$emit('update', newPosition)
      },

      cancelSelect (event) {
        event.preventDefault()
      },
      startDrag: function (event) {
        if (this.dragging) {
          return
        }
        window.addEventListener('selectstart', this.cancelSelect)

        this.startY = event.clientY
        this.startTop = this.top;
        this.dragging = true
      },
      stopDrag: function () {
        if (!this.dragging) {
          return
        }

        this.update();

        this.dragging = false
        this.YOffset = 0
        this.startTop = 0;
        window.removeEventListener('selectstart', this.cancelSelect)
      },
      onDragging: function (event) {
        if (!this.dragging) {
          return
        }

        if ((this.top - 1) + this.$refs.thumb.clientHeight <= this.$refs.track.clientHeight) {
          if (this.top >= 0) {
            this.YOffset = event.clientY - this.startY
          }
        }

        this.update();
      },

      map: function (x, in_min, in_max, out_min, out_max) {
        return (x - in_min) * (out_max - out_min) / (in_max - in_min) + out_min
      },
    },
    computed: {
      height: function () {
        if (!this.isMounted) {
          return 0
        }
        return this.map(this.visible, 0, this.all, 0, this.$refs.track.clientHeight)
      },
      top: function () {
        if (!this.isMounted) {
          return 0
        }

        if (this.dragging) {
          return this.startTop + this.YOffset;
        }

        return this.map(this.position, 0, this.all, 0, this.$refs.track.clientHeight) + this.YOffset
      },
    },
    mounted () {
      this.isMounted = true

      window.addEventListener('mouseup', this.stopDrag)
      window.addEventListener('mousemove', this.onDragging)
    }
  }
</script>

<style lang="scss" scoped>
    .scrollbar {
        position: absolute;
        right: -1px;
        top: 0;
        bottom: 0;
        width: 18px;
        border-left: 1px solid #ededed;

        .track {
            position: absolute;
            background: #f8f8f8;
            top: 16px;
            bottom: 16px;
            width: 16px;

            .thumb {
                position: relative;
                width: 14px;
                left: 1px;
                background: #d6d6d6;

                &:hover {
                    background: #b4b4b4;
                }

                &.disabled {
                    background: #f2f2f2 !important;
                }
            }
        }

        .button {
            position: absolute;
            height: 16px;
            width: 16px;

            &.up {
                top: 0;
                background: #d6d6d6 url('../../../assets/scrollbar-up.png') no-repeat 50%;
            }

            &.down {
                bottom: 0;
                background: #d6d6d6 url('../../../assets/scrollbar-down.png') no-repeat 50%;
            }

            &:hover {
                background-color: #b4b4b4;
            }

            &.disabled {
                opacity: 0.5;
            }
        }
    }
</style>
