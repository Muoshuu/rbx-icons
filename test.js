const path = require('path');
const rbxIco = require('./index.js');

rbxIco.generate(path.join(__dirname, 'icons')).then(pathIndex => {
    console.log(pathIndex['Part']);
})