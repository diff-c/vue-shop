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
      <!-- 警告区域 -->
      <el-alert title="注意：只允许为第三级分类设置相关参数！" type="warning" show-icon :closable="false">
      </el-alert>

      <!-- 选择商品分类区域 -->
      <el-row>
        <el-col>
          <span>选择商品分类：</span>

          <!-- 选择商品分类的级联选择框 -->

          <el-cascader v-model="selected" :options="goodsData" :props="CateProps" @change="handleChange" clearable>
          </el-cascader>

        </el-col>
      </el-row>

      <!-- tab页签区域 -->
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="动态参数" name="many">

          <!-- button按钮 -->
          <el-button type="primary" size="mini" :disabled="toggleState" @click="addParams">添加参数</el-button>

          <!-- 表格区域 -->
          <el-table :data="paramsList" style="width: 100%" stripe border>
            <el-table-column type="expand">
              <template slot-scope="scope">
                <!-- 循环渲染tag标签 -->
                <el-tag v-for="(item,i) in scope.row.attr_vals" :key="i" closable @close="handleClose(scope.row,i)">
                  {{item}}</el-tag>
                <!-- 输入的文本框 -->
                <el-input class="input-new-tag" v-if="scope.row.inputVisible" v-model="scope.row.inputValue"
                  ref="saveTagInput" size="small" @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)">
                </el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag
                </el-button>
              </template>
            </el-table-column>
            <el-table-column type="index" label="#"></el-table-column>

            <el-table-column prop="attr_name" label="参数名称">
            </el-table-column>
            <el-table-column label="操作">
              <template v-slot="scope">
                <el-button type="primary" size="mini" icon="el-icon-edit" @click="modifyInfo(scope.row.attr_id)">修改
                </el-button>
                <el-button type="danger " size="mini" icon="el-icon-delete" @click="deleteInfo(scope.row.attr_id)">删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>

        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only">
          <!-- 按钮区域 -->
          <el-button type="primary" size="mini" :disabled="toggleState" @click="addParams">添加属性</el-button>

          <!-- 表格区域 -->
          <el-table :data="paramsList" style="width: 100%" stripe border>

            <el-table-column type="expand">
              <template v-slot="scope">
                <el-tag v-for="(item,i) in scope.row.attr_vals" :key="i" closable @close="handleClose(scope.row,i)">
                  {{item}}</el-tag>
                <!-- 输入的文本框 -->
                <el-input class="input-new-tag" v-if="scope.row.inputVisible" v-model="scope.row.inputValue"
                  ref="saveTagInput" size="small" @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)">
                </el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag
                </el-button>
              </template>
            </el-table-column>
            <el-table-column type="index" label="#"></el-table-column>

            <el-table-column prop="attr_name" label="属性名称">
            </el-table-column>
            <el-table-column label="操作">
              <template v-slot="scope">
                <el-button type="primary" size="mini" icon="el-icon-edit" @click="modifyInfo(scope.row.attr_id)">修改
                </el-button>
                <el-button type="danger " size="mini" icon="el-icon-delete" @click="deleteInfo(scope.row.attr_id)">删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>

      </el-tabs>
    </el-card>

    <!-- 添加参数的对话框 -->
    <el-dialog :title="'添加' + titleText" :visible.sync="ParamsDialogVisible" width="50%" @close="closeParamsDialog">
      <el-form :model="paramsForm" :rules="paramsRules" ref="ruleForm" label-width="100px">
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="paramsForm.attr_name">动态参数</el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="ParamsDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="ensureInfo">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改参数 -->
    <el-dialog :title="'修改' + titleText" :visible.sync="editDialogVisible" width="50%" @close="editDialogClosed">
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px">
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="editForm.attr_name">动态参数</el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editParams">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      //商品分类数据
      goodsData: [],
      //选中文本
      selected: [],
      CateProps: {
        expandTrigger: 'hover',
        label: 'cat_name',
        value: "cat_id",
        children: 'children'
      },
      //被激活页签的名称
      activeName: 'many',
      toggleState: true,
      paramsList: [],
      //控制添加参数对话框的显示与隐藏
      ParamsDialogVisible: false,
      //表单源数据
      paramsForm: {
        attr_name: ''
      },
      paramsRules: {
        attr_name: [{ required: true, message: '请输入添加参数名称', trigger: 'blur' }]
      },
      //控制编辑参数对话框的显示与隐藏
      editDialogVisible: false,
      //修改的表单对象
      editForm: {

      },
      editFormRules: {
        attr_name: [{
          required: true, message: "请输入参数名称", trigger: 'blur'
        }]
      },

    }
  },
  methods: {
    async getGoodsData() {
      //发送获取商品分类数据列表
      const { data: res } = await this.$http.get('categories')

      if (res.meta.status !== 200) {
        return this.$message.error('获取商品分类失败')
      }
      this.$message.success('获取商品分类成功')
      // console.log(res);
      //把数据列表，赋值给goodsData
      this.goodsData = res.data;
      //为总数据条数赋值
      // this.total = res.data.total;
    },
    async handleChange() {
      this.toggleState = false;
      this.getParamsData()
    },
    //tab 页签点击事件的处理函数
    handleClick() {
      this.getParamsData()
    },
    //获取网络请求
    async getParamsData() {
      //控制级联选择器的控制范围
      if (this.selected.length !== 3) {
        this.selected = []
        this.paramsList = [];
        return
      }
      //发送请求参数列表的数据
      const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`, {
        params: { sel: this.activeName }
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取参数列表失败')
      }
      // this.$message.success('获取参数列表成功 ')

      //判断是动态参数还是静态属性分别保存到不同数组，这一步没做
      res.data.forEach(item => {
        console.log(item.attr_vals === '')

        item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
        item.inputVisible = false
        item.inputValue = ''

        //麻烦方法二

        // if (item.attr_vals === '') {
        //   item.attr_vals = [];
        //   item.inputVisible = false
        //   item.inputValue = ''
        // }
        // else {
        //   item.attr_vals = item.attr_vals.split(' ')
        //   item.inputVisible = false
        //   item.inputValue = ''
        // }
      })
      console.log(res.data)
      this.paramsList = res.data;
      // console.log(res)
      // console.log(this.selected)
    },
    addParams() {
      this.ParamsDialogVisible = true;
    },
    ensureInfo() {
      this.$refs.ruleForm.validate(async valid => {
        if (!valid) return;
        const { data: res } = await this.$http.post(`categories/${this.cateId}/attributes`, {
          attr_name: this.paramsForm.attr_name,
          attr_sel: this.activeName
        })

        if (res.meta.status !== 201) {
          return this.$message.error('添加参数失败')
        }
        this.$message.success('添加参数成功')
        this.ParamsDialogVisible = false;
        this.getParamsData()
        console.log(res)
      })

    },
    closeParamsDialog() {
      this.$refs.ruleForm.resetFields()
    },
    //点击编辑按钮打开修改参数对话框
    async modifyInfo(attrId) {


      const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes/${attrId}`)

      console.log(res);
      this.editForm = res.data
      this.editDialogVisible = true;
    },
    //提交修改后的参数名称
    editParams() {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return;
        const { data: res } = await this.$http.put(`categories/${this.cateId}/attributes/${this.editForm.attr_id}`, {
          attr_name: this.editForm.attr_name,
          attr_sel: this.activeName
        })

        if (res.meta.status !== 200) {
          return this.$message.error('修改参数失败')
        }
        this.$message.success('修改参数成功')
        this.getParamsData();

        this.editDialogVisible = false;
      })



    },
    editDialogClosed() {
      this.$refs.editFormRef.resetFields()
    },
    //根据Id删除对应的参数项
    async deleteInfo(attrId) {
      const confirmResult = await this.$confirm('此操作将永久删除该参数, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)

      if (confirmResult !== "confirm") {
        return this.$message.info('已取消删除')
      }
      //删除成功
      const { data: res } = await this.$http.delete(`categories/${this.cateId}/attributes/${attrId}`)

      if (res.meta.status !== 200) {
        return this.$message.error('删除参数失败')
      }
      this.$message.success('删除参数成功')
      this.getParamsData();


      console.log(res)
    },
    //切换为可输入文本框
    showInput(row) {
      console.log(row)
      row.inputVisible = true
      // 让文本框自动获得焦点
      // $nextTick 方法的作用，就是当页面上元素被重新渲染之后，才会指定回调函数中的代码
      this.$nextTick(() => {
        console.log(this)
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    //文本框失去焦点, 键盘按下enter事件
    async  handleInputConfirm(row) {
      if (row.inputValue.trim().length === 0) {
        row.inputValue = ''
        row.inputVisible = false
        return
      }
      row.attr_vals.push(row.inputValue.trim())
      row.inputValue = ''
      row.inputVisible = false

      //发送请求,保存这次操作
      this.saveAttrVals(row)



    },
    //将对attr_vals 的操作保存到数据库
    async saveAttrVals(row) {
      const { data: res } = await this.$http.put(`categories/${this.cateId}/attributes/${row.attr_id}`, {
        attr_name: row.attr_name,
        attr_sel: row.attr_sel,
        attr_vals: row.attr_vals.join(' ')
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取参数项失败')
      }
      this.$message.success('获取参数项成功')
    },
    handleClose(row, i) {
      row.attr_vals.splice(i, 1)
      this.saveAttrVals(row)
    }

  },
  created() {
    this.getGoodsData()
  },
  computed: {
    cateId() {
      if (this.selected.length === 3) {
        return this.selected[2]
      }
      return null
    },
    titleText() {
      if (this.activeName === 'many') {
        return '动态参数'
      } else {
        return '静态属性'
      }
    }
  },
}
</script>

<style lang="less" scoped>
.el-card {
  margin-top: 15px;
}
.el-row {
  margin: 15px 0;
}
// .el-table-column {
//   width: 100%;
// }
.el-table {
  margin-top: 15px;
}
.el-tag {
  margin: 10px;
}
.input-new-tag {
  width: 120px;
}
</style>