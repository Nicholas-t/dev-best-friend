require('dotenv').config();
var axios = require('axios')
const querystring = require('querystring');

var express = require('express');
var router = express.Router()


router.get('/file', function (req, res){
    res.download(__dirname + '/helloWorld.txt')
})

router.get('/json', function (req, res){
    console.log("Test on /json GET", req.query)
    res.json({
        hello : "World !"
    })
})

router.post('/json', function (req, res){
    console.log("Test on /json POST", req.body)
    res.json({
        hello : "World !"
    })
})

router.get('/table', function (req, res){   
    console.log("Test on /table GET", req.query)
    res.json({
        keys : [
            {  
                key : "profile"
            },
            {  
                key : "picture",
                label : "Profile Picture",
                type : "image"
            },
            {
                key : "vat_no",
                label : "Vat No."
            },
            {
                key : "created",
                label : "Created"
            },
            {
                key : "status",
                label : "Status",
                type : "pill"
            },
            {
                key : "progress",
                type : "progress-bar"
            }
        ],
        values : [
            {
                profile : "Herman Beck",
                picture : "/static/images/faces/face1.jpg",
                vat_no : "23847",
                created : "23, May, 2021",
                status : {
                    value : "Success",
                    color : "green"
                },
                progress : 23
            },
            {
                profile : "Herman Beck",
                picture : "/static/images/faces/face1.jpg",
                vat_no : "23847",
                created : "23, May, 2021",
                status : {
                    value : "Warning",
                    color : "yellow"
                },
                progress : 56
            },
            {
                profile : "Herman Beck",
                picture : "/static/images/faces/face1.jpg",
                vat_no : "23847",
                created : "23, May, 2021",
                status : {
                    value : "Info",
                    color : "blue"
                },
                progress : 25
            },
            {
                profile : "Herman Beck",
                picture : "/static/images/faces/face1.jpg",
                vat_no : "23847",
                status : {
                    value : "Primary",
                    color : "purple"
                },
                progress : 76
            },
            {
                profile : "Herman Beck",
                picture : "/static/images/faces/face1.jpg",
                created : "23, May, 2021",
                status : {
                    value : "Dark",
                    color : "black"
                },
                progress : 100
            },
            {
                profile : "Herman Beck",
                picture : "/static/images/faces/face1.jpg",
                vat_no : "23847",
                created : "23, May, 2021",
                status : {
                    value : "Secondary",
                    color : "grey"
                },
                progress : 12
            }
        ],
        style : "striped"
    })
})


router.post('/table', function (req, res){
    console.log("Test on /table POST", req.body)
    res.json({
        keys : [
            {  
                key : "profile"
            },
            {  
                key : "picture",
                label : "Profile Picture",
                type : "image"
            },
            {
                key : "vat_no",
                label : "Vat No."
            },
            {
                key : "created",
                label : "Created"
            },
            {
                key : "status",
                label : "Status",
                type : "pill"
            },
            {
                key : "progress",
                type : "progress-bar"
            }
        ],
        values : [
            {
                profile : "Herman Beck",
                picture : "/static/images/faces/face1.jpg",
                vat_no : "23847",
                created : "23, May, 2021",
                status : {
                    value : "Success",
                    color : "green"
                },
                progress : 23
            },
            {
                profile : "Herman Beck",
                picture : "/static/images/faces/face1.jpg",
                vat_no : "23847",
                created : "23, May, 2021",
                status : {
                    value : "Warning",
                    color : "yellow"
                },
                progress : 56
            },
            {
                profile : "Herman Beck",
                picture : "/static/images/faces/face1.jpg",
                vat_no : "23847",
                created : "23, May, 2021",
                status : {
                    value : "Info",
                    color : "blue"
                },
                progress : 25
            },
            {
                profile : "Herman Beck",
                picture : "/static/images/faces/face1.jpg",
                vat_no : "23847",
                status : {
                    value : "Primary",
                    color : "purple"
                },
                progress : 76
            },
            {
                profile : "Herman Beck",
                picture : "/static/images/faces/face1.jpg",
                created : "23, May, 2021",
                status : {
                    value : "Dark",
                    color : "black"
                },
                progress : 100
            },
            {
                profile : "Herman Beck",
                picture : "/static/images/faces/face1.jpg",
                vat_no : "23847",
                created : "23, May, 2021",
                status : {
                    value : "Secondary",
                    color : "grey"
                },
                progress : 12
            }
        ],
        style : "striped"
    })
})

router.get('/chart/line', function (req, res){
    res.json({
        type : 'line',
        data : {
            labels: ["2013", "2014", "2014", "2015", "2016", "2017"],
            datasets: [{
                label: '# of Votes',
                data: [10, 19, 3, 5, 2, 3],
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
                fill: false
            }]
        }
    })
})

router.get('/chart/scatter', function (req, res){
    res.json({
        type : 'scatter',
        data : {
            datasets: [{
                label: 'First Dataset',
                data: [{
                    x: -10,
                    y: 0
                  },
                  {
                    x: 0,
                    y: 3
                  },
                  {
                    x: -25,
                    y: 5
                  },
                  {
                    x: 40,
                    y: 5
                  }
                ],
                backgroundColor: [
                  'rgba(255, 99, 132, 0.2)'
                ],
                borderColor: [
                  'rgba(255,99,132,1)'
                ],
                borderWidth: 1
              },
              {
                label: 'Second Dataset',
                data: [{
                    x: 10,
                    y: 5
                  },
                  {
                    x: 20,
                    y: -30
                  },
                  {
                    x: -25,
                    y: 15
                  },
                  {
                    x: -10,
                    y: 5
                  }
                ],
                backgroundColor: [
                  'rgba(54, 162, 235, 0.2)',
                ],
                borderColor: [
                  'rgba(54, 162, 235, 1)',
                ],
                borderWidth: 1
              }
            ]
        }
    })
})

router.get('/chart/bar', function (req, res){
    res.json({
        type : 'bar',
        data : {
            labels: ["2013", "2014", "2014", "2015", "2016", "2017"],
            datasets: [{
                label: '# of Votes',
                data: [10, 19, 3, 5, 2, 3],
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
                fill: false
            }]
        }
    })
})

router.get('/chart/pie', function (req, res){
    res.json({
        type : 'pie',
        data :  {
            datasets: [{
              data: [30, 40, 30],
              backgroundColor: [
                'rgba(255, 99, 132, 0.5)',
                'rgba(54, 162, 235, 0.5)',
                'rgba(255, 206, 86, 0.5)',
                'rgba(75, 192, 192, 0.5)',
                'rgba(153, 102, 255, 0.5)',
                'rgba(255, 159, 64, 0.5)'
              ],
              borderColor: [
                'rgba(255,99,132,1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
              ],
            }],
        
            // These labels appear in the legend and in the tooltips when hovering different arcs
            labels: [
              'Pink',
              'Blue',
              'Yellow',
            ]
        }
    })
})


module.exports = router