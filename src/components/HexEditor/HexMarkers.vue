<template>
    <div class="card mb-3">
        <div class="card-header">
            Marker
        </div>
        <div class="card-body">
            <div class="color-list">
                <span class="color pickable" v-for="(color, index) in colors" :key="index"
                      :style="{ background: color }" @click="$emit('setMarker', color)"></span>
                <span class="button add pickable" @click.stop="showColorPicker()"><i class="fa fa-plus"></i></span>
                <sketch-picker
                        v-if="colorpickerVisible"
                        v-model="pickedColor"
                        @picked="saveColor()"
                        @closed="closePicker()"
                ></sketch-picker>
            </div>
        </div>
    </div>
</template>
<script>
  import SketchPicker from './ColorPicker'

  export default {
    components: { SketchPicker },
    data () {
      return {
        colors: ['#e6194b', '#3cb44b', '#ffe119', '#4363d8', '#f58231', '#911eb4', '#46f0f0', '#f032e6', '#bcf60c', '#fabebe', '#008080', '#e6beff', '#9a6324', '#fffac8', '#800000', '#aaffc3', '#808000', '#ffd8b1', '#000075', '#808080', '#ffffff'],
        pickedColor: '#fff',
        colorpickerVisible: false,
        currentIndex: null,
      }
    },
    methods: {
      saveColor () {
        if (this.currentIndex === null) {
          this.addColor()
        } else {
          this.colors[this.currentIndex] = this.pickedColor
        }
        this.closePicker()
      },
      addColor () {
        this.colors.push(this.pickedColor.hex)
      },
      closePicker () {
        this.colorpickerVisible = false
      },
      showColorPicker (color = '#fff', currentIndex = null) {
        this.currentIndex = currentIndex

        this.pickedColor = color
        this.colorpickerVisible = true
      },
    }
  }
</script>

<style lang="scss" scoped>
    .color-list {
        display: flex;
        flex-wrap: wrap;
    }

    .pickable {
        cursor: pointer;
    }

    .color, .button {
        display: block;
        background: #fff;
        border: 1px solid rgba(#000, 0.125);
        width: 24px;
        height: 24px;
        margin: 0 10px 10px 0;
        border-radius: 0.25rem;

        &.add {
            text-align: center;
            line-height: 1.7rem;
        }
    }
</style>
