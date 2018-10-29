$(function(){
	//下拉列表
	$("#position").hover(function(){
		$("#position").addClass("positionBackgroundColor");
		$("#dropDownMenu").show();
	},function(){
		$("#position").removeClass("positionBackgroundColor");
		$("#dropDownMenu").hide();
	});
	$("#dropDownMenu").hover(function(){
		$("#position").addClass("positionBackgroundColor");
		$("#dropDownMenu").show();
	},function(){
		$("#position").removeClass("positionBackgroundColor");
		$("#dropDownMenu").hide();
	});
	$(".cellStyle1").hover(function(){
		$(this).addClass("cellStyle4");
	},function(){
		$(this).removeClass("cellStyle4");
	});
	$(".cellStyle2").hover(function(){
		$(this).addClass("cellStyle4");
	},function(){
		$(this).removeClass("cellStyle4");
	});
	$(".cellStyle3").hover(function(){
		$(this).addClass("cellStyle4");
	},function(){
		$(this).removeClass("cellStyle4");
	});

	choose(1);
});

var hightemperature;
var lowtemperature;
var temperatureArray = new Array();
var timeArray = new Array();


//判断天气图片
function judge(divName,weather,flag){
	if (weather.indexOf("晴")>-1) {
		$(divName+flag).html(`&#xe6f5;`);
	}else if (weather.indexOf("多云")>-1) {
		$(divName+flag).html(`&#xe6f3;`);
	}else if (weather.indexOf("阴")>-1) {
		$(divName+flag).html(`&#xe6f8;`);
	}else if (weather.indexOf("小雨")>-1) {
		$(divName+flag).html(`&#xe6f7;`);
	}else if (weather.indexOf("阵雨")>-1) {
		$("#icon"+flag).html(`&#xe6fb;`);
	}else if (weather.indexOf("中雨")>-1) {
		$(divName+flag).html(`&#xe6fd;`);
	}else if (weather.indexOf("暴雨")>-1) {
		$(divName+flag).html(`&#xe6f2;`);
	}else if (weather.indexOf("小雪")>-1) {
		$(divName+flag).html(`&#xe6f6;`);
	}else if (weather.indexOf("阵雪")>-1) {
		$(divName+flag).html(`&#xe6fa;`);
	}else if (weather.indexOf("中雪")>-1) {
		$(divName+flag).html(`&#xe6fc;`);
	}else if (weather.indexOf("暴雪")>-1) {
		$(divName+flag).html(`&#xe6f1;`);
	}else if (weather.indexOf("冰雹")>-1) {
		$(divName+flag).html(`&#xe706;`);
	}else if (weather.indexOf("雨雪")>-1) {
		$(divName+flag).html(`&#xe70a;`);
	}
}

function choose(num){
	canvasClear();
	$("#state").removeClass("stateStyle2");
	$("#state").addClass("stateStyle1");
	$("#state").text("查询中 · · ·");
	let name = $("#city"+num).text();
	let cityName = $("#city"+num).attr("value");
	$("#city").text(name);
	$("#position").removeClass("positionBackgroundColor");
	$("#dropDownMenu").hide();
	weatherQuery1(cityName);
}


//36小时天气
function weatherQuery1(cityName){
	xhr1 = new XMLHttpRequest();
	xhr1.open("get","http://api.help.bj.cn/apis/weather36h?id="+cityName);
	xhr1.onreadystatechange = callback1;
	xhr1.send();
}

function callback1(){
	if (xhr1.readyState == 4 && xhr1.status == 200) { //回传的数据正确无误
		let result = xhr1.responseText;
		let jsonData = JSON.parse(result);
		let {citycode,weather36h} = jsonData;
		let flag = 0;
		for(let value of weather36h){
			if(flag == 9){
				break;
			}
			let {temp,time} = value;
			temperatureArray.push(parseInt(temp));
			lowtemperature=Math.min.apply( Math, temperatureArray);
			hightemperature=Math.max.apply( Math, temperatureArray);
			timeArray.push(time.split(" ")[1].substring(0,5));
			flag++;
		}
		let {temp,time,weather} = weather36h[0];
		judge("#icon",weather,1);
		$("#realTimeLeft").text(temp);
		$("#up").text("℃");
		$("#down").text(`${weather}(实时)`);
		weatherQuery2(citycode);
		// console.log("1."+result);
	}
}

//今日天气
function weatherQuery2(cityCode){
	xhr2 = new XMLHttpRequest();
	xhr2.open("get","http://api.help.bj.cn/apis/weather?id="+cityCode);
	xhr2.onreadystatechange = callback2;
	xhr2.send();
}

function callback2(){
	if (xhr2.readyState == 4 && xhr2.status == 200) { //回传的数据正确无误
		let result = xhr2.responseText;
		let jsonData = JSON.parse(result);
		let {city,citycode,wd,wdforce,uptime,humidity} = jsonData;
		$("#releaseTime").text(`${city} (发布时间：${uptime})`);
		$("#humidity").text(`湿度：${humidity}`);
		weatherQuery3(citycode);
		// console.log("2."+result);
	}
}

//今日农历
function weatherQuery3(cityCode){
	xhr3 = new XMLHttpRequest();
	xhr3.open("get","http://api.help.bj.cn/apis/nongli/?id="+cityCode);
	xhr3.onreadystatechange = callback3;
	xhr3.send();
}

function callback3(){
	if (xhr3.readyState == 4 && xhr3.status == 200) { //回传的数据正确无误
		let result = xhr3.responseText;
		let jsonData = JSON.parse(result);
		let{weathercode,data} = jsonData;
		let date = "";
		for(let value of data){
			let{name,val} = value;
			if(name == "阳历年"){
				date += val;
			}
			if(name == "阳历月"){
				date += val;
			}
			if(name == "阳历日"){
				date += val;
				date += " ";
			}
			if(name == "星期"){
				date += name;
				date += val;
				date += " ";
			}
			if(name == "农历月"){
				date += "农历";
				date += val;
			}
			if(name == "农历日"){
				date += val;
				$("#date1").text(date);
				break;
			}
		}
		weatherQuery4(weathercode);
		weatherQuery5(weathercode);
		// console.log("3."+result);
	}
}

//6天天气预报
function weatherQuery4(cityCode){
	xhr4 = new XMLHttpRequest();
	xhr4.open("get","http://api.help.bj.cn/apis/weather6d/?id="+cityCode);
	xhr4.onreadystatechange = callback4;
	xhr4.send();
}

function callback4(){
	if (xhr4.readyState == 4 && xhr4.status == 200) { //回传的数据正确无误
		let result = xhr4.responseText;
		let jsonData = JSON.parse(result);
		let{forecast,life} = jsonData.data;
		let flag = 1;
		for(let value of forecast){
			let{date,temphigh,windforce,templow,wind,weather} = value;
			if(flag == 1){
				$("#temperature"+flag).text(`${templow}~${temphigh}℃`);
				$("#weather"+flag).text(weather);
				windforce = windforce.split("[")[2].split("]")[0];
				$("#wind"+flag).text(`${wind} ${windforce}`);
				flag++;
				continue;
			}
			$("#date"+flag).text(date);
			judge("#icon",weather,flag)
			$("#temperature"+flag).text(`${templow}~${temphigh}℃`);
			$("#weather"+flag).text(weather);
			windforce = windforce.split("[")[2].split("]")[0];
			$("#wind"+flag).text(`${wind} ${windforce}`);
			flag++;
		}
		$("#suggest").text(`${life}`);
		// console.log("4."+result);
	}
}

//空气质量查询
function weatherQuery5(cityCode){
	xhr5 = new XMLHttpRequest();
	xhr5.open("get","http://api.help.bj.cn/apis/aqi?id="+cityCode);
	xhr5.onreadystatechange = callback5;
	xhr5.send();
}

function callback5(){
	if (xhr5.readyState == 4 && xhr5.status == 200) { //回传的数据正确无误
		let result = xhr5.responseText;
		let jsonData = JSON.parse(result);
		console.log(jsonData);
		if(jsonData.status != "104"){
			let {aqi,per,lv} = jsonData.data[0];
			$("#aqi").text(`${aqi} ${per}`);
			switch(lv){
				case "1": $("#aqi").css("background-color","#008000");
					break;
				case "2": $("#aqi").css("background-color","#ffff00");
					break;
				case "3": $("#aqi").css("background-color","#ffa500");
					break;
				case "4": $("#aqi").css("background-color","#ff0000");
					break;
				case "5": $("#aqi").css("background-color","#800080");
					break;
				case "6": $("#aqi").css("background-color","#a52a2a");
					break;
			}
			// console.log("5."+result);
			$("#state").removeClass("stateStyle1");
			$("#state").text("查询完毕");
			$("#state").addClass("stateStyle2");
			// console.log("temperatureArray "+temperatureArray);
			// console.log("timeArray "+timeArray);
			lineChart(temperatureArray,timeArray,lowtemperature,hightemperature);
			for(let i = 0; i < 9; i++){
				temperatureArray.pop();
				timeArray.pop();
			}
			// console.log("temperatureArray "+temperatureArray);
			// console.log("timeArray "+timeArray);	
		}else{
			// console.log("5."+result);
			$("#aqi").text("查询无果");
			$("#aqi").css("background-color","");
			$("#state").removeClass("stateStyle1");
			$("#state").text("查询完毕");
			$("#state").addClass("stateStyle2");
			// console.log("temperatureArray "+temperatureArray);
			// console.log("timeArray "+timeArray);
			lineChart(temperatureArray,timeArray,lowtemperature,hightemperature);
			for(let i = 0; i < 9; i++){
				temperatureArray.pop();
				timeArray.pop();
			}
			// console.log("temperatureArray "+temperatureArray);
			// console.log("timeArray "+timeArray);
		}
	}
}


//温度转换成纵坐标
function temperatureToPixel(temperature,value){
	let pixel = parseInt(temperature) * value; //value(像素/度)
	return 140 - pixel;
}


function valueInitX(value1,value2){   //得到value(像素/度)
	let value = Math.floor(135.0/(value2 - value1));
	return value;
}

function dValueInitX(value1,value2){   //得到行宽（度）
		let value = Math.ceil((value2 - value1)/6.0);
		return value;
}
			

function lineChart(temperature,time,low,high){
	let c=document.getElementById("myCanvas");
	let cxt=c.getContext("2d");
	let grd=cxt.createLinearGradient(0,0,0,150);
	grd.addColorStop(0,"#33cfff");
	grd.addColorStop(1,"#3dd5ff");
	cxt.fillStyle=grd;    //颜色设置
	cxt.fillRect(0,0,910,165);  //背景填充
	cxt.font="14px Arial";
	cxt.textAlign = "center";
	cxt.stroke();

	let value = valueInitX(low-3,high+3); //(像素/度)
	let dValue = dValueInitX(low-3,high+3); //(度)
	console.log(dValue);

			//横线及y轴坐标
	let initX = low-3;
	cxt.fillStyle="white";
	cxt.font="20px";
	cxt.textAlign = "center";
	cxt.fillText(initX,25,145);
	cxt.beginPath();
	cxt.moveTo(36,140);
	cxt.lineWidth = '2';
	cxt.strokeStyle='white';
	cxt.lineTo(886,140);
	cxt.stroke();
	for(let i=1; i<=7; i++){
		let temp = value * dValue * i;
		if(temp >= 140){
			break;
		}
		let j = 140 - temp;
		let t = dValue * i + initX; //X坐标
		cxt.fillText(t,25,j+5);
		cxt.beginPath();
		cxt.moveTo(36,j);
		cxt.lineWidth = '1';
		cxt.strokeStyle='white';
		cxt.lineTo(886,j);
		cxt.stroke();
	}

	//x轴坐标
	let initY = temperatureToPixel(temperature[0]-initX,value);
	cxt.fillStyle="white";
	cxt.beginPath();
	cxt.moveTo(36,initY);
	cxt.lineWidth = '2';
	cxt.strokeStyle="white";
	cxt.lineTo(61,initY);
	cxt.stroke();
	cxt.beginPath();
	cxt.fillStyle="white";
	cxt.arc(61,initY,4,0,2*Math.PI);
	cxt.fill();
	cxt.closePath();
	for(let i = 0; i < 9; i++){
		let y = temperatureToPixel(temperature[i]-initX,value);
		let j = 61 + 100 * i;

		if(i == 0){
			cxt.fillText(temperature[i]+"℃",j,y-10);
			cxt.fillText("现在",j,155);
		}
		else{
			cxt.fillText(temperature[i]+"℃",j,y-10);
			cxt.fillText(time[i],j,155);
			cxt.beginPath();
			cxt.moveTo(j-100,temperatureToPixel(temperature[i-1]-initX,value));
			cxt.lineWidth = '2';
			cxt.strokeStyle="white";
			cxt.lineTo(j,y);
			cxt.stroke();
			cxt.beginPath();
			cxt.fillStyle="white";
			cxt.arc(j,y,4,0,2*Math.PI);
			cxt.fill();
			cxt.closePath();
			cxt.lineWidth = '0';
			cxt.stroke();
		}
	}
	cxt.beginPath();
	cxt.moveTo(860,temperatureToPixel(temperature[8]-initX,value));
	cxt.lineWidth = '2';
	cxt.strokeStyle="white";
	cxt.lineTo(886,temperatureToPixel(temperature[8]-initX,value));
	cxt.stroke();	
}

function canvasClear(){
	let c=document.getElementById("myCanvas");
	let cxt=c.getContext("2d");
	// cxt.clearRect(0,0,910,165);
	c.width = 910;
	c.height = 165;
}

