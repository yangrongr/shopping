import request from '../../../utils/request.js'

export function home(params){
	return request({url: '/web/home', method: 'post', data: params})
}

export function getAd(params){
	return request({url: '/web/ad', method: 'post', data: params})
}