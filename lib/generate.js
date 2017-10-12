const Metalsmith = require('metalsmith')
const minimatch = require("minimatch")
// const template = require('art-template')
const Handlebars = require('handlebars')
const async = require('async')
const path = require('path')
const exists = require('fs').existsSync
const prompt = require('./prompt')
const options = require('../lib/option-list.js')

module.exports = function (name, src, dest, done, others) {
  console.log()
  const data = {};
  prompt(options.prompt, data, () => {
    dest = dest || path.resolve(data.name || '.')
    let ignores = generFilters(data)
    if(others.save && exists(path.join(dest, './src'))) ignores.push('src')
    // Metalsmith(path.join(src, 'template'))
    Metalsmith(path.join(src))
      .source('.')
      .destination(dest)
      .clean(false)
      .ignore(ignores)
      .metadata(data)
      .use(renderTemplate)
      .build(err => {
        if (err) throw err
        done()
      })
  })
}

function renderTemplate(files, metalsmith, done) {
  async.each(Object.keys(files), function (file, next) {
    var contents = files[file].contents.toString()
    // src下的所有文件不处理
    if (/{{([^{}]+)}}/g.test(contents) && !minimatch(file, 'src/**/*')) {
      files[file].contents = Buffer.from(Handlebars.compile(contents)(metalsmith.metadata()))
      // files[file].contents = Buffer.from(template.render(contents, metalsmith.metadata()))
    }
    next()
  }, done)
}

/**
 * 过滤不使用的文件
 * 
 * @param {any} data 
 * @returns 
 */
function generFilters(data) {
  return !options.filters
    ? []
    : Object.keys(data).reduce((prev, curr) => {
      return data[curr] === true
        ? prev
        : prev.concat(options.filters[curr] || [])
    }, [])
}
