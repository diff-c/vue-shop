<template>
  <div class="login">
    <div class="login_box">
      <!-- 头像区域 -->
      <div class="avatar_box">
        <img src="~assets/img/logo.png" alt="">
      </div>
      <!-- 登录表单区域 -->
      <el-form ref="loginFormRef" label-width="0px" class="login_form" :model="loginForm" :rules="ruleForm">
        <!-- 用户区域 -->

        <!-- prop是加给form-item的 -->
        <el-form-item prop="username">
          <el-input prefix-icon="iconfont icon-user" v-model="loginForm.username">
          </el-input>
        </el-form-item>
        <!-- 密码区域 -->
        <el-form-item prop="password">
          <el-input prefix-icon="iconfont icon-3702mima" v-model="loginForm.password" type="password">
          </el-input>
        </el-form-item>
        <el-form-item class="btns">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="btnClick">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      //这是登录表单的数据绑定对象
      loginForm: {
        username: 'admin',
        password: '123456',
      },
      //这是表单的验证规则对象
      ruleForm: {
        //验证用户名是否合法
        username: [
          { required: true, message: '请输入账号名', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        //验证密码是否合法
        password: [
          { required: true, message: '请输入密码名', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    //点击重置按钮，重置登录表单
    btnClick() {
      this.$refs.loginFormRef.resetFields();
    },
    //登录预验证
    login() {
      this.$refs.loginFormRef.validate(async (valid) => {
        if (!valid) return;
        const { data: res } = await this.$http.post("login", this.loginForm)
        if (res.meta.status != 200) return this.$message.error('登录失败！')
        this.$message.success('登陆成功');
        //1.将登陆成功之后的 token,保存到客户端的 sessionStorage中
        //  1.1. 项目中出了登录之外的其它API接口，必须在登陆之后才能访问
        //  1.2. token 应在当前网站打开期间生效，所以将token保存在 sessionStorage中
        window.sessionStorage.setItem('token', res.data.token)
        //2.通过编程式导航跳转到后台主页，路由地址是 /home
        this.$router.push('/home')
      })
    }

  },
}
</script> 


<style lang="less" scoped >
.login {
  background-color: #2b4b6b;
  height: 100%;
}
.login_box {
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 3px;
  position: absolute;
  transform: translate(-50%, -50%);
  top: 50%;
  left: 50%;
}
.avatar_box {
  height: 130px;
  width: 130px;
  border: 1px solid #eee;
  border-radius: 50%;
  padding: 10px;
  box-shadow: 0 0 10px #ddd;
  position: absolute;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #fff;

  img {
    width: 100%;
    border-radius: 50%;
    background-color: #eee;
  }
}
.login_form {
  position: absolute;
  bottom: 0;
  padding: 0 20px;
  box-sizing: border-box;
  width: 100%;
}
.btns {
  display: flex;
  justify-content: flex-end;
}
</style>
