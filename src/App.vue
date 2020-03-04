<template>
    <div id="app" class="container-fluid">
        <ul class="nav nav-tabs">
            <li class="nav-item" v-for="tab in tabs" :key="tab.name">
                <a class="nav-link" :class="{ 'active': tab.active }" :href="tab.name" @click.prevent="selectTab(tab)" @click.middle.stop="closeTab(tab)">
                    {{ tab.name ? tab.name : '*unnamed*' }} <span class="close" @click.prevent.stop="closeTab(tab)">&times;</span>
                </a>
            </li>
            <li class="nav-item">
                <a class="nav-link add-btn" href="#" @click.prevent="addTab()">+</a>
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
    mounted () {
      window.listner.onMessage((data, meta) => {
        this.addTab(data, meta.name ? meta.name : null)
      })
    },
    data () {
      return {
        tabs: [
          // new Tab('aaaa', [0, 1, 2, 3, 4], true)
        ],
      }
    },
    methods: {
      addTab (bytes = [], name = null) {
        name = name ? name : shortid.generate();

        let tab = new Tab(this.uniqueTabName(name), bytes, this.tabs.length === 0)
        this.tabs.push(tab)
        this.selectTab(tab)
        return tab
      },
      uniqueTabName(name, count = 0) {
        let searchName = name;
        for (let i = 0; i < this.tabs.length; i++) {
          if (count > 0) {
            searchName = `${name} (${count})`;
          }
          if (this.tabs[i].name === searchName) {
            count++;
            return this.uniqueTabName(name, count)
          }
        }

        return searchName;
      },
      selectTab (selectedTab) {
        this.tabs.forEach(tab => tab.active = (tab.name === selectedTab.name))
      },
      closeTab (selectedTab) {
        let index = this.tabs.findIndex(tab => tab.name === selectedTab.name)
        let wasActive = this.tabs[index].active
        this.tabs.splice(index, 1)

        if (wasActive && this.tabs.length > 0) {
          this.selectTab(this.tabs[this.tabs.length - 1])
        }
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

    .close {
        margin-left: 10px;
    }

    .add-btn {
        font-size: 1.5rem;
        font-weight: 700;
        line-height: 1;
        color: #000;
        text-shadow: 0 1px 0 #fff;
        opacity: .5;
    }
</style>
