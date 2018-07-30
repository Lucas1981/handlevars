/* jshint esversion: 6 */

const Parser = require('./Parser');
const fs = require('fs');

let content = String(fs.readFileSync('./src/index.html'), 'utf-8');
let output = Parser.renderAllTags(content);
let newFile = fs.writeFileSync('./dest/index.html', output, 'utf-8');
