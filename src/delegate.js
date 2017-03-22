const R = require('ramda');

/**
 * Defines method(s) on an object (consumer) which when invoked will delegate to another
 * object, the new method(s) will have context bound to the provider object.
 * Inspired by [Ruby Forwardable module](http://ruby-doc.org/stdlib-2.0.0/libdoc/forwardable/rdoc/Forwardable.html).
 * @example
 * // coach.report() will delegate to assistant.report()
 * delegate(assistant, 'report', coach)
 * @example
 * // coach.report() will delegate to assistant.report()
 * // coach.examine() will delegate to assistant.examine()
 * delegate(assistant, ['report', 'examine'], coach)
 * @example
 * // coach.present() will delegate to assistant.report()
 * delegate(assistant, 'report', coach, 'present')
 * @param {Object} provider - object which provides method(s) to delegate
 * @param {string|Array} methodName - method name(s) to delegate
 * @param {Object} consumer - object to define method(s) on
 * @param {String} [methodAlias] - method name to create (only works with methodName String)
 */
function delegate (provider, methodName, consumer, methodAlias) {
    if (R.is(String, methodName)) {
        delegateMethod(provider, methodName, consumer, methodAlias);
    }

    if (R.is(Array, methodName)) {
        methodName.forEach((method) => {
            delegateMethod(provider, method, consumer);
        });
    }
}

// helpers for delegate
function delegateMethod (provider, method, consumer, alias) {
    const methodName = alias || method;

    if (R.is(Function, provider[method])) {
        Object.assign(consumer, { [methodName]: provider[method].bind(provider) });
    }
}

module.exports = delegate;
