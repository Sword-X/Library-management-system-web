<template>
    <el-dialog :title="title" :visible.sync="dialogFormVisible" width="35%" center :close-on-click-modal="false">
        <el-form :model="addRoleForm" :rules="addRoleRules" ref="addRoleForm">
        <el-form-item label="角色编码：" :label-width="formLabelWidth" prop="roleCode">
        <el-input v-model="addRoleForm.roleCode" placeholder="请输入角色编码" :disabled="roleRoleInput"></el-input>
        </el-form-item>
        <el-form-item label="角色名称：" :label-width="formLabelWidth" prop="roleName">
        <el-input type="name" v-model="addRoleForm.roleName" placeholder="请输入角色名称"></el-input>
        </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addRole('addRoleForm')">确 定</el-button>
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        </div>
    </el-dialog>
</template>

<script>
  import ApiConst from '@/serverApi/api';
  import { Message } from 'element-ui';
    export default {
    data() {
      return {
        addRoleRules: {
          roleCode: [
            { required: true, message: '请输入角色编码', trigger: 'blur' }
          ],
          roleName: [
            { required: true, message: '请输入角色名称', trigger: 'blur' }
          ],
        },
        dialogFormVisible: false,
        addRoleForm: {
          id: '',
          roleCode: '',
          roleName: ''
        },
        title: "新增角色",
        roleRoleInput: false,
        formLabelWidth: '100px'
      }
    },
    methods: {
        handleOpen() {
            this.dialogFormVisible = true; // 打开对话框时设置为true
        },
        handleClose() {
            this.dialogFormVisible = false; // 关闭对话框时设置为false
        },
      addRole(formName){
        this.$refs[formName].validate(async (valid) => {
          if (valid) {
            var data = await this.$axiosPost(ApiConst.role.save,this.addRoleForm);
            if(data.code){
              this.$refs[formName].resetFields();
              this.dialogFormVisible = false;
              Message.success("操作成功！");
              this.sendMessage2Parent();
            }
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      sendMessage2Parent(){
        this.$emit('customEvent',true);
      }
    }
  }

</script>