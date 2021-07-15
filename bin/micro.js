#! /usr/bin/env node

const path = require('path')
const yargs = require("yargs")

const libPath = path.join(__dirname, "../lib");

yargs
  .commandDir(libPath)
  .option("version", {
    alias: "v",
    describe: "显示版本号"
  })
  .option("help", {
    alias: "h",
    describe: "显示帮助信息"
  })


  let action = yargs.argv;
  if (!action._.length) {
    yargs.showHelp();
  }