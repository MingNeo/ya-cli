module.exports = {
  prompt: {
    name: {
      type: 'input',
      message: '输入项目名称',
      validate: value => !!value.length || '项目名称不能为空!'
    },
    author: {
      type: 'input',
      message: '输入作者',
      validate: value => !!value.length || '作者不能为空!'
    },
    lint: {
      type: 'confirm',
      message: '是否使用es-lint?'
    },
    router: {
      type: 'confirm',
      message: '是否使用vue-router?'
    },
    vuex: {
      type: 'confirm',
      message: '是否使用Vuex?'
    },
    flow: {
      type: 'confirm',
      message: '是否使用flow?'
    }
  },
  filters: {
    'router': ['src/router/**/*'],
    'vuex': ['src/store/**/*']
  }
}
