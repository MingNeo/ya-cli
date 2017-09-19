const Metalsmith = require('metalsmith')
const template = require('art-template')
const async = require('async')
const path = require('path')
const prompt = require('./prompt')
const promptList = require('../lib/option-list.js')

module.exports = function generate (name, src, dest, done) {
  console.log()
  Metalsmith(path.join(src, 'template'))
    .source('.')
    .destination(dest)
    .clean(false)
    .use((files, metalsmith, done) => prompt(promptList, metalsmith.metadata(), done))
    .use(renderTemplate)
    .build(err => {
      if (err) throw err
      done()
    })
}

function renderTemplate (files, metalsmith, done) {
  async.each(Object.keys(files), function (file, next) {
    var contents = files[file].contents.toString()
    if (/{{([^{}]+)}}/g.test(contents)) {
      files[file].contents = Buffer.from(template.render(contents, metalsmith.metadata()))
    }
    next()
  }, done)
}
