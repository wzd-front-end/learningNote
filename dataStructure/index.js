var fs = require('fs');
var queue = require('./queue').Queue;

function Dancer(name, sex) {
    this.name = name;
    this.sex = sex;
}

function getDancers(males, females) {
    fs.readFile('queueData.txt', function (err, data) {
        if (err) {
            return console.log(err);
        }
        var names = data.toString().split("\n");
        names.map(function (name) {
            return name.trim();
        })
        console.log(names)
        // names.forEach(function (name) {
        //     var dancer = name.split(" ");
        // })

    })
}


getDancers();