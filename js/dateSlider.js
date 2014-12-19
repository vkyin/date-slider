//;(function(document,window){
	var Util = {
		/**
		 * 字符串转日期
		 * @param {Object} str 字符串格式参考new Date时使用的格式
		 */
		string2Date : function (str) {
			if (typeof str === "string") {
				return new Date(str);
			}
			return str;
		},
		
		/**
		 *	增加类名 
		 */
		addClass : function(target,className){
			className = className.trim();
			if(/ /.test(className)){
				return;
			}
			var reg = new RegExp(" "+className+"| "+className+" |"+className+" |"+className);
			if(!reg.test(target.className)){
				target.className += " " + className;
				target.className = target.className.trim();
			}
		},
		
		/**
		 * 删除类名 
		 */
		removeClass : function(target,className){
			className = className.trim();
			if(/ /.test(className)){
				return;
			}
			var reg = new RegExp(" "+className+"| "+className+" |"+className+" |"+className);
			target.className = target.className.replace(reg,"");
			target.className = target.className.trim();
		},
	};
	function DateSlider(targetId, option) {
		this.targetId = targetId;
		this.option;
		initOption(this);
	
		var _targetId = this.targetId;
		var _option = this.option;
		var target,slider,startAnchor,endAnchor,range;
	
		initContainer();
		initYearBar();
		initSliderBar();
		initMonthRuler();
		
		//事件绑定
		(function(slider){
			var startPos;
			console.log(target)
			//var containerWidth = target.offsetWidth;
			//var sliderWidth = slider.offsetWidth;
			slider.addEventListener("mousedown",function(){
				//console.log(containerWidth +" "+sliderWidth);
				startPos=event.x;
				console.log(startPos);
			});
			slider.addEventListener("mouseup",function(){
				var left = parseInt(slider.style.left) || 0;
				var value = left + event.x-startPos;
				if(value > 0){
					value = 0;
				}else	if(value < target.offsetWidth-slider.offsetWidth){
					value = target.offsetWidth-slider.offsetWidth;
				}
				slider.style.left = value +"px";
				//console.log(event.x);
			});
		})(slider);

		/**
		 * 初始化option
		 * @param {Object} that
		 */
		function initOption(that) {
			var now = new Date();
			var start = new Date();
			var end = new Date();
			start.setFullYear(now.getFullYear() - 1);
			end.setFullYear(now.getFullYear() + 1);
			that.option = {
				"format": "yyyy-mm",
				"startDate": start,
				"endDate": end,
				"nowDate": now,
				"maxSpan": 12,
			};
			option = option || {};
			for (var x in option) {
				that.option[x] = option[x];
			}
			that.option["startDate"] = Util.string2Date(that.option["startDate"]);
			that.option["endDate"] = Util.string2Date(that.option["endDate"]);
			that.option["nowDate"] = Util.string2Date(that.option["nowDate"]);
		}
		
		/**
		 * 初始化容器 
		 */
		function initContainer(){
			target = document.getElementById(_targetId);
			Util.addClass(target,"date-slider-container");
			target.innerHTML = '<span class="arrow-right pull-left"></span><span class="arrow-left pull-right"></span>';
			slider = document.createElement("div");
			Util.addClass(slider,"date-slider");
			target.appendChild(slider);
		}
		
		/**
		 * 初始化年份页面展示
		 */
		function initYearBar() {
			var html = '<span class="date-slider-year" style="width: 18px;"></span>';
			var width = (13 - _option.startDate.getMonth())*30;
			for(var start = _option.startDate.getFullYear(),end=_option.endDate.getFullYear();start<end;start++){
				html += '<span class="date-slider-year" style="width: '+width+'px;">'+start+'</span>';
				if(width!=360){
					width = 360;
				}
			}
			html += '<span class="date-slider-year" style="width: '+(_option.endDate.getMonth()-1)*30+'px;">'+start+'</span>'
			html = '<div class="date-slider-year-bar"><div class="date-slider-years">' + html + '</div></div>'
			slider.innerHTML = html;
		}
	
		/**
		 * 初始化拖动条
		 */
		function initSliderBar() {
			startAnchor = document.createElement("span");
			endAnchor = document.createElement("span");
			range = document.createElement("span");
			var sliderBar = document.createElement("div");
			Util.addClass(startAnchor,"draggable");
			Util.addClass(startAnchor,"date-slider-start");
			Util.addClass(endAnchor,"draggable");
			Util.addClass(endAnchor,"date-slider-end");
			Util.addClass(range,"draggable");
			Util.addClass(range,"date-slider-range");
			Util.addClass(sliderBar,"date-slider-bar");
			sliderBar.appendChild(range);
			sliderBar.appendChild(startAnchor);
			sliderBar.appendChild(endAnchor);
			slider.appendChild(sliderBar);
		}
	
		/**
		 * 初始化月份尺子
		 */
		function initMonthRuler() {
			var startYear = _option.startDate.getFullYear();
			var endYear = _option.endDate.getFullYear();
			var startMonth = _option.startDate.getMonth();
			var endMonth = _option.endDate.getMonth();
			var scale = '<span class="date-slider-scale" style="width:18px;"></span>';
			var monthHtml = '<span class="date-slider-value" style="width:18px;"></span>';
			var monthAmount = 0;
			for(;startYear<endYear||startMonth<endMonth;startMonth++,monthAmount++){
				if(startMonth>12){
					startMonth = 1;
					startYear++;
				}
				monthHtml += '<span class="date-slider-value">'+startMonth+'</span>';
				scale += '<span class="date-slider-scale"></span>';
			}
			slider.innerHTML += '<div class="date-slider-ruler"><div class="date-slider-scales">'+scale+'</div><div class="date-slider-values">' +monthHtml+'</div></div>'; 
			console.log(monthAmount);
			slider.style.width = monthAmount * 30+ 36+"px";
		}
	
	}
	
	DateSlider.prototype = {
		getOption: function() {
			return this.option;
		},
	};

//window.DateSlider = DateSlider;
//})(document,window);





function asdfasdf(e){
	console.log(event)
}
