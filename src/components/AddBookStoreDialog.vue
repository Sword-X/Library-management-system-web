<template>
    <el-dialog :title="title" :visible.sync="dialogFormVisible" width="35%" center :close-on-click-modal="false" :show-close="false">
        <el-form :model="addBookStoreForm" :rules="addBookStoreRules" ref="addBookStoreForm">
        <el-form-item label="书名：" :label-width="formLabelWidth" prop="bookName">
        <el-input v-model="addBookStoreForm.bookName" placeholder="请输入书名"></el-input>
        </el-form-item>
        <el-form-item label="作者：" :label-width="formLabelWidth" prop="author">
        <el-input v-model="addBookStoreForm.author" placeholder="请输入作者"></el-input>
        </el-form-item>
        <el-form-item label="分类：" :label-width="formLabelWidth" prop="categoryId">
        <!-- <el-input v-model="addBookStoreForm.categoryId" placeholder="请输入分类ID" :disabled="bookStoreNameInput"></el-input> -->
        <el-select @change="getSelectData" v-model="addBookStoreForm.categoryName" placeholder="请选择图书分类">
            <el-option v-for="item in bookCategorys" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>  
        </el-form-item>
        <el-form-item label="标签：" :label-width="formLabelWidth" prop="tag">
        <el-input v-model="addBookStoreForm.tag" placeholder="请输入标签"></el-input>
        </el-form-item>
        <el-form-item label="出版社：" :label-width="formLabelWidth" prop="publisher">
        <el-input v-model="addBookStoreForm.publisher" placeholder="请输入出版社"></el-input>
        </el-form-item>
        <el-form-item label="出版时间：" :label-width="formLabelWidth" prop="publishDate">
        <el-input v-model="addBookStoreForm.publishDate" placeholder="请输入出版时间"></el-input>
        </el-form-item>
        <el-form-item label="国际书号：" :label-width="formLabelWidth" prop="isbn">
        <el-input v-model="addBookStoreForm.isbn" placeholder="请输入国际标准书号"></el-input>
        </el-form-item>
        <el-form-item label="库存：" :label-width="formLabelWidth" prop="stock">
        <el-input v-model="addBookStoreForm.stock" placeholder="请输入库存数量"></el-input>
        </el-form-item>
        <el-form-item label="描述信息：" :label-width="formLabelWidth" prop="description">
        <!-- <el-input v-model="addBookStoreForm.description" placeholder="请输入描述信息"></el-input> -->
            <el-input
            type="textarea"
            placeholder="请输入描述内容"
            v-model="addBookStoreForm.description"
            maxlength="500"
            show-word-limit
            rows="3"
          ></el-input>
        </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addBookStore('addBookStoreForm')">确 定</el-button>
        <el-button @click="cancelForm">取 消</el-button>
        </div>
    </el-dialog>
</template>

<script>
  import ApiConst from '@/serverApi/api';
  import { Message } from 'element-ui';
    export default {
    data() {
      return {
        bookCategorys: [],
        addBookStoreRules: {
          author: [
            { required: true, message: '请输入作者', trigger: 'blur' }
          ],
          bookName: [
            { required: true, message: '请输入书名', trigger: 'blur' }
          ],
          categoryId: [
            { required: true, message: '请选择图书分类', trigger: 'blur' }
          ],
          publisher: [
            { required: true, message: '请输入出版社', trigger: 'blur' }
          ],
          isbn: [
            { required: true, message: '请输入国际标准书号', trigger: 'blur' }
          ],
          stock: [
            { required: true, message: '请输入库存数量', trigger: 'blur' }
          ],
        },
        dialogFormVisible: false,
        addBookStoreForm: {},
        title: "新增菜单",
        bookStoreBookStoreInput: false,
        formLabelWidth: '100px'
      }
    },
    methods: {
      getSelectData(categoryId){
        this.addBookStoreForm.categoryId = categoryId;
      },
      cancelForm(){
        this.dialogFormVisible = false;
        this.addBookStoreForm = {};
      },
        handleOpen() {
            this.dialogFormVisible = true; // 打开对话框时设置为true
        },
        handleClose() {
            this.dialogFormVisible = false; // 关闭对话框时设置为false
        },
      addBookStore(formName){
        this.$refs[formName].validate(async (valid) => {
          if (valid) {
            var data = await this.$axiosPost(ApiConst.bookStore.save,this.addBookStoreForm);
            if(data.code){
              this.$refs[formName].resetFields();
              this.dialogFormVisible = false;
              this.addBookStoreForm= {},
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