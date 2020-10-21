<template>
  <div>
    <!-- 面包屑组件 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-alert
        :closable="false"
        show-icon
        title="注意：只允许为第三级分类设置相关参数"
        type="warning"
      >
      </el-alert>
      <el-row>
        <el-col :span="3">
          <span>选择商品分类:</span>
        </el-col>
        <el-col :span="5">
          <el-cascader
            v-model="selectcate"
            :options="categoles"
            :props="{
              expandTrigger: 'hover',
              value: 'cat_id',
              label: 'cat_name',
              childrem: 'children',
            }"
            @change="handleChange"
            clearable
          ></el-cascader>
        </el-col>
      </el-row>
      <el-tabs v-model="activeTab" @tab-click="tabchange">
        <el-tab-pane label="动态参数" name="many">
          <el-button
            type="primary"
            size="mini"
            :disabled="isshow"
            @click="isadddialog = true"
            >添加参数</el-button
          >
          <el-table :data="manydata" stripe border>
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag
                  v-for="(tag, i) in scope.row.attr_vals"
                  class="tags"
                  :key="i"
                  closable
                  type="primary"
                  @close="handleClose(scope.row, tag)"
                >
                  {{ tag }}
                </el-tag>
                <el-input
                  class="taginput"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button v-else size="small" @click="showInput(scope.row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <el-table-column label="#" type="index"></el-table-column>
            <el-table-column
              label="参数名称"
              prop="attr_name"
            ></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="primary"
                  icon="el-icon-edit"
                  @click="showedit(scope.row)"
                  >操作</el-button
                >
                <el-button
                  size="mini"
                  type="danger"
                  icon="el-icon-delete"
                  @click="deldialog(scope.row)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only">
          <el-button
            type="primary"
            size="mini"
            :disabled="isshow"
            @click="isadddialog = true"
            >添加属性</el-button
          >
          <el-table :data="onlydata" stripe border>
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag
                  v-for="(tag, i) in scope.row.attr_vals"
                  class="tags"
                  :key="i"
                  closable
                  type="primary"
                  @close="handleClose(scope.row, tag)"
                >
                  {{ tag }}
                </el-tag>
                <el-input
                  class="taginput"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button v-else size="small" @click="showInput(scope.row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <el-table-column label="#" type="index"></el-table-column>
            <el-table-column
              label="属性名称"
              prop="attr_name"
            ></el-table-column>
            <el-table-column label="操作">
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <el-button
                    size="mini"
                    type="primary"
                    icon="el-icon-edit"
                    @click="showedit(scope.row)"
                    >操作</el-button
                  >
                  <el-button
                    size="mini"
                    type="danger"
                    icon="el-icon-delete"
                    @click="deldialog(scope.row)"
                    >删除</el-button
                  >
                </template>
              </el-table-column>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!-- 添加框 -->
    <el-dialog
      :title="'添加' + isdialogtitle"
      :visible.sync="isadddialog"
      width="30%"
      @close="resetdialog"
    >
      <el-form
        ref="addformref"
        :rules="addrules"
        :model="addfome"
        label-width="80px"
      >
        <el-form-item :label="isdialogtitle" prop="attr_name">
          <el-input v-model="addfome.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isadddialog = false">取 消</el-button>
        <el-button type="primary" @click="setadd">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑框 -->
    <el-dialog
      :title="'修改' + isdialogtitle"
      :visible.sync="iseditdialog"
      width="30%"
      @close="resetdialog"
    >
      <el-form
        ref="addformref"
        :rules="addrules"
        :model="editfome"
        label-width="80px"
      >
        <el-form-item :label="isdialogtitle" prop="attr_name">
          <el-input v-model="editfome.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="iseditdialog = false">取 消</el-button>
        <el-button type="primary" @click="setedit">确 定</el-button>
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
      categoles: [],
      selectcate: [],
      activeTab: "many",
      onlydata: [],
      manydata: [],
      momentid: 0,
      isadddialog: false,
      addfome: {},
      editfome: {},
      addrules: {
        attr_name: [{ required: true, message: "请输入名称", trigger: "blur" }],
      },
      iseditdialog: false,
    };
  },
  created() {
    this.getcategoles();
  },
  methods: {
    async getcategoles() {
      const { data: res } = await this.$http.get("categories");
      if (res.meta.status != 200)
        return this.$message.error("获取商品参数失败");
      this.categoles = res.data;
      console.log(res);
    },
    //   级联选择切换选择是
    async handleChange(id) {
      if (this.selectcate.length == 3) {
        const { data: res } = await this.$http.get(
          `categories/${this.selectcate[2]}/attributes/`,
          {
            params: { sel: this.activeTab },
          }
        );
        console.log(res);
        if (res.meta.status != 200) return this.$message.error("获取参数失败");
        res.data.forEach((item) => {
          item.attr_vals = item.attr_vals ? item.attr_vals.split(",") : [];
          item.attr_vals = item.attr_vals.join(" ");
          item.attr_vals = item.attr_vals.split(" ");
          item.inputVisible = false;
          item.inputValue = "";
        });
        this[this.activeTab + "data"] = res.data;
      }
    },
    tabchange() {
      this.handleChange();
    },
    // 显示input框
    showInput(scope) {
      console.log(scope);
      scope.inputVisible = true;
      this.$nextTick((_) => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    // 增加tag时
    async handleInputConfirm(scope) {
      scope.inputVisible = false;
      if (scope.inputValue.trim() == "") {
        return scope.inputValue == "";
      } else {
        // console.log(scope.attr_vals);
        scope.attr_vals.push(scope.inputValue);
        scope.inputValue = "";
        scope.inputVisible = false;
        const { data: res } = await this.$http.put(
          `categories/${scope.cat_id}/attributes/${scope.attr_id}`,
          {
            attr_name: scope.attr_name,
            attr_vals: scope.attr_vals.join(","),
            attr_sel: scope.attr_sel,
          }
        );
        console.log(res);
        scope = res.data;
        if (res.meta.status != 200) return this.$message.error("添加参数失败");
        this.$message.success("添加成功");
      }
    },
    async handleClose(scope, tag) {
      scope.attr_vals.splice(scope.attr_vals.indexOf(tag), 1);
      const { data: res } = await this.$http.put(
        `categories/${scope.cat_id}/attributes/${scope.attr_id}`,
        {
          attr_name: scope.attr_name,
          attr_vals: scope.attr_vals.join(","),
          attr_sel: scope.attr_sel,
        }
      );
      scope = res.data;
      if (res.meta.status != 200) return;
    },
    setadd() {
      this.$refs.addformref.validate(async (vali) => {
        if (!vali) return;
        const { data: res } = await this.$http.post(
          `categories/${this.selectcate[2]}/attributes`,
          {
            attr_name: this.addfome.attr_name,
            attr_sel: this.activeTab,
          }
        );
        console.log(res);
        if (res.meta.status != 201)
          return this.$message.error("添加" + this.isdialogtitle + "失败");
        this.$message.success("添加" + this.isdialogtitle + "成功");
        this.handleChange();
        this.isadddialog = false;
      });
    },
    resetdialog() {
      this.$refs.addformref.resetFields();
    },
    showedit(scope) {
      console.log(scope);
      this.editfome = scope;
      this.iseditdialog = true;
    },
    setedit() {
      this.$refs.addformref.validate(async (vali) => {
        if (!vali) return;
        const {
          data: res,
        } = await this.$http.put(
          `categories/${this.editfome.cat_id}/attributes/${this.editfome.attr_id}`,
          { attr_name: this.editfome.attr_name, attr_sel: this.activeTab }
        );
        console.log(res);
        if (res.meta.status != 200)
          return this.$message.error("修改" + this.isdialogtitle + "失败");
        this.$message.success("修改" + this.isdialogtitle + "成功");
        this.handleChange();
        this.iseditdialog = false;
      });
    },
    async deldialog(scope) {
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
      const { data: r } = await this.$http.delete(
        `categories/${scope.cat_id}/attributes/${scope.attr_id}`
      );
      console.log(r);
      if (r.meta.status != 200)
        return this.$message.error("删除" + this.isdialogtitle + "失败");
      this.$message.success("删除" + this.isdialogtitle + "成功");
      this.handleChange();
    },
  },
  computed: {
    isshow() {
      if (this.selectcate.length == 3) {
        return false;
      } else {
        return true;
      }
    },
    isdialogtitle() {
      if (this.activeTab == "only") {
        return "静态属性";
      }
      return "动态参数";
    },
  },
};
</script>
<style lang='less' scoped>
.el-row {
  display: flex;
  align-items: center;
}
.taginput {
  width: 5vw;
}
.tags {
  margin: 0 1vw;
}
</style>