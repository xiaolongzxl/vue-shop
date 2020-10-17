<template>
  <div>
    <!-- 面包屑组件 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- card组件 -->
    <el-card>
      <el-button type="primary" @click="changeaddcate">添加分类</el-button>
      <tree-table
        index-text="#"
        :data="goodscate"
        :columns="columns"
        :selectable="false"
        :expand-type="false"
        show-index
        border
        class="tree-table"
      >
        <!-- 是否有效 -->
        <template slot="isok" slot-scope="scope">
          <i
            v-if="scope.row.cat_deleted == false"
            class="el-icon-circle-check"
            style="color: lightgreen"
          ></i>
          <i v-else class="el-icon-circle-close" style="color: red"></i>
        </template>
        <!-- 排序 -->
        <template slot="order" slot-scope="scope">
          <el-tag v-if="scope.row.cat_level == 0" size=":mine">一级</el-tag>
          <el-tag
            v-else-if="scope.row.cat_level == 1"
            size=":mine"
            type="success"
            >二级</el-tag
          >
          <el-tag v-else size=":mine" type="warning">三级</el-tag>
        </template>

        <!-- 操作 -->
        <template slot="set" slot-scope="scope">
          <el-button
            size="mini"
            type="primary"
            icon="el-icon-edit"
            @click="changeeditcate(scope.row)"
            >编辑</el-button
          >
          <el-button
            size="mini"
            type="danger"
            icon="el-icon-delete"
            @click="deletecate(scope.row)"
            >删除</el-button
          >
        </template>
      </tree-table>
      <el-pagination
        @current-change="handleCurrentChange"
        :currentPage="goodsargument.pagenum"
        layout="total, prev, pager, next, jumper"
        :total="total"
        :pageSize="goodsargument.pagesize"
      >
      </el-pagination>
    </el-card>
    <!-- 添加分类框 -->
    <el-dialog title="添加分类" :visible.sync="isaddcate" width="30%">
      <el-form
        ref="addcateref"
        :model="addcate"
        :rules="addcaterules"
        label-width="80px"
      >
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addcate.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类">
          <el-cascader
            v-model="parentcate"
            :options="showcate"
            :props="{
              expandTrigger: 'hover',
              value: 'cat_id',
              label: 'cat_name',
              children: 'children',
            }"
            @change="selectchange"
            clearable
            change-on-select
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isaddRoles = false">取 消</el-button>
        <el-button type="primary" @click="addcatehandle()">添加</el-button>
      </span>
    </el-dialog>
    <!-- 编辑分类框 -->
    <el-dialog title="添加分类" :visible.sync="iseditcate" width="30%">
      <el-form
        ref="editcateref"
        :model="editcate"
        :rules="addcaterules"
        label-width="80px"
      >
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="editcate.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="iseditcate = false">取 消</el-button>
        <el-button type="primary" @click="editcatehandle()">添加</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  components: {},
  props: {},
  data() {
    return {
      //   请求分类需要的参数
      goodsargument: {
        pagenum: 1,
        pagesize: 5,
      },
      //   总条数
      total: 0,
      //   请求会的商品分类
      goodscate: [],
      columns: [
        { title: "商品分类", key: "cat_name" },
        {
          title: "是否有效",
          type: "template",
          template: "isok",
        },
        {
          title: "排序",
          type: "template",
          template: "order",
        },
        {
          title: "操作",
          type: "template",
          template: "set",
        },
      ],
      isaddcate: false,
      addcaterules: {
        cat_name: [
          { required: true, message: "请输入分类名称", trigger: "blur" },
          { min: 1, message: "分类名称不得少于1个字符", trigger: "blur" },
        ],
      },
      //   form表单双向数据绑定的值
      showcate: {},
      parentcate: [],
      //   发请求时携带的数据
      addcate: {
        cat_pid: 0,
        cat_name: "",
        cat_level: 0,
      },
      iseditcate: false,
      editcate: {},
    };
  },
  created() {
    this.getgoodscate();
  },
  methods: {
    async getgoodscate() {
      const { data: res } = await this.$http.get("categories", {
        params: this.goodsargument,
      });
      if (res.meta.status != 200)
        return this.$message.error("获取商品分类失败");
      this.goodscate = res.data.result;
      this.total = res.data.total;
    },
    // 分页改变是的事件
    handleCurrentChange(currentpage) {
      this.goodsargument.pagenum = currentpage;
      this.getgoodscate();
    },
    // 点击添加分类按钮时的事件
    async changeaddcate() {
      const { data: res } = await this.$http.get("categories", {
        params: { type: 2 },
      });
      console.log(res);
      if (res.meta.status != 200)
        return this.$message.error("获取商品分类失败");
      this.showcate = res.data;
      this.isaddcate = true;
    },
    // 下拉框中的值改变是
    selectchange() {
      if (this.parentcate.length > 0) {
        this.addcate.cat_pid = this.parentcate[this.parentcate.length - 1];
        this.addcate.cat_level = this.parentcate.length;
      } else {
        this.addcate.cat_pid = 0;
        this.addcate.cat_level = 0;
      }
    },
    // 执行添加分类操作
    addcatehandle() {
      this.$refs.addcateref.validate(async (res) => {
        if (!res) return;
        const { data: r } = await this.$http.post("categories", this.addcate);
        if (r.meta.status != 201) return this.$message.error("添加分类失败");
        this.$message.success("添加分类成功");
        this.getgoodscate();
        this.isaddcate = false;
      });
    },
    async changeeditcate(scope) {
      const { data: res } = await this.$http.get("categories/" + scope.cat_id);
      console.log(res);
      if (res.meta.status != 200) return this.$message.error("请求数据失败");
      this.editcate = res.data;
      this.iseditcate = true;
    },
    // 修改分类
    editcatehandle() {
      this.$refs.editcateref.validate(async (vali) => {
        if (!vali) return;
        const { data: r } = await this.$http.put(
          "categories/" + this.editcate.cat_id,
          { cat_name: this.editcate.cat_name }
        );
        if (r.meta.status != 200) return this.$message.error("修改分类失败");
        this.$message.success("修改分类成功");
        this.getgoodscate();
        this.iseditcate = false;
      });
    },
    // 删除分类
    async deletecate(scope) {
      console.log(scope);
      const res = await this.$confirm(
        "此操作不可逆，您真的要删除吗？",
        "确认删除",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
          center: true,
        }
      ).catch((res) => res);
      if (res != "confirm") return this.$message.info("取消删除成功");
      const { data: r } = await this.$http.delete("categories/" + scope.cat_id);
      console.log(r);
      if (r.meta.status != 200) return this.$message.error("删除分类失败");
      this.$message.success("删除分类成功");
      this.getgoodscate();
    },
  },
};
</script>
<style lang='less' scoped>
.tree-table {
  margin-top: 15px;
}
</style>