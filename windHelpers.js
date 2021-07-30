const toCardinal = (degrees) => {
	if(degrees > 348.75 || degrees < 11.25){
		return 'N'
	}else if(degrees > 11.25 && degrees < 33.75){
		return 'NNE'
	}else if(degrees > 33.75 && degrees < 56.25){
		return 'NE'
	}else if(degrees > 56.25 && degrees < 78.75){
		return 'ENE'
	}else if(degrees > 78.75 && degrees < 101.25){
		return 'E'
	}else if(degrees > 101.25 && degrees < 123.75){
		return 'ESE'
	}else if(degrees > 123.75 && degrees < 146.25){
		return 'SE'
	}else if(degrees > 146.25 && degrees < 168.75){
		return 'SSE'
	}else if(degrees > 168.75 && degrees < 191.25){
		return 'S'
	}else if(degrees > 191.25 && degrees < 213.75){
		return 'SSW'
	}else if(degrees > 213.75 && degrees < 236.25){
		return 'SW'
	}else if(degrees > 236.25 && degrees < 258.75){
		return 'WSW'
	}else if(degrees > 258.75 && degrees < 281.25){
		return 'W'
	}else if(degrees > 281.25 && degrees < 303.75){
		return 'WNW'
	}else if(degrees > 303.75 && degrees < 326.25){
		return 'NW'
	}else if(degrees > 326.25 && degrees < 348.75){
		return 'NNW'
	}
}

const buildGaugeWindChart = (stationSpeed,stationGust,stationDirection,stationMaxGust) => {
	const currentOb = new Date().toLocaleString()

	let gColor
	if(stationSpeed<5){
		gColor = '#42b6f4'
	}else if(stationSpeed>=5 && stationSpeed<10){
		gColor = '#3287B8'
	}else if(stationSpeed>=10 && stationSpeed<15){
		gColor = '#6bafae'
	}else if(stationSpeed>=15 && stationSpeed<20){
		gColor = '#a3d7a4'
	}else if(stationSpeed>=20 && stationSpeed<25){
		gColor = '#d1ebb1'
	}else if(stationSpeed>=25 && stationSpeed<30){
		gColor = '#f6fbbb'
	}else if(stationSpeed>=30 && stationSpeed<35){
		gColor = '#fae7a4'
	}else if(stationSpeed>=35 && stationSpeed<40){
		gColor = '#fdd58e'
	}else if(stationSpeed>=40 && stationSpeed<45){
		gColor = '#f5a168'
	}else if(stationSpeed>=45 && stationSpeed<50){
		gColor = '#ed7044'
	}else if(stationSpeed>=50 && stationSpeed<55){
		gColor = '#e75939'
	}else if(stationSpeed>=55 && stationSpeed<60){
		gColor = '#e1432f'
	}else if(stationSpeed>=60 && stationSpeed<65){
		gColor = '#ed2652'
	}else if(stationSpeed>=65 && stationSpeed<70){
		gColor = '#f70c72'
	}else if(stationSpeed>=70 && stationSpeed<75){
		gColor = '#f73da2'
	}else if(stationSpeed>=75 && stationSpeed<80){
		gColor = '#f76acd'
	}else if(stationSpeed>=80 && stationSpeed<85){
		gColor = '#f793e7'
	}else if(stationSpeed>=85 && stationSpeed<90){
		gColor = '#f6baff'
	}else if(stationSpeed>=90 && stationSpeed<95){
		gColor = '#fbd2ff'
	}else if(stationSpeed>=95 && stationSpeed<100){
		gColor = '#fee6ff'
	}

	const gaugeOptions = {
	    chart: {
	        type: 'gauge'
	    },
	    title: {
	        text: 'Current Wind Speed'
	    },

	    subtitle: {
	        text: `Station: Mount Mitchell (MITC)<br/>24-Hour High: ${stationGust} mph`
	    },
	    pane: {
	        size: '90%',
	        startAngle: -180,
	        endAngle: 90,
	        background: {
	            backgroundColor: '#EEE',
	            innerRadius: '85%',
	            outerRadius: '100%',
	            shape: 'arc'
	        }
	    },
	    tooltip: {
	        enabled: false
	    },
	    // the value axis
	    yAxis: {
			plotBands: [{
				from: 0,
				to: stationSpeed,
				color: gColor,
				innerRadius: '85%'
			},{
				from: stationSpeed,
				to: 100,
				color: '#EEEEEE',
				innerRadius: '85%'
			}],
	        lineWidth: 0,
	        minorTickInterval: 0,
	        tickPixelInterval: 50,
	        tickWidth: 1,
	        labels: {
	            enabled: true,
	            distance: 10
	        }
	    },
	    plotOptions: {
	        gauge: {
	            innerRadius: '85%',
	            dataLabels: {
	                y: 5,
	                borderWidth: 0,
	                useHTML: true
	            },
	            dial: {
	            	backgroundColor: 'red'
	            }
	        }
	    },
	    responsive: {
	        rules: [{
	            condition: {
	                Width: 500
	            },
	            chartOptions: {
	                legend: {
	                    layout: 'horizontal',
	                    align: 'center',
	                    verticalAlign: 'bottom'
	                }
	            }
	        }]
	    }
	};




	const chartSpeed = Highcharts.chart('windCurrentContainer', Highcharts.merge(gaugeOptions, {
	    yAxis: {
	        min: 0,
	        max: 100
	    },
	    credits: {
	        enabled: false
	    },
	    series: [{
	        name: 'inSpeed',
	        data: [stationSpeed], /////// Speed Value //////////
	        dataLabels: {
	            format: '<div style="text-align:center"><span style="font-size:20px;color:black">'+ stationDirection + ' at {y} mph</span><br/>' + '<span style="font-size:12px;color:black">Gusting to '+stationGust+' mph</span></div>'
	        }
	    }]
	}));
  seriesGet()
}

const getMax = (stationSpeed,stationDirection,stationGust) => {
	let url = `https://api.climate.ncsu.edu/data?loc=MITC&var=gustspeedmax10m&start=-24%20hours&end=now&int=1%20DAY&obtype=O&output=json&attr=location,datetime,var,value,value_accum,unit,score,nettype,paramtype,obtype,obnum,obtime&hash=8de315acb7cf795cf0e5a4b9d351caa2efd2a922`
	console.log(url)

	xhr = new XMLHttpRequest();

	xhr.responseType = 'json';

	xhr.onreadystatechange = function() {
		if(xhr.readyState === XMLHttpRequest.DONE){
			//Station Data Objects
			console.log(xhr.response.data.MITC)

			let dataList = []
			let timeList = []
			let station
			try {
				const stationObj = xhr.response.data.MITC
				const stationLength = Object.keys(stationObj).length
				let stationCount = 1
				let stationMaxGust
				let stationObTime
				if (stationLength == 1){
					for(let key in stationObj){
						const stationMaxGustHold = stationObj[key].gustspeedmax10m.value
						if (stationMaxGustHold == 'NA' || stationMaxGustHold == 'QCF' || stationMaxGustHold == 'MV'){
							stationMaxGust = null
						}else {
							stationMaxGust = stationGustHold
						}
					}
				}else {
					for (let key in stationObj){
						if (stationCount == stationLength-1){
							const stationMaxGustHold = stationObj[key].gustspeedmax10m.value
							if (stationMaxGustHold == 'NA' || stationMaxGustHold == 'QCF' || stationMaxGustHold == 'MV'){
								stationMaxGust = 'null'
							}else {
								stationMaxGust = stationMaxGustHold
							}
						}
						stationCount = stationCount + 1
					}
				}

				buildGaugeWindChart(stationSpeed,stationGust,stationDirection,stationMaxGust)
			} catch(err) {}
		}
	}
	xhr.open("GET",url)
	xhr.send()
}

const buildWindChart = (timeList,gustAvgList,gustMaxList,speedAvgList,speedMinList,directionAvgList) => {
	let timeCategory = []
	let periodSpeed = []
	let periodDir = []
	let holdList = []
	let holdList2 = []
	let minMaxRange = []
	let avgSpeedList = []
	let avgDirList = []
	let total
	let catTime
	let min
	let max
	console.log(speedAvgList.length)
	for(let i=0;i<speedAvgList.length;i++){
		min = speedMinList[i]
		max = gustMaxList[i]
		holdList.push(min)
		holdList.push(max)
		minMaxRange.push(holdList)

		avgSpeed = (speedAvgList[i] + gustAvgList[i])/2
		avgSpeedList.push(avgSpeed)

		if((i%8)==0){
			avgDir = [avgSpeed/2.237,directionAvgList[i]]
			avgDirList.push(avgDir)
		}else{
			avgDir = []
			avgDirList.push(avgDir)
		}

		if((i%4)==0){
			catTime = timeList[i]
			timeCategory.push(catTime)
		}else{
			timeCategory.push('')
		}

		periodSpeed = []
		periodDir = []
		holdList = []
		holdList2 = []
/*
		total = 0
		periodSpeed.push(speedList[i])
		periodSpeed.push(gustList[i])
		periodDir.push(directionList[i])
		if(i==0){}
		else if((i%15)==0){
			min = Math.min.apply(Math,periodSpeed)
			max = Math.max.apply(Math,periodSpeed)
			holdList.push(min)
			holdList.push(max)
			minMaxRange.push(holdList)

			avgSpeed = calcAverages(periodSpeed,total,holdList)
			avgSpeedList.push(avgSpeed)

			avgDir = calcAveragesBarb(periodDir,periodSpeed,total,holdList2,i)
			avgDirList.push(avgDir)

			periodSpeed = []
			periodDir = []
			holdList = []
			holdList2 = []
		}
		if((i%60)==0){
			catTime = timeList[i]
			timeCategory.push(catTime)
		}else if((i%15)==0){
			timeCategory.push('')
		}*/
	}

	timeCategory.splice(95,1,'Now')

	let allMax = Math.max.apply(Math,gustMaxList)
	let currentOb = getCurrent(gustAvgList,speedAvgList,directionAvgList)
	//console.log(timeCategory)
	Highcharts.chart('windSeriesContainer', {

	    title: {
	        text: 'Wind Speed Average, Gust/Lull, and Direction'
	    },

	    subtitle: {
	        text: `Station: Mount Mitchell (MITC)<br/>24-Hour High: ${allMax} mph`
	    },

		credits: {
	        enabled: false
	    },

	    yAxis: {
	        title: {
	            text: 'Wind Speed (mph)',
	            style: {
	            	color: '#FF0000',
	            	fontSize: '20px'
	            }
	        }
	    },
	    xAxis: {
	    	title: {
	    		text: 'Time (Eastern Time)',
	    		style: {
	    			fontSize: '18px'
	    		}
	    	},
	    	offset: 40,
	    	categories: timeCategory,
	    	min: 0,
	    	max: 95,
	    	gridLineWidth: 1,
	    	labels: {
	    		rotation: 315
	    	}
	    },
	    legend: {
	        layout: 'vertical',
	        align: 'right',
	        verticalAlign: 'middle'
	    },
	    tooltip: {
	    	shared: false
	    },
	    series: [{
	        name: 'Average',
	        data: avgSpeedList,
	        zIndex: 1,
	        color: '#FF0000',
	        marker: false
	    }, {
	        name: 'Gust/Lull',
	        data: minMaxRange,
	        type: 'arearange',
	        lineWidth: 0,
	        color: '#B4B4DC',
	        fillOpacity: 0.8,
	        zIndex: 0,
	        marker: {
	            enabled: false
	        }
	    },{
	        type: 'windbarb',
	        data: avgDirList,
	        name: 'Wind',
	        color: Highcharts.getOptions().colors[1],
	        showInLegend: false,
	        tooltip: {
	            valueSuffix: ' m/s'
	        }
	    }],

	    responsive: {
	        rules: [{
	            condition: {
	                maxWidth: 500
	            },
	            chartOptions: {
	                legend: {
	                    layout: 'horizontal',
	                    align: 'center',
	                    verticalAlign: 'bottom'
	                }
	            }
	        }]
	    }

	});
}

const calcAverages = (periodSpeed,total) => {
	total = 0;
	for(let i=0;i<periodSpeed.length;i++) {
		total += periodSpeed[i];

	}
	let avgSpeed = total/periodSpeed.length;
	console.log(avgSpeed.toFixed(2))

	return avgSpeed
}

const calcAveragesBarb = (periodDir,periodSpeed,total,holdList2,i) => {
	if (i%120==0) {
		total = 0;
		for(let i=0;i<periodDir.length;i++) {
		    total += periodDir[i];

		}
		avgDir = total/periodDir.length;

		total = 0;
		for(let i=0;i<periodSpeed.length;i++) {
		    total += periodSpeed[i];

		}
		avgSpeed = (total/periodSpeed.length)/2.237;

		return [avgSpeed,avgDir]
	}else {
		return []
	};
}

const getCurrent = (gustAvgList,speedAvgList,directionAvgList) => {
	let currentGust = gustAvgList.slice(-1)[0]
	let currentSpeed = speedAvgList.slice(-1)[0]
	let currentDir = toCardinal(directionAvgList.slice(-1)[0])

	let current = `${currentDir} at ${currentSpeed} mph, gusting to ${currentGust} mph`
	return current
}
