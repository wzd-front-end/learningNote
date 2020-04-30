let Promise = require('./reviewPromise')

// let thenable = {
//   then: function(resolve, reject) {
//     resolve(42);
//   }
// };
//
// let p1 = Promise.resolve(thenable);
// p1.then(function(value) {
//   console.log(value);
// });
var a = new Promise((resolve, reject) => {
  setTimeout(function () {
    resolve(4)
  },1000)
}).then(data => {
  console.log(data)
})
