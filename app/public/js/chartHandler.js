const configSample = {
    type : 'line',
    data : {
        labels: ["2013", "2014", "2015", "2016", "2017"],
        datasets: [{
          label: '# of Votes',
          data: [12, 19, 3, 5, 2, 3],
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)'
          ],
          borderColor: [
            'rgba(255,99,132,1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)'
          ],
          borderWidth: 1,
          fill: true
        }]
    }
}

//type : line, scatter, bar, pie
function createChart(config, id = "chart"){
    var canvas = $(`#${id}`).get(0).getContext("2d");

    if (config.type == "line") {
        new Chart(canvas, {
            type: config.type,
            data: config.data,
            options: options
        });
    } else if (config.type == "scatter"){
        new Chart(canvas, {
            type: config.type,
            data: config.data,
            options: scatterChartOptions
        });
    } else if (config.type == "bar"){
        new Chart(canvas, {
            type: config.type,
            data: config.data,
            options: options
        });
    }  else if (config.type == "pie"){
        new Chart(canvas, {
            type: config.type,
            data: config.data,
            options: pieOptions
        });
    }
}


var options = {
    scales: {
      yAxes: [{
        ticks: {
          beginAtZero: true
        }
      }]
    },
    legend: {
      display: true
    },
    elements: {
      point: {
        radius: 0
      }
    },
    responsive:true,
    maintainAspectRatio: false
};

var pieOptions = {
    animation: {
      animateScale: true,
      animateRotate: true
    },
    responsive:true,
    maintainAspectRatio: false
};

var areaOptions = {
    plugins: {
      filler: {
        propagate: true
      }
    },
    responsive:true,
    maintainAspectRatio: false
}

var scatterChartOptions = {
    scales: {
      xAxes: [{
        type: 'linear',
        position: 'bottom'
      }]
    },
    responsive:true,
    maintainAspectRatio: false
}


