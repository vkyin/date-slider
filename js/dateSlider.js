;(function(document,window){
	"use strict";
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
		/**
		 * 根据html文本生成DOM节点
		 */
		parseDom : function(str){
			var obj = document.createElement("div");
			obj.innerHTML = str;
			return obj.childNodes;
		},
		/**
		 * 将html append到目标节点
		 * @param arr {String} html
		 * @param target {Object} 目标节点
		 */
		appendHtml : function(target,str){
			var fragment = document.createDocumentFragment();
			var arr = this.parseDom(str);
			console.log(arr)
			for(var i = 0,len = arr.length;i<len;++i){
				fragment.appendChild(arr.item(i).cloneNode(true));
			}
			target.appendChild(fragment);
		}
	};
	
	var SCALE_WIDTH = 30;
	function DateSlider(targetId, option) {
		this.targetId = targetId;
		this.option;
		this._anchor1;
		this._anchor2;
		initOption(this);
	
		var _targetId = this.targetId;
		var _option = this.option;
		var _self = this;
		var target,slider,anchor1,anchor2,range,sliderBar;
	
		initContainer();
		initYearBar();
		initSliderBar();
		initMonthRuler();
		
		//事件绑定
		document.addEventListener("mouseup",function(){
			document.onmousemove = null;
		});
		(function(sliderBar){
			var startPos,referPos;
			sliderBar.addEventListener("mousedown",function(e){
				var e = e || event;
				var target = e.target || e.srcElement;
				if(target === this){
					return;
				}
				startPos = target.offsetLeft
				referPos = e.clientX;
				document.onmousemove = function(){
					var e = e || event;
					var value = e.clientX - referPos;
					var maxWidth = (_option.maxSpan-1) * SCALE_WIDTH;
					var width = Math.abs(anchor2.offsetLeft - anchor1.offsetLeft);
					var calcLeftValue;
					if(target === anchor1 || target === anchor2){
						calcLeftValue = (startPos + value)<18?18:(startPos + value)>(30*SCALE_WIDTH)?(30*SCALE_WIDTH):(startPos + value);
						if(width>maxWidth){
							if(target === anchor1){
								if(anchor2.offsetLeft - anchor1.offsetLeft>0){
									maxWidth *=-1;
								}
								anchor2.style.left = calcLeftValue - maxWidth +"px";
							}else{
								if(anchor1.offsetLeft - anchor2.offsetLeft>0){
									maxWidth *=-1;
								}
								anchor1.style.left = calcLeftValue - maxWidth +"px";
							}
						}
						target.style.left = calcLeftValue + "px";
						setRangePos();
					}else if(target === range){
						target.style.left = (startPos + value)<26?26:(startPos + value)>(30*SCALE_WIDTH+8-range.offsetWidth)?(30*SCALE_WIDTH+8-range.offsetWidth):(startPos + value) + "px";
						anchor1.style.left = range.offsetLeft - 8 + "px";
						anchor2.style.left = range.offsetLeft - 8 + range.offsetWidth + "px";
					}
				};
				return;
			});
			document.addEventListener("mouseup",function(e){
				var sleft = anchor1.offsetLeft;
				var eleft = anchor2.offsetLeft;
				anchor1.style.left = sleft - (sleft - 10)%SCALE_WIDTH +SCALE_WIDTH/2 + "px";
				anchor2.style.left = eleft - (eleft - 10)%SCALE_WIDTH +SCALE_WIDTH/2 + "px";
				setRangePos();
			});
		})(sliderBar);
		function setRangePos(){
			var left = anchor1.offsetLeft < anchor2.offsetLeft? anchor1.offsetLeft : anchor2.offsetLeft;
			var width = Math.abs(anchor2.offsetLeft - anchor1.offsetLeft);
			range.style.left = left + 8 + "px";
			range.style.width = width + "px";
		}
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
			Util.appendHtml(target,'<span class="arrow-right pull-left"></span><span class="arrow-left pull-right"></span>');
			slider = document.createElement("div");
			Util.addClass(slider,"date-slider");
			target.appendChild(slider);
		}
		
		/**
		 * 初始化年份尺子
		 */
		function initYearBar() {
			var html = '<span class="date-slider-year" style="width: 18px;"></span>';
			var width = (12 - _option.startDate.getMonth())*SCALE_WIDTH;
			for(var start = _option.startDate.getFullYear(),end=_option.endDate.getFullYear();start<end;start++){
				html += '<span class="date-slider-year" style="width: '+width+'px;">'+start+'</span>';
				if(width!=12*SCALE_WIDTH){
					width = 12*SCALE_WIDTH;
				}
			}
			html += '<span class="date-slider-year" style="width: '+(_option.endDate.getMonth()-1)*SCALE_WIDTH+'px;">'+start+'</span>';
			html = '<div class="date-slider-year-bar"><div class="date-slider-years">' + html + '</div></div>';
			Util.appendHtml(slider,html);
		}
	
		/**
		 * 初始化拖动条
		 */
		function initSliderBar() {
			_self._anchor1 = anchor1 = document.createElement("span");
			_self._anchor2 = anchor2 = document.createElement("span");
			range = document.createElement("span");
			sliderBar = document.createElement("div");
			Util.addClass(anchor1,"draggable");
			Util.addClass(anchor1,"date-slider-anchor");
			Util.addClass(anchor2,"draggable");
			Util.addClass(anchor2,"date-slider-anchor");
			Util.addClass(range,"draggable");
			Util.addClass(range,"date-slider-range");
			Util.addClass(sliderBar,"date-slider-bar");
			sliderBar.appendChild(range);
			sliderBar.appendChild(anchor1);
			sliderBar.appendChild(anchor2);
			slider.appendChild(sliderBar);
		}
	
		/**
		 * 初始化月份尺子
		 */
		function initMonthRuler() {
			var startYear = _option.startDate.getFullYear();
			var endYear = _option.endDate.getFullYear();
			var startMonth = _option.startDate.getMonth()+1;
			var endMonth = _option.endDate.getMonth()+1;
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
			Util.appendHtml(slider,'<div class="date-slider-ruler"><div class="date-slider-scales">'+scale+'</div><div class="date-slider-values">' +monthHtml+'</div></div>');
			target.style.maxWidth = slider.style.width = monthAmount * SCALE_WIDTH+ 36+"px";
		}
	}
	
	DateSlider.prototype = {
		getOption: function() {
			return this.option;
		},
		getStartTime: function() {
			var left = this._anchor1.offsetLeft > this._anchor2.offsetLeft?this._anchor2.offsetLeft:this._anchor1.offsetLeft;
			var monthCount = Math.ceil(left/SCALE_WIDTH);
			var year = this.option.startDate.getFullYear();
			var month = this.option.startDate.getMonth();
			for(var i = 0;i<monthCount;++i){
				month++;
				if(month===13){
					month = 1;
					year++;
				}
			}
			if(month<10){
				month = "0"+month;
			}
			return ""+year+month;
		},
		getEndTime: function() {
			var left = this._anchor1.offsetLeft < this._anchor2.offsetLeft?this._anchor2.offsetLeft:this._anchor1.offsetLeft;
			var monthCount = Math.ceil(left/SCALE_WIDTH);
			var year = this.option.startDate.getFullYear();
			var month = this.option.startDate.getMonth();
			for(var i = 0;i<monthCount;++i){
				month++;
				if(month===13){
					month = 1;
					year++;
				}
			}
			if(month<10){
				month = "0"+month;
			}
			return ""+year+month;
		}
	};

	window.DateSlider = DateSlider;
})(document,window);
