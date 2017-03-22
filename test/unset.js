const test = require('tape');
const R = require('ramda');
const { unset, unsetEmptyProperties } = require('../src/unset');

test('#unset', (t) => {
    test('unsets properties matching predicate', (assert) => {
        const obj = {
            foo: 123,
            bar: true,
            baz: 'hej'
        };

        const expected = {
            bar: true,
            baz: 'hej'
        };

        unset(x => x === 123)(obj);

        assert.deepEqual(obj, expected);
        assert.end();
    });

    test('unsets properties recursively', (assert) => {
        const obj = {
            foo: 123,
            bar: true,
            baz: 'hej',
            quxx: {
                deep: 123,
                more: {
                    deeper: 123
                }
            }
        };

        const expected = {
            bar: true,
            baz: 'hej',
            quxx: {
                more: {
                }
            }
        };

        unset(x => x === 123)(obj);

        assert.deepEqual(obj, expected);
        assert.end();
    });

    test('checks properties against predicate after unsetting children', (assert) => {
        const obj = {
            foo: undefined,
            bar: {},
            quxx: {
                deep: undefined,
                more: {
                    deeper: undefined
                }
            }
        };

        const expected = {};

        unset(x => x === undefined || R.isEmpty(R.keys(x)))(obj);

        assert.deepEqual(obj, expected);
        assert.end();
    });

    t.end();
});

test('#unsetEmptyProperties', (t) => {
    test('unsets empty properties recursively', (assert) => {
        const obj = {
            foo: null,
            bar: {},
            quxx: {
                deep: undefined,
                more: {
                    deeper: []
                }
            },
            another: {}
        };

        const expected = {};

        unsetEmptyProperties(obj);

        assert.deepEqual(obj, expected);
        assert.end();
    });

    t.end();
});
