const majo = require('majo');
const path = require('path');
const transform = require('mustache').render;
const isBinaryPath = require('is-binary-path');
const isRegExp = require('lodash/isRegExp');
const isFunction = require('lodash/isFunction');

function absolutePath(p) {
    if (/^\//.test(p)) {
        return p;
    }
    return path.resolve(process.cwd(), p);
}

const defaultSettings = {
    beforeTransform: null,
    afterTransform: null,
    filter: null,
    transform
};

module.exports = function (source, dest, vars, options = {}) {
    const settings = { ...defaultSettings, ...options };
    const stream = majo();
    source = absolutePath(source);
    dest = absolutePath(dest);
    let instance = stream
        .source('**', { baseDir: source })
        .filter(file => !/\.DS_Store$/.test(file));
    if (settings.beforeTransform) {
        instance = instance.use(ctx => settings.beforeTransform(ctx.files));
    }
    if (isRegExp(settings.filter)) {
        instance = instance.filter(file => settings.filter.test(file));
    }
    else if (isFunction(settings.filter)) {
        instance = instance.filter(settings.filter);
    }
    instance = instance.use(ctx => {
        ctx.fileList.forEach(file => {
            const content = ctx.fileContents(file);
            if (!isBinaryPath(file)) {
                ctx.writeContents(file, settings.transform(content, vars));
            }
        });
    });
    if (settings.afterTransform) {
        instance = instance.use(ctx => settings.afterTransform(ctx.files));
    }
    return instance.dest(dest);
};
