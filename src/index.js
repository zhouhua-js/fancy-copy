const majo = require('majo');
const path = require('path');
const render = require('mustache').render;
const isBinaryPath = require('is-binary-path');

function absolutePath(p) {
    if (/^\//.test(p)) {
        return p;
    }
    return path.resolve(process.cwd(), p);
}

module.exports = function (source, dest, vars, options) {
    const stream = majo();
    source = absolutePath(source);
    dest = absolutePath(dest);
    stream
        .source('**', { baseDir: source })
        .filter(file => !/\.DS_Store$/.test(file))
        .use(ctx => {
            for (const file in ctx.fileList) {
                const content = ctx.fileContents(file)
                if (!isBinaryPath(filepath)) {
                    ctx.writeContents(file, mustache.render(content, vars));
                }
            }
        })
        .dest(dest)
}
