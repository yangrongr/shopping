<template>
	<div class="gray-bg">
		<van-nav-bar title="我的收藏" left-arrow @click-left="onClickLeft" />
		
		
		<van-swipe-cell v-for="(item,index) in collectList" :key="index" class="mt-10">
		  <van-cell>
			  <template #icon>
				  <van-image :src="item.img" class="images"></van-image>
			  </template>
			  <template #label>
				  <div style="font-size: 18px;color: orangered;margin-top: 24px;">￥ {{item.cost_price}}</div>
				  <!-- <van-row>2021-08-29 22:04:56</van-row> -->
			  </template>
			  <template #title>
				  <span>{{item.name}}</span>
			  	<van-icon name="arrow" class="pay_icon_right" />
			  </template>
		  </van-cell>
		  <template #right>
		    <van-button square text="删除" type="danger" class="delete-button"/>
		  </template>
		</van-swipe-cell>
		
		
	</div>
</template>

<script>
	import { goodsList } from '@/common/api/web/goods.js'
	export default {
		data() {
			return {
				collectId: [],
				dataList:[], 
				collectList: [],
			}
		}, //data
		mounted() {
			this.initData()
			
			// console.log(arr)
			// this.dataList = arr;

		},
		methods: {
			onClickLeft(){
				this.$router.go('-1')
			},
			async initData(){
				let res = await goodsList();
				this.dataList = res.data.data
				
				var arr = this.$cache_get('collect_goods_id');
				// console.log(this.dataList)
				let that = this;
				this.dataList.forEach(function(item,index){
					// console.log(item.id)
					for(let i=0; i<=arr.length; i++){
						if(item.id == arr[i]){
							console.log(arr[i]);
							that.collectList[i] = item;
							console.log(that.collectList)
						}
					}
				
				})
			},
		}
	}
</script>

<style>
  .goods-card {
    margin: 0;
    background-color: @white;
  }

  .delete-button {
    height: 100%;
  }
  .images {
  	width: 80px;
  	height: 80px;
  	overflow: hidden;
  	display: flex;
  	justify-content: center;
	margin-right: 5px;
  }
  .pay_icon_right {
  	font-size: 16px;
  	/* line-height: 100px; */
	float: right;
	margin-top: 32px;
  }
</style>
