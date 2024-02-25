<template>
    <el-aside width="200px" style="background-color: rgb(238, 241, 246)">
        <el-menu
            default-active="/index"
            class="el-menu-vertical-demo"
            @open="handleOpen"
            @close="handleClose"
            background-color="#545c64"
            text-color="#fff"
            active-text-color="#ffd04b"
            router>
            <el-menu-item index="/index">
                <i class="el-icon-s-home"></i>
                <span slot="title">首页</span>
            </el-menu-item>
            <el-menu-item index="/bookStore">
                <i class="el-icon-reading"></i>
                <span slot="title">藏经阁</span>
            </el-menu-item>
            <el-submenu index="/book">
                <template slot="title">
                    <i class="el-icon-notebook-1"></i>
                    <span>借阅管理</span>
                </template>
                <el-menu-item-group>
                    <el-menu-item index="/borrow">借阅信息</el-menu-item>
                    <el-menu-item index="4-2">选项2</el-menu-item>
                </el-menu-item-group>
            </el-submenu>
            <el-menu-item index="/role">
                <i class="el-icon-s-cooperation"></i>
                <span slot="title">角色管理</span>
            </el-menu-item>
            <el-menu-item index="/user">
                <i class="el-icon-s-custom"></i>
                <span slot="title">用户管理</span>
            </el-menu-item>
            <el-menu-item index="/log">
                <i class="el-icon-lock"></i>
                <span slot="title">审计日志</span>
            </el-menu-item>
        </el-menu>
    </el-aside>
</template>

<script>
  export default {
    methods: {
      handleOpen(key, keyPath) {
        console.log(key, keyPath);
      },
      handleClose(key, keyPath) {
        console.log(key, keyPath);
      }
    }
  }
</script>