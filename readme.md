# API Smith in JavaScript

A lightweight library for object transformations in JavaScript. Inspired by the [API Smith Ruby library](https://github.com/Sutto/api_smith).

## Synopsis

```javascript
const apiSmith = require('js-api-smith');

// apiSmith.smash transforms object
const transformation = {
    foo: 'foo',
    baz: {
      from: ['bar', 'quxx'],
      transform: x => x + 1
    }
};
const from = {
    foo: 123,
    bar: {
      quxx: 99
    }
};
apiSmith.smash(transformation, from)
=> { foo: 123, baz: 100 }

// apiSmith.unset and apiSmith.unsetEmptyProperties unsets properties in object by mutation
let before = {
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
apiSmith.unset(before);
=> { }

// apiSmith.delegate defines delegation methods on target objects
const provider = {
    num: 123,
    getNum: function() { return this.num; }
};
let consumer = {};
delegate(provider, 'getNum', consumer);
consumer.getNum();
=> 123
```

## Install

```bash
$ npm install js-api-smith
```

### See also
* [API documentation](doc.md)
