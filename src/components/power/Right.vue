<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card class="box-card">

      <el-table :data="tableData" style="width: 100%" border stripe>
        <el-table-column label="#" width="180" type="index"></el-table-column>
        <el-table-column label="权限名称" prop="authName" width="180"></el-table-column>
        <el-table-column label="路径" prop="path" width="180"></el-table-column>
        <el-table-column label="权限等级" prop="level">
          <template v-slot="scope">
            <el-tag v-if="scope.row.level === '0'">一级</el-tag>
            <el-tag type="success" v-else-if="scope.row.level === '1'">二级</el-tag>
            <el-tag type="warning" v-else>三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tableData: []
    }
  },
  methods: {
    async getRootList() {
      const { data: res } = await this.$http.get('rights/list')
      console.log(res)
      if (res.meta.status !== 200) { return this.$message.error('获取权限列表失败') }
      else {
        this.$message.success('获取权限列表成功')
        this.tableData = res.data;
      }

    }

  },
  created() {
    this.getRootList()
  },
}
</script>

<style lang="less" scoped>
.box-card {
  margin-top: 15px;
}
</style>