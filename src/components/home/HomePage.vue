<template>
  <div class="children-page">
    <!-- 数据汇总 -->
    <div style="margin:24px 0 0 50px;">
      <strong class="title el-icon-s-flag"> 数据汇总</strong>
    </div>
    <!-- 分割线 -->
    <div style="margin:0 50px;">
      <el-divider></el-divider>
    </div>
    <el-row :gutter="50" style="margin:0 30px" v-loading="dataLoading">
      <el-col :xs="24" :sm="12" :md="6" :lg="6" :xl="6">
        <div class="tip1">
          <div class="tip1_1">
            <i class="el-icon-user-solid"></i> 用户总数
          </div>
          <div class="tip1_2">{{dataRes.userCount}}</div>
        </div>
      </el-col>
      <el-col :xs="24" :sm="12" :md="6" :lg="6" :xl="6">
        <div class="tip2">
          <div class="tip1_1">
            <i class="el-icon-user-solid"></i> 博客总数
          </div>
          <div class="tip1_2">{{dataRes.blogCount}}</div>
        </div>
      </el-col>
      <el-col :xs="24" :sm="12" :md="6" :lg="6" :xl="6">
        <div class="tip3">
          <div class="tip1_1">
            <i class="el-icon-user-solid"></i> 点赞总数
          </div>
          <div class="tip1_2">{{dataRes.likeCount}}</div>
        </div>
      </el-col>
      <el-col :xs="24" :sm="12" :md="6" :lg="6" :xl="6">
        <div class="tip4">
          <div class="tip1_1">
            <i class="el-icon-user-solid"></i> 评论总数
          </div>
          <div class="tip1_2">{{dataRes.commentCount}}</div>
        </div>
      </el-col>
    </el-row>
    <!-- 整体趋势 -->
    <div style="margin:24px 0 0 50px;">
      <strong class="title el-icon-s-marketing"> 整体趋势</strong>
    </div>
    <!-- 分割线 -->
    <div style="margin:0 50px;">
      <el-divider></el-divider>
    </div>
    <el-row style="margin-bottom:20px;">

    </el-row>
    <!-- 图表 -->
    <el-row>
      <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
        <!-- 用户饼图 -->
        <div class="blank" id="UserPie" :style="{ height: '30vw' }" v-loading="userChartLoading"></div>
      </el-col>
      <el-col :xs="24" :sm="24" :md="11" :lg="11" :xl="11">
        <!-- 博客饼图 -->
        <div class="blank" id="BlogPie" :style="{ height: '30vw' }" v-loading="blogChartLoading"></div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        dataLoading: false,
        dataRes: {
          userCount: 0,
          blogCount: 0,
          likeCount: 0,
          commentCount: 0
        },
        userChartLoading: false,
        blogChartLoading: false,
        parts: [],
      }
    },
    components: {},
    mounted() {
      this.retrieveHomeData()
      this.retrieveChartDataUser()
      this.retrieveChartDataBlog()
    },
    methods: {
      // 获取首页数据
      retrieveHomeData() {
        this.dataLoading = true

        const queryUser = Bmob.Query('_User')
        let p1 = queryUser.count()

        const queryBlog = Bmob.Query('MicroBlog')
        let p2 = queryBlog.count()

        const queryLike = Bmob.Query('Like')
        let p3 = queryLike.count()

        const queryComment = Bmob.Query('Comment')
        let p4 = queryComment.count()

        Promise.all([p1, p2, p3, p4]).then(result => {
          this.dataLoading = false
          this.dataRes.userCount = result[0]
          this.dataRes.blogCount = result[1]
          this.dataRes.likeCount = result[2]
          this.dataRes.commentCount = result[3]
        }).catch(err => {
          this.dataLoading = false
          this.$notify.error({
            title: '错误',
            message: err
          })
        })
      },
      // 用户图表
      retrieveChartDataUser() {
        this.userChartLoading = true
        const queryM = Bmob.Query('_User')
        queryM.equalTo('sex', '===', 'm')
        let pM = queryM.count()

        const queryF = Bmob.Query('_User')
        queryF.equalTo('sex', '===', 'f')
        let pF = queryF.count()

        const queryO = Bmob.Query('_User')
        queryO.equalTo('sex', '===', 'o')
        let pO = queryO.count()

        const queryU = Bmob.Query('_User')
        queryU.doesNotExist('sex')
        let pU = queryU.count()

        Promise.all([pM, pF, pO, pU]).then(res => {
          this.userChartLoading = false
          let myChart = this.$echarts.init(
            document.getElementById("UserPie"),
            "walden"
          )
          let option = {

            title: {
              text: '用户分布',
              left: 'center',
              top: 20,
              textStyle: {
                color: '#000000'
              }
            },

            tooltip: {
              trigger: 'item',
              formatter: '{a} <br/>{b} : {c} ({d}%)'
            },

            visualMap: {
              show: false,
              min: Math.min.apply(null, res),
              max: Math.max.apply(null, res) * 1.5,
              inRange: {
                colorLightness: [0, 1]
              }
            },
            series: [{
              name: '用户分布',
              type: 'pie',
              radius: '55%',
              center: ['50%', '50%'],
              data: [{
                  value: res[0],
                  name: '男性'
                },
                {
                  value: res[1],
                  name: '女性'
                },
                {
                  value: res[2],
                  name: '保密'
                },
                {
                  value: res[3],
                  name: '未知'
                }
              ].sort(function (a, b) {
                return a.value - b.value;
              }),
              roseType: 'radius',
              label: {
                color: '#000000'
              },
              labelLine: {
                lineStyle: {
                  color: '#000000'
                },
                smooth: 0.2,
                length: 10,
                length2: 20
              },
              animationType: 'scale',
              animationEasing: 'elasticOut',
              animationDelay: function (idx) {
                return Math.random() * 200;
              }
            }]
          };
          myChart.setOption(option);
        }).catch(err => {
          this.dataLoading = false
          this.$notify.error({
            title: '错误',
            message: err
          })
        })
      },
      // 博客图表
      retrieveChartDataBlog() {
        this.blogChartLoading = true
        const queryParts = this.Bmob.Query('Parts')
        queryParts.order('partIndex')
        queryParts.find().then(res => {
          let pArr = new Array(res.length)
          let query = new Array(res.length)
          for (let index in res) {
            query[index] = Bmob.Query('MicroBlog')
            query[index].equalTo('part', '===', res[index].partIndex)
            pArr[index] = query[index].count()
          }
          Promise.all(pArr).then(result => {
            for (let i in res) {
              res[i].value = result[i]
            }
            this.blogChartLoading = false
            let myChart = this.$echarts.init(
              document.getElementById("BlogPie"),
              "walden"
            )
            let option = {

              title: {
                text: '博客分布',
                left: 'center',
                top: 20,
                textStyle: {
                  color: '#000000'
                }
              },

              tooltip: {
                trigger: 'item',
                formatter: '{a} <br/>{b} : {c} ({d}%)'
              },

              visualMap: {
                show: false,
                min: Math.min.apply(null, result),
                max: Math.max.apply(null, result) * 1.5,
                inRange: {
                  colorLightness: [0, 1]
                }
              },
              series: [{
                name: '博客分布',
                type: 'pie',
                radius: '55%',
                center: ['50%', '50%'],
                data: [],
                roseType: 'radius',
                label: {
                  color: '#000000'
                },
                labelLine: {
                  lineStyle: {
                    color: '#000000'
                  },
                  smooth: 0.2,
                  length: 10,
                  length2: 20
                },
                animationType: 'scale',
                animationEasing: 'elasticOut',
                animationDelay: function (idx) {
                  return Math.random() * 200;
                }
              }]
            };
            option.series[0].data = res.map(item => {
              return Object.assign({}, {
                value: item.value,
                name: item.partName
              })
            })
            myChart.setOption(option)
          }).catch(err => {
            this.blogChartLoading = false
            this.$notify.error({
              title: '错误',
              message: err
            })
          })
        })
      }
    }
  }

</script>

<style scoped>
  .title {
    font-size: 1.3em;
  }

  .blank {
    min-height: 1px;
  }

  .tip1 {
    margin: 20px 0;
    width: 100%;
    min-height: 140px;
    border-radius: 6px;
    background: url("../../assets/img/tip1.png") no-repeat center top;
    background-size: cover;
  }

  .tip1_1 {
    padding: 40px 0 0 65px;
    color: white;
    font-size: 1.5em;
    display: block;
    text-align: left;
    width: 100%;
  }

  .tip1_2 {
    padding: 0 0 0 90px;
    color: white;
    font-size: 1.8em;
    display: block;
    text-align: left;
    width: 100%;
  }

  .tip2 {
    margin: 20px 0;
    width: 100%;
    min-height: 140px;
    border-radius: 6px;
    background: url("../../assets/img/tip2.png") no-repeat center top;
    background-size: cover;
  }

  .tip3 {
    margin: 20px 0;
    width: 100%;
    min-height: 140px;
    border-radius: 6px;
    background: url("../../assets/img/tip3.png") no-repeat center top;
    background-size: cover;
  }

  .tip4 {
    margin: 20px 0;
    width: 100%;
    min-height: 140px;
    border-radius: 6px;
    background: url("../../assets/img/tip4.png") no-repeat center top;
    background-size: cover;
  }

  .tip01 {
    padding: 40px 0 0 20px;
  }

  .tip02 {
    padding: 0 0 0 40px;
  }

  .tip03 {
    padding: 40px 0 0 10px;
    font-size: 1em;
  }

  .tip04 {
    padding: 20px 0 0 10px;
    font-size: 1em;
  }

  .c-pointer {
    cursor: pointer;
  }

</style>
