import Vue from "vue";
import VueRouter from "vue-router";

const Login = () => import("components/Login");
const Home = () => import("components/Home");
const Welcome = () => import("components/Welcome");
const User = () => import("../components/user/User");
const Right = () => import("components/power/Right");
const Role = () => import("components/power/Role");
const Cate = () => import("components/goods/Cate");
const Params = () => import("components/goods/Params");
const GoodsList = () => import("components/goods/List");
const Add = () => import("components/goods/Add");
const Order = () => import("components/order/Order");
const Report = () => import("components/report/Report");

Vue.use(VueRouter);

const router = new VueRouter({
  routes: [
    {
      path: "/login",
      component: Login
    },
    {
      path: "/",
      redirect: "/login"
    },
    {
      path: "/home",
      component: Home,
      redirect: "/welcome",
      children: [
        { path: "/welcome", component: Welcome },
        { path: "/users", component: User },
        { path: "/rights", component: Right },
        { path: "/roles", component: Role },
        { path: "/categories", component: Cate },
        { path: "/params", component: Params },
        { path: "/goods", component: GoodsList },
        { path: "/goods/add", component: Add },
        { path: "/orders", component: Order },
        { path: "/reports", component: Report }
      ]
    }
  ],
  mode: "history"
});

//挂载路由导航守卫
router.beforeEach((to, from, next) => {
  //如果用户访问的是登录页，直接放行
  if (to.path === "/login") return next();
  //从 sessionStorage 中获取到  保存的 token值-+
  const tokenStr = window.sessionStorage.getItem("token");
  if (!tokenStr) return next("/login");
  next();
});

export default router;
