<template>
  <div>

    <!-- 面包屑区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片区域 -->
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="addCategory">添加分类</el-button>
        </el-col>
      </el-row>

      <!-- 表格区域 -->
      <tree-table :data="goodsData" :columns="columns" :selection-type="false" :expand-type="false" show-index
        index-text="#" border class="treeTable">
        <!-- 是否有效 -->
        <template slot-scope="scope" slot="isok">
          <i class="el-icon-success" v-if="scope.row.cat_deleted === false" style="color:lightgreen;"></i>
          <i class="el-icon-success" v-else style="color:red;"></i>
        </template>
        <!-- 排序 -->
        <template slot-scope="scope" slot="order">
          <el-tag type="primary" size="mini" v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag type="success" size="mini" v-else-if="scope.row.cat_level === 1">二级</el-tag>
          <el-tag type="warning" size="mini" v-else>三级</el-tag>

        </template>

        <template slot-scope="scope" slot="opt">
          <el-button size="mini" type="primary" icon="el-icon-edit">编辑</el-button>
          <el-button size="mini" type="danger" icon="el-icon-delete">删除</el-button>

        </template>
      </tree-table>

      <!-- 分页区域 -->
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum" :page-sizes="[3,5,10,15]" :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </el-card>

    <!-- 添加分类的对话框 -->
    <el-dialog title="添加分类" :visible.sync="addCateVisible" width="50%" @close="closeCateDialog">
      <!-- 添加分类的表单 -->
      <el-form ref="addCateForm" :model="addCateForm" label-width="80px" :rules="addCateFormRules">
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类">
          <!-- 级联选择器 -->
          <el-cascader v-model="selected" :options="parentCateList" :props="parentProps" clearable
            @change="handleChange">
          </el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      //商品分类的数据列表
      goodsData: [],
      //查询条件
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      //总数据条数
      total: 0,
      //为table指定列的定义
      columns: [{
        label: '分类名称',
        prop: 'cat_name',
      }, {
        label: '是否有效',
        //表示，将当前列定义为模板列
        type: 'template',
        //表示当前这一列使用模板名称
        template: 'isok'
      }, {
        label: "排序",
        // prop: 'cat_level',
        type: 'template',
        template: 'order'
      }, {
        label: '操作',
        type: 'template',
        template: 'opt'
      }],
      //控制添加分类对话框的显示与隐藏
      addCateVisible: false,
      //添加分类的表单数据对象
      addCateForm: {
        //想要添加的分类名称
        cat_name: ' ',
        //父级分类的id
        cat_pid: 0,
        //分类等级，默认要添加的是1级分类
        cat_level: 0
      },
      //添加分类表单的验证规则对象
      addCateFormRules: {
        cat_name: [{ required: true, message: '请输入你的分类名称', trigger: 'blur' }
        ]
      },
      //父级分类的数据
      parentCateList: [],
      //文本框选中的
      selected: [],
      //需要的展示的数据
      parentProps: {
        expandTrigger: 'hover',
        label: 'cat_name',
        value: 'cat_id',
        children: 'children',
        //默认级联选择器只能选择最后的层级,设置该属性可以使一级分类也可以选择
        checkStrictly: 'true'
      }
    }
  },
  methods: {
    //获取商品数据
    async getGoodsData() {
      //发送获取商品分裂数据列表
      const { data: res } = await this.$http.get('categories', { params: this.queryInfo })

      if (res.meta.status !== 200) {
        return this.$message.error('获取商品分类失败')
      }
      this.$message.success('获取商品分类成功')
      console.log(res);
      //把数据列表，赋值给goodsData
      this.goodsData = res.data.result;
      //为总数据条数赋值
      this.total = res.data.total;
    },
    //页面发生变化时
    //监听每页显示条数改变
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      console.log('1')
      this.getGoodsData()

    },
    //监听当前页的改变
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      console.log('2')

      this.getGoodsData();
    },
    //添加商品分类
    addCategory() {
      //获取父级分类数据
      this.getParentCateList();
      //展示添加分类对话框
      this.addCateVisible = true
    },
    //获取分级分类的数据列表
    async  getParentCateList() {
      const { data: res } = await this.$http.get('categories', {        params: { type: 2 }
      })
      if (res.meta.status !== 200) { return this.$messgae.error('获取父级分类数据失败') }
      this.$message.success('获取分级分类数据成功')
      //把取到的父级分类数据保存到parentCateList中,用于展示页面
      this.parentCateList = res.data;

    },
    //当级联选择器发生变化时
    handleChange() {
      console.log(this.selected)
      if (this.selected.length > 0) {
        this.addCateForm.cat_pid = this.selected[this.selected.length - 1]
        this.addCateForm.cat_level = this.selected.length
        return
      } else {
        this.addCateForm.cat_level = 0
        this.addCateForm.cat_pid = 0;
      }

    },
    addCate() {
      this.$refs.addCateForm.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post('categories', this.addCateForm)

        if (res.meta.status !== 201) { return this.$message.error('添加分类失败') }
        this.$message.success('添加分类成功')

        this.addCateVisible = false;
        this.getGoodsData();
      })
    },
    closeCateDialog() {
      this.$refs.addCateForm.resetFields()
      this.selected = [];
      this.addCateForm.cat_pid = 0
      this.addCateForm.cat_level = 0
    }
  },
  created() {
    this.getGoodsData();
  }
}
</script>

<style scoped>
.el-card {
  margin-top: 15px;
}
.treeTable {
  margin: 15px 0;
}
</style>