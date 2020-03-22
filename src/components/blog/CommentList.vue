<template>
  <div class="children-page">
    <!-- 表格 -->
    <el-table :data="list" style="width: 100%" v-loading="tableLoading" stripe>
      <!-- 表格体 -->
      <el-table-column prop="objectId" label="id">
      </el-table-column>
      <!-- <el-table-column label="头像">
        <template slot-scope="scope">
          <div class="avatar" :style="{ 'background-image': 'url(' + scope.row.creator.avatarUrl + ')'}"></div>
        </template>
      </el-table-column> -->
      <el-table-column prop="creator.nickname" label="评论人">
      </el-table-column>
      <el-table-column prop="review" label="评论">
      </el-table-column>
      <el-table-column align="right">
        <template slot="header" slot-scope="scope">
          <el-input v-model="key" @keydown.enter.native="initList();getTotal()" placeholder="请输入关键字"></el-input>
        </template>
        <template slot-scope="scope">
          <el-button type="danger" size="small" icon="el-icon-close" circle plain @click="reset(scope.row.objectId)">
          </el-button>
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
        closeComment: '该评论已删除'
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
        const query = Bmob.Query('Comment')
        if (this.key) {
          const query1 = query.equalTo("objectId", '===', {
            "$regex": "" + this.key + ".*"
          })
          const query2 = query.equalTo("review", '===', {
            "$regex": "" + this.key + ".*"
          })
          query.or(query1, query2)
        }
        query.count().then(res => {
          this.total = res
        })
      },
      // 第一页
      initList() {
        this.tableLoading = true
        const query = Bmob.Query('Comment')
        query.include('creator')
        query.order('-createdAt')
        if (this.key) {
          const query1 = query.equalTo("objectId", '===', {
            "$regex": "" + this.key + ".*"
          })
          const query2 = query.equalTo("review", '===', {
            "$regex": "" + this.key + ".*"
          })
          query.or(query1, query2)
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
        const query = Bmob.Query('Comment')
        query.include('creator')
        query.order('-createdAt')
        if (this.key) {
          const query1 = query.equalTo("objectId", '===', {
            "$regex": "" + this.key + ".*"
          })
          const query2 = query.equalTo("review", '===', {
            "$regex": "" + this.key + ".*"
          })
          query.or(query1, query2)
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
      reset(objectId) {
        this.tableLoading = true
        const query = Bmob.Query('Comment')
        query.get(objectId).then(res => {
          res.set('review', this.closeComment)
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
