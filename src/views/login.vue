<template>
<div class="login">
  <div class="login-box">
    <div class="avatar-box">
      <img src="~@/assets/logo.png" alt="">
    </div>
    <el-form ref="form" label-width="0px" class="login-form" :model="loginform" :rules="loginrules">
      <el-form-item prop="username">
        <el-input prefix-icon="el-icon-user-solid" v-model="loginform.username"></el-input>
      </el-form-item>
      <el-form-item prop="password"> 
        <el-input prefix-icon="el-icon-lock" suffix-icon="el-icon-view" v-model="loginform.password" type="password"></el-input>
      </el-form-item>
      <el-form-item class="btns">
        <el-button type="primary" @click="login">登录</el-button>
        <el-button type="info" @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</div>
</template>

<script>
export default {
  components: {},
  props: {},
  data() {
    var password = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'));
          return
        }else {
          var exp = new RegExp(/^[0-9]\w{5,17}$/)
          var result = exp.test(value)
          if (result === false) {
          callback(new Error('请输入以数字开头的5-20位的数字，密码组合'));
        }else{
          callback()
        } 
        }
      };
    return {
      loginform:{
        username:'admin',
        password:'123456'
      },
      loginrules:{
        username:[
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        password:[
          {validator:password,trigger: 'blur'}
        ]
      }
    };
  },
  methods:{
    reset(){
      this.$refs.form.resetFields()
    },
    login(){
      this.$refs.form.validate(async vali => {
        if (!vali) return '登陆失败';
        var {data:res} = await this.$http.post('login',this.loginform)
        if (res.meta.status != 200) return this.$message.error('登陆失败')
        this.$message.success('登陆成功')
        sessionStorage.setItem('token',res.data.token)
        this.$router.push('/home')
      })
    }
  }
};
</script>
<style lang="less" scoped>
.login{
  width: 100%;
  height: 100%;
  background: #2b4b6b;
}
.login-box{
  width: 450px;
  height: 300px;
  border: 3px;
  background: #fff;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%,-50%);

    .avatar-box{
      width: 130px;
      height: 130px;
      border: 1px solid #ddd;
      border-radius: 50%;
      padding: 8px;
      position: absolute;
      left: 50%;
      transform: translate(-50%,-50%);
      background: #fff;

        img{
          width:100%;
          height:100%;
          border-radius:50%;
          background: #ddd;
        }
    }
    .login-form{
      position: absolute;
      bottom: 0;
      width: 100%;
      box-sizing: border-box;
      padding: 0 20px;

      .btns{
        display: flex;
        justify-content: flex-end;
      }
    }

    
}
</style>