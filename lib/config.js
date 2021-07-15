const path = require('path')
const config = require('../config.json')
const inquirer = require('inquirer')
let { spawn } = require('child_process')
const crossSpawn = require('cross-spawn');
const fs = require('fs-extra')

inquirer.registerPrompt('checkbox-plus', require('inquirer-search-checkbox'))

// micro config set dir main <dir> ------  micro 在dir路径上启动main项目
// micro config set root <dir> ------- micro 启动dir路径下的项目
module.exports = {
    command: 'config',
    desc: "微前端配置 - config set [dir|root] [main|micro-1|micro-2|...] <dir>\n",
    handler: async argv => {
		const [config1, op, type, key, value] = argv._ || []
		if (!op && !type && !key && !value) {
			console.log('micro config set dir [main/micro-1/micro-2] <dir>')
			return
		}

		// 返回运行文件所在的目录
		//console.log('__dirname : ' + __dirname)

		// 当前命令所在的目录
		//console.log('resolve   : ' + path.resolve('./'))

		// 当前命令所在的目录
		//console.log('cwd       : ' + process.cwd())

		// const homedir = require('os').homedir()
		const file = path.resolve(__dirname, '../config.json')
		const config = await fs.readJson(file)

		if (op === 'set') {
			if (type === 'dir') {
				const projectConfig = config.map[key]
				if (!projectConfig) {
					console.log('project is not found! please check your project name')
					return
				}
				projectConfig.dir = path.resolve(value)
				await fs.writeFile(file, JSON.stringify(config, null, 2), 'utf-8')
				console.log('your project config is updated !!')
				return
			}
			if (type === 'root') {
				if (!key) {
					console.log('please set root value!')
					return
				}
				config['root'] = path.resolve(key)
				await fs.writeFile(file, JSON.stringify(config, null, 2), 'utf-8')
				console.log('your project config is updated !!')
				return
			}
		} else {
			console.log('op',op)
		}
		
    }
}