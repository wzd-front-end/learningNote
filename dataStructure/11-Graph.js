function Graph(v) {
  this.vertices = v
  this.vertexList = []
  // 节点数
  this.edges = 0
  // 存储路径，用于广度优先搜索查找最短路径
  this.edgeTo = []
  // 图的邻接表
  this.adj = []
  // 初始化邻接表，为空数组，无任何赋值
  for (var i = 0; i < this.vertices; ++i) {
    this.adj[i] = []
  }
  this.addEdge = addEdge
  this.showGraph = showGraph
  // 用于标记节点是否已被遍历过
  this.marked = []
  // 初始化节点标记，默认没被遍历过
  for (var i = 0; i < this.vertices; i++) {
    this.marked[i] = false
  }

  this.dfs = dfs
  this.bfs = bfs
  this.pathTo = pathTo
  this.hashPathTo = hashPathTo
  this.topSortHelper = topSortHelper
  this.topSort = topSort

  // 注意此处是无向图，增加一个边，实际上会对邻接表中的两个值进行操作
  function addEdge(v, w) {
    this.adj[v].push(w)
    this.adj[w].push(v)
    this.edges++
  }
  // 打印邻接表中的依赖关系
  function showGraph() {
    var visited = [];
    for (var i = 0; i < this.vertices; ++i) {
      console.log(this.vertexList[i] + " -> ");
      visited.push(this.vertexList[i]);
      for (var j = 0; j < this.vertices; ++j) {
        if (this.adj[i][j] != undefined) {
          if (visited.indexOf(this.vertexList[this.adj[i][j]]) < 0) {
            console.log(this.vertexList[this.adj[i][j]] + '(邻接表)');
          }
        }
      }
      visited.pop();
    }
  }

  // 深度优先搜索
  function dfs(v) {
    this.marked[v] = true
    if (this.adj[v] != undefined) {
      console.log("Visited vertex:" + v)
    }
    this.adj[v].forEach(function (w) {
      if (!this.marked[w]) {
        this.dfs(w)
      }
    }.bind(this))
  }

  // 广度优先搜索
  function bfs(s) {
    var queue = []
    this.marked[s] = true
    queue.push(s)
    while (queue.length > 0) {
      var v = queue.shift()
      if (typeof (v) != 'string') {
        console.log("Visited vertex:" + v)
      }

      this.adj[v].forEach(function (w) {
        if (!this.marked[w]) {
          this.edgeTo[w] = v
          this.marked[w] = true
          queue.push(w)
        }
      }.bind(this))
    }
  }

  // 搜索最短路径算法
  function pathTo(v) {
    var source = 0
    this.bfs(0)
    if (!this.hashPathTo(v)) {
      return undefined
    }
    var path = []
    for (var i = v; i != source; i = this.edgeTo[i]) {
      path.push(i)
    }
    path.push(source)
    return path
  }

  function hashPathTo(v) {
    return this.marked[v]
  }
  // 拓扑排序实际上是应用了深度优先搜索
  function topSort() {
    var stack = []
    var visited = []
    for (var i = 0; i < this.vertices; i++) {
      visited[i] = false
    }

    for (var i = 0; i < this.vertices; i++) {
      if (visited[i] === false) {
        this.topSortHelper(i, visited, stack)
      }
    }
    for (var i = 0; i < stack.length; i++) {
      if (stack[i] != undefined && stack[i] != false) {
        console.log(this.vertexList[stack[i]]);
      }
    }
  }

  function topSortHelper(v, visited, stack) {
    visited[v] = true
    if (this.adj[v]) {
      this.adj[v].forEach(function (w) {
        if (visited[w] === false) {
          this.topSortHelper(visited[w], visited, stack)
        }
      }.bind(this))
    }
    stack.push(v)
  }

}

g = new Graph(5);
g.addEdge(0,1);
g.addEdge(0,2);
g.addEdge(1,3);
g.addEdge(2,4);
// g.showGraph();
console.log(g.pathTo(4))
