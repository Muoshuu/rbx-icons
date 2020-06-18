const fs = require('fs');
const path = require('path');
const request = require('request-promise');
const https = require('https');

const slice = require('./slice');

function download(url, to) {
    return new Promise((resolve, reject) => {
        let file = fs.createWriteStream(to);

        https.get(url, res => {
            res.pipe(file);

            file.on('finish', () => {
                file.close(); resolve();
            })
        }).on('error', reject);
    })
}

function generate(outputDir) {
    return new Promise((resolve, reject) => {
        if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);

        let sheetPath = path.join(outputDir, 'sheet.png');

        Promise.all([
            request('https://raw.githubusercontent.com/RobloxAPI/build-archive/master/data/production/latest.json'),
            request('https://reflection.rbx-api.xyz/icons')

        ]).then(bodies => {
            let rbxVersion = JSON.parse(bodies[0]).GUID;
            let iconIndex = JSON.parse(bodies[1]);

            download(`https://raw.githubusercontent.com/RobloxAPI/build-archive/master/data/production/builds/${rbxVersion}/ClassImages.png`, sheetPath).then(() => {
                slice(sheetPath, outputDir, 16, 16).then(() => {
                    let pathIndex = {};

                    for (let className in iconIndex) {
                        pathIndex[className] = path.join(outputDir, iconIndex[className] + '.png');
                    }

                    resolve(pathIndex);
                }).catch(reject);
            }).catch(reject);
        }).catch(reject);
    })
}

module.exports = {
    generate
}