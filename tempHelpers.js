const buildGaugeTempChart = (stationTemp,stationFeels,stationMax,stationMin) => {
	const currentOb = new Date().toLocaleString()
	console.log('building gauge chart')

	let speedGauge = Highcharts.chart('tempCurrentContainer', {
		chart: {
				type: 'solidgauge'
		},
		title: {
				text: 'Current Air Temperature'
		},

		subtitle: {
				text: `Station: Mount Mitchell (MITC)<br/>24-Hour High: ${stationMax}°F     Low: ${stationMin}°F`
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
			min: -20,
			max : 90,
			stops: [
					[19/(90-(-20)), '#fabef9'],
					[39/(90-(-20)), '#4e6af5'],
					[59/(90-(-20)), '#2cb030'],
					[79/(90-(-20)), '#edff7a'],
					[99/(90-(-20)), '#ed1a1a'], ],
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
				solidgauge: {
						innerRadius: '85%',
						dataLabels: {
								y: 5,
								borderWidth: 0,
								useHTML: true
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
		},
		credits: {
				enabled: false
		},
		series: [{
				name: 'inTemp',
				data: [stationTemp], /////// Temp Value //////////
				dataLabels: {
						format: '<div style="text-align:center"><span style="font-size:25px;color:black">{y}&deg;F</span><br/>' + '<span style="font-size:12px;color:silver">Feels Like: '+stationFeels+'</span></div>'
				}
		}]
	})
	getCurrentWind()
}

const getMaxMin = (stationTemp,stationFeels) => {
	let url = `https://api.climate.ncsu.edu/data?loc=MITC&var=airtempmax2m,airtempmin2m&start=-24%20hours&end=now&int=1%20DAY&obtype=O&output=json&attr=location,datetime,var,value,value_accum,unit,score,nettype,paramtype,obtype,obnum,obtime&hash=8de315acb7cf795cf0e5a4b9d351caa2efd2a922`
	console.log(url)

	const xhr = new XMLHttpRequest();

	xhr.responseType = 'json';

	xhr.onreadystatechange = function() {
		if(xhr.readyState === XMLHttpRequest.DONE){
			//Station Data Objects
			console.log(xhr.response.data.MITC)

			const stationObj = xhr.response.data.MITC
			const stationLength = Object.keys(stationObj).length
			let stationCount = 1
			let stationMax
			let stationMin
			if (stationLength == 1){
				for(let key in stationObj){
					const stationMaxHold = stationObj[key].airtempmax2m.value
					const stationMinHold = stationObj[key].airtempmin2m.value
					if (stationMaxHold == 'NA' || stationMaxHold == 'QCF' || stationMaxHold == 'MV'){
						stationMax = null
					}else if (stationMinHold == 'NA' || stationMinHold == 'QCF' || stationMinHold == 'MV'){
						stationMin = null
					}else {
						stationMax = eval(stationMaxHold)
						stationMin = eval(stationMinHold)
					}
				}
			}else {
				for (let key in stationObj){
					if (stationCount == stationLength-1){
						const stationMaxHold = stationObj[key].airtempmax2m.value
						const stationMinHold = stationObj[key].airtempmin2m.value
						if (stationMaxHold == 'NA' || stationMaxHold == 'QCF' || stationMaxHold == 'MV'){
							stationMax = null
						}else if (stationMinHold == 'NA' || stationMinHold == 'QCF' || stationMinHold == 'MV'){
							stationMin = null
						}else {
							stationMax = eval(stationMaxHold)
							stationMin = eval(stationMinHold)
						}
					}
					stationCount = stationCount + 1
				}
			}
			buildGaugeTempChart(stationTemp,stationFeels,stationMax,stationMin)
			try {
			} catch(err) {}
		}
	}
	xhr.open("GET",url)
	xhr.send()
}

const getFeels = (stationTemp,feelsVar) => {
	let url = `https://api.climate.ncsu.edu/data?loc=MITC&var=${feelsVar}&start=-20%20minutes&end=now&obtype=O&output=json&attr=location,datetime,var,value,value_accum,unit,score,nettype,paramtype,obtype,obnum,obtime&hash=8de315acb7cf795cf0e5a4b9d351caa2efd2a922`
	console.log(url)

	const xhr = new XMLHttpRequest();

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
				let stationCount = 2
				let stationFeels
				let stationObTime
				if (stationLength == 1){
					for(let key in stationObj){
						const stationFeelsHold = stationObj[key][feelsVar].value
						if (stationFeelsHold == 'NA' || stationFeelsHold == 'QCF' || stationFeelsHold == 'MV'){
							stationFeels = null
						}else {
							stationFeels = stationFeelsHold
						}
					}
				}else {
					for (let key in stationObj){
						if (stationCount == stationLength-1){
							const stationFeelsHold = stationObj[key][feelsVar].value
							stationObTime = stationObj[key][feelsVar].obtime
							if (stationFeelsHold == 'NA' || stationFeelsHold == 'QCF' || stationFeelsHold == 'MV'){
								stationFeels = 'null'
							}else {
								stationFeels = stationFeelsHold + '°F'
							}
						}
						stationCount = stationCount + 1
					}
				}
				if(stationFeels == 'null'){
					console.log('null')
				}else{
					console.log(stationFeels)
				}

				getMaxMin(stationTemp,stationFeels)
			} catch(err) {}
		}
	}
	xhr.open("GET",url)
	xhr.send()
}

const buildTempChart = (tempList,chillList,heatList,timeList,stationMax,stationMin) => {
	let finalTimeList = []
	for(let i in timeList){
		if((i%4)==0){
			finalTimeList.push(timeList[i])
		}else{
			finalTimeList.push('')
		}
	}
	finalTimeList.splice(48,1,'Now')
	console.log('building series chart')
	let tempSeriesChart = Highcharts.chart('tempSeriesContainer', {
	    chart: {
	        type: 'spline'
	    },
	    title: {
	        text: 'Temperature, Heat Index, and Wind Chill'
	    },
	    subtitle: {
	        text: `Station: Mount Mitchell (MITC)<br/>24-Hour High: ${stationMax}°F     Low: ${stationMin}°F`
	    },
	    xAxis: {
	    	categories: finalTimeList,
	        reversed: false,
	    	title: {
	    		text: 'Time (Eastern Time)',
	    		style: {
	    			fontSize: '18px'
	    		}
	    	},/*,
	        labels: {
	            format: '{value}'
	        },*/
	        showLastLabel: true
	    },
	    yAxis: [{
		    title: {
		        text: 'Air Temperature (°F)',
		        style: {
		        	color: '#FF0000',
		        	fontSize: '20px'
		        }
		    },
	        labels: {
	            format: '{value}'
	        },
	        lineWidth: 2
	    },{
		    title: {
		        text: `<span style='color:#1d91f0;'>Wind Chill</span>/<span style='color:#d64f99;'>Heat Index</span> (°F)`,
		        style: {
		        	fontSize: '20px'
		        }
		    },
	        labels: {
	            format: '{value}'
	        },
	        lineWidth: 2,
	        opposite: true
	    }],
	    legend: {
	        enabled: false
	    },
	    tooltip: {
	        headerFormat: '<b>{series.name}</b><br/>',
	        pointFormat: '{point.x}: {point.y}°F'
	    },
	    plotOptions: {
	        spline: {
	            marker: {
	                enabled: false
	            }
	        }
	    },
	    series: [{
	        name: 'Temperature',
	        data: tempList,
			color: "#FF0000",
			zIndex: 1
	    },
	    {
	    	name: 'Wind Chill',
	    	data: chillList,
	    	color: "#1d91f0",
	    	zIndex: 0,
	    	dashStyle: 'shortdot'
	    },{
	    	name: 'Heat Index',
	    	data: heatList,
	    	color: "#d64f99",
	    	zIndex: 0,
	    	dashStyle: 'shortdot'
	    }]
	});
	getSeriesWind()
}

const getMaxMinSeries = (tempList,chillList,heatList,timeList) => {
	let url = `https://api.climate.ncsu.edu/data?loc=MITC&var=airtempmax2m,airtempmin2m&start=-24%20hours&end=now&int=1%20DAY&obtype=O&output=json&attr=location,datetime,var,value,value_accum,unit,score,nettype,paramtype,obtype,obnum,obtime&hash=8de315acb7cf795cf0e5a4b9d351caa2efd2a922`
	console.log(url)

	const xhr = new XMLHttpRequest();

	xhr.responseType = 'json';

	xhr.onreadystatechange = function() {
		if(xhr.readyState === XMLHttpRequest.DONE){
			//Station Data Objects
			console.log(xhr.response.data.MITC)
			try {
				const stationObj = xhr.response.data.MITC
				const stationLength = Object.keys(stationObj).length
				let stationCount = 1
				let stationMax
				let stationMin
				if (stationLength == 1){
					for(let key in stationObj){
						const stationMaxHold = stationObj[key].airtempmax2m.value
						const stationMinHold = stationObj[key].airtempmin2m.value
						if (stationMaxHold == 'NA' || stationMaxHold == 'QCF' || stationMaxHold == 'MV'){
							stationMax = null
						}else if (stationMinHold == 'NA' || stationMinHold == 'QCF' || stationMinHold == 'MV'){
							stationMin = null
						}else {
							stationMax = eval(stationMaxHold)
							stationMin = eval(stationMinHold)
						}
					}
				}else {
					for (let key in stationObj){
						if (stationCount == stationLength-1){
							const stationMaxHold = stationObj[key].airtempmax2m.value
							const stationMinHold = stationObj[key].airtempmin2m.value
							if (stationMaxHold == 'NA' || stationMaxHold == 'QCF' || stationMaxHold == 'MV'){
								stationMax = null
							}else if (stationMinHold == 'NA' || stationMinHold == 'QCF' || stationMinHold == 'MV'){
								stationMin = null
							}else {
								stationMax = eval(stationMaxHold)
								stationMin = eval(stationMinHold)
							}
						}
						stationCount = stationCount + 1
					}
				}
				buildTempChart(tempList,chillList,heatList,timeList,stationMax,stationMin)
			} catch(err) {}
		}
	}
	xhr.open("GET",url)
	xhr.send()
}

const getOne = (tempList,feels,timeList) => {
	let url = `https://api.climate.ncsu.edu/data?loc=MITC&var=${feels}&start=-24%20hours&end=now&int=30%20MINUTE&obtype=O&output=json&attr=location,datetime,var,value,value_accum,unit,score,nettype,paramtype,obtype,obnum,obtime&hash=8de315acb7cf795cf0e5a4b9d351caa2efd2a922`
	console.log(url)

	const xhr = new XMLHttpRequest();

	xhr.responseType = 'json';

	xhr.onreadystatechange = function() {
		if(xhr.readyState === XMLHttpRequest.DONE){
			//Station Data Objects
			console.log(xhr.response.data.MITC)
			let heatList = []
			let chillList = []
			let stationFeels

			const stationObj = xhr.response.data.MITC
			for(let key in stationObj){
				const stationFeelsHold = stationObj[key][feels].value
				if (stationFeelsHold == 'NA' || stationFeelsHold == 'QCF' || stationFeelsHold == 'MV'){
					stationFeels = null
				}else {
					stationFeels = eval(stationFeelsHold)
				}

				if(feels=='windchill'){
					chillList.push(stationFeels)
					heatList.push('')
				}else{
					chillList.push('')
					heatList.push(stationFeels)
				}

			}

			getMaxMinSeries(tempList,chillList,heatList,timeList)

			try {

			} catch(err) {}
		}
	}
	xhr.open("GET",url)
	xhr.send()
}

const getTwo = () => {

}

const convert12 = (timeSplit) => {
	let pieces = timeSplit.split(':')
	let hourNF = eval(pieces[0])
	let minute = pieces[1]
	let hour
	let time
	if(hourNF>12){
		hour = hourNF-12
		time = `${hour}:${minute} PM`
		return time
	}else{
		time = `${hourNF}:${minute} AM`
		return time
	}
}
