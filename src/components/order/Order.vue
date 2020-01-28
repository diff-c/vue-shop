<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片区域 -->
    <el-card>
      <!-- 一行 -->
      <el-row :gutter="20">
        <!-- 搜索框 -->
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable>
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
      </el-row>

      <!-- table表格区域 -->
      <el-table size="medium" :data="orderList" stripe border>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="order_number" label="订单编号"></el-table-column>
        <el-table-column prop="order_price" label="订单价格" width="95px"></el-table-column>
        <el-table-column prop="pay_status" label="是否付款" width="70px">
          <template v-slot="scope">
            <el-tag v-if="scope.row.pay_status === '1'">已付款</el-tag>
            <el-tag v-else type="danger">未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="is_send" label="是否发货" width="155px">

        </el-table-column>
        <el-table-column label="下单时间" width="160px" prop="create_time">
          <template v-slot="scope">
            {{scope.row.create_time | dateFormat}}
          </template>
        </el-table-column>

        <el-table-column label="操作" width="130px">
          <template v-slot="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="showBox"></el-button>
            <el-button type="success" icon="el-icon-location" size="mini" @click="showProgressBox">
            </el-button>
          </template>
        </el-table-column>

      </el-table>

      <!-- 分页区域 -->
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum" :page-sizes="[5, 10, 15]" :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper" :total="total" background>
      </el-pagination>
    </el-card>

    <!-- 修改地址的对话框 -->
    <el-dialog title="修改地址" :visible.sync="addressVisible" width="50%">
      <el-form :model="addressForm" :rules="addressFormRules" ref="addressFormRef" label-width="100px"
        class="demo-ruleForm">
        <el-form-item label="省市区/县" prop="address1">
          <el-cascader v-model="addressForm.address1" :options="cityData" :props="{ expandTrigger: 'hover' }">
          </el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="address2">
          <el-input v-model="addressForm.address2"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addressVisible = false">取 消</el-button>
        <el-button type="primary" @click="addressVisible = false">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 展示物流的对话框 -->
    <el-dialog title="查看物流进度" :visible.sync="progressVisible" width="50%">
      <!-- 时间线 -->
      <el-timeline>
        <el-timeline-item v-for="(activity, index) in progressInfo" :key="index" :timestamp="activity.ftime">
          {{activity.context}}
        </el-timeline-item>
      </el-timeline>
    </el-dialog>

  </div>
</template>

<script>
import cityData from './citydata'
export default {
  data() {
    return {
      //查询对象
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      //订单数据列表
      orderList: [],
      //总页数
      total: 0,
      addressVisible: false,
      addressForm: {
        address1: [],
        address2: ''
      },
      //配置修改地址的验证规则
      addressFormRules: {
        address1: [{ required: true, message: '请选择省市区县', trigger: 'blur' }],
        address2: [{ required: true, message: '请填写详细地址', trigger: 'blur' }]
      },
      cityData,
      //控制物流对话框显示与隐藏
      progressVisible: false,
      progressInfo: []

    }
  },
  methods: {
    //获取订单数据类表
    async  getOrderList() {
      const { data: res } = await this.$http.get('orders', { params: this.queryInfo })

      if (res.meta.status !== 200) {
        return this.$message.error('获取订单数据失败')
      }
      this.$message.success('获取订单数据成功')
      console.log(res)

      this.orderList = res.data.goods

      this.total = res.data.total
    },
    //每页显示条数改变
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getOrderList()
    },
    //页码改变
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getOrderList()
    },
    //展示修改地址对话框
    showBox() {
      this.addressVisible = true
    },
    async showProgressBox() {
      const { data: res } = await this.$http.get('/kuaidi/1106975712662')

      if (res.meta.status !== 200) {
        return this.$message.error('获取物流进度失败')
      }
      this.progressInfo = res.data

      console.log(this.progressInfo)
      this.progressVisible = true
    }

  },
  created() {
    this.getOrderList()
  },
}
</script>

<style scoped>
.el-card {
  margin-top: 15px;
}
.el-table {
  margin: 15px 0;
}
.el-cascader {
  width: 100%;
}
</style>