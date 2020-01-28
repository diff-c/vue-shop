<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片区域 -->
    <el-card>
      <!-- 一行 -->
      <el-row :gutter="20">
        <!-- 搜索框 -->
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getGoodsList">
            <el-button slot="append" icon="el-icon-search" @click="getGoodsList"></el-button>
          </el-input>
        </el-col>
        <!-- 点击按钮 -->
        <el-col :span="4">
          <el-button type="primary" @click="addGoods">添加商品</el-button>
        </el-col>
      </el-row>

      <!-- table表格区域 -->
      <el-table size="medium" :data="goodsList" stripe border>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="goods_name" label="商品名称"></el-table-column>
        <el-table-column prop="goods_price" label="商品价格(元)" width="95px"></el-table-column>
        <el-table-column prop="goods_weight" label="商品重量" width="70px"></el-table-column>
        <el-table-column prop="add_time" label="创建时间" width="155px">
          <template v-slot="scope">
            {{scope.row.add_time | dateFormat}}
          </template>
        </el-table-column>
        <el-table-column prop="" label="操作" width="130px">
          <template v-slot="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeGoods(scope.row.goods_id)">
            </el-button>
          </template>
        </el-table-column>

      </el-table>

      <!-- 分页区域 -->
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum" :page-sizes="[5, 10, 20, 30]" :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper" :total="total" background>
      </el-pagination>
    </el-card>

  </div>
</template>

<script>
export default {
  data() {
    return {
      //商品列表数据
      goodsList: [],
      //查询参数对象
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      total: 0
    }
  },
  methods: {
    //获取商品列表数据
    async  getGoodsList() {
      //发送网络请求获取商品列表数据
      const { data: res } = await this.$http.get('goods', { params: this.queryInfo })

      if (res.meta.status !== 200) {
        return this.$message.error('获取商品列表失败')
      }
      console.log(res)
      this.goodsList = res.data.goods;
      this.total = res.data.total
    },
    //当每页显示的数量改变
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      //重新调用获取商品列表的方法
      this.getGoodsList()
    },
    //当页码改变
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      //重新调用获取商品列表的方法
      this.getGoodsList()
    },
    //删除某一行商品
    async removeGoods(goodsId) {
      const confirmResult = await this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      console.log(confirmResult)
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除')
      }
      const { data: res } = await this.$http.delete(`goods/${goodsId}`)

      if (res.meta.status !== 200) {
        return this.$message.error('删除商品失败')
      }
      this.$message.success('删除商品成功')

      //重新调用获取商品列表的方法
      this.getGoodsList();
    },
    //单击添加商品按钮
    addGoods() {
      this.$router.push('/goods/add')
    }
  },
  created() {
    this.getGoodsList()
  }
}
</script>

<style scoped>
.el-card {
  margin-top: 15px;
}
.el-row {
  margin-bottom: 15px;
}
.el-pagination {
  margin-top: 15px;
}
</style>