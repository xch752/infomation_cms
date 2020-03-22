<template>
  <div class="children-page">
    <!-- 表格 -->
    <el-table :data="list" style="width: 100%" v-loading="tableLoading" stripe>
      <!-- expand -->
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" class="demo-table-expand">
            <el-form-item v-if="props.row.reportBlog.content">
              <span>{{props.row.reportBlog.content}}</span>
              <el-button type="danger" size="small" icon="el-icon-close" circle plain
                @click="unpassContent(props.row.reportBlog.objectId)"></el-button>
            </el-form-item>
            <el-form-item>
              <div style="display:inline-flex">
                <div v-for="(item,index) in props.row.reportBlog.imgList" :key="index">
                  <el-image class="imgList" :src="item" fit="cover" :preview-src-list="props.row.reportBlog.imgList">
                  </el-image>
                  <el-button type="danger" size="small" icon="el-icon-close" circle plain
                    @click="unpassImg(props.row.reportBlog.objectId,index,props.row.reportBlog.imgList)"></el-button>
                </div>
              </div>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <!-- 表格体 -->
      <el-table-column prop="objectId" label="id">
      </el-table-column>
      <el-table-column prop="reportUser.nickname" label="举报人">
      </el-table-column>
      <el-table-column prop="content" label="举报内容">
      </el-table-column>
      <el-table-column label="举报图片">
        <template slot-scope="scope">
          <div v-if="scope.row.imgList" v-for="item in scope.row.imgList" :key="item">
            <el-image class="imgList" :src="item" fit="cover" :preview-src-list="scope.row.imgList"></el-image>
          </div>
        </template>
      </el-table-column>
      <el-table-column align="right">
        <template slot="header" slot-scope="scope">
          <el-input v-model="key" @keydown.enter.native="initList();getTotal()" placeholder="请输入关键字"></el-input>
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
        loseImg: 'http://static.xch752.com/lose_efficacy.jpg'
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
        const query = Bmob.Query('Report')
        if (this.key) {
          const query1 = query.equalTo("objectId", '===', {
            "$regex": "" + this.key + ".*"
          })
          const query2 = query.equalTo("content", '===', {
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
        const query = Bmob.Query('Report')
        query.include('reportBlog', 'reportUser')
        query.order('-createdAt')
        if (this.key) {
          const query1 = query.equalTo("objectId", '===', {
            "$regex": "" + this.key + ".*"
          })
          const query2 = query.equalTo("content", '===', {
            "$regex": "" + this.key + ".*"
          })
          query.or(query1, query2)
        }
        query.limit(this.pageSize)
        query.find().then(res => {
          res.map(item => {
            if (item.imgList) {
              item.imgList = item.imgList.split(',')
            }
            if (item.reportBlog.imgList) {
              item.reportBlog.imgList = item.reportBlog.imgList.split(',')
            }
          })
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
        const query = Bmob.Query('Report')
        query.include('reportBlog', 'reportUser')
        query.order('-createdAt')
        if (this.key) {
          const query1 = query.equalTo("objectId", '===', {
            "$regex": "" + this.key + ".*"
          })
          const query2 = query.equalTo("content", '===', {
            "$regex": "" + this.key + ".*"
          })
          query.or(query1, query2)
        }
        query.limit(this.pageSize)
        query.skip(this.pageSize * (this.pageNum - 1))
        query.find().then(res => {
          res.map(item => {
            if (item.imgList) {
              item.imgList = item.imgList.split(',')
            }
            if (item.reportBlog.imgList) {
              item.reportBlog.imgList = item.reportBlog.imgList.split(',')
            }
          })
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
      unpassImg(objectId, index, imgList) {
        this.tableLoading = true
        imgList[index] = this.loseImg
        const query = Bmob.Query('MicroBlog')
        query.get(objectId).then(res => {
          res.set('imgList', imgList.join(','))
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
      unpassContent(objectId) {
        this.tableLoading = true
        const query = Bmob.Query('MicroBlog')
        query.get(objectId).then(res => {
          res.set('content', '')
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

  .imgList {
    width: 100px;
    height: 100px;
  }

</style>
