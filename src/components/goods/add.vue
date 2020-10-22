<template>
  <div>
    <!-- 面包屑组件 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片组件 -->
    <el-card>
      <!-- 警告条 -->
      <el-alert title="添加商品信息" type="info" center show-icon="">
      </el-alert>
      <!-- 进度条 -->
      <el-steps
        :space="200"
        :active="activeName - 0"
        finish-status="success"
        align-center
      >
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>

      <el-form
        :model="addshopform"
        :rules="addshopformrules"
        ref="addshopformref"
        label-width="100px"
        label-position="top"
      >
        <!-- tab切换 -->
        <el-tabs
          tab-position="left"
          v-model="activeName"
          :before-leave="beforetableave"
          @tab-click="clicktab"
        >
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addshopform.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input
                v-model="addshopform.goods_price"
                type="number"
              ></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input
                v-model="addshopform.goods_weight"
                type="number"
              ></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input
                v-model="addshopform.goods_number"
                type="number"
              ></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader
                v-model="addshopform.goods_cat"
                :options="catelist"
                :props="{
                  expandTrigger: 'hover',
                  value: 'cat_id',
                  label: 'cat_name',
                  children: 'children',
                }"
                @change="changecat"
                clearable
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <el-form-item
              v-for="item in manydata"
              :key="item.id"
              :label="item.attr_name"
            >
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox
                  :label="i"
                  border
                  v-for="(i, idx) in item.attr_vals"
                  :key="idx"
                ></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item
              v-for="item in onlydata"
              :key="item.id"
              :label="item.attr_name"
            >
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <el-upload
              :on-success="upload"
              :action="baseurls"
              :on-preview="handlePreview"
              list-type="picture"
              :headers="header"
            >
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <quill-editor
              v-model="addshopform.goods_introduce"
              style="height: 500px; margin-bottom: 15vh"
            ></quill-editor>
            <el-button type="primary" @click="add">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
    <!-- 图片预览 -->
    <el-dialog title="图片预览" :visible.sync="isupload" width="50%">
      <img :src="url" alt="" />
    </el-dialog>
  </div>
</template>

<script>
export default {
  components: {},
  props: {},
  data() {
    return {
      activeName: 0,
      addshopform: {
        goods_name: "",
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        goods_cat: [],
        pics: [],
        goods_introduce: "",
        attrs: [],
      },
      addshopformrules: {
        goods_name: [
          { required: true, message: "请输入商品名称", trigger: "blur" },
        ],
        goods_price: [
          { required: true, message: "请输入商品价格", trigger: "blur" },
        ],
        goods_weight: [
          { required: true, message: "请输入商品重量", trigger: "blur" },
        ],
        goods_number: [
          { required: true, message: "请输入商品数量", trigger: "blur" },
        ],
        goods_cat: [
          { required: true, message: "请选择商品分类", trigger: "blur" },
        ],
      },
      catelist: [],
      manydata: [],
      onlydata: [],
      checkList: [],
      baseurls: "http://127.0.0.1:8888/api/private/v1/upload",
      header: {
        Authorization: sessionStorage.getItem("token"),
      },
      url: "",
      isupload: false,
    };
  },
  created() {
    this.getcatelist();
  },
  methods: {
    async getcatelist() {
      const { data: res } = await this.$http.get("categories");
      console.log(res);
      if (res.meta.status != 200) return this.$message.error("获取分类失败");
      this.catelist = res.data;
    },
    changecat() {},
    beforetableave(newtab, oldtab) {
      if (newtab != 0 && this.addshopform.goods_cat == 0) {
        this.$message.error("请选择商品分类");
        return false;
      }
    },
    async clicktab(tab) {
      if (this.addshopform.goods_cat.length == 0) return;
      if (tab.name == 1) {
        const { data: res } = await this.$http.get(
          `categories/${this.getid}/attributes`,
          {
            params: { sel: "many" },
          }
        );
        if (res.meta.status != 200)
          return this.$message.error("获取动态参数错误");
        console.log(res);
        res.data.forEach((item) => {
          item.attr_vals = item.attr_vals.split(",");
        });
        this.manydata = res.data;
        // console.log(this.manydata);
      } else if (tab.name == 2) {
        const { data: res } = await this.$http.get(
          `categories/${this.getid}/attributes`,
          {
            params: { sel: "only" },
          }
        );
        if (res.meta.status != 200)
          return this.$message.error("获取静态属性错误");
        // res.data.forEach((item) => {
        //   item.attr_vals = item.attr_vals.split(",");
        // });
        this.onlydata = res.data;
      }
    },
    upload(file) {
      this.addshopform.pics.push(file.data.tmp_path);
      console.log(this.addshopform.pics);
    },
    // 点击图片是触发
    handlePreview(file) {
      console.log(file);
      this.url = file.response.data.url;
      this.isupload = true;
    },
    add() {
      this.$refs.addshopformref.validate(async (vali) => {
        if (!vali) return this.$message.error("请填写商品必填项");
        var goods_cat = this.addshopform.goods_cat;
        this.addshopform.goods_cat = goods_cat.join(",");
        this.manydata.forEach((item) => {
          var newdata = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals.join(","),
          };

          this.addshopform.attrs.push(newdata);
        });
        this.onlydata.forEach((item) => {
          var newdata = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals,
          };

          this.addshopform.attrs.push(newdata);
        });
        const { data: res } = await this.$http.post("goods", this.addshopform);
        console.log(res);
        if (res.meta.status != 201) return this.$message.error("添加商品失败");
        this.$message.success("添加商品成功");
        this.$router.push("/goods");
      });
    },
  },
  computed: {
    getid() {
      return this.addshopform.goods_cat[this.addshopform.goods_cat.length - 1];
    },
  },
};
</script>
<style lang='less' scoped>
.el-checkbox {
  margin: 10px 10px 10px 0 !important;
}
.el-dialog {
  img {
    width: 100%;
  }
}
</style>