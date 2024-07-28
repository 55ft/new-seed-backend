const fs = require('fs');

const express = require('express');
const router = express.Router();
const functions = require('../functions');
const hostconfig = require('../hostconfig');

for(var item in functions) global[item] = functions[item];

for(var src of fs.readdirSync('./routes', { withFileTypes: true }).filter(f => !(fs.statSync('./routes/' + (f.name || f)).isDirectory())).map(dirent => dirent.name || dirent)) {
	if(src.toLowerCase() == 'router.js') continue;
    eval(fs.readFileSync('./routes/' + src).toString());
}

module.exports = router;
