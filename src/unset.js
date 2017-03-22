const R = require('ramda');

/**
 * Recursivelly unset properties of an object if the property matches a predicate,
 * this function mutates the object passed in.
 * @param {Function} predicate - predicate function on property
 * @param {Object} obj - obj to mutate
 * @return {Object} mutated object
 * @example
 * // unsets properties based on predicate against property value
 * apiSmith.unset(x => x === 123, {
 *     foo: 123,
 *     bar: true,
 *     baz: 'hej',
 *     quxx: {
 *         deep: 123,
 *         more: {
 *             deeper: 123
 *         }
 *     }
 * });
 * => {
 *     bar: true,
 *     baz: 'hej',
 *     quxx: {
 *       more: {
 *       }
 *     }
 * }
 */
function unset (predicate, obj) {
    const recursivelyUnset = (path) => {
        const local = path.length === 0 ? obj : R.path(path, obj);

        // if it's object, recursively unset its properties
        if (R.is(Object, local)) {
            Object.keys(local)
                .forEach((prop) => {
                    const newPath = R.concat(path, [prop]);
                    recursivelyUnset(newPath);
                });
        }

        // do the real work, unset property
        if (predicate(local)) {
            baseUnset(obj, path);
        }
    };

    recursivelyUnset([]);

    return obj;
}

// helpers for unset
function baseUnset (obj, path) {
    if (R.isEmpty(path)) {
        return;
    }

    let parent;

    if (path.length === 1) {
        parent = obj;
    } else {
        const parentPath = path.slice(0, path.length - 1);
        parent = R.path(parentPath, obj);
    }

    const key = path[path.length - 1];

    delete parent[key];
}

function isEmpty (val) {
    return R.isNil(val) || (R.is(Object, val) && R.isEmpty(R.keys(val)));
}

const curriedUnset = R.curry(unset);

/**
 * Recursivelly unset properties of an object if the property is either:
 * _undefined_, _null_, _0_, empty array or empty object,
 * this function mutates the object passed in.
 * @kind function
 * @function unsetEmptyProperties
 * @param {Object} obj - obj to mutate
 * @return {Object} mutated object
 * @example
 * apiSmith.unsetEmptyProperties(x => x === 123, {
 *     foo: null,
 *     bar: {},
 *     quxx: {
 *         deep: undefined,
 *         more: {
 *             deeper: []
 *         }
 *     },
 *     another: {}
 * });
=> { }
 */
const unsetEmptyProperties = curriedUnset(isEmpty);

module.exports = {
    unset: curriedUnset,
    unsetEmptyProperties
};
