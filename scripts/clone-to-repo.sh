#!/usr/bin/env node
const cp = require('child_process')
const fs = require('fs');
const path = require('path');

const APP_VERSION = JSON.parse(fs.readFileSync('package.json', { encoding: 'utf8' })).version
const TAG = `v${APP_VERSION}`

cp.execSync(`gh release create ${TAG} Launcher-windows-amd64.zip -R https://github.com/blurnos/nos-launcher`, { stdio: 'inherit' })