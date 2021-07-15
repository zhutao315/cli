const path = require('path')
const config = require('../config.json')
const inquirer = require('inquirer')
let { spawn } = require('child_process')
const crossSpawn = require('cross-spawn');
const npmRunPath = require('npm-run-path');
const stdio = require('./stdio');

inquirer.registerPrompt('checkbox-plus', require('inquirer-search-checkbox'))

module.exports = {
    command: 'serve [groupId]',
    desc: "以当前目录为项目地址开启微前端服务\n",
    handler: argv => {
		const groupId = argv.groupId
        const envs = groupId ? ['serve', groupId] : ['serve']
		const main = config.map['main']
		const list = [main, {dir: '.'}]

		Promise.all(list.map(item => {
			crossSpawn('yarn', envs, {
				stdio: 'inherit',
				cwd: path.resolve(item.dir) || path.resolve(config.root, `./${item.name}-front`),
			}, (err, stdout, stderr) => {
				console.log(err, stdout, stderr);
			})
		}))
    }
}