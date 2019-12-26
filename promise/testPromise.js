let Promise = require('./promise')

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
  resolve(4)
})
console.log(a)
