<template>
  <div>
    <!-- nav -->
    <nav class="navbar navbar-inverse navbar-fixed-top">
      <div class="container-fluid">
        <!-- Brand and toggle get grouped for better mobile display -->
        <div class="navbar-header">
          <button type="button" class="navbar-toggle collapsed" data-toggle="collapse"
            data-target="#bs-example-navbar-collapse-1" aria-expanded="false">
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
          </button>
          <a class="navbar-brand">
            <img alt="Brand">
          </a>
        </div>

        <!-- Collect the nav links, forms, and other content for toggling -->
        <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
          <ul class="nav navbar-nav">
            <li><a>{{username}}</a></li>
          </ul>
          <ul class="nav navbar-nav navbar-right">
            <li class="c-pointer" style="width: 50px;height: 50px;line-height: 50px;">
              <el-popover placement="top" width="160" v-model="logoutVisible">
                <p>确认退出?</p>
                <div style="text-align: right; margin: 0">
                  <el-button size="mini" type="text" @click="logoutVisible = false">取消</el-button>
                  <el-button type="primary" size="mini" @click="logout">确定
                  </el-button>
                </div>
                <a slot="reference" class="el-icon-switch-button logout-btn"></a>
              </el-popover>
            </li>
          </ul>
        </div><!-- /.navbar-collapse -->
      </div><!-- /.container-fluid -->
    </nav>
    <!-- menu -->
    <el-menu default-active="0" class="el-menu-vertical-demo menu" :collapse="isCollapse" background-color="#293c55"
      text-color="#fff" active-text-color="#a9334c">
      <router-link to="/homePage">
        <el-menu-item index="0">
          <i class="el-icon-s-help"></i>
          <span slot="title">系统首页</span>
        </el-menu-item>
      </router-link>
      <router-link to="/userList">
        <el-menu-item index="1">
          <i class="el-icon-user-solid"></i>
          <span slot="title">用户管理</span>
        </el-menu-item>
      </router-link>
      <el-submenu index="2">
        <template slot="title">
          <i class="el-icon-s-management"></i>
          <span slot="title">博客管理</span>
        </template>
        <router-link to="/blogList">
          <el-menu-item index="2-1">
            <i class="el-icon-tickets"></i>
            <span slot="title">博客管理</span>
          </el-menu-item>
        </router-link>
        <router-link to="/commentList">
          <el-menu-item index="2-2">
            <i class="el-icon-s-comment"></i>
            <span slot="title">评论管理</span>
          </el-menu-item>
        </router-link>
      </el-submenu>
      <el-submenu index="3">
        <template slot="title">
          <i class="el-icon-location"></i>
          <span slot="title">消息管理</span>
        </template>
        <router-link to="/report">
          <el-menu-item index="3-1">
            <i class="el-icon-s-check"></i>
            <span slot="title">举报管理</span>
          </el-menu-item>
        </router-link>
        <router-link to="/feedback">
          <el-menu-item index="3-2">
            <i class="el-icon-s-opportunity"></i>
            <span slot="title">反馈管理</span>
          </el-menu-item>
        </router-link>
      </el-submenu>
    </el-menu>
    <!-- router -->
    <router-view></router-view>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        logoutVisible: false,
        username: '',
        isCollapse: true
      }
    },
    created() {
      this.username = JSON.parse(sessionStorage.getItem('bmob')).username
    },
    components: {},
    methods: {
      logout() {
        sessionStorage.removeItem('bmob');
        this.$router.push({
          path: '/login'
        })
      },
      handleOpen(key, keyPath) {
        console.log(key, keyPath);
      },
      handleClose(key, keyPath) {
        console.log(key, keyPath);
      }
    }
  }

</script>

<style scoped>
  .navbar-brand {
    padding-top: 5px;
    padding-bottom: 5px;
  }

  .navbar-brand img {
    width: 40px;
    height: 40px;
    content: url('../assets/img/logo.png')
  }

  /* li {
    width: 50px;
    height: 50px;
    line-height: 50px;
    cursor: pointer;
  } */

  a {
    text-decoration: none;
    color: black;
  }

  .c-pointer {
    cursor: pointer;
  }

  .logout-btn {
    color: #666;
  }

  .logout-btn:hover {
    color: #fff;
  }

  .menu {
    min-height: 100vh;
    padding-top: 50px;
    position: fixed;
  }

  .navbar-inverse {
    background: #293c55;
    -moz-box-shadow: 1px 2px 4px rgb(74, 74, 74);
    -webkit-box-shadow: 1px 2px 4px rgb(74, 74, 74);
    box-shadow: 1px 2px 4px rgb(74, 74, 74);
  }

  /* .el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 200px;
    min-height: 400px;
  }

  .el-menu {
    position: fixed;
  }

  .el-menu--collapse {
    width: 64px;
    padding-top: 50px;
    min-height: 100vh;
  } */

</style>
