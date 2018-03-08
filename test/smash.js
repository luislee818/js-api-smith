const test = require('tape');
const smash = require('../src/smash');

const before = test;

test('#smash', (t) => {
    const TRANSFORMATIONS = {
        gold: 'stone',
        gist: ['blah', 'more', 'wait', 'here'],
        moreGist: 'blah.more.wait.there',
        hasFoo: raw => !!raw.foo,
        num: {
            from: 'num',
            transformer: 'toString'
        },
        salud: {
            from: ['info', 'name'],
            transformer: name => `Hola ${name}`
        },
        secrets: {
            from: 'secrets',
            default: []
        },
        'grandparent.parent.child': 'name'
    };

    let smasher;
    let from;
    let to;

    before('before', (assert) => {
        smasher = smash(TRANSFORMATIONS);
        assert.end();
    });

    test('returns a new object', (assert) => {
        from = {};
        to = smasher(from);

        assert.notEqual(to, from);
        assert.end();
    });

    test('transform property base on property name mapping', (assert) => {
        from = {
            stone: '1kg'
        };

        to = smasher(from);

        assert.equal(to.gold, from.stone);
        assert.end();
    });

    test('transform property base on property path mapping in array of strings', (assert) => {
        from = {
            blah: {
                more: {
                    wait: {
                        here: 'kidding'
                    }
                }
            }
        };

        to = smasher(from);

        assert.equal(to.gist, 'kidding');
        assert.end();
    });

    test('transform property base on property path mapping in dot properties', (assert) => {
        from = {
            blah: {
                more: {
                    wait: {
                        there: 'kidding'
                    }
                }
            }
        };

        to = smasher(from);

        assert.equal(to.moreGist, 'kidding');
        assert.end();
    });

    test('transform property based on function transformer', (assert) => {
        from = { foo: 123 };

        to = smasher(from);

        assert.true(to.hasFoo);
        assert.end();
    });

    test('constructs nested properties', (assert) => {
        from = { name: 'guapo' };

        to = smasher(from);

        assert.equal(to.grandparent.parent.child, from.name);
        assert.end();
    });

    test('transform property based on string transformer', (assert) => {
        from = {
            num: 123
        };

        to = smasher(from);

        assert.equal(to.num, '123');
        assert.end();
    });

    test('transform property based on function transformer', (assert) => {
        from = {
            info: {
                name: 'guapo'
            }
        };

        to = smasher(from);

        assert.equal(to.salud, 'Hola guapo');
        assert.end();
    });

    test('uses default value when property cannot be found', (assert) => {
        from = {};

        to = smasher(from);

        assert.deepEqual(to.secrets, []);
        assert.end();
    });

    test('uses default value when property is null', (assert) => {
        from = { secrets: null };

        to = smasher(from);

        assert.deepEqual(to.secrets, []);
        assert.end();
    });

    t.end();
});
