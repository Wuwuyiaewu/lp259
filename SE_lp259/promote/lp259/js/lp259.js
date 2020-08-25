
var vm = new Vue({
	el: "#app",
	data() {
		return {
			checkedNames: ["外汇", "指数", "能源", "贵金属", "农产品", "美股", "港股"],
			tempChecked: [],
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
			// vueloading
			notloading:false,
			// 彈窗顯示
			popshow: false,
			// 一次性視窗
			isalert: false,
			// 全選選擇器
			isAll: true,
			//id總覽
			all:
			{
				product: [
					{ type: "外汇", name: "欧元美元", id: "573139", hight: 0, low: 0, mulpiple: "100000" },
					{ type: "外汇", name: "英镑美元", id: "573039", hight: 0, low: 0, mulpiple: "100000" },
					{ type: "外汇", name: "澳元美元", id: "573024", hight: 0, low: 0, mulpiple: "100000" },
					{ type: "外汇", name: "纽元美元", id: "573028", hight: 0, low: 0, mulpiple: "100000" },
					{ type: "外汇", name: "美元瑞郎", id: "573035", hight: 0, low: 0, mulpiple: "100000" },
					{ type: "外汇", name: "欧元瑞郎", id: "573033", hight: 0, low: 0, mulpiple: "100000" },
					{ type: "外汇", name: "英镑瑞郎", id: "573034", hight: 0, low: 0, mulpiple: "100000" },
					{ type: "外汇", name: "欧元英镑", id: "573036", hight: 0, low: 0, mulpiple: "100000" },
					{ type: "外汇", name: "欧元澳元", id: "573041", hight: 0, low: 0, mulpiple: "100000" },
					{ type: "外汇", name: "英镑澳元", id: "573037", hight: 0, low: 0, mulpiple: "100000" },
					{ type: "外汇", name: "澳元纽元", id: "573030", hight: 0, low: 0, mulpiple: "100000" },
					{ type: "外汇", name: "美元新加坡元", id: "593069", hight: 0, low: 0, mulpiple: "100000" },
					{ type: "外汇", name: "欧元加元", id: "573090", hight: 0, low: 0, mulpiple: "100000" },
					{ type: "外汇", name: "欧元纽元", id: "573091", hight: 0, low: 0, mulpiple: "100000" },
					{ type: "外汇", name: "美元加元", id: "573031", hight: 0, low: 0, mulpiple: "100000" },
					{ type: "外汇", name: "英镑加元", id: "573088", hight: 0, low: 0, mulpiple: "100000" },
					{ type: "外汇", name: "英镑纽元", id: "573089", hight: 0, low: 0, mulpiple: "100000" },
					{ type: "外汇", name: "美元日元", id: "573032", hight: 0, low: 0, mulpiple: "1000" },
					{ type: "外汇", name: "欧元日元", id: "573040", hight: 0, low: 0, mulpiple: "1000" },
					{ type: "外汇", name: "英镑日元", id: "573038", hight: 0, low: 0, mulpiple: "1000" },
					{ type: "外汇", name: "澳元日元", id: "573026", hight: 0, low: 0, mulpiple: "1000" },
					{ type: "外汇", name: "纽元日元", id: "573029", hight: 0, low: 0, mulpiple: "1000" },
					{ type: "外汇", name: "加元日元", id: "573027", hight: 0, low: 0, mulpiple: "1000" },
					{ type: "外汇", name: "美元离岸人民币", id: "573043", hight: 0, low: 0, mulpiple: "1000" },
					{ type: "外汇", name: "港元离岸人民币", id: "573042", hight: 0, low: 0, mulpiple: "1000" },
					{ type: "外汇", name: "瑞郎日元", id: "573087", hight: 0, low: 0, mulpiple: "1000" },
					{ type: "指数", name: "英国UK100", id: "573023", hight: 0, low: 0, mulpiple: "10" },
					{ type: "指数", name: "发过FRA40", id: "573021", hight: 0, low: 0, mulpiple: "20" },
					{ type: "指数", name: "德国GER30", id: "573022", hight: 0, low: 0, mulpiple: "10" },
					{ type: "指数", name: "美汇指数", id: "573019", hight: 0, low: 0, mulpiple: "1000" },
					{ type: "指数", name: "恐慌指数", id: "573020", hight: 0, low: 0, mulpiple: "1000" },
					{ type: "指数", name: "香港50", id: "573016", hight: 0, low: 0, mulpiple: "2" },
					{ type: "指数", name: "中华300", id: "573017", hight: 0, low: 0, mulpiple: "10" },
					{ type: "指数", name: "日本JPN225", id: "573018", hight: 0, low: 0, mulpiple: "2" },
					{ type: "指数", name: "美国DJ30", id: "573015", hight: 0, low: 0, mulpiple: "5" },
					{ type: "指数", name: "美国SP500", id: "573013", hight: 0, low: 0, mulpiple: "50" },
					{ type: "指数", name: "美国TECH100", id: "573014", hight: 0, low: 0, mulpiple: "20" },
					{ type: "能源", name: "天然气", id: "573012", hight: 0, low: 0, mulpiple: "10000" },
					{ type: "能源", name: "英国原油", id: "573011", hight: 0, low: 0, mulpiple: "100" },
					{ type: "能源", name: "美国原油", id: "573010", hight: 0, low: 0, mulpiple: "100" },
					{ type: "贵金属", name: "现货白银", id: "573005", hight: 0, low: 0, mulpiple: "5000" },
					{ type: "贵金属", name: "现货黄金", id: "573004", hight: 0, low: 0, mulpiple: "100" },
					{ type: "贵金属", name: "钯金", id: "573003", hight: 0, low: 0, mulpiple: "100" },
					{ type: "贵金属", name: "铜", id: "593070", hight: 0, low: 0, mulpiple: "100" },
					{ type: "贵金属", name: "铂金", id: "573002", hight: 0, low: 0, mulpiple: "50" },
					{ type: "农产品", name: "玉米", id: "573007", hight: 0, low: 0, mulpiple: 100 },
					{ type: "农产品", name: "大豆", id: "573008", hight: 0, low: 0, mulpiple: 500 },
					{ type: "农产品", name: "小麦", id: "573006", hight: 0, low: 0, mulpiple: 100 },
					{ type: "农产品", name: "可可", id: "573009", hight: 0, low: 0, mulpiple: "20" },
					{ type: "美股", name: "苹果公司", id: "573118", hight: 0, low: 0, mulpiple: "1" },
					{ type: "美股", name: "阿里巴巴", id: "573115", hight: 0, low: 0, mulpiple: "1" },
					{ type: "美股", name: "花旗银行", id: "573113", hight: 0, low: 0, mulpiple: "1" },
					{ type: "美股", name: "波音", id: "573116", hight: 0, low: 0, mulpiple: "1" },
					{ type: "美股", name: "京东", id: "573099", hight: 0, low: 0, mulpiple: "1" },
					{ type: "美股", name: "耐克", id: "593052", hight: 0, low: 0, mulpiple: "1" },
					{ type: "美股", name: "特斯拉", id: "593043", hight: 0, low: 0, mulpiple: "1" },
					{ type: "美股", name: "微博", id: "573143", hight: 0, low: 0, mulpiple: "1" },
					{ type: "美股", name: "新浪", id: "593048", hight: 0, low: 0, mulpiple: "1" },
					{ type: "美股", name: "58同城", id: "573144", hight: 0, low: 0, mulpiple: "1" },
					{ type: "美股", name: "拼多多", id: "573095", hight: 0, low: 0, mulpiple: "1" },
					{ type: "美股", name: "沃尔玛", id: "593041", hight: 0, low: 0, mulpiple: "1" },
					{ type: "美股", name: "百度", id: "573114", hight: 0, low: 0, mulpiple: "1" },
					{ type: "美股", name: "亚马逊", id: "573117", hight: 0, low: 0, mulpiple: "1" },
					{ type: "美股", name: "可口可乐", id: "573098", hight: 0, low: 0, mulpiple: "1" },
					{ type: "美股", name: "微软", id: "573096", hight: 0, low: 0, mulpiple: "1" },
					{ type: "美股", name: "华米科技", id: "573128", hight: 0, low: 0, mulpiple: "1" },
					{ type: "美股", name: "迪士尼", id: "593063", hight: 0, low: 0, mulpiple: "1" },
					{ type: "美股", name: "谷歌C", id: "593062", hight: 0, low: 0, mulpiple: "1" },
					{ type: "美股", name: "星巴克", id: "573093", hight: 0, low: 0, mulpiple: "1" },
					{ type: "港股", name: "美团点评-W", id: "573110", hight: 0, low: 0, mulpiple: 100 / 7.77 },
					{ type: "港股", name: "石药集团", id: "573136", hight: 0, low: 0, mulpiple: 2000 / 7.77 },
					{ type: "港股", name: "百威亚太", id: "593037", hight: 0, low: 0, mulpiple: 100 / 7.77 },
					{ type: "港股", name: "比亚迪股份", id: "593020", hight: 0, low: 0, mulpiple: 500 / 7.77 },
					{ type: "港股", name: "中国金茂", id: "593026", hight: 0, low: 0, mulpiple: 2000 / 7.77 },
					{ type: "港股", name: "阿里健康", id: "593031", hight: 0, low: 0, mulpiple: 2000 / 7.77 },
					{ type: "港股", name: "海底捞", id: "573112", hight: 0, low: 0, mulpiple: 1000 / 7.77 },
					{ type: "港股", name: "舜宇光学科技", id: "573150", hight: 0, low: 0, mulpiple: 100 / 7.77 },
					{ type: "港股", name: "青岛啤酒", id: "593032", hight: 0, low: 0, mulpiple: 2000 / 7.77 },
					{ type: "港股", name: "康师傅", id: "593029", hight: 0, low: 0, mulpiple: 2000 / 7.77 },
					{ type: "港股", name: "蒙牛", id: "593014", hight: 0, low: 0, mulpiple: 1000 / 7.77 },
					{ type: "港股", name: "李宁", id: "593013", hight: 0, low: 0, mulpiple: 500 / 7.77 },
					{ type: "港股", name: "阿里巴巴-SW", id: "573152", hight: 0, low: 0, mulpiple: 100 / 7.77 },
					{ type: "港股", name: "香港交易所", id: "573097", hight: 0, low: 0, mulpiple: 100 / 7.77 },
					{ type: "港股", name: "友邦保险", id: "573106", hight: 0, low: 0, mulpiple: 200 / 7.77 },
					{ type: "港股", name: "腾讯控股", id: "573100", hight: 0, low: 0, mulpiple: 100 / 7.77 },
					{ type: "港股", name: "阅文", id: "593035", hight: 0, low: 0, mulpiple: 200 / 7.77 },
					{ type: "港股", name: "平安好医生", id: "573146", hight: 0, low: 0, mulpiple: 100 / 7.77 },
					{ type: "港股", name: "安踏体育", id: "573148", hight: 0, low: 0, mulpiple: 1000 / 7.77 },
					{ type: "港股", name: "小米集团-W", id: "573107", hight: 0, low: 0, mulpiple: 200 / 7.77 },
				]
			},
			HKUSrate: NaN,
			//view 層次
			htmlView: [
			],
			// 及時
			forComputed: [],
			//表單選擇的產品
			selId: [],

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
			console.log(msgType)
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
				var realtimePrice = {
					curPrice: split[3],
					highPrice: split[5],
					lowPrice: split[6],
				};
				vm.updateElementDiv(numSplit, realtimePrice)


				// 格式

			} else if (typeof (e) === "string" && e.toString().indexOf("p(") < 0) {
				var msg = JSON.parse(e);
				var msg_code = msg.msg_code;
				console.log('2')
			}

			//事件判斷，尋找msg_type
			switch (msg_code) {
				case "UserLoginInfoRet":
					// 初次比對
					// 比對每個產品推入 id ，執行產品訂閱
					vm.checkedNames.forEach(res => {
						vm.all.product.forEach(res2 => {
							if (res === res2.type) {
								vm.selId.push(res2.id)
							} else {
							}
						})
					})
					console.log('3')
					_content = {
						// 注入產品 ID 陣列 
						// e.g 573004 = 黃金價格
						code_ids: vm.selId,
						subscribeType: "reSubscribe",
						type: "yz"
					}
					rateContent = {
						code_ids: 573044,
						subscribeType: "reSubscribe",
						type: "yz"
					}
					vm.WsBuildup("productSubscription", _content)
					// vm.getRate("productSubscription",rateContent)
					break;
				case "HeartBeatConf":
					break;
				case "InitProductInfo":
					break;
				default:
					break;
			}
		},
		getRate(msgType, _content) {
			console.log(msgType, "取匯率用")
			let vm = this
			vm.Ws_config.trace = `h5 ${vm.get_current_time()}`
			vm.Ws_config.head.msgType = msgType
			vm.Ws_config.head.sendTime = vm.get_current_time(),
				vm.Ws_config.content = _content
			vm.websocketsend(JSON.stringify(vm.Ws_config));
		},
		updateElementDiv(id, realtime) {
			let vm = this
			let benefit = realtime.highPrice - realtime.lowPrice
			let product = {
				id: id,
				curPrice: realtime.curPrice,
				benefit: benefit
			}
			vm.all.product.forEach(res => {
				if (res.id == id) {
					product.type = res.type
					product.mulpiple = res.mulpiple
					product.name = res.name
					product.img = vm.img
					product.benefit = (product.benefit * product.mulpiple).toFixed(1)
					var index = vm.htmlView.findIndex(x => x.id == res.id)
					if (index === -1) {
						vm.htmlView.push(product);
					} else if (index !== -1) {
						vm.htmlView.forEach(res2 => {
							if (res.id == res2.id) {
								res2.curPrice = realtime.curPrice
							}
						})
					}
				}
			})
		},
		// 彈窗切換
		popControl() {
			let vm = this
			vm.tempChecked = vm.checkedNames
			vm.popshow = true
		},
		// 移除警告確認
		remainCheck(){
			let vm = this
			vm.isalert = false
		},
		// 給予排名加上陣列圖片
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
				vm.isalert = true
				return
			}
			vm.htmlView = []
			this.websock.close()
			this.gotourl()
			this.buildUphtml()
			// 比對檢查選擇清單
			vm.selId = []
			vm.checkedNames = vm.checkedNames.toString().split(',')
			vm.checkedNames.forEach(res => {
				// 比對檢查列表
				vm.all.product.forEach(res2 => {
					if (res === res2.type) {
						//推入id
						//此時已經選取好該入場顯示的產品了
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
	watch: {
		checkedNames() {
			let vm = this
			if (this.checkedNames.length < 7) {
				vm.isAll = false
				document.getElementById("data1").checked = false
			} else {
				document.getElementById("data1").checked = true
			}
		}
	},
	computed: {
		html() {
			let vm = this
			let newSort = vm.htmlView.sort((a, b) => {
				let one = a.benefit
				let two = b.benefit
				return two - one
			});
			return newSort
		}
	},
	mounted() {
		// 前往 IX_postMessage
		// let recaptchaScript = document.createElement('script')
		// recaptchaScript.setAttribute('src', 'public/js/IX_postMessage.js')
		// document.head.appendChild(recaptchaScript)
	},
	created() {
		setTimeout(() => {
			this.notloading = true
		}, 0);
		this.gotourl()
		this.buildUphtml()
	},
	destroyed() {
	}
})


