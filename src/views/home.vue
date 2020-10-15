<template>
  <el-container class="home-container">
    <!-- 头部 -->
    <el-header>
      <div>
        <img src="~@/assets/header.jpg" alt="" />
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="tc">退出</el-button>
    </el-header>
    <!-- 内容 -->
    <el-container>
      <!-- 左侧侧边 -->
      <Aside :menu = menulist></Aside>
      <!-- 右侧 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import Aside from '@/components/Aside.vue'
export default {
  components: {Aside},
  props: {},
  data() {
    return {
      menulist:[]
    };
  },
  created(){
    this.getmenulist()
  },
  methods: {
    tc() {
      sessionStorage.removeItem("token");
      this.$router.replace("/login");
    },
    async getmenulist(){
      var {data:res} = await this.$http.get('menus')
      if(res.meta.status != 200)return this.$message.error(res.meta.msg)
      this.menulist = res.data
    }
  },
};
</script>
<style lang="less" scoped>
.home-container {
  height: 100%;
  .el-header {
    width: 100%;
    background: #363d40;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #fff;
    padding-left: 0;
    > div {
      display: flex;
      align-items: center;
      font-size: 20px;
      > img {
        width: 4vw;
        height: 4vw;
        border-radius: 50%;
        margin: 0 15px 0 0;
      }
    }
  }
  .el-main {
    background: #e9edf1;
  }
}
</style>