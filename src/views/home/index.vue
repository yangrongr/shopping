<template>
	<div class="gray-bg">

		<!-- 搜索框 -->
		<van-search v-model="search" placeholder="请输入搜索关键词" class="fixed-top-item" @click="$navto('/search')" />
		
		
		<van-row style="background: #f2f2f2; margin-top: 54px;">
		    <van-tabs v-model="active" @click="tabSelect" animated>
		    <!-- <van-collapse-item title="标题1" name="1">内容</van-collapse-item> -->
		    <van-tab title="推荐" >
		    </van-tab>
			
		    <van-tab title="智能" >
		    </van-tab>
			
		    <van-row style="background-color: rgb(255, 174, 153);">
		    <van-tab title="电视">
		    </van-tab>
		    </van-row>
			
		    <van-row style="background-color: rgb(225, 65, 57);width:100%;">
		    <van-tab title="家电">
		    </van-tab>
		    </van-row>
		
		    <van-row style="background-color: rgb(72, 120, 166);" >
		    <van-tab title="笔记本">
		    </van-tab>
		     </van-row>
		    </van-tabs>
		</van-row>
		
		
		
		
		
		
		<van-pull-refresh v-model="isLoading" success-text="刷新成功" @refresh="onRefresh">
			<div v-if="active == 0">
			<!-- 轮播图 -->
			<van-swipe class="my-swipe" :autoplay="3000" indicator-color="white">
				<van-swipe-item v-for="(image, index) in banner" :key="index">
					<van-image class="my-swiper-photo" :src=" image.path" />
				</van-swipe-item>
			</van-swipe>
			<!-- 通知 -->
			<van-notice-bar left-icon="volume-o" :scrollable="false" style="height: 30px;">
				<van-swipe vertical class="notice-swipe" :autoplay="3000" :show-indicators="false">
					<van-swipe-item v-for="(item, index) in notice" :key="index">{{item.title}}</van-swipe-item>
				</van-swipe>
			</van-notice-bar>
			<!-- 页面导航（分类图标） -->
			<van-grid clickable :column-num="5" class="mb-10" :border="false" v-if="active==0">
				<van-grid-item v-for="(item,index) in typeList" :key="index" @click="$navto('/classify/1')">
					<template #text><span style="color: #adadad;font-size: 12px;">{{item.name}}</span></template>
					<template #icon>
						<van-image :src="item.img" class="type-image"></van-image>
					</template>
				</van-grid-item>
			</van-grid>
			<!-- 推荐商品cell单元格 -->
			<van-cell title="推荐商品" is-link value="查看更多" :border="false" url="#/type" @click="seeMore" />
			
			</div>
			
			<!-- 商品列表 -->
			<van-grid :border="false" :column-num="2" class="mb_50" :gutter="5">
				<van-grid-item v-for="(item, index) in goodlist" :key="index" @click="$navto('/goods/'+ item.id)"
					style="width: 160px;">
					<div class="images_out">
						<img :src=" item.img " />
					</div>
					<div class="goods_card_name">{{item.name}}</div>
					<div class="price">￥{{item.cost_price}}</div>
				</van-grid-item>
			</van-grid>
		</van-pull-refresh>
	</div>
</template>

<script>
	import {
		home,
	} from '../../common/api/web/home.js'
	import {
		Lazyload
	} from 'vant';
	import {
		userInfo
	} from '@/common/api/web/user.js'
	export default {
		data() {
			return {
				isLoading: false,
				search: '',
				banner: [{
					name: '1',
					path: 'https://cdn.cnbj1.fds.api.mi-img.com/mi-mall/a2b3ab270e5ae4c9e85d6607cdb97008.jpg?thumb=1&w=720&h=360'
				},{
					name: '2',
					path: 'https://m.360buyimg.com/mobilecms/s700x280_jfs/t1/207409/40/442/111710/613e9ea2Ed65c56d3/c0155cee8de94a4c.jpg!cr_1053x420_4_0!q70.jpg.dpg'
				}],
				notice: [],
				goodlist: [],
				typeList: [{
						name: '数码电器',
						img: 'https://m.360buyimg.com/mobilecms/s120x120_jfs/t1/178015/31/13828/6862/60ec0c04Ee2fd63ac/ccf74d805a059a44.png!q70.jpg.dpg'
					}, {
						name: '服饰',
						img: 'https://m.360buyimg.com/mobilecms/s120x120_jfs/t1/41867/2/15966/7116/60ec0e0dE9f50d596/758babcb4f911bf4.png!q70.jpg.dpg'
					}, {
						name: '汽车用品',
						img: 'https://m.360buyimg.com/mobilecms/s120x120_jfs/t19726/325/2005987992/6401/2075e896/5ae06206N8412b247.png.webp'
					}, {
						name: '户外运动',
						img: 'https://m.360buyimg.com/mobilecms/s120x120_jfs/t19957/358/3216993/6100/3abf816a/5ae06259N29275358.png.webp'
					},
					{
						img: 'https://ossmuyuanec.oss-cn-beijing.aliyuncs.com/Storage/Shop/1206/Products/16781/1.png',
						name: '手机',
					},
					{
						img: 'https://img.51miz.com/Element/00/38/77/61/3398348e_E387761_10ec6360.png',
						name: '以旧换新',
					},
					{
						img: 'https://img.51miz.com/Element/00/89/46/39/24ad311b_E894639_9a4b7b5a.png',
						name: '智能',
					},
					{
						img: 'http://5b0988e595225.cdn.sohucs.com/images/20190525/aee104cdb7f84a7683500ff2f8a824eb.jpeg',
						name: '笔记本',
					},
					{
						img: 'http://www.qianjia.com/Upload/News/20181025/images/201810251417346386.jpg',
						name: '电视',
					},
					{
						img: 'https://www.haihui.cc/images/202006/source_img/3313_P_1592076654968.jpg',
						name: '洗衣机',
					}
				],
				active: 0,
			}
		}, //data
		methods: {
			zhuxiao() {
				localStorage.setItem('token', '')
				// this.$router.push('/login')
			},
			onRefresh() {
				this.initData()
				setTimeout(() => {
					this.$toast('刷新成功')
					this.isLoading = false;
				}, 1000);
			},
			// 获取数据
			initData() {
				let that = this;
				home({}).then(function(res) {
					let map = res.data
					if (res.code == 200) {
						// that.banner = map.banner
						that.notice = map.notice
						that.goodlist = map.goodlist
					}
				})
				// this.$cache_set('goods_list', this.goodlist)
			},
			seeMore() {
				this.$parent.seeMoreActive();
			},
			async getInfo() {
				let user = this.$cache_get('userInfo')
				let params = {
					uid: user.id
				}
				let res = await userInfo(params);
				if (res.code == 200) {
					this.$cache_set('userInfo', res.data)
				}
			},
			tabSelect(name){
				console.log(name)
			},
		}, //methods
		mounted() {
			this.initData();
			this.getInfo()
		}
	}
</script>

<style>
	.notice-swipe {
		height: 40px;
		line-height: 40px;
	}

	.my-swipe .van-swipe-item {
		color: #fff;
		font-size: 20px;
		height: 200px;
		text-align: center;
	}

	.my-swiper-photo {
		height: 200px;
	}

	.price {
		font-size: 0.875rem;
		color: orangered;
		text-align: left;
		width: 96%;
	}

	.images_out {
		width: 7.5rem;
		height: 7.5rem;
		overflow: hidden;
		display: flex;
		justify-content: center;
	}

	.type-image {
		width: 30px;
		height: 30px;
	}

	.images_list {
		width: auto;
		height: 168px;
	}
	.msg_right{
	    margin-top: 24px;
	    margin-right: 15px;
	    font-size: 60px;
	    width: 10%;
	    float: right;
	}
	.van-tab{
	    background: #f2f2f2;
	}
	.van-tab{
	    display: flex;
	    justify-content: space-around;
	}
	.img_style{
		width: 100%;
	    padding: 0;
	    margin: 0;
	}
	.img_style img{
	    height: 125px;
		/* width: 100vh; */
	}
	img{
	    display:block;
	    padding: 0;
	}
	.color-red{
	    color:#fff;
	}
	.main_list van-row{
	    border-right: none;
	}
	.main_computer{
	  width: 92%;
	  padding: 4%;
	}
	.goods_desc {
	  width: 100%;
	  color: #3c3c3c;
	  height: auto;
	  line-height: 25px;
	  display: inline-block;
	}
	.goods_list{
	  width: 100%;
	  color: rgba(0,0,0,.87);
	  height: auto;
	  line-height: 55px;
	  display: inline-block;
	}
</style>
