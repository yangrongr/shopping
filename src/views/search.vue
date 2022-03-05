<template>
	<div class="gray-bg">
		<van-row style="background-color: #fff;height: 54px;" class="fixed-top-item">
			<van-icon name="arrow-left" size="22" class="mt-15" @click="$back()" />
			<van-search v-model="search" placeholder="请输入搜索关键词" class="fixed-top-item"
				style="display: inline-block; width: 90%;" @search="onSearch" @focus="searchFocus" />
		</van-row>

		<!-- 搜索历史 -->
		<div class="history-box" v-show="showHistory">
			<van-cell title="最近搜索" :border="false">
				<template>
					<span @click="clearHistory">
						<van-icon name="delete-o" size="20" />
					</span>
				</template>
			</van-cell>
			<div v-for="(item, index) in history" :key="index" @click="onClickHistory(item)" class="history-cell">
				{{item}}</div>
		</div>

		<!-- 热门搜索 -->
		<div class="hot-box" v-show="showHot">
			<van-cell title="热门搜索" value="隐藏" :border="false" :class="{'mt-56': !this.showHistory}">
				<template>
					<span @click="showHot = false">隐藏</span>
				</template>
			</van-cell>
			<div v-for="(item, index) in hot" :key="index" class="history-cell" @click="onClickHistory(item)">{{item}}
			</div>
		</div>


		<div v-show="showResult" style="margin-top: 54px;">
			<van-dropdown-menu>
				<van-dropdown-item v-model="isOption['active']" :options="selectOption['active']"
					@change="dropSelect('active')" />
				<van-dropdown-item v-model="isOption['price']" :options="selectOption['price']"
					@change="dropSelect('price')" />
				<van-dropdown-item v-model="isOption['sort']" :options="selectOption['sort']"
					@change="dropSelect('sort')" />
			</van-dropdown-menu>

			<!-- 列表 -->
			<van-cell style="margin-bottom: 10px;" v-for="(item, index) in dataList" @click="$navto('/goods/'+ item.id)"
				:key="index">
				<template #icon>
					<van-image :src="item.img" class="images"></van-image>
				</template>
				<template #label>
					<div style="font-size: 18px;color: orangered;margin-top: 20px;">￥ {{item.sell_price}}</div>
				</template>
				<template #title>
					<span class="nameStyle">{{item.name}}</span>
					<van-icon name="shopping-cart-o" class="pay_icon_right" />
				</template>
			</van-cell>
		</div>

		<van-empty image="error" description="没有找到相关商品" v-show="showEmpty" />
	</div>
</template>

<script>
	import {
		goodsList,
		goodsSpec
	} from '@/common/api/web/goods.js'
	export default {
		data() {
			return {
				search: '',
				showHistory: true,
				showHot: true,
				history: [],
				hot: ['电脑写字板', '早餐奶', '最新款小米手环', '秋冬卫衣', '电脑散热架', '网红小零食', '懒人减肥神器', '蒸汽眼罩', '吹风机静音', '北极星挂钟'],
				selectOption: {},
				isOption: {},
				pid: 0,
				page: 1,
				dataList: [],
				showResult: false,
				showEmpty: false
			}
		}, //data
		mounted() {
			var local_history = this.$cache_get('search_history')
			if (local_history == undefined || local_history == '') {
				this.showHistory = false
			} else {
				this.history = local_history
			}
			this.initSpec();
			// this.initData();
		}, //mounted
		methods: {
			onSearch() {
				this.dataList = [];
				//历史记录
				this.search = this.search.replace(/^\s*|\s*$/g, "");
				if (this.search == '') {
					this.$toast('请输入搜索内容')
					return
				}
				var arr = this.history;
				var that = this;
				arr.forEach(function(item,index){
					if(item == that.search){
						arr.splice(index,1)
					}
				})
				for (let i = arr.length; i >= 0; i--) {
					arr[i] = arr[i - 1]
				}
				arr[0] = this.search
				this.history = arr
				this.$cache_set('search_history', arr)
				this.initData();
				this.showHistory = false;
				this.showHot = false;
				this.showResult = true
			},
			// 清空历史记录
			clearHistory() {
				var that = this;
				this.$dialog.confirm({
						title: '提示',
						message: '确定删除记录？',
					})
					.then(() => {
						that.history = [];
						that.$cache_set('search_history', '')
						that.showHistory = false;
						that.showHot = true;
					})
					.catch(() => {
						return
					});
			},
			async initSpec() {
				let res = await goodsSpec({
					pid: this.pid
				}); //异步获取
				if (res.code == 200) {
					this.selectOption = res.data.selectOption;
					this.isOption = res.data.isOption;
				}
			},
			async initData() {
				var params = {
					pid: this.pid,
					page: this.page,
					pagesize: 5,
					active: this.isOption['active'],
					sort: this.isOption['sort'],
					price: this.isOption['price'],
					search: this.search,
				};
				let res = await goodsList(params);
				if (res.code == 200) {
					this.dataList = res.data.data
					// console.log(this.dataList)
					if (this.dataList.length ==  0 ) {
						// console.log(123)
						this.showEmpty = true;
					}else{
						// console.log(234)
						this.showEmpty = false;
					}
				} else {
					this.$toast(res.msg);
				}
			},
			searchFocus() {
				if (this.history != '') {
					this.showHistory = true;
				}
				this.showHot = true;
				this.showResult = false;
				this.showEmpty = false;
			},
			dropSelect() {
				this.dataList = [];
				this.initData();
			},
			onClickHistory(value) {
				this.search = value
				this.onSearch();
			}
		},
	}
</script>

<style>
	.backIcon {
		display: inline-block;
		margin-top: 10px;
	}

	.history-box {
		margin-top: 56px;
		padding-bottom: 10px;
		background-color: white;
	}

	.mt-56 {
		margin-top: 56px;
	}

	.hot-box {
		margin-top: 2px;
		padding-bottom: 10px;
		background-color: white;
	}

	.history-cell {
		display: inline-block;
		padding: 3px 10px;
		margin: 5px;
		font-size: 13px;
		color: #797979;
		background-color: #f3f3f3;
		border-radius: 5px;
		/* border: #797979 1px solid; */
	}

	.images {
		width: 80px;
		height: 80px;
		overflow: hidden;
		display: flex;
		justify-content: center;
		margin-right: 5px;
	}
	.nameStyle {
		display: inline-block;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		width: 14rem;
	}
</style>
