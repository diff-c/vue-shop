<template>
  <!-- 面包屑导航区域 -->
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 搜索与添加区域 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="usersInfo.query" clearable @clear="getUserList">
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="isShow = true">添加用户</el-button>
        </el-col>
      </el-row>

      <!-- 用户列表区域 -->
      <el-table :data="users" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="username" label="姓名" width="180"></el-table-column>
        <el-table-column prop="email" label="邮箱" width="180"></el-table-column>
        <el-table-column prop="mobile" label="电话" width="180"></el-table-column>
        <el-table-column prop="role_name" label="角色" width="180"></el-table-column>
        <el-table-column prop="mg_state" label="状态" width="180">
          <template v-slot="scope">
            <!-- {{scope.row.mg_state}} -->
            <el-switch v-model="scope.row.mg_state" active-color="#409EFF" inactive-color="#dcdfe6"
              @change="changeState(scope.row)">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template v-slot="scope">
            <!-- {{scope.row}} -->
            <el-button type="primary" icon="el-icon-edit" @click="editInfo(scope.row.id)"></el-button>
            <!-- 绑定点击事件删除角色数据 -->
            <el-button type="danger" icon="el-icon-delete" @click="deleteInfo(scope.row.id)"></el-button>
            <el-tooltip content="分配角色" placement="top" effect="light" :enterable="false">
              <el-button type="warning" icon="el-icon-setting"></el-button>
            </el-tooltip>

          </template>
        </el-table-column>

      </el-table>

      <!-- 分页区域 -->
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
        :current-page="usersInfo.pagenum" :page-sizes="[1, 2, 3, 4]" :page-size="usersInfo.pageSize"
        layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </el-card>

    <!-- 添加用户对话框 -->
    <el-dialog title="添加用户  " :visible.sync="isShow" width="50%" @close="closeDialog">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="70px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="ruleForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="ruleForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="ruleForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="phone">
          <el-input v-model="ruleForm.phone"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="isShow = false">取 消</el-button>
        <el-button type="primary" @click="validateForm">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改用户对话框 -->
    <el-dialog title="修改信息" :visible.sync="isShow2" width="50%">
      <el-form ref="editData" :model="editData" label-width="70px" :rules="rules" @close="closeDialog2">
        <el-form-item label="用户名">
          <el-input v-model="editData.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editData.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="editData.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isShow2 = false">取 消</el-button>
        <el-button type="primary" @click="validateForm2">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    var checkEmail = (rule, value, callback) => {
      const emailReg = /^[a-zA-Z0-9]+([-_.][a-zA-Z0-9]+)*@[a-zA-Z0-9]+([-_.][a-zA-Z0-9]+)*\.[a-z]{2,}$/
      if (emailReg.test(value)) {
        return callback()
      } else {
        return callback(new Error('请输入合法的邮箱名'))
      }
    }
    var checkMobile = (rule, value, callback) => {
      const phoneEmail = /^1[345789]\d{9}$/
      if (phoneEmail.test(value)) {
        return callback()
      } else {
        return callback(new Error('请输入合法的手机名'))
      }
    }
    return {
      //自定义校验规则

      usersInfo: {
        query: '',
        pagenum: 1,
        pagesize: 2
      },
      total: 0,
      // pagenum: 1,
      users: [],
      isShow: false,
      isShow2: false,
      ruleForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      rules: {
        username: [{
          required: true, message: '请输入用户名', trigger: 'blur'
        }, { min: 3, max: 10, message: "请输入3-10个字符的用户名", trigger: 'blur' }],
        password: [{
          required: true, message: '请输入密码', trigger: 'blur'
        }, { min: 6, max: 15, message: "请输入6-15个字符的用户名", trigger: 'blur' }],
        email: [{
          required: true, message: '请输入邮箱名 ', trigger: 'blur'
        }, { min: 3, max: 20, message: "请输入3-15个字符的用户名", trigger: 'blur' }, {
          validator: checkEmail, trigger: 'blur'
        }],
        mobile: [{
          required: true, message: '请输入手机号码', trigger: 'blur'
        }, { min: 3, max: 12, message: "请输入11字符的用户名", trigger: 'blur' }, {
          validator: checkMobile, trigger: 'blur'
        }]

      },
      editData: {}
    }
  },
  methods: {
    async getUserList() {
      const { data: res } = await this.$http.get('/users', { params: this.usersInfo })
      // console.log(res)
      if (res.meta.status !== 200) return this.$message.error('获取管理员列表失败')
      this.total = res.data.total;
      this.users = res.data.users;
      this.pagenum = res.data.pagenum
    },
    handleSizeChange(newSize) {
      // console.log(newSize)
      this.usersInfo.pagesize = newSize
      this.getUserList()
    },
    handleCurrentChange(newPage) {
      // console.log(newPage)
      this.usersInfo.pagenum = newPage;
      this.getUserList()
    },
    async changeState(state) {
      const { data: res } = await this.$http.put(`users/${state.id}/state/${state.mg_state}`)
      if (res.meta.status !== 200) {
        res.state.mg_state = !res.state.mg_state
        return this.$message.error('修改用户失败')
      }
      return this.$message.success('修改用户成功')
    },
    closeDialog() {
      this.$refs.ruleForm.resetFields()
    },
    validateForm() {
      //对表单进行预验证
      this.$refs.ruleForm.validate(async valid => {
        if (!valid) return
        //验证通过发送网络请求
        const { data: res } = await this.$http.post('users', this.ruleForm)
        if (res.meta.status !== 201) return this.$message.error('添加用户失败')
        this.$message.success('添加用户成功')
        this.isShow = false;

        this.getUserList()
        // console.log(res)
      })
    },
    closeDialog2() {
      this.$refs.editData.resetFields()
    },
    validateForm2() {
      this.$refs.editData.validate(async valid => {
        if (!valid) return
        //验证通过发送网络请求
        const { data: res } = await this.$http.put('users/' + this.editData.id, {
          email: this.editData.email,
          mobile: this.editData.mobile
        })

        console.log(res)
        if (res.meta.status !== 200) {
          return this.$message.error('编辑用户信息失败')
        }
        this.$message.success('编辑用户信息成功')
        this.getUserList()
        this.isShow2 = false;

      })
    },
    async editInfo(id) {
      this.isShow2 = true;
      //发送根据id查询用户信息的网络请求
      const { data: res } = await this.$http.get(`users/${id}`)
      if (res.meta.status !== 200) return this.$message.error('获取用户信息失败')
      // console.log(res.data);
      this.editData = res.data;
    },
    async deleteInfo(id) {
      //弹框提示
      const confirmResult = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmResult !== 'confirm') {
        return this.$message.info('用户取消删除')
      } else {
        // console.log(id);
        //发送网络请求删除单个用户
        const { data: res } = await this.$http.delete(`users/${id}`)
        if (res.meta.status !== 200) {
          return this.$message.error('删除失败')
        }
        this.$message.success('删除成功')
        this.getUserList();
      }



    }

  },
  created() {
    this.getUserList()
  }
}
</script>

<style lang="less" scoped>
.el-table {
  margin-top: 15px;
  font-size: 12px;
}
.el-breadcrumb {
  margin-bottom: 15px;
  font-size: 12px;
}
.el-card {
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.15);
}
</style>