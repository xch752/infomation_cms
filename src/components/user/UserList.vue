<template>
  <div class="children-page">
    <!-- 表格 -->
    <el-table :data="list" style="width: 100%" v-loading="tableLoading" stripe>
      <!-- expand -->
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="昵称">
              <span>{{ props.row.nickname }}</span>
              <el-button type="danger" size="small" icon="el-icon-close" circle plain
                @click="unpass(props.row.objectId,'nickname')"></el-button>
            </el-form-item>
            <el-form-item label="个人介绍">
              <span>{{ props.row.introduction }}</span>
              <el-button type="danger" size="small" icon="el-icon-close" circle plain
                @click="unpass(props.row.objectId,'introduction')"></el-button>
            </el-form-item>
            <el-form-item label="头像">
              <div style="display:inline-flex">
                <div class="avatar" :style="{ 'background-image': 'url(' + props.row.avatarUrl + ')'}"></div>
                <el-button style="width: 32px;height: 32px;margin: 4px 10px;" type="danger" size="small"
                  icon="el-icon-close" circle plain @click="unpass(props.row.objectId,'avatarUrl')"></el-button>
              </div>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <!-- 表格体 -->
      <el-table-column prop="objectId" label="id">
      </el-table-column>
      <el-table-column prop="nickname" label="昵称">
      </el-table-column>
      <el-table-column label="头像">
        <template slot-scope="scope">
          <div class="avatar" :style="{ 'background-image': 'url(' + scope.row.avatarUrl + ')'}"></div>
        </template>
      </el-table-column>
      <el-table-column prop="username" label="用户名/手机号">
      </el-table-column>
      <el-table-column label="性别">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.sex==='m'" type="info">男</el-tag>
          <el-tag v-else-if="scope.row.sex==='f'" type="danger">女</el-tag>
          <el-tag v-else-if="scope.row.sex==='o'" type="warning">保密</el-tag>
          <el-tag v-else>未知</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="introduction" label="个人介绍">
      </el-table-column>
      <el-table-column prop="birthday" label="生日">
      </el-table-column>
      <el-table-column align="right">
        <template slot="header" slot-scope="scope">
          <el-input v-model="key" @keydown.enter.native="initList();getTotal()" placeholder="请输入关键字"></el-input>
        </template>
        <template slot-scope="scope">
          <!-- 冻结三种状态 -->
          <!-- 解封 -->
          <el-tooltip v-if="scope.row.status == 'freeze'" class="item" effect="dark" content="解封" placement="top">
            <el-button type="success" size="small" icon="el-icon-unlock" circle plain
              @click="freeze(scope.row.objectId,'')"></el-button>
          </el-tooltip>
          <!-- 冻结  -->
          <el-tooltip v-else class="item" effect="dark" content="冻结" placement="top">
            <el-button type="danger" size="small" icon="el-icon-lock" circle plain
              @click="freeze(scope.row.objectId,'freeze')">
            </el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination @current-change="currentChange" :page-size="pageSize" layout="prev, pager, next, jumper" background
      :total="total">
    </el-pagination>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        list: [{}],
        pageNum: 1,
        pageSize: 20,
        total: 0,
        tableLoading: false,
        key: '',
        defaultAva: 'http://static.xch752.com/defaultAvatar.jpg'
      }
    },
    components: {},
    mounted() {
      this.getTotal()
      this.initList()
    },
    methods: {
      // 获取总数
      getTotal() {
        const query = Bmob.Query('_User')
        if (this.key) {
          const query1 = query.equalTo("objectId", '===', {
            "$regex": "" + this.key + ".*"
          })
          const query2 = query.equalTo("username", '===', {
            "$regex": "" + this.key + ".*"
          })
          const query3 = query.equalTo("nickname", '===', {
            "$regex": "" + this.key + ".*"
          })
          query.or(query1, query2, query3)
        }
        query.count().then(res => {
          this.total = res
        })
      },
      // 第一页
      initList() {
        this.tableLoading = true
        const query = Bmob.Query('_User')
        query.order('-createdAt')
        if (this.key) {
          const query1 = query.equalTo("objectId", '===', {
            "$regex": "" + this.key + ".*"
          })
          const query2 = query.equalTo("username", '===', {
            "$regex": "" + this.key + ".*"
          })
          const query3 = query.equalTo("nickname", '===', {
            "$regex": "" + this.key + ".*"
          })
          query.or(query1, query2, query3)
        }
        query.limit(this.pageSize)
        query.find().then(res => {
          this.tableLoading = false
          this.list = res
        }).catch(err => {
          this.tableLoading = false
          this.$notify.error({
            title: '错误',
            message: err
          })
        })
      },
      // 分页
      currentChange(pageNum) {
        this.pageNum = pageNum
        this.tableLoading = true
        const query = Bmob.Query('_User')
        query.order('-createdAt')
        if (this.key) {
          const query1 = query.equalTo("objectId", '===', {
            "$regex": "" + this.key + ".*"
          })
          const query2 = query.equalTo("username", '===', {
            "$regex": "" + this.key + ".*"
          })
          const query3 = query.equalTo("nickname", '===', {
            "$regex": "" + this.key + ".*"
          })
          query.or(query1, query2, query3)
        }
        query.limit(this.pageSize)
        query.skip(this.pageSize * (this.pageNum - 1))
        query.find().then(res => {
          this.tableLoading = false
          this.list = res
        }).catch(err => {
          this.tableLoading = false
          this.$notify.error({
            title: '错误',
            message: err
          })
        })
      },
      // 冻结&解封
      freeze(objectId, status) {
        this.tableLoading = true
        const query = Bmob.Query('_User')
        query.get(objectId).then(res => {
          res.set('status', status)
          res.save()
          this.tableLoading = false
          this.$notify.success({
            title: '成功'
          })
          this.currentChange(this.pageNum)
        }).catch(err => {
          this.tableLoading = false
          this.$notify.error({
            title: '错误',
            message: err
          })
        })
      },
      // 不通过
      unpass(objectId, name) {
        this.tableLoading = true
        const query = Bmob.Query('_User')
        query.get(objectId).then(res => {
          switch (name) {
            case 'nickname':
              res.set('nickname', '用户' + this.randomWord(true, 5, 10))
              res.save()
              break;
            case 'introduction':
              res.set('introduction', '')
              res.save()
              break;
            case 'avatarUrl':
              res.set('avatarUrl', this.defaultAva)
              res.save()
              break;
          }
          this.tableLoading = false
          this.$notify.success({
            title: '成功'
          })
          this.currentChange(this.pageNum)
        }).catch(err => {
          this.tableLoading = false
          this.$notify.error({
            title: '错误',
            message: err
          })
        })
      },
      // 随机字符串
      randomWord(randomFlag, min, max) {
        var str = "",
          range = min,
          arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j',
            'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E',
            'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'
          ];

        // 随机产生
        if (randomFlag) {
          range = Math.round(Math.random() * (max - min)) + min;
        }
        for (var i = 0; i < range; i++) {
          var pos = Math.round(Math.random() * (arr.length - 1));
          str += arr[pos];
        }
        return str;
      }
    }
  }

</script>

<style scoped>
  .avatar {
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center center;
    width: 40px;
    height: 40px;
    border-radius: 50%;
  }

  .el-form-item__content {
    display: inline-flex;
  }

</style>
