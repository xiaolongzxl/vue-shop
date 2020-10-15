<template>
  <div style="height:100%">
    <el-aside :width="iscollapse ? '64px' : '200px'">
      <div class="check" @click="collapse">|||</div>
      <el-menu
        background-color="#313743"
        text-color="#fff"
        active-text-color="#5283c7"
        unique-opened
        :collapse="iscollapse"
        :collapse-transition="false"
        router
        :default-active="activepath"
      >
        <!-- 一级菜单 -->
        <el-submenu v-for="item in menu" :key="item.id" :index="item.id + ''">
          <template slot="title">
            <!-- 图标 -->
            <i :class="iconfont[item.id]"></i>
            <!-- 文本 -->
            <span>{{ item.authName }}</span>
          </template>
          <!-- 二级菜单 -->
          <el-menu-item
            v-for="eitem in item.children"
            :key="eitem.id"
            :index="'/' + eitem.path"
            @click="setactivepath('/' + eitem.path)"
          >
            <i class="el-icon-menu"></i>
            <span>{{ eitem.authName }}</span>
          </el-menu-item>
        </el-submenu>
      </el-menu>
    </el-aside>
  </div>
</template>

<script>
export default {
  components: {},
  props: {
    menu: {
      type: Array,
    },
  },
  data() {
    return {
      activepath:'',
      iscollapse: false,
      iconfont: {
        125: "iconfont icon-Shape",
        103: "iconfont icon-hezi",
        101: "iconfont icon-shangpin",
        102: "iconfont icon-icon-",
        145: "iconfont icon-shuju",
      },
    };
  },
  created(){
    this.setactivepath('/users')
    this.activepath = sessionStorage.getItem('activepath')
  },
  methods: {
    collapse() {
      this.iscollapse = !this.iscollapse;
    },
    setactivepath(activepath){
      sessionStorage.setItem('activepath',activepath)
      this.activepath = sessionStorage.getItem('activepath')
    }
  },
};
</script>
<style lang="less" scoped>
.el-aside {
  background: #313743;
  height: 100%;
  .check {
    background: #475164;
    text-align: center;
    height: 8vh;
    line-height: 8vh;
    color: #fff;
    letter-spacing: 0.2em;
    cursor: pointer;
  }
  .el-menu {
    background: #313743;
    border: 0;
    // transition: all .3s linear;
    .iconfont {
      margin: 0 10px 0 0;
    }
  }
}
</style>