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
      <el-row :gutter="30">
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            v-model="params.query"
            clearable
            @clear="searchshop"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="searchshop"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="3">
          <el-button type="primary" @click="$router.push('/goods/add')"
            >添加商品</el-button
          >
        </el-col>
      </el-row>
      <el-table :data="shoplist" stripe border>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="商品名称" prop="goods_name"></el-table-column>
        <el-table-column
          label="商品价格"
          prop="goods_price"
          width="100"
        ></el-table-column>
        <el-table-column
          label="商品重量"
          prop="goods_weight"
          width="100"
        ></el-table-column>
        <el-table-column label="创建时间" width="200">
          <template slot-scope="scope">
            {{ scope.row.add_time | dateformat }}
          </template></el-table-column
        >
        <el-table-column label="操作" width="200">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-edit"
              @click="editshop(scope.row)"
            ></el-button>
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              @click="deleteshop(scope.row)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="changesize"
        @current-change="changenum"
        :current-page="params.pagenum - 0"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="params.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!-- 编辑商品 -->
    <el-dialog title="编辑商品" :visible.sync="iseditshop" width="30%">
      <el-form
        ref="editshopformref"
        :model="editdata"
        :rules="editshopformrules"
      >
        <el-form-item label="商品名称" prop="goods_name">
          <el-input v-model="editdata.goods_name"></el-input>
        </el-form-item>
        <el-form-item label="商品价格" prop="goods_price">
          <el-input v-model="editdata.goods_price" type="number"></el-input>
        </el-form-item>
        <el-form-item label="商品数量" prop="goods_number">
          <el-input v-model="editdata.goods_number" type="number"></el-input>
        </el-form-item>
        <el-form-item label="商品重量" prop="goods_weight">
          <el-input v-model="editdata.goods_weight" type="number"></el-input>
        </el-form-item>
        <el-form-item label="商品介绍" prop="goods_introduce">
          <el-input v-model="editdata.goods_introduce"></el-input>
        </el-form-item>
        <el-form-item label="商品图片">
          <el-upload
            :action="baseurls"
            list-type="picture-card"
            :headers="header"
            :on-success="changefile"
          >
            <i slot="default" class="el-icon-plus"></i>
            <div
              slot="file"
              v-for="(item, i) in editdata.pics"
              :key="i"
              style="height: 100%"
            >
              <img :src="item.pics" style="width: 100%; height: 100%" />
              <span class="el-upload-list__item-actions">
                <span
                  v-if="!disabled"
                  class="el-upload-list__item-delete"
                  @click="handleRemove(file)"
                >
                  <i class="el-icon-delete"></i>
                </span>
              </span>
            </div>
          </el-upload>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="iseditshop = false">取 消</el-button>
        <el-button type="primary" @click="editshopdata">确 定</el-button>
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
      searchval: "",
      // 调用接口需要的参数
      params: {
        query: "",
        pagenum: 1,
        pagesize: 10,
      },
      //   总条数
      total: 0,
      // 请求回来显示的商品数据
      shoplist: [],
      iseditshop: false,
      editdata: [],
      baseurls: "http://127.0.0.1:8888/api/private/v1/upload",
      header: {
        Authorization: sessionStorage.getItem("token"),
      },
      editshopformrules: {
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
      disabled: false,
      image: "",
    };
  },
  created() {
    this.getshoplist();
  },
  methods: {
    async getshoplist() {
      const { data: res } = await this.$http.get("goods", {
        params: this.params,
      });
      if (res.meta.status != 200)
        return this.$message.error("获取商品列表失败");
      //   this.$message.success("获取商品列表成功");
      this.shoplist = res.data.goods;
      this.total = res.data.total;
      this.params.pagenum = res.data.pagenum;
    },

    // 改变页面条数触发
    changesize(size) {
      this.params.pagesize = size;
      this.getshoplist();
    },
    // 改变当前页时触发
    changenum(num) {
      this.params.pagenum = num;
      this.getshoplist();
    },
    // 搜索商品
    searchshop() {
      this.getshoplist();
    },
    // 删除尚品
    async deleteshop(scope) {
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
      const { data: r } = await this.$http.delete(`goods/${scope.goods_id}`);
      console.log(r);
      if (r.meta.status != 200) return this.$message.error("删除商品失败");
      this.$message.success("删除商品成功");
      this.getshoplist();
    },
    handleRemove(file) {
      console.log(file);
    },
    async editshop(scope) {
      console.log(scope);
      const { data: res } = await this.$http.get(`goods/${scope.goods_id}`);
      console.log(res);
      if (res.meta.status != 200)
        return this.$message.error("获取商品数据失败");
      this.editdata = res.data;
      this.iseditshop = true;
    },
    changefile(file) {
      console.log(file);
      this.editdata.pics.push({ pics: file.data.url });
    },
    editshopdata() {
      this.$refs.editshopformref.validate(async (vali) => {
        if (!vali) return;
        console.log(this.editdata);
        var attr = [];
        var attrss = this.editdata.attrs;
        attrss.forEach((item) => {
          var att = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals,
          };
          attr.push(att);
        });
        const { data: res } = await this.$http.put(
          `goods/${this.editdata.goods_id}`,
          {
            goods_name: this.editdata.goods_name,
            goods_price: this.editdata.goods_price,
            goods_number: this.editdata.goods_number,
            goods_weight: this.editdata.goods_weight,
            goods_cat: this.editdata.goods_cat,
            goods_introduce: this.editdata.goods_introduce,
            pics: this.editdata.pics,
            attrs: attr,
          }
        );
        console.log(res);
        if (res.meta.status != 200) return this.$message.error("商品编辑失败");
        this.$message.success("商品编辑成功");
        this.getshoplist();
        this.iseditshop = false;
      });
    },
  },
};
</script>
<style lang='less' scoped>
</style>