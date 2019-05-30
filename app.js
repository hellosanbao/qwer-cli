const inquirer = require('inquirer');
const fs = require('fs');

const config = require('./config');

class XzqCli {
  constructor() {
    this.__init();
  }
  async __init() {
    const argv = await this.__getArgv();
    this.__buildApi(argv.api);
    // this.__insertApiInfo(argv);
  }
  __getArgv() {
    return inquirer
      .prompt([
        {
          type: "input",
          name: "api",
          message: "请输入接口名:",
          validate(input) {
            const done = this.async();
            let groups = fs.readdirSync(config.controllerPath);
            let group = input.split('.')[0];
            const file = input.split('.')[1] + '.js';
            let files = [];
            if (groups.includes(group)) {
              files = fs.readdirSync(`${config.controllerPath}/${group}`);
            }

            if (!input) {
              done('接口名不能为空');
              return;
            } else if (!input.split('.')[1]) {
              done('接口名不合法，合法接口示例：product.getProductDetail');
              return;
            } else if (files.includes(file)) {
              done('该接口已存在，请替换接口名');
            }
            done(null, true);
          }
        },
        // {
        //   type: "list",
        //   name: "safe",
        //   message: '请选择安全等级',
        //   choices: ['Anonym', 'User']
        // }
      ]);
  }
  __insertApiInfo(argv) {
    const apiInfo = JSON.parse(fs.readFileSync(`${config.root}/static/apiInfo.json`, 'utf-8'));
    apiInfo[`node_${argv.api}`] = argv.safe;
    fs.writeFileSync(`${config.root}/static/apiInfo.json`, JSON.stringify(apiInfo, null, "\t"));
  }
  __buildApi(api) {
    let data = { api };
    const template = fs.readFileSync(__dirname + '/temp.js', 'utf-8');
    const buildTemplate = this.__render(template, data);
    let controllerPath = config.controllerPath;
    let group = api.split('.')[0];
    let file = api.split('.')[1] + '.js';
    let groups = fs.readdirSync(controllerPath);
    if (!groups.includes(group)) {
      fs.mkdirSync(`${controllerPath}/${group}`);
    }
    fs.writeFileSync(`${controllerPath}/${group}/${file}`, buildTemplate);
    console.error('接口：' + api + '创建成功');

  }
  __render(template, obj) {
    let reg = /{{2}\w+}{2}/ig;
    let mt = template.match(reg);
    mt.forEach((item) => {
      let key = item.replace(/({|})/ig, "");
      template = template.replace(item, `"${obj[key]}"`);
    });
    return template;
  }
}

new XzqCli();

