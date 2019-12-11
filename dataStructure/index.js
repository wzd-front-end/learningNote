var fs = require('fs');
var Queue = require('./5-Queue').Queue;

function Dancer(name, sex) {
    this.name = name;
    this.sex = sex;
}

function getDancers(males, females) {
    return new Promise(function (resolve, reject) {
        fs.readFile('queueData.txt', function (err, data) {
            if (err) {
                return console.log(err);
            }
            var names = data.toString().split("\r\n");
            names.map(function (name) {
                return name.trim();
            })

            names.forEach(function (name) {
                var dancer = name.split(" ");
                var sex = dancer[0];
                var name = dancer[1];

                if(sex == "F"){
                    females.enqueue(new Dancer(name, sex));
                }else {
                    males.enqueue(new Dancer(name, sex));
                }
            })
            resolve();

        })
    });
}

function dance(males, females){
    var person = '';
    while (!males.empty() && !females.empty()){
        console.log("舞蹈小队"+(++n)+"成员:");
        person = males.dequeue();
        console.log(person.name);
        person = females.dequeue();
        console.log(person.name)
    }
}

var maleDances = new Queue();
var femaleDances = new Queue();
var n = 0;

async function start(){
    await getDancers(maleDances, femaleDances);
    await dance(maleDances, femaleDances);
    if(!femaleDances.empty()){
        console.log("正在等待的女性舞伴名称："+femaleDances.front().name)
    }
    if(!maleDances.empty()){
        console.log("正在等待的男性舞伴名称："+maleDances.front().name)
    }
}
start();
