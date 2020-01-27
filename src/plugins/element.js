import Vue from "vue";
import {
  Button,
  Form,
  FormItem,
  Input,
  Container,
  Main,
  Header,
  Aside,
  Menu,
  MenuItem,
  Submenu,
  MenuItemGroup,
  Breadcrumb,
  BreadcrumbItem,
  Card,
  Row,
  Col,
  Table,
  TableColumn,
  Switch,
  Tooltip,
  Pagination,
  Dialog,
  MessageBox,
  Tag,
  Tree,
  Select,
  Option,
  Cascader,
  Alert,
  Tabs,
  TabPane
} from "element-ui";
//导入弹框提示组件
import { Message } from "element-ui";

Vue.use(Button);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Input);
Vue.use(Container)
  .use(Main)
  .use(Header)
  .use(Aside)
  .use(Menu)
  .use(MenuItem)
  .use(Submenu)
  .use(MenuItemGroup)
  .use(Breadcrumb)
  .use(BreadcrumbItem)
  .use(Card)
  .use(Col)
  .use(Row)
  .use(Table)
  .use(TableColumn)
  .use(Switch)
  .use(Tooltip)
  .use(Pagination)
  .use(Dialog)
  .use(Tag)
  .use(Tree)
  .use(Select)
  .use(Option)
  .use(Cascader)
  .use(Alert)
  .use(Tabs)
  .use(TabPane);

//Message必须挂载到全局中
Vue.prototype.$message = Message;
//MessageBox必须挂载到全局中

Vue.prototype.$confirm = MessageBox.confirm;
