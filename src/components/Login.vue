<!-- 登陆 -->
<template>
  <div>
    <img src="../assets/img/bg.png" alt="" class="wave">
    <div class="contain">
      <div class="img">
        <img src="../assets/img/img-3.svg" alt="">
      </div>
      <div class="login-box" v-loading="loginLoading">
        <form @submit.prevent="onSubmit">
          <img src="../assets/img/avatar.svg" alt="" class="avatar">
          <h2></h2>
          <div class="input-group">
            <div class="icon">
              <i class="fa fa-user"></i>
            </div>
            <div>
              <h5>Username</h5>
              <input type="text" class="input" v-model="username">
            </div>
          </div>
          <div class="input-group">
            <div class="icon">
              <i class="fa fa-lock"></i>
            </div>
            <div>
              <h5>Password</h5>
              <input type="password" class="input" v-model="password">
            </div>
          </div>
          <button class="btn" @click="login()">login</button>
        </form>
      </div>
    </div>
    <a class="copyright">&copy; xch752</a>
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
      this.init()
    },
    methods: {
      init() {
        const inputs = document.querySelectorAll(".input");

        function focusFunction() {
          let parentNode = this.parentNode.parentNode;
          parentNode.classList.add('focus');
        }

        function blurFunction() {
          let parentNode = this.parentNode.parentNode;
          if (this.value == '') {
            parentNode.classList.remove('focus');
          }
        }

        inputs.forEach(input => {
          input.addEventListener('focus', focusFunction);
          input.addEventListener('blur', blurFunction);
        })
      },
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
      onSubmit() {
        return false;
      }
    }
  }

</script>

<style scoped>
  * {
    padding: 0;
    margin: 0;
    box-sizing: border-box;
  }

  body {
    font-family: 'Roboto', sans-serif;
  }

  .wave {
    position: fixed;
    height: 100%;
    left: 0;
    bottom: 0;
    z-index: -1;
  }

  .contain {
    width: 100vw;
    height: 100vh;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-gap: 18rem;
    padding: 0 2rem;
  }

  .img {
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }

  .img img {
    width: 500px;
  }

  .login-box {
    display: flex;
    align-items: center;
    text-align: center;
  }

  form {
    width: 360px;
  }

  .avatar {
    width: 100px;
  }

  form h2 {
    font-size: 2.9rem;
    text-transform: uppercase;
    margin: 15px 0;
    color: #999;
  }

  input {
    font-size: 1.2rem;
  }

  .input-group {
    position: relative;
    display: grid;
    grid-template-columns: 7% 93%;
    margin: 25px 0;
    padding: 5px 0;
    border-bottom: 2px solid #d9d9d9;
  }

  .input-group:nth-child(1) {
    margin-bottom: 4px;
  }

  .input-group:before,
  .input-group:after {
    content: '';
    position: absolute;
    bottom: -2px;
    width: 0;
    height: 2px;
    background-color: #2A6DF1;
    transition: .5s;
  }

  .input-group:after {
    right: 50%;
  }

  .input-group:before {
    left: 50%;
  }

  .icon {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .icon i {
    color: #d9d9d9;
    transition: .5s;
  }

  .input-group>div {
    position: relative;
    height: 45px;
  }

  .input-group>div>h5 {
    position: absolute;
    left: 10px;
    top: 50%;
    transform: translateY(-50%);
    color: #d9d9d9;
    font-size: 18px;
    transition: .3s;
  }

  .input-group.focus .icon i {
    color: #2A6DF1;
  }

  .input-group.focus div h5 {
    top: -5px;
    font-size: 15px;
  }

  .input-group.focus:after,
  .input-group.focus:before {
    width: 50%;
  }

  .input {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    border: none;
    outline: none;
    background: none;
    padding: 0.5rem 0.7rem;
    font-size: 1.5rem;
    color: #555;
    font-family: 'Roboto', sans-serif;
  }

  a {
    display: block;
    text-align: right;
    text-decoration: none;
    color: #999;
    font-size: 0.9rem;
    transition: .3s;
  }

  a:hover {
    color: #2A6DF1;
  }

  .btn {
    display: block;
    width: 100%;
    height: 50px;
    border-radius: 25px;
    margin: 1rem 0;
    font-size: 1.2rem;
    outline: none;
    border: none;
    background-image: linear-gradient(to right, #4d3dd6, #1b68db, #3d40cf);
    cursor: pointer;
    color: #fff;
    text-transform: uppercase;
    font-family: 'Roboto', sans-serif;
    background-size: 200%;
    transition: .5s;
  }

  .btn:hover {
    background-position: right;
  }

  .copyright {
    position: absolute;
    width: 100%;
    height: 50px;
    bottom: 2px;
    color: #2A6DF1;
    text-align: center;
    font-size: 18px;
    font-family: 'Roboto', sans-serif;
  }

  /*媒体查询*/
  @media screen and (max-width: 1080px) {
    .contain {
      grid-gap: 9rem;
    }
  }

  @media screen and (max-width: 1024px) {
    form {
      width: 290px;
    }

    form h2 {
      font-size: 2.4rem;
      margin: 8px 0;
    }

    .img img {
      width: 360px;
    }
  }

  @media screen and (max-width: 768px) {
    .wave {
      display: none;
    }

    .img {
      display: none;
    }

    .contain {
      grid-template-columns: 1fr;
    }

    .login-box {
      justify-content: center;
    }
  }

</style>
