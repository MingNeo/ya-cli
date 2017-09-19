var request = require('request')
var chalk = require('chalk')
var packageConfig = require('../package.json')
var ora = require('ora')

module.exports = function (done) {
  var spinner = ora(chalk.gray('正在检查版本...')).start()
  request(
    {
      url: 'https://registry.npmjs.org/ya-cli',
      timeout: 1000
    },
    function (err, res, body) {
      spinner.stop()
      if (!err && res.statusCode === 200) {
        var latestVersion = JSON.parse(body)['dist-tags'].latest
        var localVersion = packageConfig.version
        if (localVersion !== latestVersion) {
          console.log()
          console.log(chalk.yellow('  ya-cli新版本可用.'))
          console.log()
          console.log(chalk.green('  最新版本: ' + latestVersion))
          console.log(chalk.red('  本地版本: ' + localVersion))
          console.log()
        }
      }
      done()
    }
  )
}
