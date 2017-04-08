var os = require('os');

if (process.fiberLib) {
	return module.exports = process.fiberLib;
}
var fs = require('fs'), path = require('path');

// Seed random numbers [gh-82]
Math.random();

var modPath;
if (process.env.ELECTRON) {
    modPath = path.resolve(__dirname, 'bin', process.platform, os.arch(), 'electron', 'fibers');
}  else {
    var ver = process.version.split('.'); 
    var maj = ver[0].substr(1);
    if (maj < 5 || maj > 6) {
        throw new Error('Unsupported node.js version - ' + process.version
            + '\n Only node.js 5.x - 6.x are currently supported.'); 
    }
    modPath = path.resolve(__dirname, 'bin', process.platform, os.arch(), maj + '.x', 'fibers');
}

try {
	fs.statSync(modPath + '.node');
} catch (ex) {
	// No binary!
	throw new Error('`'+ modPath+ '.node` is missing.');
}

// Pull in fibers implementation
process.fiberLib = module.exports = require(modPath).Fiber;