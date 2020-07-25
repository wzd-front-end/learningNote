/* @flow */

import { cached } from 'shared/util'
import { parseFilters } from './filter-parser'

const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g
const regexEscapeRE = /[-.*+?^${}()|[\]\/\\]/g

const buildRegex = cached(delimiters => {
  const open = delimiters[0].replace(regexEscapeRE, '\\$&')
  const close = delimiters[1].replace(regexEscapeRE, '\\$&')
  return new RegExp(open + '((?:.|\\n)+?)' + close, 'g')
})

type TextParseResult = {
  expression: string,
  tokens: Array<string | { '@binding': string }>
}

export function parseText (
  text: string,
  delimiters?: [string, string]
): TextParseResult | void {
  const tagRE = delimiters ? buildRegex(delimiters) : defaultTagRE
  if (!tagRE.test(text)) {
    return
  }
  const tokens = []
  const rawTokens = []
  let lastIndex = tagRE.lastIndex = 0
  let match, index, tokenValue
  while ((match = tagRE.exec(text))) {
    index = match.index
    // push text token
    if (index > lastIndex) {
      rawTokens.push(tokenValue = text.slice(lastIndex, index))
      // 将字符串再进行一次转化，确保其包含两层引号
      tokens.push(JSON.stringify(tokenValue))
    }
    // tag token
    // 解析filters，vue的过滤器，现在的exp已经被过滤器封装后的代码字符串
    const exp = parseFilters(match[1].trim())
    // 推入数组中，用于合并成目标表达式
    tokens.push(`_s(${exp})`)
    rawTokens.push({ '@binding': exp })
    // 更新lastIndex，index 和lastIndex的对比主要是为了对纯文本文字的添加
    lastIndex = index + match[0].length
  }
  if (lastIndex < text.length) {
    rawTokens.push(tokenValue = text.slice(lastIndex))
    tokens.push(JSON.stringify(tokenValue))
  }
  return {
    // 合并为目标表达式
    expression: tokens.join('+'),
    tokens: rawTokens
  }
}
