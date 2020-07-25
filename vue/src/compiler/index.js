/* @flow */

import { parse } from './parser/index'
import { optimize } from './optimizer'
import { generate } from './codegen/index'
import { createCompilerCreator } from './create-compiler'

// `createCompilerCreator` allows creating compilers that use alternative
// parser/optimizer/codegen, e.g the SSR optimizing compiler.
// Here we just export a default compiler using the default parts.
export const createCompiler = createCompilerCreator(function baseCompile (
  template: string,
  options: CompilerOptions
): CompiledResult {
  // 生成抽象语法树ast
  const ast = parse(template.trim(), options)
  if (options.optimize !== false) {
    // 优化，Vue是数据驱动的，响应式的，但模板并不是所有的数据都是响应式的，也会有很多的数据是首次渲染后将不再变化的，那这部分数据生成的DOM也不会变化，
    // 我们可以在patch中跳过对他的比对
    optimize(ast, options)
  }
  // 生成代码
  const code = generate(ast, options)
  return {
    ast,
    render: code.render,
    staticRenderFns: code.staticRenderFns
  }
})
