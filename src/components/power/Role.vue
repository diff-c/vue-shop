<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card class="box-card">
      <el-row>
        <el-col>
          <el-button type="primary" @click="addRole">添加角色</el-button>
        </el-col>
      </el-row>

      <!-- 角色列表区域 -->
      <el-table :data="rolesList" border stripe>
        <!-- 展开列-->
        <el-table-column type="expand">
          <template v-slot="scope">
            <!-- {{scope.row}} -->
            <!-- 渲染一级菜单 -->
            <el-row :class="['el-row',index === 0 ? 'top':'','vcenter']" v-for="(item,index) in scope.row.children"
              :key="item.id">
              <el-col :span="5">
                <el-tag closable @close="closeTag(scope.row,item.id)">{{item.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 渲染二级菜单 -->
              <el-col :span="19">
                <el-row class="vcenter" v-for="item1 in item.children" :key="item1.id">
                  <el-col :span="6">
                    <el-tag type="success" closable @close="closeTag(scope.row,item1.id)">{{item1.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag type="warning" v-for="item2 in item1.children" :key="item2.id"
                      @close="closeTag(scope.row,item2.id)" closable>
                      {{item2.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>

          </template>

        </el-table-column>

        <!-- 索引列 -->
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>

        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作">
          <template v-slot="scope">
            <!-- {{scope.row.id}} -->
            <el-button size="mini" type="primary" icon="el-icon-edit" @click="editRoleInfo(scope.row.id)">编辑</el-button>
            <el-button size="mini" type="danger" icon="el-icon-delete" @click="deleteRoleInfo(scope.row.id)">删除
            </el-button>
            <el-button size="mini" type="warning" icon="el-icon-setting" @click="showRightDialog(scope.row)">分配权限
            </el-button>

          </template>
        </el-table-column>

      </el-table>

    </el-card>

    <el-dialog title="添加角色" :visible.sync="dialogVisible" width="50%">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="ruleForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="ruleForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRoleToList">确 定</el-button>
      </span>

    </el-dialog>

    <el-dialog title="修改角色" :visible.sync="dialogVisible1" width="50%">
      <!-- 表单验证 -->
      <el-form :model="editData" :rules="rules" ref="ruleForm" label-width="100px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editData.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="editData.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible1 = false">取 消</el-button>
        <el-button type="primary" @click="submitInfo">确 定</el-button>
        <!-- @click="submitInfo()" -->
      </span>

    </el-dialog>

    <!-- 分配权限的对话框 -->

    <el-dialog title="分配权限" :visible.sync="setRightDialogVisible" width="50%" @close="setRightDialogClosed">
      <!-- 树形控件 -->
      <el-tree show-checkbox :data="rightList" :props="treeProp" default-expand-all node-key="id" ref="treeRef"
        :default-checked-keys="defKeys"></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRights">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
export default {
  data() {
    return {
      //控制分配对话框的显示与隐藏
      setRightDialogVisible: false,
      rolesList: [],
      //控制对话框显示与隐藏
      dialogVisible: false,
      dialogVisible1: false,
      ruleForm: {
        roleName: '',
        roleDesc: "",
      },
      editData: {},
      rightList: [],
      rules: {
        roleName: [{ required: true, message: '请输入角色名称', trigger: 'blur' }],
        roleDesc: [{ required: true, message: '请输入角色描述', trigger: 'blur' }]
      },
      treeProp: {
        label: 'authName',
        children: 'children'
      },
      defKeys: [105],
      roleId: ''
    }
  },
  methods: {
    async  getRolesList() {
      const { data: res } = await this.$http.get('roles')
      console.log(res)
      if (res.meta.status !== 200) { return this.$message.error('获取角色列表失败') }
      this.$message.success('获取角色列表成功')
      this.rolesList = res.data
    },
    addRole() {
      this.dialogVisible = true
    },
    async addRoleToList() {
      //发起网络请求添加角色
      const { data: res } = await this.$http.post('roles', this.ruleForm)
      if (res.meta.status !== 201) { return this.$message.error('添加用户失败') }
      this.$message.success('添加用户成功')
      //重新获取新的角色列表数据
      this.getRolesList()
      this.dialogVisible = false;
      //关闭对话框

    },
    async editRoleInfo(id) {
      this.dialogVisible1 = true
      const { data: res } = await this.$http.get(`roles/${id}`)
      if (res.meta.status !== 200) {
        return this.$message.error('获取角色信息失败')
      }
      this.$message.success('获取角色信息成功')
      console.log(res);
      this.editData = res.data;
    },
    async deleteRoleInfo(id) {
      const confirmResult = await this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
      // console.log(confirmResult)
      if (confirmResult === 'confirm') {
        const { data: res } = await this.$http.delete(`roles/${id}`)
        // console.log(res.meta.status)
        if (res.meta.status !== 200) { return this.$message.error('删除用户失败') }
        // console.log(res)
        this.$message.success('删除用户成功')
        this.getRolesList();
      }



    },
    async submitInfo() {
      const { data: res } = await this.$http.put('roles/' + this.editData.roleId, {
        roleName: this.editData.roleName,
        roleDesc: this.editData.roleDesc
      })
      if (res.meta.status !== 200) { return this.$message.error('修改用户失败') }
      this.$message.success('修改用户成功')
      this.getRolesList()
      this.dialogVisible1 = false;
    },
    async closeTag(role, id) {
      // console.log(id);
      const confirmResult = await this.$confirm('此操作将永久删除该权限, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)

      if (confirmResult !== 'confirm') {
        return this.$message.info('取消了删除')
      }
      const { data: res } = await this.$http.delete(`roles/${role.id}/rights/${id}`)
      // console.log(role.children);
      this.$message.success('确认了删除')
      role.children = res.data;
    },
    //展示分配权限的对话框
    async showRightDialog(role) {
      this.roleId = role.id
      //获取权限列表数据
      const { data: res } = await this.$http.get('rights/tree')
      this.rightList = res.data;
      console.log(this.rightList)
      this.getLeafKeys(role, this.defKeys)
      this.setRightDialogVisible = true;
    },
    //通过递归形式,获取角色下三级权限的id
    getLeafKeys(node, arr) {
      if (!node.children) {
        return arr.push(node.id)
      }
      node.children.forEach(item => {
        this.getLeafKeys(item, arr)
      })
    },
    setRightDialogClosed() {
      this.defKeys = [];
    },
    //点击为角色权限分配
    async  allotRights() {
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ]
      const idStr = keys.join(',');
      const { data: res } = await this.$http.post(`roles/${this.roleId}/rights`, {
        rids: idStr
      })
      if (res.meta.status !== 200) {
        return this.$message.error('分配权限失败')
      }
      this.$message.success('分配权限成功!')
      this.getRolesList();
      this.setRightDialogVisible = false;
    }
  },

  created() {
    this.getRolesList()
  }
}
</script>

<style>
.box-card {
  margin-top: 15px;
}
.el-tag {
  margin: 7px;
}
.el-row {
  border-bottom: 1px solid #eee;
}
.top {
  border-top: 1px solid #eee;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>