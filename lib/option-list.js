module.exports = {
  type: {
    type: 'list',
    message: '选择项目类型',
    choices: ['PC', 'Mobile']
  },
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
  router: {
    type: 'confirm',
    message: '是否使用vue-router?'
  },
  vuex: {
    type: 'confirm',
    message: '是否使用Vuex?'
  }
}
