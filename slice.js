const jimp = require('jimp');
const fs = require('fs');
const path = require('path');

function defaultMapper(x, y) {
    return x.toString();
}

function slice(input, outputDir, width, height, mapper = defaultMapper) {
    return new Promise((resolve, reject) => {
        if (!fs.existsSync(input)) reject('Invalid input');
        if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);

        jimp.read(input).then(image => {
            const nTilesX = Math.floor(image.bitmap.width/width);
            const nTilesY = Math.floor(image.bitmap.height/height);

            let toWrite = 0, written = 0;

            function onWritten() {
                written++;

                if (toWrite === written) {
                    resolve();
                }
            }

            for (let x = 0; x < nTilesX; x++) {
                for (let y = 0; y < nTilesY; y++) {
                    let clone = image.clone(); toWrite++;

                    if (nTilesX + nTilesY > 2) {
                        clone.crop(x * width, y*height, width, height);
                    }

                    clone.write(path.resolve(outputDir, mapper(x, y) + path.extname(input)), onWritten);
                }
            }
        }).catch(reject);
    })
}

module.exports = slice;