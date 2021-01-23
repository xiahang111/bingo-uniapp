<template name="storePage">
	
	<view class="container999" @touchstart="refreshStart" @touchmove="refreshMove" @touchend="refreshEnd">
		
		<!-- 刷新组件需搭配scroll-view使用，并在pages.json中添加 "disableScroll":true-->
		<refresh ref="refresh" @isRefresh='isRefresh'></refresh>
		<view class='nav'>
			<!-- #ifdef H5 -->
			<view style="height: 44px;width: 100%;text-align: center;margin-top: 10rpx;">仓库信息</view>
			<!-- #endif -->
			<!-- 搜索 -->
			<!-- <view class='searchInput999'>
				<view class='searchBox999'>
					<image src='/static/icon-search.png' class='search999'></image>
				</view>
				<input class='input999' placeholder="输入关键词"></input>
			</view> -->
			<!-- 导航栏 agents导航栏标题 -->
			<navTab ref="navTab" :tabTitle="tabTitle" @changeTab='changeTab'></navTab>
		</view>
		<!-- swiper切换 swiper-item表示一页 scroll-view表示滚动视窗 -->
		<swiper style="min-height: 120vh;" :current="currentTab" @change="swiperTab">
			<swiper-item >
				<scroll-view style="height: 100%;" scroll-y="true" @scrolltolower="lower1" scroll-with-animation :scroll-into-view="toView">
					<view :id="'top'+listIndex" style="width: 100%;height: 180upx;">边距盒子</view>
					<view class="top-content">总数量:{{totalNum}}</view>
					<view class="top-content">总价值:{{totalPrice}}</view>
					<view class='content'>
						<histogram-chart
						            :dataAs="histogramData2"
						            canvasId="ht1"
						            labelKey="label"
						            valueKey="value"
						            :yAxisAs="{
						                formatter: {
						                    type: 'percent' //type:number percent String,额外参数:fixed:NUmber,name:String
						                }
						            }"
						        />
						        <view style="text-align: center;line-height: 40px;">柱状图histogram percent</view>
					</view>
					<view class='content'>
						<histogram-chart
						            :dataAs="histogramData2"
						            canvasId="ht1"
						            labelKey="label"
						            valueKey="value"
						            :yAxisAs="{
						                formatter: {
						                    type: 'percent' //type:number percent String,额外参数:fixed:NUmber,name:String
						                }
						            }"
						        />
						        <view style="text-align: center;line-height: 40px;">柱状图histogram percent</view>
					</view>
				
					<view style="width: 100%;height: 100upx;opacity:0;">底部占位盒子</view>
				</scroll-view>
			</swiper-item>
		</swiper>
		<tabBar4 :currentPage="currentPage"></tabBar4>
	</view>
</template>

<script>
	const util = require('@/util/util.js');
	import refresh from '@/components/order/refresh.vue';
	import navTab from '@/components/order/navTab.vue';
	import tabBar4 from '@/components/order/tabBar4.vue';
	import HistogramChart from '@/components/stan-ucharts/HistogramChart.vue';
	export default {
		components: {
			refresh,
			navTab,
			tabBar4,
			HistogramChart
		},
		data() {
			return {
				currentPage: 'index',
				toView: '', //回到顶部id
				tabTitle: ['成品料信息', '坯料信息'], //导航栏格式 --导航栏组件
				currentTab: 0, //sweiper所在页
				pages: [1, 1, 1, 1], //第几个swiper的第几页
				totalNum: '278',
				totalPrice: '3962367',
				list: [
					[{
						orderId: 'K-门20098',
						customerName: '刘德华',
						orderMaker: '周卫菊',
						totalPrice: '2800',
						orderDate: '2020-12-30 17:00:00',
						phoneNum: '15201290813',
						customerAddr: '江西省九江市湖口县'
					}, {
						orderId: 'K-门20098',
						customerName: '张学友',
						orderMaker: '莫小兰',
						totalPrice: '3700',
						orderDate: '2020-12-30 17:00:00',
						phoneNum: '15201290813',
						customerAddr: '江西省九江市湖口县'
					}]
				], //数据格式
				histogramData2: {
				                //柱状图Compent  //label应为series value 应为
				                label: ['2052', '2013', '2014', '2015', '2016', '2017', '2018'],
				                value: [
				                    {
				                        name: 'labelKey改变',
				                        data: [0.3, 0.2, 0.5, 0.4, 0.3, 0.1, 0.2]
				                    }
				                ]
				            },
			};
		},
		onLoad(e) {

		},
		onShow() {},
		onHide() {},
		methods: {
			toTop() {
				this.toView = ''
				setTimeout(() => {
					this.toView = 'top' + this.currentTab
				}, 10)
			},
			changeTab(index) {
				this.currentTab = index;
			},

			aaa(message) {
				console.log(message)
				alert(message);
			},
			// 其他请求事件 当然刷新和其他请求可以写一起 多一层判断。
			isRequest() {
				return new Promise((resolve, reject) => {
					this.pages[this.currentTab]++
					var that = this
					setTimeout(() => {
						uni.hideLoading()
						uni.showToast({
							icon: 'none',
							title: `请求第${that.currentTab + 1 }个导航栏的第${that.pages[that.currentTab]}页数据成功`
						})
						let newData = ['新数据1', '新数据2', '新数据3']
						
					}, 1000)
				})
			},
			// swiper 滑动
			swiperTab: function(e) {
				var index = e.detail.current //获取索引
				this.$refs.navTab.longClick(index);
			},
			// 加载更多 util.throttle为防抖函数
			lower1: util.throttle(function(e) {
				console.log(`加载${this.currentTab}`) //currentTab表示当前所在页数 根据当前所在页数发起请求并带上page页数
				uni.showLoading({
					title: '加载中',
					mask: true
				})
				this.isRequest().then((res) => {
					let tempList = this.list
					tempList[this.currentTab] = tempList[this.currentTab].concat(res)
					console.log(tempList)
					this.list = tempList
					this.$forceUpdate() //二维数组，开启强制渲染
				})
			}, 300),
			// 刷新touch监听
			refreshStart(e) {
				this.$refs.refresh.refreshStart(e);
			},
			refreshMove(e) {
				this.$refs.refresh.refreshMove(e);
			},
			refreshEnd(e) {
				this.$refs.refresh.refreshEnd(e);
			},
			isRefresh() {
				setTimeout(() => {
					uni.showToast({
						icon: 'success',
						title: '刷新成功'
					})
					this.$refs.refresh.endAfter() //刷新结束调用
				}, 1000)
			}
		}
	};
</script>

<style lang="scss">
	.container999 {
		width: 100vw;
		font-size: 28upx;
		min-height: 100vh;
		overflow: hidden;
		color: #6B8082;
		position: relative;
		background-color: #f6f6f6;
	}

	.content {
		width: 100%;
	}

	.card {
		width: 90%;
		height: 448upx;
		background-color: white;
		margin: 0 auto 42upx auto;
		background: #FFFFFF;
		box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.10);
		border-radius: 5px;
		position: relative;
	}

	.card-head {
		display: flex;
		align-items: center;
		padding-left: 10px;
		height: 70upx;
		background-color: rgba($color: #2a2a2a, $alpha: 1.0);
		box-shadow: 0 0 5px 0 rgba($color: #3e3e3e, $alpha: 1.0);
		color: rgba($color: #ffffff, $alpha: 1.0);
	}

	.card-former {
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-items: flex-start;
		color: rgba($color: #545454, $alpha: 1.0);
		height: 1vh;
		margin-top: 9rpx;
		margin-left: 20rpx;
	}


	.top-content {
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-items: flex-start;
		margin-left: 250rpx;
		text-align: center;
		font-weight: 20rpx;
		color: rgba($color: #212121, $alpha: 1.0);
		font-size: 30rpx;
	}
	.card-latter {
		display: flex;
		flex-direction: column;
		justify-content: flex-end;
		align-items: flex-end;
		color: rgba($color: #000000, $alpha: 1.0);
		font-weight: 10rpx;
		margin-top: -5rpx;
		margin-right: 20rpx;
	}


	.noCard {
		width: 90%;
		height: 200upx;
		margin: auto;
		background-color: white;
		display: flex;
		align-items: center;
		justify-content: center;
		color: #999999;
		box-shadow: 0 0 10upx 0 rgba(0, 0, 0, 0.10);
		border-radius: 10upx;
	}


	.nav {
		position: fixed;
		left: 0;
		top: 0;
		color: white;
		width: 100%;
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		justify-content: flex-start;
		font-size: 24upx;
		background-color: #50B7EA;
		z-index: 996;
	}

	.searchInput999 {
		width: 90%;
		margin: 0 auto;
		background: white;
		border-radius: 30upx;
		display: flex;
		align-items: center;
		justify-content: center;
		height: 56upx;
	}

	.search999 {
		width: 32upx;
		height: 32upx;
	}

	.search998 {
		width: 32upx;
		height: 32upx;
		margin-right: 10px;
	}

	.searchBox999 {
		width: 56upx;
		height: 56upx;
		display: flex;
		justify-content: center;
		align-items: center;
	}


	.input999 {
		color: #999;
		width: 80%;
	}
</style>
