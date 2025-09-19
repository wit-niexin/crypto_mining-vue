<template>
  <div style="padding: 24px 0; background: none;">
    <!-- 顶部四个统计卡片 -->
    <div class="card-row">
      <div class="stat-card green">
        <div class="icon-circle">
          <el-icon style="vertical-align: middle;">
            <Connection/>
          </el-icon>
        </div>
        <div class="value">{{ totalProfit }} <span>USDT</span></div>
        <div class="label">总收益</div>
      </div>
      <div class="stat-card blue">
        <div class="icon-circle">
          <el-icon style="vertical-align: middle;">
            <Histogram/>
          </el-icon>
        </div>
        <div class="value">{{ todayProfit }} <span>USDT</span></div>
        <div class="label">今日收益</div>
      </div>
      <div class="stat-card yellow">
        <div class="icon-circle">
          <el-icon style="vertical-align: middle;">
            <DataAnalysis/>
          </el-icon>
        </div>
        <div class="value">{{ annualizedReturn }} <span>%</span></div>
        <div class="label">年化收益率</div>
      </div>
      <div class="stat-card purple">
        <div class="icon-circle">
          <el-icon style="vertical-align: middle;">
            <Postcard/>
          </el-icon>
        </div>
        <div class="value">{{ walletBalance }} <span>USDT</span></div>
        <div class="label">钱包余额</div>
      </div>
    </div>

    <!-- 收益趋势 -->
    <div class="block">
      <div class="block-title" style="flex-wrap: wrap;">
        <div style="display: flex; align-items: center;">
          <span>📈 收益趋势</span>
          <!--
          <el-date-picker
              v-model="selectedYear"
              type="year"
              size="small"
              value-format="YYYY"
              format="YYYY年"
              style="width: 100px; margin-left: 16px;"
              @change="updateChart"
          />
          -->
        </div>
        <el-radio-group v-model="trendTab" size="small" style="margin-left: 20px;" @change="updateChart">
          <el-radio-button label="累计">累计</el-radio-button>
          <el-radio-button label="日期">日期</el-radio-button>
        </el-radio-group>
      </div>
      <div class="trend-summary">
        <div class="trend-summary-row">
          <div>
            <div class="trend-label">平均年化</div>
            <div class="trend-value-green">+ {{ annualizedReturn }} %</div>
          </div>
          <div style="text-align: right;">
            <div class="trend-label">收益</div>
            <div class="trend-value-green" style="color: #2ecc71;">+￥{{ totalProfit }}</div>
          </div>
        </div>
        <div class="trend-date-range">
          <template v-if="sortedData.length">
            {{ dateRangeText }}
          </template>
          <template v-else>
            加载中…
          </template>
        </div>
      </div>
      <div ref="chartRef" style="height: 180px; width: 100%;"></div>
    </div>


    <!-- 机器列表 -->
    <div class="block">
      <div class="block-title">🤖 机器列表</div>
      <el-table :data="machineList" style="width: 100%;" size="small">
        <el-table-column prop="miningRigName" label="" min-width="25%"/>
        <el-table-column prop="status" label="" min-width="25%">
          <template #default="{ row }">
            <el-tag :type="statusType(row.status)" disable-transitions>{{statusText(row.status)}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="daysRunning" label="" min-width="25%">
          <template #default="{ row }">
            {{ row.daysRunning }} 天
          </template>
        </el-table-column>
        <el-table-column prop="cumulativeReturn" label="" min-width="25%">
          <template #default="{ row }">
            {{ row.cumulativeReturn }} U
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 公告栏 -->
    <div class="block">
      <div class="block-title">
        <span>📢 公告栏</span>
        <div style="float: right;">
          <!--
          <el-button size="small" type="text">一键已读</el-button>
          <el-button size="small" type="primary" plain>查看全部</el-button>
          -->
        </div>
      </div>
      <ul class="notice-list">
        <li v-for="item in noticeList" :key="item.id" class="notice-item">
          <span class="dot"></span>
          <span class="notice-title">{{ item.title }}</span>
          <span class="notice-time">{{ item.time }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import {ref, nextTick, onMounted, onUnmounted, watch, computed} from 'vue'
import * as echarts from 'echarts'
import {getUserDashboard, getUserDashboardChart} from "@/api/dashboard"
import {getBenefitAllPage} from "@/api/reflect"
import useStore from "@/store";
import {storeToRefs} from "pinia";

const {user} = useStore();
const {username} = storeToRefs(user);
const totalProfit = ref(0)
const todayProfit = ref(0)
const annualizedReturn = ref(0)
const walletBalance = ref(0)
const machineList = ref([])
const trendTab = ref('累计')
const chartRef = ref(null)
let chart = null
let resizeHandler = null
const sortedData = ref([])
let chartLabelsYear = []
let chartDataYear = []
let chartLabelsDay = []
let chartDataDay = []

//const chartDataYear = [0, 10, 18, 27, 37] // 示例：年累计收益
//const chartLabelsYear = ['08/07', '11/10', '02/03', '05/03', '08/06']
//const chartDataMonth = [0.6, 0.7, 0.7, 0.9, 1.1, 0.8, 0.8, 0.8, 0.8, 1.6, 1.7, 1.5] // 示例：每月收益
//const chartLabelsMonth = ['09月', '10月', '11月', '12月', '01月', '02月', '03月', '04月', '05月', '06月', '07月', '08月']

const dateRangeText = computed(() => {
  if (trendTab.value === '累计') {
    const start = sortedData.value[0].createDate.slice(0, 10);
    const end   = sortedData.value[sortedData.value.length - 1].createDate.slice(0, 10);
    return `${start} - ${end}`;
  }
  else if (trendTab.value === '日期') {
    const start = sortedData.value[0].createDate.slice(0, 10);
    const end   = sortedData.value[sortedData.value.length - 1].createDate.slice(0, 10);
    return `${start} - ${end}`;
  } else{
    return 'very good'
  }
});

function updateChart() {
  if (!chart) return
  if (trendTab.value === '累计') {
    chart.setOption({
      xAxis: {
        type: 'category',
        data: chartLabelsYear,
        boundaryGap: false,
        axisLine: {show: false},
        axisTick: {show: false},
        axisLabel: {color: '#888', fontSize: 10}
      },
      yAxis: {
        type: 'value',
        splitLine: {lineStyle: {color: '#eee'}},
        axisLine: {show: false},
        axisTick: {show: false},
        axisLabel: {color: '#888', fontSize: 10}
      },
      series: [{
        data: chartDataYear,
        type: 'line',
        smooth: true,
        areaStyle: {color: '#e3f2fd'},
        lineStyle: {color: '#2ecc71'},
        symbol: 'circle',
        symbolSize: 6
      }],
      tooltip: {
        trigger: 'axis',
        formatter: params => {
          const p = params[0]
          return `${p.axisValue}<br/>收益：+￥${p.data.toFixed(2)}`
        }
      },
      grid: {left: 20, right: 20, top: 20, bottom: 20}
    })
  } else {
    chart.setOption({
      xAxis: {
        type: 'category',
        data: chartLabelsDay,
        boundaryGap: true,
        axisLine: {show: false},
        axisTick: {show: false},
        axisLabel: {color: '#888', fontSize: 10}
      },
      yAxis: {
        type: 'value',
        splitLine: {lineStyle: {color: '#eee'}},
        axisLine: {show: false},
        axisTick: {show: false},
        axisLabel: {color: '#888', fontSize: 10}
      },
      series: [{
        data: chartDataDay,
        type: 'bar',
        itemStyle: {color: '#2ecc71', borderRadius: [4, 4, 0, 0]},
        barWidth: '60%'
      }],
      tooltip: {
        trigger: 'axis',
        formatter: params => {
          const p = params[0]
          return `${p.axisValue}<br/>月收益：+￥${p.data.toFixed(2)}`
        }
      },
      grid: {left: 20, right: 20, top: 20, bottom: 20}
    })
  }
}

onMounted(() => {
  chart = echarts.init(chartRef.value)
  resizeHandler = () => chart.resize()
  window.addEventListener('resize', resizeHandler)
})

onUnmounted(() => {
  if (resizeHandler) {
    window.removeEventListener('resize', resizeHandler)
    resizeHandler = null
  }
  if (chart) {
    chart.dispose()
    chart = null
  }
})

watch(
    [trendTab, chartLabelsDay, chartDataDay, chartLabelsYear, chartDataYear],
    () => {
      // 数据为空就不画
      if (trendTab.value === '日期' && !chartLabelsDay.length) return
      updateChart()
    }
)

const noticeList = [
  {id: 1, title: '比特币挖矿市场行情：最新动态与趋势分析', time: '2025-07-21 10:00'},
  {id: 2, title: '2024年比特币挖矿市场：行情回顾与展望', time: '2025-07-22 11:01'},
  {id: 3, title: '比特币挖矿市场行情：算力增长与收益变化', time: '2025-07-29 12:02'},
  {id: 4, title: '比特币挖矿市场行情：价格波动与挖矿成本分析', time: '2025-08-02 13:03'},
  {id: 5, title: '2025年比特币挖矿市场：行业动态与未来展望', time: '2025-08-10 14:04'}
]

function statusText(status) {
  switch (status) {
    case 0:
      return "在线";
    case 1:
      return "离线";
    case 2:
      return "失效";
    default:
      return status;
  }
}

function statusType(status) {
  if (status === 0) return 'success'
  if (status === 1) return 'warning'
  if (status === 2) return 'danger'
  return 'info'
}

function handleSearch() {
  getUserDashboard({
    name: username.value
  }).then(res=>{
    totalProfit.value = res.data.totalProfit
    todayProfit.value = res.data.todayProfit
    annualizedReturn.value = res.data.annualizedReturn
    walletBalance.value = res.data.walletBalance
  })

  getBenefitAllPage({
    current: 1,
    size: 10,
    name: username.value
  }).then(res => {
    machineList.value = res.data.records
  })

  getUserDashboardChart({
    name: username.value
  }).then(res => {
    sortedData.value = res.data.slice().reverse()
    chartLabelsDay = sortedData.value.map(item => {
      const date = new Date(item.createDate);
      const day = date.getDate();
      const month = date.getMonth() + 1;
      return `${day}/${month}`;
    });
    chartLabelsYear = chartLabelsDay;
    chartDataDay = sortedData.value.map(item => item.todayProfit.toString());
    chartDataYear = sortedData.value.map(item => item.totalProfit.toString());

    nextTick(updateChart)
  })
}

handleSearch()
</script>

<style scoped>
.card-row {
  display: flex;
  gap: 20px;
  margin-bottom: 24px;
  flex-wrap: wrap;
}

.stat-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 20px;
  border-radius: 12px;
  min-width: 0;
}

/* 手机端：2个一排 */
@media (max-width: 768px) {
  .card-row {
    gap: 12px;
  }

  .stat-card {
    /* flex: 1 1 calc(50% - 12px); */
    min-width: calc(50% - 47px);
    margin-bottom: 12px;
  }
}

/* PC端：4个一排 */
@media (min-width: 769px) {
  .stat-card {
    flex: 1 1 0;
    min-width: 0;
    margin-bottom: 0;
  }
}

.stat-card.blue {
  background: #f6faff;
}

.stat-card.yellow {
  background: #fffbe6;
}

.stat-card.purple {
  background: #f8f6ff;
}

.stat-card.green {
  background: #e6fff6;
}

.stat-card .icon-circle {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 8px;
  font-size: 28px;
  background: #eaf3ff;
  color: #409EFF;
}

.stat-card.green .icon-circle {
  background: #d2faea;
  color: #1abc9c;
}

.stat-card.yellow .icon-circle {
  background: #fff3d6;
  color: #e6a23c;
}

.stat-card.purple .icon-circle {
  background: #ede7ff;
  color: #8e6fff;
}

.stat-card .value {
  font-size: 28px;
  font-weight: bold;
  margin-bottom: 4px;
}

.stat-card .value span {
  font-size: 14px;
  color: #888;
  margin-left: 2px;
}

.stat-card .label {
  font-size: 14px;
  color: #888;
}

.block {
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 24px;
  box-shadow: 0 2px 8px 0 #f0f1f2;
}

.block-title {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.trend-total {
  margin-top: 12px;
  font-size: 15px;
  color: #333;
}

.notice-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.notice-item {
  display: flex;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid #f0f0f0;
}

.notice-item:last-child {
  border-bottom: none;
}

.dot {
  width: 8px;
  height: 8px;
  background: #409EFF;
  border-radius: 50%;
  margin-right: 12px;
  flex-shrink: 0;
}

.notice-title {
  flex: 1;
  font-size: 15px;
  color: #333;
}

.notice-time {
  font-size: 13px;
  color: #999;
  margin-left: 16px;
}

.trend-summary {
  background: #f6faff;
  border-radius: 10px;
  padding: 18px 20px 12px 20px;
  margin-bottom: 16px;
}

.trend-summary-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.trend-label {
  font-size: 13px;
  color: #888;
}

.trend-value-green {
  color: #1abc9c;
  font-weight: bold;
  font-size: 18px;
}

.trend-date-range {
  text-align: center;
  font-size: 13px;
  color: #888;
  margin-top: 14px;
}
</style>