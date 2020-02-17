<template>
    <div>
        <div class="row">
            <div class="col-4">
                <div class="row">
                    <div class="col-md-12">
                        <hex-calc ref="hexCalc" :buffer="tab.selection.buffer" :position="tab.selection.positionStart"></hex-calc>
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-12">
                        <hex-markers @setMarker="setMarker"></hex-markers>
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-12">
                        <hex-clipboard :binary="tab.buffer" @update="updateBuffer"></hex-clipboard>
                    </div>
                </div>
            </div>
            <div class="col-8">
                <hex-view ref="hexView" :binary="tab.buffer" @selection="setSelection"></hex-view>
            </div>
        </div>
    </div>
</template>

<script>
  import HexView from './HexEditor/HexView/HexView'
  import HexCalc from './HexEditor/HexCalc'
  import HexMarkers from './HexEditor/HexMarkers'
  import HexClipboard from './HexEditor/HexClipboard'
  import Tab from './Tab'
  import ByteBuffer from './HexEditor/HexView/ByteBuffer'

  export default {
    components: { HexView, HexCalc, HexMarkers, HexClipboard },
    props: {
      tab: { required: true, type: Tab },
    },
    methods: {
      updateBuffer (bytes) {
        this.tab.buffer = new ByteBuffer(new Buffer(bytes))
      },
      setSelection (data) {
        this.tab.selection = data
      },
      setMarker (color) {
        this.$refs.hexView.setMarkerAtSelection(color)
      }
    }
  }
</script>
