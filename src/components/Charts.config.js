export const options = {
	chart: {
		height: 500,
		type: 'line',
		zoom: {
			enabled: false
		}
	},
	dataLabels: {
		enabled: false
	},
	stroke: {
		curve: 'straight'
	},
	title: {
		text: 'Price History',
		align: 'left',
		style: {
      fontSize:  '16px',
      fontWeight:  'bold',
      fontFamily:  'Roboto, sans-serif',
      color:  '#263238'
    },
	},
	grid: {
		row: {
			colors: ['#f3f3f3', 'transparent'],
			opacity: 0.5
		},
	}
}

export const series = [{
	data: [30, 40, 45, 50, 49, 60, 70, 91]
}]
