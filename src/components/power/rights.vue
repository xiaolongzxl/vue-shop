<template>
  <div>
    <!-- 面包屑组件 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <!-- 利用表格组件渲染数据 -->
      <el-table :data="rightsList" stripe border>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="权限名称" prop="authName"></el-table-column>
        <el-table-column label="路径" prop="path"></el-table-column>
        <el-table-column label="权限等级">
          <!-- 利用作用域插槽获取值,根据值得不同渲染不同样式 -->
          <template slot-scope="scope">
            <el-tag v-if="scope.row.level == 0">一级</el-tag>
            <el-tag type="success" v-else-if="scope.row.level == 1">二级</el-tag>
            <el-tag type="warning" v-else>三级</el-tag>
          </template>
        </el-table-column>

      </el-table>
    </el-card>

  </div>
</template>

<script>
export default {
  components: {},
  props: {},
  data() {
    return {
      rightsList:[]
    };
  },
  // 页面创建好久请求数据
  created(){
    this.getrightslist()
  },
  methods:{
    // 获取权限数据
    async getrightslist(){
      const {data:res} = await this.$http.get('rights/list')
      if(res.meta.status != 200) return this.$message.Error('获取权限数据失败')
      this.rightsList = res.data
      // console.log(res.data)
    }
  }
};
</script>
<style lang='lass' scoped>
</style>