

function popup_close() {
	$("#select_popup").fadeOut();
}

function update_list() {

	$("#select_popup").fadeOut();
}


var vm = new Vue({
	el: "#app",
	data() {
		return {
			checkedNames: ["贵金属", "能源", "外汇", "指数", "农产品", "美股", "港股"],
			show: true,
			ax_data: {
				"head": { "appKey": "yz352001" },
				"data": { "login_name": "", "password": "", "accountType": "" }
			},
			Http_config: {
				method: 'post',
				url: 'https://api.dragonfly8.com/account/appProperties/getAccountProperties',
				headers: {
					'Content-type': 'application/json',
					'module': 'uat-account',
					'rpcType': 'http',
					'method': '/account/appProperties/getAccountProperties',
					'httpMethod': 'post',
					'trace': 'h5_' + this.get_current_time(),
					'Authorization': ''
				},

				data: {
					"head": { "appKey": "yz352001" },
					"data": { "login_name": "Guest", "password": "" }
				},
			},
			websock: null,
			Ws_config: {
				trace: `h5 ${this.get_current_time()}`,
				version_code: "1",
				device: "h5",
				head: {
					server: "yz",
					msgType: "",
					sendTime: this.get_current_time(),
					Authorization: "",
					lang: "zh-TW"
				},
				content: {
					appKey: "",
					clientIp: "",
					company_id: "",
					login_name: "Guest",
					password: "",
					user_type: 1
				},
			},
			product: [],
			price: "",
			img: [
				'promote/lp259/images/icon1.png',
				'promote/lp259/images/icon2.png',
				'promote/lp259/images/icon3.png',
				'promote/lp259/images/icon4.png',
				'promote/lp259/images/icon5.png',
			],
			// 彈窗顯示
			popshow:false,
			// 全選選擇器
			isAll: false,
			all:
			{
				product: [
					{
						type: "贵金属", name: '现货黄金', hight: 1288.05, low: 1283.85, multiple: 100, id: 573004,
					},
					{
						type: "贵金属", name: '现货白银', hight: 14.973, low: 14.9, multiple: 5000, id: 573004,
					},
					{
						type: "农产品", name: '玉米', hight: 405.63, low: 405.13, multiple: 100, id: 573007,
					},
					{
						type: "农产品", name: '大豆', hight: 854.75, low: 854.13, multiple: 500, id: 573008,
					},
					{
						type: "港股", name: '美团点评-W', hight: 222.75, low: 222.45, multiple: 3.87, id: 573110,
					},
					{
						type: "港股", name: '石药集团', hight: 15.9, low: 15.88, multiple: 5.16, id: 573136,
					},
					{
						type: "指数", name: '英国UK100', hight: 7209.5, low: 7182.5, multiple: 10, id: 573023,
					},
					{
						type: "指数", name: '发过FRA40', hight: 5408, low: 5281.75, multiple: 0, id: 573021,
					},
				],
			},
			//表單選擇的產品
			selId: [],
			//id總覽
			productList: [
				{ type: "外汇", name: "欧元瑞郎", id: "573033" },
				{ type: "指数", name: "英国UK100", id: "573023" },
				{ type: "能源", name: "天然气", id: "573012" },
				{ type: "贵金属", name: "现货白银", id: "573005" },
				{ type: "农产品", name: "玉米", id: "573007" },
				{ type: "农产品", name: "米將", id: "573999" },
				{ type: "美股", name: "苹果公司", id: "573118" },
				{ type: "港股", name: "美团点评-W", id: "573110" },
			]
		}
	},
	methods: {
		get_current_time() {
			var d = new Date();
			return d.getTime();
		},
		gotourl() {
			let vm = this
			axios(vm.Http_config, vm.ax_data)
				.then(function (response) {
					// 進行 ws 操作
					// 應該為動態 url
					vm.Ws_config.url = 'wss://api.dragonfly8.com/websocket'
					vm.Ws_config.method = 'get'
					// 從 HTTP 所取得的 response 帶入ws head
					vm.Ws_config.head.Authorization = response.headers.authorization
					vm.Ws_config.head.msgType = 'login'
					vm.Ws_config.content.appKey = response.data.data.transBaseConfigVo.appKey
					vm.Ws_config.content.clientIp = response.data.data.clientIp
					vm.Ws_config.content.company_id = response.data.data.toKenCompanyInfoVo.companyId
					vm.Ws_config.content.login_name = vm.Http_config.data.data.login_name
					vm.Ws_config.content.password = vm.Http_config.data.data.password
					vm.Ws_config.content.user_type = -1
					vm.initWebSocket(vm.Ws_config)
				})
				.catch(function (error) {
					console.log(error, 'axios 發送的 Http 、 Ws 出現錯誤');
				});
		},
		initWebSocket(Ws_config) { //初始化weosocket
			console.log(Ws_config.url)
			this.websock = new WebSocket(Ws_config.url);
			this.websock.onmessage = this.websocketonmessage;
			this.websock.onopen = this.websocketonopen;
			this.websock.onerror = this.websocketonerror;
			this.websock.onclose = this.websocketclose;
		},
		websocketonopen() { //連接建立後執行send發送數據
			let vm = this
			console.log('open connect', vm.Ws_config)
			if (this.websock.readyState === 1) {
				this.websocketsend(JSON.stringify(vm.Ws_config));
			} else {
				alert("還沒到 readyState 1")
			}
		},
		websocketonerror() {//連結失敗，重新連線
			this.initWebSocket();
		},
		websocketonmessage(e) { //資料接收後
			let vm = this
			vm.Wsevent(e.data)
		},
		websocketsend(Data) {//資料發送
			this.websock.send(Data);
		},
		websocketclose(e) {  //關閉
			console.log('websocket連線中斷', e);
		},
		//使用字串與組裝變數後
		//
		//Websocket 送出點
		//
		WsBuildup(msgType, _content) {
			let vm = this
			vm.Ws_config.head.msgType = msgType
			vm.Ws_config.content = _content
			vm.websocketsend(JSON.stringify(vm.Ws_config));
		},
		Wsevent(e) {
			// 使用 switch 去判斷 msgType 
			// 再決定發送什麼 Ws 格式
			let vm = this
			// 進來的字串，需要再轉字串才能使用方法
			if (e.toString().indexOf("p(") > -1) {
				// console.log(e)
				// p( 因為非物件開頭 所以不能單純使用 json.parse 去做處理
				// p(產品ID,賣價,買價,當前價,時間,最高價格,最低價格)
				// 字串處理
				let newData = e.slice(2, e.length - 1);
				let split = newData.split(",");
				if (split.length < 7) {
					console.log("報價有錯  " + e);
				}
				var numSplit = split[0] * 1
				if (vm.product.indexOf(numSplit) < 0) {
					console.log('推入ID')
					vm.product.push(numSplit)
				}
				vm.price = split
				// console.log(vm.product)
				// 格式

			} else if (typeof (e) === "string" && e.toString().indexOf("p(") < 0) {
				var msg = JSON.parse(e);
				var msg_code = msg.msg_code;
			}
			switch (msg_code) {
				case "UserLoginInfoRet":
					vm.checkedNames.forEach(res => {
						vm.productList.forEach(res2 => {
							if (res === res2.type) {
								vm.selId.push(res2.id)
								console.log(`${vm.selId}`);
							} else {
								console.log('沒中')
							}
						})
					})
					_content = {
						//
						// 注入產品 ID 陣列 
						// e.g 573004 = 黃金價格
						code_ids: vm.selId,
						//
						subscribeType: "reSubscribe",
						type: "yz"
					}
					vm.WsBuildup("productSubscription", _content)
					break;
				case "HeartBeatConf":
					break;
				case "InitProductInfo":
					break;
				default:
					break;
			}
		},
		// 彈窗切換
		popControl() {
			let vm = this
			vm.popshow = true
		},
		//
		buildUphtml() {
			let vm = this
			vm.all.product.forEach(res => {
				res.img = vm.img
			})
		},
		// 攫取產品id
		buildUpId() {
			let vm = this
			if (vm.checkedNames.length === 0) {
				alert('請選擇一項產品')
				return
			}
			// 比對檢查選擇清單
			vm.selId = []
			vm.checkedNames = vm.checkedNames.toString().split(',')
			console.log(vm.checkedNames, '顯示')
			vm.checkedNames.forEach(res => {
				// 比對檢查列表
				vm.productList.forEach(res2 => {
					if (res === res2.type) {
						//推入id
						vm.selId.push(res2.id)
					} else {
					}
				})
			})
			_content = {
				// 注入產品 ID 陣列 
				// e.g 573004 = 黃金價格
				code_ids: vm.selId,
				subscribeType: "reSubscribe",
				type: "yz"
			}
			vm.WsBuildup("productSubscription", _content)
			vm.popshow = false
		},
		allChang() {
			let vm = this
			vm.isAll = !vm.isAll
			if (vm.isAll === true) {
				vm.checkedNames = ["贵金属", "能源", "外汇", "指数", "农产品", "美股", "港股"]
			} else if (vm.isAll === false) {
				vm.checkedNames = []
			}
		}
	},
	watch:{
		checkedNames(){
			let vm = this
			if(this.checkedNames.length < 7){
				vm.isAll = false
				document.getElementById("data1").checked = false
			}else{
				document.getElementById("data1").checked = true
			}
		}
	},
	computed: {
		html() {

			let vm = this
			let newSort = vm.all.product.sort((a, b) => {
				let one = (a.hight - a.low) * a.multiple
				let two = (b.hight - b.low) * b.multiple
				return one < two ? 1 : -1;
			});
			return newSort
		}
	},
	mounted() {
	},
	created() {
		this.gotourl()
		this.buildUphtml()
	},
	destroyed() {
	}
})


