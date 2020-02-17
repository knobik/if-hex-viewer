<template>
    <div role="application" aria-label="Sketch color picker" :class="['vc-sketch', disableAlpha ? 'vc-sketch__disable-alpha' : '']">
        <div class="btn-controls d-flex justify-content-between">
            <button class="btn btn-success btn-sm" @click="$emit('picked')"><i class="fa fa-check"></i></button>
            <button class="btn btn-danger btn-sm" @click="$emit('closed')"><i class="fa fa-times"></i></button>
        </div>
        <div class="vc-sketch-saturation-wrap">
            <saturation v-model="colors" @change="childChange"></saturation>
        </div>
        <div class="vc-sketch-controls">
            <div class="vc-sketch-sliders">
                <div class="vc-sketch-hue-wrap">
                    <hue v-model="colors" @change="childChange"></hue>
                </div>
                <div class="vc-sketch-alpha-wrap" v-if="!disableAlpha">
                    <alpha v-model="colors" @change="childChange"></alpha>
                </div>
            </div>
            <div class="vc-sketch-color-wrap">
                <div :aria-label="`Current color is ${activeColor}`" class="vc-sketch-active-color" :style="{background: activeColor}"></div>
                <checkboard></checkboard>
            </div>
        </div>
        <div class="vc-sketch-field" v-if="!disableFields">
            <!-- rgba -->
            <div class="vc-sketch-field--double">
                <ed-in label="hex" :value="hex" @change="inputChange"></ed-in>
            </div>
            <div class="vc-sketch-field--single">
                <ed-in label="r" :value="colors.rgba.r" @change="inputChange"></ed-in>
            </div>
            <div class="vc-sketch-field--single">
                <ed-in label="g" :value="colors.rgba.g" @change="inputChange"></ed-in>
            </div>
            <div class="vc-sketch-field--single">
                <ed-in label="b" :value="colors.rgba.b" @change="inputChange"></ed-in>
            </div>
            <div class="vc-sketch-field--single" v-if="!disableAlpha">
                <ed-in label="a" :value="colors.a" :arrow-offset="0.01" :max="1" @change="inputChange"></ed-in>
            </div>
        </div>
        <div class="vc-sketch-presets" role="group" aria-label="A color preset, pick one to set as current color">
            <template v-for="c in presetColors">
                <div
                        v-if="!isTransparent(c)"
                        class="vc-sketch-presets-color"
                        :aria-label="'Color:' + c"
                        :key="c"
                        :style="{background: c}"
                        @click="handlePreset(c)">
                </div>
                <div
                        v-else
                        :key="c"
                        :aria-label="'Color:' + c"
                        class="vc-sketch-presets-color"
                        @click="handlePreset(c)">
                    <checkboard />
                </div>
            </template>
        </div>
    </div>
</template>

<script>
  import { Sketch } from 'vue-color'
  export default {
    extends: Sketch,
  }
</script>

<style lang="scss">
    .btn-controls {
        margin-bottom: 10px;
    }
</style>
