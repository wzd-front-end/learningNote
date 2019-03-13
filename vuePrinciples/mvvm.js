function MVVM(options) {
    this.$options = options || {};
    var data = this._data = this.$options.data;
    var me = this;

    //数据代理，实现vm.xxx指向vm._data.xxx;
    Object.keys(data).forEach(function (key) {
        me._proxyData(key)
    });
    //对计算属性进行处理，包括数据拦截以及代理
    me._initComputed();

    //新建一个发布者，劫持监听所有属性的变化，一旦发生改变通知订阅者
    observe(data, this);

    this.$compile = new Compile(options.el || document.body, this)
}

MVVM.prototype = {
    $watch: function(key, cb){
        new Watcher(this, key, cb);
    },
    _proxyData: function (key, setter, getter) {
        var me = this;

        setter = setter ||
            Object.defineProperty(me, key ,{
                configurable: false,
                enumerable: true,
                get: function () {
                    return me._data[key];
                },
                set: function (newVal) {
                    me._data[key] = newVal;
                }
            })
    },
    _initComputed: function () {
        var me = this;
        var computed = this.$options.computed;
        if(typeof computed === "object"){
            Object.keys(computed).forEach(function (key) {
                Object.defineProperty(me, key, {
                    get: typeof computed[key] === 'function' ? computed[key]:computed[key].get,
                    set: function () {}
                })
            })
        }
    }
}