const Metalsmith = require('metalsmith')
const template = require('art-template')
const async = require('async')
const path = require('path')
const prompt = require('./prompt')
const options = require('../lib/option-list.js')

module.exports = function (name, src, dest, done) {
  console.log()
  const data = {};
  prompt(options.prompt, data, () => {
    Metalsmith(path.join(src, 'template'))
      .source('.')
      .destination(dest)
      .clean(false)
      .ignore(generFilters(data))
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
    if (/{{([^{}]+)}}/g.test(contents)) {
      files[file].contents = Buffer.from(template.render(contents, metalsmith.metadata()))
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
