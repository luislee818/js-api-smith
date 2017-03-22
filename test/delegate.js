const test = require('tape');
const delegate = require('../src/delegate');

test('#delegate', (t) => {
    test('without renaming delegated method', (t2) => {
        test('delegates single method call', (assert) => {
            const provider = {
                num: 123,
                getNum: function() { return this.num; }
            };

            let consumer = {};

            delegate(provider, 'getNum', consumer);

            assert.equal(consumer.getNum(), 123);
            assert.end();
        });

        test('delegates multiple method calls', (assert) => {
            const provider = {
                getFirstName: function() { return 'Michael'; },
                getLastName: function() { return 'Smith'; }
            };

            let consumer = {
                getFullName: function() { return this.getFirstName() + ' ' + this.getLastName(); }
            };

            delegate(provider, ['getFirstName', 'getLastName'], consumer);

            assert.equal(consumer.getFullName(), 'Michael Smith');
            assert.end();
        });

        test('does nothing if delegate source does not have matching property', (assert) => {
            const provider = {};
            let consumer = {};

            delegate(provider, 'notHere', consumer);

            assert.equal(consumer.notHere, undefined);
            assert.end();
        });

        test('does nothing if delegate source has matching property which is not a function', (assert) => {
            const provider = { notHere: 123 };
            let consumer = {};

            delegate(provider, 'notHere', consumer);

            assert.equal(consumer.notHere, undefined);
            assert.end();
        });

        t2.end();
    });

    test('renaming/aliasing methods', (t2) => {
        test('aliases single method call', (assert) => {
            const provider = {
                num: 123,
                getNum: function() { return this.num; }
            };

            let consumer = {};

            delegate(provider, 'getNum', consumer, 'getNumber');

            assert.equal(consumer.getNumber(), 123);
            assert.end();
        });

        test('can alias method calls from and to itself', (assert) => {
            const provider = {
                name: 'Michael',
                getName: function() { return this.name; },
            };

            delegate(provider, 'getName', provider, 'getNombre');

            assert.equal(provider.getNombre(), 'Michael');
            assert.end();
        });

        t2.end();
    });

    t.end();
});
