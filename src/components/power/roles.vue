<template>
  <div>
    <!-- 面包屑组件 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <!-- 点击弹框 -->
      <el-button type="primary" @click="isaddRoles = true">添加用户</el-button>
      <el-table :data="rolesList" border stripe>
        <el-table-column type="expand">
          <!-- 使用作用域插槽 -->
          <template slot-scope="scope">
            <el-row
              v-for="(item1, i1) in scope.row.children"
              :key="item1.id"
              :class="['borderb', 'flex', i1 == 0 ? 'bordert' : '']"
            >
              <el-col :span="4">
                <el-row>
                  <el-tag closable @close="deleteRight(scope.row, item1.id)">{{
                    item1.authName
                  }}</el-tag>
                  <i class="el-icon-caret-right"></i>
                </el-row>
              </el-col>
              <el-col :span="20">
                <el-row
                  v-for="item2 in item1.children"
                  :key="item2.id"
                  class="flex"
                >
                  <el-col :span="6">
                    <el-row>
                      <el-tag
                        type="success"
                        closable
                        @close="deleteRight(scope.row, item2.id)"
                        >{{ item2.authName }}</el-tag
                      >
                      <i class="el-icon-caret-right"></i>
                    </el-row>
                  </el-col>
                  <el-col :span="18">
                    <el-row>
                      <el-tag
                        v-for="item3 in item2.children"
                        :key="item3.id"
                        type="warning"
                        closable
                        @close="deleteRight(scope.row, item3.id)"
                      >
                        {{ item3.authName }}
                      </el-tag>
                    </el-row>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="editRoles(scope.row.id)"
              >编辑</el-button
            >
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="deleteRoles(scope.row.id)"
              >删除</el-button
            >
            <el-button
              type="warning"
              icon="el-icon-s-tools"
              size="mini"
              @click="allocationrole(scope.row)"
              >分配权限</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 修改角色弹框 -->
    <el-dialog
      title="提示"
      :visible.sync="iseditRoles"
      width="30%"
      @close="reseteditrole"
    >
      <el-form
        ref="editrolesref"
        :model="editroles"
        :rules="editrolerules"
        label-width="80px"
      >
        <el-form-item label="角色ID">
          <el-input v-model="editroles.roleId" disabled></el-input>
        </el-form-item>
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editroles.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="editroles.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="iseditRoles = false">取 消</el-button>
        <el-button type="primary" @click="changeRoles">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 添加用户弹框 -->
    <el-dialog
      title="添加角色"
      :visible.sync="isaddRoles"
      width="30%"
      @close="resetrole"
    >
      <el-form
        ref="addrolesref"
        :model="addroles"
        :rules="editrolerules"
        label-width="80px"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addroles.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="addroles.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isaddRoles = false">取 消</el-button>
        <el-button type="primary" @click="addRoles()">添加</el-button>
      </span>
    </el-dialog>
    <el-dialog title="添加角色" :visible.sync="isallocationroles" width="30%">
      <el-tree
        ref="tree"
        :data="allroles"
        :props="defaultProps"
        :default-checked-keys="defaultroles"
        default-expand-all
        show-checkbox
        node-key="id"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isaddRoles = false">取 消</el-button>
        <el-button type="primary" @click="setrole(momentid)">添加</el-button>
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
      // 角色信息
      rolesList: [],
      iseditRoles: false,
      // 修改角色信息
      editroles: {},
      editrolerules: {
        roleName: [
          { required: true, message: "请输入角色名", trigger: "blur" },
          {
            min: 1,
            max: 8,
            message: "角色名由1到8个字符，数字，字母组合而成",
            trigger: "blur",
          },
        ],
      },
      // 添加用户弹框是否显示
      isaddRoles: false,
      // 添加角色的数据
      addroles: {},
      // 分配权限弹框是否开启
      isallocationroles: false,
      allroles: [],
      defaultProps: {
        label: "authName",
        children: "children",
      },
      defaultroles: [],
      // 设置权限时需要的id值
      momentid: "",
    };
  },
  // 页面创建好久请求数据
  created() {
    this.getroleslist();
  },
  methods: {
    // 获取权限数据
    async getroleslist() {
      const { data: res } = await this.$http.get("roles");
      if (res.meta.status != 200)
        return this.$message.Error("获取角色数据失败");
      this.rolesList = res.data;
      // console.log(res.data);
    },
    // 点击修改先打开弹框，在获取原来的数据
    async editRoles(id) {
      this.iseditRoles = true;
      const { data: res } = await this.$http.get("roles/" + id);
      if (res.meta.status != 200)
        return this.$message.error("获取角色数据失败");
      this.editroles = res.data;
      // console.log(res);
    },
    // 发送请求更改角色数据
    changeRoles() {
      this.$refs.editrolesref.validate(async (vali) => {
        if (!vali) return;
        const { data: res } = await this.$http.put(
          "roles/" + this.editroles.roleId,
          {
            roleName: this.editroles.roleName,
            roleDesc: this.editroles.roleDesc,
          }
        );
        if (res.meta.status != 200) return this.$message.error("修改角色失败");
        this.$message.success("修改角色成功");
        this.iseditRoles = false;
        this.getroleslist();
      });
    },
    async deleteRoles(id) {
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
      const { data: r } = await this.$http.delete("roles/" + id);
      console.log(r);
      if (r.meta.status != 200) return this.$message.error("删除角色失败");
      this.$message.success("删除角色成功");
      this.getroleslist();
    },
    // 添加用户
    addRoles() {
      this.$refs.addrolesref.validate(async (vali) => {
        if (!vali) return;
        const { data: res } = await this.$http.post("roles", {
          roleName: this.addroles.roleName,
          roleDesc: this.addroles.roleDesc,
        });
        if (res.meta.status != 200) return this.$message.error("添加角色失败");
        this.addroles = res.data;
        this.isaddRoles = false;
        this.$message.success("添加角色成功");
        this.getroleslist();
      });
    },
    resetrole() {
      this.$refs.addrolesref.resetFields();
    },
    reseteditrole() {
      this.$refs.editrolesref.resetFields();
    },
    async deleteRight(roleid, rightid) {
      const res = await this.$confirm(
        "此操作不可逆，您真的要删除吗？",
        "确认删除",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
          centre: true,
        }
      ).catch((res) => res);
      if (res != "confirm") return this.$message.info("取消删除成功");
      const { data: r } = await this.$http.delete(
        `roles/${roleid.id}/rights/${rightid}`
      );
      console.log(r);
      if (r.meta.status != 200) return this.$message.error("删除权限失败");
      roleid.children = r.data;
      this.$message.success("删除权限成功");
    },
    async allocationrole(role) {
      this.momentid = role.id;
      // 点击分配权限按钮时先获取所有权限
      const { data: res } = await this.$http.get("rights/tree");
      console.log(res);
      if (res.meta.status != 200)
        return this.$message.error("权限列表获取失败");
      this.allroles = res.data;
      // 每次递归时，先清空原默认数组
      this.defaultroles = [];
      // 递归获取默认权限
      this.defaultcheck(this.defaultroles, role);
      // 打开弹框
      this.isallocationroles = true;
    },
    // 递归函数获取默认权限
    defaultcheck(arr, node) {
      if (!node.children) {
        return arr.push(node.id);
      }
      node.children.forEach((item) => {
        this.defaultcheck(arr, item);
      });
    },
    async setrole(id) {
      var keys = [
        ...this.$refs.tree.getHalfCheckedKeys(),
        ...this.$refs.tree.getCheckedKeys(),
      ];
      keys = keys.join(",");
      const { data: res } = await this.$http.post("roles/" + id + "/rights", {
        rids: keys,
      });
      if (res.meta.status != 200) return this.$message.error("设置权限失败");
      this.$message.success("设置权限成功");
      this.isallocationroles = false;
    },
  },
};
</script>

<style lang='less' scoped>
.el-tag {
  margin: 10px;
}
.bordert {
  border-top: 1px solid #ddd;
}
.borderb {
  border-bottom: 1px solid #ddd;
}
.flex {
  display: flex;
  align-items: center;
}
</style>