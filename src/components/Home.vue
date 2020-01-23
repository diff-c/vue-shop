<template>

  <el-container class="home-container">
    <!-- 头部区域 -->
    <el-header>
      <div>
        <img src="~assets/img/heima.png" alt="">
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <!-- 页面主题区域 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="isCollapse ? '64px':'200px'">
        <div class="toggle-button" @click="toggle">|||</div>
        <!-- 侧边栏菜单区域 -->
        <el-menu background-color="#333744" text-color="#fff" active-text-color="#409eff" unique-opened
          :collapse-transition="false" :collapse="isCollapse" router :default-active="path">

          <!-- 一级菜单 -->
          <el-submenu :index="item.id + ''" v-for="item in menuList" :key="item.id">
            <!-- 一级菜单模板区域 -->
            <template slot="title">
              <i :class="iconsObj[item.id]"></i>
              <span>{{item.authName}}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item :index="'/' + subItem.path" v-for="subItem in item.children" :key="subItem.id"
              @click="handleMenuItem('/' + subItem.path)">
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{subItem.authName}}</span>
              </template></el-menu-item>
          </el-submenu>

        </el-menu>
      </el-aside>
      <!-- 右侧内容主体 -->
      <el-main>
        <router-view></router-view>
        <!-- {{$route.path}} -->
      </el-main>
    </el-container>
  </el-container>

</template>

<script>
export default {
  data() {
    return {
      //左侧菜单数据
      menuList: [],
      iconsObj: {
        '125': "iconfont icon-users",
        '103': "iconfont icon-tijikongjian",
        '101': "iconfont icon-shangpin",
        "102": "iconfont icon-danju",
        "145": "iconfont icon-baobiao"
      },
      //控制侧边栏是否展开或隐藏
      isCollapse: false,
      path: ''
    }
  },
  created() {
    this.getMenuList()
    this.path = window.sessionStorage.getItem('path')
  },
  methods: {
    //退出登录
    logout() {
      window.sessionStorage.clear();
      this.$router.push('/login')
    },
    //获取所有的菜单
    async getMenuList() {
      const { data: res } = await this.$http.get('menus')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.menuList = res.data
      // console.log(res);
    },
    //点击按钮切换侧边栏
    toggle() {
      this.isCollapse = !this.isCollapse
    },
    handleMenuItem(activePath) {
      // window.sessionStorage.setItem('path', path)
      // this.path = path;
      this.path = activePath;
      window.sessionStorage.setItem('path', this.path)



    }
  },
}
</script>

<style lang="less" scoped>
.home-container {
  height: 100%;
}
.el-header {
  background-color: #373d41;
  padding-left: 0;
  line-height: 60px;
  color: #fff;
  font-size: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  img {
    vertical-align: middle;
  }
  span {
    margin-left: 15px;
  }
}
.iconfont {
  margin-right: 15px;
}

.el-aside {
  background-color: #333744;
  // line-height: 200px;
}

.el-main {
  background-color: #eaedf1;
  // line-height: 160px;
}

body > .el-container {
  margin-bottom: 40px;
}
.el-menu {
  border-right: 0;
}
.toggle-button {
  background-color: #4a5064;
  font-size: 10px;
  line-height: 24px;
  text-align: center;
  color: #fff;
  letter-spacing: 0.2em;
  cursor: pointer;
}
</style>