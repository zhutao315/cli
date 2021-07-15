const path = require('path')
const config = require('../config.json')
const inquirer = require('inquirer')
let { spawn } = require('child_process')
const crossSpawn = require('cross-spawn');
const npmRunPath = require('npm-run-path');
const stdio = require('./stdio');

inquirer.registerPrompt('checkbox-plus', require('inquirer-search-checkbox'))

// const dir = process.platform === "win32" ? "npm.cmd" : "npm"
const TEN_MEGABYTES = 1000 * 1000 * 10;
function handleArgs(cmd, args, opts) {
	let parsed;

	opts = Object.assign({
		extendEnv: true,
		env: {}
	}, opts);

	if (opts.extendEnv) {
		opts.env = Object.assign({}, process.env, opts.env);
	}

	if (opts.__winShell === true) {
		delete opts.__winShell;
		parsed = {
			command: cmd,
			args,
			options: opts,
			file: cmd,
			original: {
				cmd,
				args
			}
		};
	} else {
		parsed = crossSpawn._parse(cmd, args, opts);
	}

	opts = Object.assign({
		maxBuffer: TEN_MEGABYTES,
		buffer: true,
		stripEof: true,
		preferLocal: true,
		localDir: parsed.options.cwd || process.cwd(),
		encoding: 'utf8',
		reject: true,
		cleanup: true
	}, parsed.options);

	opts.stdio = stdio(opts);

	if (opts.preferLocal) {
		opts.env = npmRunPath.env(Object.assign({}, opts, {cwd: opts.localDir}));
	}

	if (opts.detached) {
		// #115
		opts.cleanup = false;
	}

	if (process.platform === 'win32' && path.basename(parsed.command) === 'cmd.exe') {
		// #116
		parsed.args.unshift('/q');
	}

	return {
		cmd: parsed.command,
		args: parsed.args,
		opts,
		parsed
	};
}

const exec = (cmd, args, opts) => {
    const parsed = handleArgs(cmd, args, opts);
    spawn(parsed.cmd, parsed.args, parsed.opts)
}

module.exports = {
    command: 'start [groupId]',
    aliases: ['st'],
    desc: "开启微前端服务",
    handler: argv => {
		const groupId = argv.groupId
        inquirer.prompt([
            {
                name: 'all',
                type: 'confirm',
                message: '是否启动全部子应用',
                default: true
            },
            {
                name: 'list',
                type: 'checkbox',
                choices: config.list.map(item => config.map[item]),
                message: '请选择需要启动的子应用',
                when: (params) => {
                    return !params.all
                },
            }
        ]).then(answers => {
            let list = config.map
            if (!answers.all) {
                list = answers.list.map(item => config.map[item])
            }

			const envs = groupId ? ['serve', groupId] : ['serve']


            Promise.all(list.map(item => {
                crossSpawn('yarn', envs, {
                    stdio: 'inherit',
                    cwd: item.dir ? path.resolve(item.dir) : path.resolve(config.root, `./${item.name}-front`),
                }, (err, stdout, stderr) => {
                    console.log(err, stdout, stderr);
                })
            }))
        })
    }
}