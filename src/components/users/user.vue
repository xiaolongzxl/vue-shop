<template>
  <div>
    <!-- 面包屑组件 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片组件 -->
    <el-card>
      <!-- 栅格系统 -->
      <el-row :gutter="30">
        <el-col :span="10">
          <!-- 自定义input组件 -->
          <el-input
            placeholder="请输入内容"
            v-model="params.query"
            clearable
            @clear="getuserlist"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getuserlist"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="5">
          <!-- 点击弹框 -->
          <el-button type="primary" @click="dialogVisible = true"
            >添加用户</el-button
          >
        </el-col>
      </el-row>
      <!-- 表格组件 -->
      <el-table :data="userlist" stripe border>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="姓名" prop="username"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="电话" prop="mobile"></el-table-column>
        <el-table-column label="角色" prop="role_name"></el-table-column>
        <el-table-column label="状态">
          <!-- 运用作用域插槽，直接获取此行的数据，根据数据渲染 -->
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.mg_state"
              @change="userscopechange(scope.row)"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="changedia(scope.row.id)"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="deleteform(scope.row.id)"
            ></el-button>
            <el-tooltip
              class="item"
              effect="light"
              content="设置角色"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="warning"
                icon="el-icon-s-tools"
                size="mini"
                @click="setusers(scope.row)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pagenum"
        :page-sizes="[1, 2, 5, 8]"
        :page-size="params.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!-- 添加用户弹框 -->
    <el-dialog
      title="添加用户"
      :visible.sync="dialogVisible"
      width="30%"
      @close="addformclose"
    >
      <el-form
        ref="addform"
        :model="addform"
        label-width="80px"
        :rules="addrules"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addform.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addform.password" type="password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addform.email"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="mobile">
          <el-input v-model="addform.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 添加删除弹框 -->
    <el-dialog :visible.sync="changedialog" width="50%" @close="reseteditform">
      <el-form
        ref="editform"
        :model="editform"
        label-width="80px"
        :rules="addrules"
      >
        <el-form-item label="用户名">
          <el-input v-model="editform.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editform.email"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="mobile">
          <el-input v-model="editform.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="changedialog = false">取 消</el-button>
        <el-button type="primary" @click="changedit">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 设置用户角色弹框 -->
    <el-dialog
      :visible.sync="isuserrole"
      width="30%"
      @close="resetuserrole"
      title="分配角色"
    >
      <div>
        <p>当前的用户:{{ momentuser }}</p>
        <p>当前的角色:{{ momentrole }}</p>
        <p>
          分配新角色:
          <el-select v-model="nowrole" placeholder="请选择">
            <el-option
              v-for="item in rolelist"
              :key="item.id"
              :value="item.id"
              :label="item.roleName"
            ></el-option>
          </el-select>
        </p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="changedialog = false">取 消</el-button>
        <el-button type="primary" @click="changuserrole">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  components: {},
  props: {},
  data() {
    var email = (rules, value, callback) => {
      var exp = /^[a-zA-Z0-9]+@\w+\.com$/;
      if (!exp.test(value)) {
        callback(new Error("请输入正确的邮箱"));
      } else {
        callback();
      }
    };
    var tel = (rules, value, callback) => {
      var exp = /^1[3|5|6|7|8|9][0-9]\d{8}$/;
      if (!exp.test(value)) {
        callback(new Error("请输入正确的电话"));
      } else {
        callback();
      }
    };
    return {
      params: {
        query: "",
        pagesize: 2,
        pagenum: 1,
      },
      userlist: [],
      pagenum: 1,
      total: 0,
      // 添加用户弹框
      dialogVisible: false,
      // 修改用户弹框
      changedialog: false,
      // 填写的数据
      addform: {
        username: "",
        password: "",
        email: "",
        mobile: "",
      },

      // 添加用户校验规则
      addrules: {
        username: [
          { required: true, message: "请填写用户名", trigger: "blur" },
          {
            min: 3,
            max: 8,
            message: "用户名在3到10个字符之间",
            trigger: "blur",
          },
        ],
        password: [
          { required: true, message: "请填写密码", trigger: "blur" },
          {
            min: 6,
            max: 15,
            message: "密码由6到15个字符组成",
            trigger: "blur",
          },
        ],
        email: [
          { required: true, message: "请填写邮箱", trigger: "blur" },
          { validator: email, trigger: "blur" },
        ],
        mobile: [
          { required: true, message: "请填写电话", trigger: "blur" },
          { validator: tel, trigger: "blur" },
        ],
      },
      editform: {},
      // 分配角色弹框是否显示
      isuserrole: false,
      // 分配角色使用的用户名
      momentuser: "",
      // 分配角色使用的角色
      momentrole: "",
      // 设置角色是使用的id
      momentid: 0,
      // 选择角色下拉框绑定至
      rolelist: [],
      // 被选中的角色id
      nowrole: "",
    };
  },
  // 页面创建成功调用请求
  created() {
    this.getuserlist();
  },
  methods: {
    // 掉用户数据
    async getuserlist() {
      var { data: res } = await this.$http.get("users", {
        params: this.params,
      });
      if (res.meta.status != 200) return this.$message.error(res.meta.msg);
      this.userlist = res.data.users;
      this.total = res.data.total;
    },
    // 更改用户状态
    async userscopechange(userscope) {
      var { data: res } = await this.$http.put(
        `users/${userscope.id}/state/${userscope.mg_state}`
      );
      if (res.meta.status != 200) {
        userscope.mg_state = !userscope.mg_state;
        return this.$message.error(res.meta.msg);
      }
      this.$message.success("修改状态成功");
    },
    // 当前显示没页几条
    handleSizeChange(pagesize) {
      this.params.pagesize = pagesize;
      this.getuserlist();
    },
    // 当前页数
    handleCurrentChange(pagenum) {
      this.params.pagenum = pagenum;
      this.getuserlist();
    },
    // 添加用户弹框关闭时
    addformclose() {
      this.$refs.addform.resetFields();
    },
    // 添加用户
    addUser() {
      this.$refs.addform.validate(async (vali) => {
        if (!vali) return;
        const { data: res } = await this.$http.post("users", {
          username: this.addform.username,
          password: this.addform.password,
          email: this.addform.email,
          mobile: this.addform.mobile,
        });
        if (res.meta.status != 201) return this.$message.error("添加失败");
        this.$message.success("添加用户成功");
        this.dialogVisible = false;
        this.getuserlist();
      });
    },
    async changedia(id) {
      this.changedialog = true;
      const { data: res } = await this.$http.get("users/" + id);
      if (res.meta.status != 200) return this.$message.error("获取数据失败");
      this.editform = res.data;
    },
    reseteditform() {
      this.$refs.editform.resetFields();
    },
    // 修改用户信息
    async changedit() {
      const { data: res } = await this.$http.put("users/" + this.editform.id, {
        email: this.editform.email,
        mobile: this.editform.mobile,
      });
      if (res.meta.status != 200) return this.$message.error("修改失败");
      this.$message.success("更新用户信息成功");
      this.changedialog = false;
    },
    // 删除用户
    async deleteform(id) {
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
      const { data: r } = await this.$http.delete("users/" + id);
      if (r.meta.status != 200) return this.$message.error("删除用户失败");
      this.$message.success("删除用户成功");
      this.getuserlist();
    },
    // 设置用户角色
    async setusers(user) {
      this.isuserrole = true;
      this.momentuser = user.username;
      this.momentrole = user.role_name;
      this.momentid = user.id;
      const { data: res } = await this.$http.get("roles");
      if (res.meta.status != 200)
        return this.$message.error("获取角色列表失败");
      this.rolelist = res.data;
    },
    // 关闭弹框已选择的值清空
    resetuserrole() {
      this.nowrole = "";
    },
    async changuserrole() {
      const { data: res } = await this.$http.put(
        `users/${this.momentid}/role`,
        {
          rid: this.nowrole,
        }
      );
      // console.log(res);
      if (res.meta.status != 200) return this.$message.error("设置角色失败");
      this.$message.success("设置角色成功");
      this.getuserlist();
      this.isuserrole = false;
    },
  },
};
</script>
<style lang="less" scoped>
.el-breadcrumb {
  margin-bottom: 15px;
}
</style>