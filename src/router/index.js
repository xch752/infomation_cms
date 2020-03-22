import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login'
import Home from '@/components/Home'
import HomePage from '@/components/home/HomePage'
import UserList from '@/components/user/UserList'
import BlogList from '@/components/blog/BlogList'
import CommentList from '@/components/blog/CommentList'
import Report from '@/components/message/Report'
import Feedback from '@/components/message/Feedback'

Vue.use(Router)

export default new Router({
  routes: [{
      path: '/',
      name: 'home',
      component: Home,
      children: [
        // 首页
        {
          path: '/homePage',
          name: 'homePage',
          component: HomePage
        },
        // 用户
        {
          path: '/userList',
          name: 'userList',
          component: UserList
        },
        // 博客
        {
          path: '/blogList',
          name: 'blogList',
          component: BlogList
        },
        // 博客
        {
          path: '/commentList',
          name: 'commentList',
          component: CommentList
        },
        // 举报
        {
          path: '/report',
          name: 'report',
          component: Report
        },
        // 反馈
        {
          path: '/feedback',
          name: 'feedback',
          component: Feedback
        }
      ]
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    }
  ]
})
