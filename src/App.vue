<template>
    <div id="app" class="container-fluid">
        <ul class="nav nav-tabs">
            <li class="nav-item" v-for="tab in tabs">
                <a class="nav-link" :class="{ 'active': tab.active }" :href="tab.name" @click.prevent="selectTab(tab)">
                    {{ tab.name }}
                </a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="#" @click.prevent="addTab()">+</a>
            </li>
        </ul>
        <HexEditor v-if="currentTab !== null" :tab="currentTab"></HexEditor>
    </div>
</template>

<script>
  import HexEditor from './components/HexEditor'
  import Tab from './components/Tab.js'
  import shortid from 'shortid'

  export default {
    components: { HexEditor },
    data () {
      return {
        tabs: [
          // new Tab('aaaa', [0, 1, 2, 3, 4], true)
        ],
      }
    },
    methods: {
      addTab (bytes = []) {
        this.tabs.push(new Tab(shortid.generate(), bytes, this.tabs.length === 0))
      },
      selectTab (selectedTab) {
        this.tabs.forEach(tab => tab.active = (tab.name === selectedTab.name))
      }
    },
    computed: {
      currentTab () {
        for (let i = 0; i < this.tabs.length; i++) {
          if (this.tabs[i].active === true) {
            return this.tabs[i]
          }
        }

        return null
      }
    }
  }
</script>

<style lang="scss">
    @import '~bootstrap/scss/bootstrap.scss';
    @import '~@fortawesome/fontawesome-free/css/all.css';

    html {
        font-size: 13px;
    }

    .container-fluid {
        margin-top: 15px;
    }

    .card-body {
        padding: 0.8em;
    }
    .nav {
        margin-bottom: 30px;
    }
</style>
