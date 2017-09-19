/*
 * @Author: lmr
 * @Date: 2017-09-18 13:28:07
 * @Last Modified by: lmr
 * @Last Modified time: 2017-09-19 17:29:29
 */
const async = require('async')
const inquirer = require('inquirer')

/**
 * 遍历所有交互，逐条处理，返回结果
 */
module.exports = function (prompts, data, done) {
  async.eachSeries(Object.keys(prompts), (key, next) => prompt(data, key, prompts[key], next), done)
}

function prompt (data, name, prompt, done) {
  // if (prompt.when && !evaluate(prompt.when, data)) return done()
  inquirer.prompt([Object.assign({}, prompt, {
    name: name,
    default: typeof prompt.default === 'function' ? () => prompt.default.bind(this)(data) : prompt.default,
    validate: prompt.validate || (() => true)
  })])
  .then(args => {
    data[name] = args[name]
    done()
  })
}
exports.prompt = prompt
