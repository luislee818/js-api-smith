const R = require('ramda');

/**
 * Transform an object into another new object based on rules.
 * Inspired by [Ruby API Smith library](http://www.rubydoc.info/gems/api_smith/APISmith/Smash).
 * @param {Object} transformations - the identifier name of the entity, e.g. 'accountId'
 * @example
 * // creates new property 'foo' with value of property 'bar'
 * { foo: 'bar' }
 * @example
 * // creates new property 'foo' with value of path ['bar', 'baz']
 * { foo: ['bar', 'baz'] }
 * @example
 * // creates new property 'foo' with value of path ['bar', 'baz'] using dot syntax
 * { foo: 'bar.baz' }
 * @example
 * // creates new property 'foo' with transformer function on the raw object
 * { foo: (raw) => 123 }
 * @example
 * // creates nested new property 'foo.bar.baz' with value 'quxx'
 * { 'foo.bar.baz': 'quxx' }
 * @example
 * // creates property 'foo' with value of 'bar', if 'bar' doesn't exist, default to 99
 * { foo: { from: 'bar', default: 99 } }
 * @example
 * // creates property 'foo' with value of 'bar', if 'bar' exists, invokes 'toString' on it
 * { foo: { from: 'bar', transformer: 'toString' } }
 * @example
 * // creates property 'foo' with value of 'bar', if 'bar' exists, invokes R.toUpper with it
 * { foo: { from: 'bar', transformer: R.toUpper } }
 * @example
 * // creates property 'foo' with value of 'bar', if 'bar' exists, invokes myFn with it,
 * the first param is the picked property, the second param is the raw object
 * { foo: { from: 'bar', transformer: (bar, raw) => ... } }
 * @param {Object} from - the object before transformation
 * @return {Object} transformed object
 */
function smash (transformations, from) {
    const toProps = R.keys(transformations);

    return R.reduce((to, toProp) => {
        const rule = transformations[toProp];
        const toPath = toProp.split('.');
        const toValue = transformProp(from, rule);

        Object.assign(to, R.assocPath(toPath, toValue, to));
        return to;
    }, {}, toProps);
}

// helpers for smash
function transformProp (from, rule) {
    if (R.is(String, rule) || R.is(Array, rule)) {
        return readPropertyValue(from, rule);
    } else if (R.is(Function, rule)) {
        return rule(from);
    } else if (R.is(Object, rule)) {
        let propValue = readPropertyValue(from, rule.from);

        if ((propValue === undefined || propValue === null) && rule.default !== undefined) {
            propValue = rule.default;
        }

        if (rule.transformer) {
            propValue = transformPropertyValue(rule.transformer, propValue, from);
        }

        return propValue;
    }
}

function readPropertyValue (from, propNameOrPath) {
    let reader;

    if (R.is(String, propNameOrPath)) {
        reader = stringLookupReader;
    } else if (R.is(Array, propNameOrPath)) {
        reader = pathLookupReader;
    }

    return reader && reader(from, propNameOrPath);
}

function stringLookupReader (from, props) {
    const path = props.split('.');
    return R.path(path, from);
}

function pathLookupReader (from, propPath) {
    return R.path(propPath, from);
}

function transformPropertyValue (transformer, value, from) {
    let transformation;

    if (R.is(String, transformer)) {
        transformation = stringFunctionTransformation;
    } else if (R.is(Function, transformer)) {
        transformation = functionTransformation;
    }

    return transformation && transformation(transformer, value, from);
}

function stringFunctionTransformation (fnName, value) {
    return value && value[fnName] && value[fnName]();
}

function functionTransformation (fn, value, raw) {
    return fn(value, raw);
}

module.exports = R.curry(smash);
