<template>
  <div class="card">
    <div class="card-header">
      <ul class="nav nav-tabs card-header-tabs">
        <li class="nav-item" v-for="tab in tabs" :key="tab.name">
          <a class="nav-link" :class="{ 'active': tab.active }" @click.prevent="selectTab(tab)"
             :href="tab.href">{{ tab.name }}</a>
        </li>
      </ul>
    </div>
    <div class="card-body">
      <slot></slot>
    </div>
    <div class="card-footer" v-if="$slots.footer">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tabs: [],
    };
  },

  methods: {
    selectTab(selectedTab) {
      this.tabs.forEach(tab => tab.active = (tab.name === selectedTab.name));
    }
  }
};
</script>
