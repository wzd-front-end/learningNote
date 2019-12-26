var fs = require('fs')
var stats = []
console.log(process.argv.slice(2))
console.log('地址：' + __dirname)
console.log('\033[90m' + process.cwd() + '\033[39m')


// process.argv，获取命令行指令的参数值，第一个参数为node地址，第二个为当前文件所在地址，往后的才是我们传入的参数

// 使用__dirname来获取执行文件时该文件在文件系统中所在的目录

// 获取当前工作目录，可以调用process.cwd方法

// 设置NODE_ENV的值，在window需要使用set NODE_ENV=''&& ...，在Mac 和 Linux上使用export,还有可以安装第三方插件cross-env，
// 使用cross-env NODE_ENV='' 兼容两种，注意cross-env后面不需要用&&链接

// 要让一个应用退出，可以调用process.exit并提供一个退出代码。比如发生错误的时候，要退出程序，这个时候最好是使用退出代码1

// 进程和操作系统进行通信的其中一种方式就是通过信号。Node程序是通过在process对象上以事件分发的形式来发送信号的：process.on("",function(){})

// fs模块允许你通过Stream API 来对数据进行读写操作的，与readFile 和 writeFile方法不同的是，它对内存的分配不是一次性完成的，它是以一种数据流的方式进行的

// fs.createReadStream方法允许为一个文件创建一个可读的Stream对象，而使用readFile(path, function(){})回调函数则是需要等到整个文件读取完毕，载入到RAM，可用的情况下才会触发
// 而stream.on('data'function(chunk){})每次读取可变大小的内容块，并且每次读取猴会触发回调函数，读取完毕会触发stream.on('end', function(chunk){})
// 比如使用日志记录，如果我们使用的是wirteFile，那需要重复的进行打开和关闭文件的操作是很低效的，而使用fs.WriteStream，打开文件操作只做一次，然后每个日志项都调用.write方法

// node允许监听文件或目录是否发生变化。监视意味着当文件系统中的文件（或者目录）发生变化的时候，会分发一个事件，然后触发指定的回调函数。
// 该功能在Node生态系统中被广泛使用，比如说，CSS预编辑，当文件发生变化的时候，就将其编译为css文件；fs.watchFile(path, function(){})，除了使用fs.watchFile，还可以使用fs.watch来监听整个目录






// fs.readdir(process.cwd(), function (err, files) {
//   if (!files.length) {
//     return console.log("no files to show")
//   }
//
//   console.log('select which file or directoty you want to see\n')
//
//   function option(data) {
//     var filename = files[Number(data)]
//     if (!filename) {
//       process.stdout.write('Enter your choice:')
//     } else {
//       process.stdin.pause()
//       if (stats[Number(data)].isDirectory()) {
//         fs.readdir(__dirname + '/' + filename, function (err, files) {
//           console.log('')
//           console.log('(' + files.length + ' files)')
//           files.forEach(function (file) {
//             console.log(' - ' + file)
//           })
//         })
//       } else {
//         fs.readFile(__dirname + '/' + filename, 'utf8', function (err, data) {
//           console.log('')
//           console.log(data)
//         })
//       }
//     }
//   }
//
//   function read() {
//     console.log('')
//     process.stdout.write('Enter your choice:')
//     process.stdin.resume();
//     process.stdin.setEncoding('utf8')
//     process.stdin.on('data', option)
//
//   }
//
//   function file(i) {
//     var filename = files[i];
//     fs.stat(__dirname + '/' + filename, function (err, stat) {
//         stats[i] = stat
//         if (stat.isDirectory()) {
//           console.log('这是路径 ' + i + '  ' + filename)
//         } else {
//           console.log('这是文件 ' + i + '  ' + filename)
//         }
//         i++
//         if (i == files.length) {
//           read()
//         } else {
//           file(i);
//         }
//       }
//     )
//   }
//
//   file(0)
// })
