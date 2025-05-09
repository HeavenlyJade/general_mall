<template>
	<div class="wx-date-picker">
	  <div class="picker-wheels">
		<!-- 年份选择器 -->
		<scroll-view 
		  class="wheel year-wheel" 
		  scroll-y 
		  :scroll-into-view="'year-' + selectedYear"
		>
		  <div 
			v-for="year in years" 
			:key="year" 
			:id="'year-' + year"
			:class="['wheel-item', { 'selected': year === selectedYear }]" 
			@tap="selectYear(year)"
		  >
			{{ year }}年
		  </div>
		</scroll-view>
		
		<!-- 月份选择器 -->
		<scroll-view 
		  class="wheel month-wheel" 
		  scroll-y 
		  :scroll-into-view="'month-' + selectedMonth"
		>
		  <div 
			v-for="month in months" 
			:key="month" 
			:id="'month-' + month"
			:class="['wheel-item', { 'selected': month === selectedMonth }]" 
			@tap="selectMonth(month)"
		  >
			{{ month }}月
		  </div>
		</scroll-view>
		
		<!-- 日期选择器 -->
		<scroll-view 
		  class="wheel day-wheel" 
		  scroll-y 
		  :scroll-into-view="'day-' + selectedDay"
		>
		  <div 
			v-for="day in days" 
			:key="day" 
			:id="'day-' + day"
			:class="['wheel-item', { 'selected': day === selectedDay }]" 
			@tap="selectDay(day)"
		  >
			{{ day }}日
		  </div>
		</scroll-view>
	  </div>
	</div>
  </template>
  
  <script>
  export default {
	name: 'WxDatePicker',
	props: {
	  defaultDate: {
		type: Date,
		default: () => new Date(),
	  },
	},
	data() {
	  return {
		selectedDate: new Date(this.defaultDate),
	  };
	},
	computed: {
	  years() {
		const currentYear = new Date().getFullYear();
		const years = [];
		for (let y = currentYear - 10; y <= currentYear + 10; y++) {
		  years.push(y);
		}
		return years;
	  },
	  months() {
		return Array.from({ length: 12 }, (_, i) => i + 1);
	  },
	  days() {
		const daysInMonth = new Date(
		  this.selectedDate.getFullYear(),
		  this.selectedDate.getMonth() + 1,
		  0
		).getDate();
		return Array.from({ length: daysInMonth }, (_, i) => i + 1);
	  },
	  selectedYear() {
		return this.selectedDate.getFullYear();
	  },
	  selectedMonth() {
		return this.selectedDate.getMonth() + 1;
	  },
	  selectedDay() {
		return this.selectedDate.getDate();
	  },
	},
	watch: {
	  // 监听selectedDate变化，通知父组件
	  selectedDate: {
		handler(newDate) {
		  this.$emit('update:selectedDate', newDate);
		},
		deep: true
	  }
	},
	mounted() {
	  // 初始化时确保scroll-view滚动到当前选中项
	  this.$nextTick(() => {
		// 微信小程序可能需要延迟一点时间才能正确滚动
		setTimeout(() => {
		  // 这里可能需要使用微信小程序的API来滚动
		}, 50);
	  });
	},
	methods: {
	  selectYear(year) {
		// 使用新的Date对象避免引用问题
		let newDate = new Date(this.selectedDate);
		newDate.setFullYear(year);
		
		// 处理2月29日在非闰年的情况
		const maxDaysInMonth = new Date(year, this.selectedDate.getMonth() + 1, 0).getDate();
		if (this.selectedDate.getDate() > maxDaysInMonth) {
		  newDate.setDate(maxDaysInMonth);
		}
		
		this.selectedDate = newDate;
	  },
	  selectMonth(month) {
		let newDate = new Date(this.selectedDate);
		
		// 先设置为该月1日，避免月末日期问题
		newDate.setDate(1);
		newDate.setMonth(month - 1);
		
		// 处理月末日期问题（例如3月31日到2月）
		const maxDaysInMonth = new Date(this.selectedDate.getFullYear(), month, 0).getDate();
		const targetDay = Math.min(this.selectedDate.getDate(), maxDaysInMonth);
		newDate.setDate(targetDay);
		
		this.selectedDate = newDate;
	  },
	  selectDay(day) {
		let newDate = new Date(this.selectedDate);
		newDate.setDate(day);
		this.selectedDate = newDate;
	  },
	},
  };
  </script>
  
  <style>
  .wx-date-picker {
	width: 100%;
	padding: 10px 0;
  }
  
  .picker-wheels {
	display: flex;
	justify-content: space-between;
	height: 150px;
  }
  
  .wheel {
	flex: 1;
	height: 150px;
	text-align: center;
	background-color: #f8f8f8;
	margin: 0 5px;
	border-radius: 5px;
  }
  
  .wheel-item {
	height: 40px;
	line-height: 40px;
	padding: 0 5px;
	font-size: 16px;
  }
  
  .selected {
	background-color: #ff525d;
	color: white;
	font-weight: bold;
  }
  </style>