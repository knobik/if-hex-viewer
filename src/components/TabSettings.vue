<template>
    <div class="card mb-3">
        <div class="card-header">
            Tab settings
        </div>
        <div class="card-body">
            <form>
                <div class="form-group">
                    <div class="input-group">
                        <div class="input-group-prepend">
                            <span class="input-group-text">Name</span>
                        </div>
                        <input type="text" class="form-control" v-model="tab.name">
                    </div>
                </div>
            </form>
        </div>
    </div>
</template>

<script>
    import Tab from './Tab'
    export default {
      props: {
        tab: { Required: true, type: Tab }
      }
    }
</script>
