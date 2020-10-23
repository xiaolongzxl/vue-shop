<template>
  <div>
    <!-- 面包屑组件 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片组件 -->
    <el-card>
      <el-row>
        <el-col :span="8 - 0">
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
      </el-row>
      <el-table :data="orderdata" stripe border>
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column label="订单编号" prop="order_number"></el-table-column>
        <el-table-column label="订单价格" prop="order_price"></el-table-column>
        <el-table-column label="是否付款">
          <template slot-scope="scope">
            <el-tag type="danger" v-if="scope.row.pay_status == 0"
              >未付款</el-tag
            >
            <el-tag type="success" v-else>已付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="是否发货" prop="is_send"></el-table-column>
        <el-table-column label="下单时间">
          <template slot-scope="scope">
            {{ scope.row.create_time | dateformat }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-edit"
              @click="editorder(scope)"
            ></el-button>
            <el-button
              size="mini"
              type="success"
              icon="el-icon-location"
              @click="getorder"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="params.pagenum - 0"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="params.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!-- 编辑物流 -->
    <el-dialog
      title="修改地址"
      :visible.sync="iseditorder"
      width="30%"
      @close="resetdialog"
    >
      <el-form ref="editformref" :rules="editformref" :model="editform">
        <el-form-item label="请选择省/市/区" prop="city">
          <el-cascader
            :options="citydata"
            v-model="editform.city"
            :props="{ expandTrigger: 'hover' }"
            clearable
          ></el-cascader>
        </el-form-item>
        <el-form-item label="请填写详细地址" prop="address">
          <el-input v-model="editform.address"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="iseditorder = false">取 消</el-button>
        <el-button type="primary" @click="iseditorder = false">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 物流 -->
    <el-dialog title="物流信息" :visible.sync="isorder" width="30%">
    </el-dialog>
  </div>
</template>
<script>
import citydata from "@/components/order/citydata.js";
export default {
  components: {},
  props: {},
  data() {
    return {
      // 调用接口需要的参数
      params: {
        query: "",
        pagenum: 1,
        pagesize: 10,
      },
      //   总条数
      total: 0,
      orderdata: [],
      iseditorder: false,
      city: [],
      citydata,
      editform: {
        city: [],
        address: "",
      },
      editformref: {
        city: {
          required: true,
          message: "请选择省/市/区",
          trigger: "blur",
        },
        address: {
          required: true,
          message: "请填写详细地址",
          trigger: "blur",
        },
      },
      isorder: false,
      order: [],
    };
  },
  created() {
    this.getorder();
  },
  methods: {
    searchshop() {},
    async getorder() {
      const { data: res } = await this.$http.get("orders", {
        params: this.params,
      });
      console.log(res);
      if (res.meta.status != 200)
        return this.$message.error("获取订单数据失败");
      this.total = res.data.total;
      this.orderdata = res.data.goods;
    },
    handleSizeChange(size) {
      this.params.pagesize = size;
      this.getorder();
    },
    handleCurrentChange(page) {
      this.params.pagenum = page;
      this.getorder();
    },
    editorder(scope) {
      this.iseditorder = true;
    },
    resetdialog() {
      this.$refs.editformref.resetFields();
    },
    // async getorder() {
    //   const { data: res } = await this.$http.get("/kuaidi/" + 1106975712662);
    //   console.log(res);
    //   if (res.meta.status != 200)
    //     return this.$message.error("获取物流信息失败");
    //   this.order = res.data;
    // },
  },
};
</script>
<style lang='less' scoped>
</style>