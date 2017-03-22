## Functions

<dl>
<dt><a href="#delegate">delegate(provider, methodName, consumer, [methodAlias])</a></dt>
<dd><p>Defines method(s) on an object (consumer) which when invoked will delegate to another
object, the new method(s) will have context bound to the provider object.
Inspired by <a href="http://ruby-doc.org/stdlib-2.0.0/libdoc/forwardable/rdoc/Forwardable.html">Ruby Forwardable module</a>.</p>
</dd>
<dt><a href="#smash">smash(transformations, from)</a> ⇒ <code>Object</code></dt>
<dd><p>Transform an object into another new object based on rules.
Inspired by <a href="http://www.rubydoc.info/gems/api_smith/APISmith/Smash">Ruby API Smith library</a>.</p>
</dd>
<dt><a href="#unset">unset(predicate, obj)</a> ⇒ <code>Object</code></dt>
<dd><p>Recursivelly unset properties of an object if the property matches a predicate,
this function mutates the object passed in.</p>
</dd>
<dt><a href="#unsetEmptyProperties">unsetEmptyProperties(obj)</a> ⇒ <code>Object</code></dt>
<dd><p>Recursivelly unset properties of an object if the property is either:
<em>undefined</em>, <em>null</em>, <em>0</em>, empty array or empty object,
this function mutates the object passed in.</p>
</dd>
</dl>

<a name="delegate"></a>

## delegate(provider, methodName, consumer, [methodAlias])
Defines method(s) on an object (consumer) which when invoked will delegate to another
object, the new method(s) will have context bound to the provider object.
Inspired by [Ruby Forwardable module](http://ruby-doc.org/stdlib-2.0.0/libdoc/forwardable/rdoc/Forwardable.html).

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| provider | <code>Object</code> | object which provides method(s) to delegate |
| methodName | <code>string</code> &#124; <code>Array</code> | method name(s) to delegate |
| consumer | <code>Object</code> | object to define method(s) on |
| [methodAlias] | <code>String</code> | method name to create (only works with methodName String) |

**Example**  
```js
// coach.report() will delegate to assistant.report()
delegate(assistant, 'report', coach)
```
**Example**  
```js
// coach.report() will delegate to assistant.report()
// coach.examine() will delegate to assistant.examine()
delegate(assistant, ['report', 'examine'], coach)
```
**Example**  
```js
// coach.present() will delegate to assistant.report()
delegate(assistant, 'report', coach, 'present')
```
<a name="smash"></a>

## smash(transformations, from) ⇒ <code>Object</code>
Transform an object into another new object based on rules.
Inspired by [Ruby API Smith library](http://www.rubydoc.info/gems/api_smith/APISmith/Smash).

**Kind**: global function  
**Returns**: <code>Object</code> - transformed object  

| Param | Type | Description |
| --- | --- | --- |
| transformations | <code>Object</code> | the identifier name of the entity, e.g. 'accountId' |
| from | <code>Object</code> | the object before transformation |

**Example**  
```js
// creates new property 'foo' with value of property 'bar'
{ foo: 'bar' }
```
**Example**  
```js
// creates new property 'foo' with value of path ['bar', 'baz']
{ foo: ['bar', 'baz'] }
```
**Example**  
```js
// creates new property 'foo' with value of path ['bar', 'baz'] using dot syntax
{ foo: 'bar.baz' }
```
**Example**  
```js
// creates new property 'foo' with transformer function on the raw object
{ foo: (raw) => 123 }
```
**Example**  
```js
// creates nested new property 'foo.bar.baz' with value 'quxx'
{ 'foo.bar.baz': 'quxx' }
```
**Example**  
```js
// creates property 'foo' with value of 'bar', if 'bar' doesn't exist, default to 99
{ foo: { from: 'bar', defaults: 99 } }
```
**Example**  
```js
// creates property 'foo' with value of 'bar', if 'bar' exists, invokes 'toString' on it
{ foo: { from: 'bar', transformer: 'toString' } }
```
**Example**  
```js
// creates property 'foo' with value of 'bar', if 'bar' exists, invokes R.toUpper with it
{ foo: { from: 'bar', transformer: R.toUpper } }
```
**Example**  
```js
// creates property 'foo' with value of 'bar', if 'bar' exists, invokes myFn with it,
the first param is the picked property, the second param is the raw object
{ foo: { from: 'bar', transformer: (bar, raw) => ... } }
```
<a name="unset"></a>

## unset(predicate, obj) ⇒ <code>Object</code>
Recursivelly unset properties of an object if the property matches a predicate,
this function mutates the object passed in.

**Kind**: global function  
**Returns**: <code>Object</code> - mutated object  

| Param | Type | Description |
| --- | --- | --- |
| predicate | <code>function</code> | predicate function on property |
| obj | <code>Object</code> | obj to mutate |

**Example**  
```js
// unsets properties based on predicate against property value
apiSmith.unset(x => x === 123, {
    foo: 123,
    bar: true,
    baz: 'hej',
    quxx: {
        deep: 123,
        more: {
            deeper: 123
        }
    }
});
=> {
    bar: true,
    baz: 'hej',
    quxx: {
      more: {
      }
    }
}
```
<a name="unsetEmptyProperties"></a>

## unsetEmptyProperties(obj) ⇒ <code>Object</code>
Recursivelly unset properties of an object if the property is either:
_undefined_, _null_, _0_, empty array or empty object,
this function mutates the object passed in.

**Kind**: global function  
**Returns**: <code>Object</code> - mutated object  

| Param | Type | Description |
| --- | --- | --- |
| obj | <code>Object</code> | obj to mutate |

**Example**  
```js
apiSmith.unsetEmptyProperties(x => x === 123, {
    foo: null,
    bar: {},
    quxx: {
        deep: undefined,
        more: {
            deeper: []
        }
    },
    another: {}
});
=> { }
```
