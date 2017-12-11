const Metalsmith = require('metalsmith');
const minimatch = require('minimatch');
// const template = require('art-template')
const Handlebars = require('handlebars');
const async = require('async');
const path = require('path');
const rf = require('fs');
const exists = rf.existsSync;
const prompt = require('./prompt');
const generPackageJson = require('./generPackageJson');
const options = require('../lib/option-list.js');

module.exports = function(name, src, dest, done, others) {
  console.log();
  const data = {};
  others.save
    ? buildProject(data, name, src, dest, done, others)
    : prompt(options.prompt, data, () => {
        buildProject(data, name, src, dest, done, others);
      });
};

function buildProject(data, name, src, dest, done, others) {
  dest = dest || path.resolve('.');
  // 使用filter里的规则忽略文件
  let ignores = generFilters(data);
  // 如果是目录已存在且不覆盖，则跳过src目录
  if (others.save) {
    exists(path.join(dest, './src')) && ignores.push('src');
    ignores.push('/index.js', '/README.md');
  }
  // Metalsmith(path.join(src, 'template'))
  Metalsmith(path.join(src))
    .source('.')
    .destination(dest)
    .clean(false)
    .ignore(ignores)
    .metadata(data)
    .use(renderTemplate(others))
    .build(err => {
      if (err) throw err;
      done();
    });
}
/**
 * 使用模板引擎格式化文件
 * @param {*} others
 */
function renderTemplate(others) {
  return function(files, metalsmith, done) {
    async.each(
      Object.keys(files),
      function(file, next) {
        var contents = files[file].contents.toString();
        let dest = path.join(metalsmith._destination, 'package.json');
        // 更新不覆盖时合并package.json
        if (others.save && file === 'package.json' && exists(dest)) {
          contents = generPackageJson(contents, metalsmith.metadata(), dest);
          files[file].contents = Buffer.from(contents);
        }
        // src下的所有文件不处理
        if (/{{([^{}]+)}}/g.test(contents) && !minimatch(file, 'src/**/*')) {
          files[file].contents = Buffer.from(Handlebars.compile(contents)(metalsmith.metadata()));
          // files[file].contents = Buffer.from(template.render(contents, metalsmith.metadata()))
        }

        next();
      },
      done,
    );
  };
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
        return data[curr] === true ? prev : prev.concat(options.filters[curr] || []);
      }, []);
}
