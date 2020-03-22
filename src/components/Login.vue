<!-- 登陆 -->
<template>
  <div class="full">
    <el-row>
      <el-col :xs="4" :sm="8" :md="9" :lg="10" :xl="10">
        <div class="blank"></div>
      </el-col>
      <!-- 登陆界面 -->
      <el-col :xs="16" :sm="10" :md="6" :lg="4" :xl="4">
        <div class="card">
          <!-- logo -->
          <img class="icon" src="../assets/img/logo.png">
          <!-- 账号输入框 -->
          <el-input class="username" placeholder="请输入账号" prefix-icon="el-icon-user" v-model="username" clearable>
          </el-input>
          <!-- 密码输入框 -->
          <el-input class="password" placeholder="请输入密码" prefix-icon="el-icon-lock" v-model="password" show-password>
          </el-input>
          <!-- 登陆按钮 -->
          <el-button @click="login()" :loading="loginLoading" class="login" type="primary">
            Login
          </el-button>
        </div>
      </el-col>
      <el-col :xs="4" :sm="8" :md="9" :lg="10" :xl="10">
        <div class="blank"></div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        // 用户名
        username: '',
        // 密码
        password: '',
        // 登录Loading
        loginLoading: false
      }
    },
    components: {

    },
    mounted() {
      this.onKeyEnter()
    },
    methods: {
      // 登录
      login() {
        // 未输入账号密码
        if (!this.username || !this.password) {
          this.$notify({
            title: '警告',
            message: '请输入账号密码',
            type: 'warning'
          })
        } else { // 输入账号密码
          this.loginLoading = true
          const query = Bmob.Query('SysUser')
          query.equalTo('username', '===', this.username)
          query.find().then(res => {
            this.loginLoading = false
            if (res.length === 0) {
              this.$notify({
                title: '错误',
                message: '账号不存在',
                type: 'error'
              })
            } else if (res.length === 1) {
              if (res[0].password === this.password) {
                this.$notify({
                  title: '成功',
                  message: '登陆成功',
                  type: 'success'
                })
                sessionStorage.setItem('bmob', JSON.stringify(res[0]))
                this.$router.push({
                  path: '/homePage'
                })
              } else {
                this.$notify({
                  title: '错误',
                  message: '账号密码错误',
                  type: 'error'
                })
              }
            }
          })
        }
      },
      // 监听回车事件
      onKeyEnter() {
        document.onkeydown = (e) => {
          if (e.keyCode === 13 && e.target.baseURI.match(/login/)) {
            this.login()
          }
        }
      }
    }
  }

</script>

<style scoped>
  .full {
    left: 0;
    top: 0;
    height: 100%;
    width: 100%;
    position: fixed;
    text-align: center;
    background: url('../assets/img/login_background.svg');
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center center;
  }

  .el-row {
    position: absolute;
    top: 50%;
    width: 100%;
    transform: translate(-0%, -50%);
  }

  .el-col {
    border-radius: 4px;
  }

  .blank {
    border-radius: 4px;
    min-height: 36px;
  }

  .card {
    background: #ffffff;
    border-radius: 10px;
    padding: 25px;
    -moz-box-shadow: 0px 2px 4px rgb(240, 240, 240);
    -webkit-box-shadow: 0px 2px 4px rgb(240, 240, 240);
    box-shadow: 0px 2px 4px rgb(240, 240, 240);
  }

  .icon {
    width: 50px;
    height: 50px;
    margin: 0 auto;
  }

  .username {
    margin-top: 25px;
  }

  .password {
    margin-top: 25px;
  }

  .login {
    width: 100%;
    margin-top: 25px;
    border-radius: 999px;
  }

</style>
