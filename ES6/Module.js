/**
 * export命令用于规定模块得对外接口
 *
 * 写法一：
 * export var a = 1;
 * export function multiply(x, y){
 *   return x + y;
 * }
 * 写法二：
 * var a = 1;
 * function multiply(x, y){
 *   return x + y
 * }
 * export {a, multiply}
 * 写法三：
 * var a = 1;
 * export { v1 as a }
 * 注：export语句输出的接口，与其对应的值是动态绑定关系的，即通过接口可以取到模块内部实时的值
 * 注：export命令可以出现在模块的任何位置，只要处于模块顶层就可以
 *
 * import用于加载使用export定义对外接口的模块
 *
 * 写法一：
 * import { test } from './test'
 * 注：通过import命令输入的变量，应该仅为只读，尝试修改会报错，但如果输出的变量是对象，是可以修改对象属性，但这么做很难查找
 *
 * 写法二：
 * import { last as sure} from './test'
 * 注：import命令具有提升效果，会提升到整个模块的头部，本质是因为，import是在编译阶段执行的，在代码运行之前，所以不能使用表达式或者其他运行时才能使用的语法
 *
 * 写法三：
 * import 'lodash'
 * 注：上面的代码仅仅执行所加载的模块，但不输入任何值
 * 注：如果重复执行同一个import，实际只会执行一次，而不会执行多次
 *
 * 模块的整体加载
 * import * as obj from './circle'
 * 除了指定加载某个输出值，还可以使用整体加载，即用星号（*）指定一个对象，所有输出值都加载在这个对象上面
 *
 * export default命令
 * export default命令只能使用一次，export default 就是输出一个叫做default的变量和方法，然后系统允许你为它取任意名字，所以它后面不能跟变量声明语句
 *
 * export 与 import 的复合写法
 * 例：export { foo, bar } from 'my_module';
 *
 * 注：写成一行后，foo与bar 实际上并没有被导入当前模块，只是相当于对外转发了这两个接口，导致当前模块不能直接使用foo和bar
 *
 * import()函数实现动态加载模块，返回一个Promise对象
 * 注：import()函数与所加载的模块之间没有静态连接关系，这个点与import不同，import()类似与Node的require方法，区别在于前者是异步加载，后者是同步加载
 *
 * 适用场景：
 * 一、按需加载
 *
 * 二、条件加载
 *
 * 三、动态的模块路径
 *
 * 注：import()加载模块以后，这个模块会作为一个对象，当作then方法的参数，因此可以用解构赋值的语法，获取输出接口
 */



/**
 * CommonJS与ES6的模块加载有什么区别
 * - CommonJS 模块输出的是一个值的拷贝，ES6模块输出的一个值的引用
 * - CommonJS 模块是运行时加载，ES6是编译时输出接口
 * - CommonJS 加载的是一个对象，该对象只有在脚本运行完才生成，而ES6模块不是对象，它的对外接口只是一种静态定义，在代码静态解析阶段就会生成
 *
 *
 * */






























