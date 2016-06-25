# API Reference | ReactFly


## Table of Contents

 * [Initialization](#initialization)
 * [`bindAsArray(flybaseRef, bindVar, cancelCallback)`](#bindasarrayflybaseref-bindvar-cancelcallback)
 * [`bindAsObject(flybaseRef, bindVar, cancelCallback)`](#bindasobjectflybaseref-bindvar-cancelcallback)
 * [`unbind(bindVar)`](#unbindbindvar)


## Initialization

To add the ReactFly mixin to your React component, add it to your component's `mixins` list:

```js
var ExampleComponent = React.createClass({
  mixins: [ReactFlyMixin],
  ...
});
```

## bindAsArray(flybaseRef, bindVar, cancelCallback)

### Description

Creates a one-way binding from a list of nodes in your Flybase database to an array in `this.state`
of your React component. The name of the array stored in `this.state` is specified using the
`bindVar` variable.

### Arguments

| Argument | Type | Description |
|----------|------|-------------|
| `flybaseRef` | `DatabaseRef` | The database reference to which we are binding. |
| `bindVar` | String | The name of the attribute within `this.state` which will be bound to your database. |
| `cancelCallback` | Function | An optional callback that will be notified in case of errors. This callback will be passed an `Error` object indicating why the failure occurred. |

### Examples

The following code will make the data stored at the `/items` node as an array and make it available
as `this.state.items` within your component:

```js
componentWillMount: function() {
	this.bindAsArray(flybaseRef, "items");
}
```

Each record in the bound array will contain a `.key` property which specifies the key where the
record is stored. So if you have data with an `_id` of `uniquedocid-1`, then  the record for that data
will have a `.key` of `"uniquedocid-1"`.

If an individual record's value in the database is a primitive (boolean, string, or number), the
value will be stored in the `.value` property. If the individual record's value is an object, each
of the object's properties will be stored as properties of the bound record. As an example, let's
assume the `/items` node you bind to contains the following data:

```js
{
  "items": {
    "uniquedocid-1": 100,
    "uniquedocid-2": {
      "first": "Lucy",
      "last": "Furious""
    },
	"uniquedocid-3": "foo"
  }
}
```

The resulting bound array stored in `this.state.items` will be:

```js
[
  {
    ".key": "uniquedocid-1",
    ".value": 100
  },
  {
    ".key": "uniquedocid-2",
    "first": "Lucy"
    "last": "Furious"
  },
  {
    ".key": "uniquedocid-3",
    ".value": "foo"
  }
]
```


## bindAsObject(flybaseRef, bindVar, cancelCallback)

### Description

Creates a one-way binding from node in your Flybase database to an object in this.state of your
React component. The name of the object stored in `this.state` is specified using the `bindVar`
variable.

### Arguments

| Argument | Type | Description |
|----------|------|-------------|
| `flybaseRef` | `DatabaseRef` | The database reference to which we are binding. |
| `bindVar` | String | The name of the attribute within `this.state` which will be bound to your database. |
| `cancelCallback` | Function | An optional callback that will be notified in case of errors. This callback will be passed an `Error` object indicating why the failure occurred. |

### Examples

With Flybase, you can perform actual queries, so for example, the following code will perform a query to return the user with an `_id` of `uniquedocid-2` as an object and make it available as `this.state.user` within your component:

```js
componentWillMount: function() {
  var ref = flybase.where({"_id": "uniquedoc-2"}), 'items');
  this.bindAsObject(ref, "user");
}
```

The bound object will contain a `.key` property which specifies the key where the object is stored.
So in the code above where we bind to a user with the `_id` of `uniquedoc-2`, the bound object will have a `.key` of `"uniquedoc-2"`.

If the bound node's value in the database is a primitive (boolean, string, or number), the value
will be stored in the `.value` property. If the bound node's value is an object, each of the
object's properties will be stored as properties of the bound object. As an example, let's assume
the `uniquedoc-2` document you bind comes from the following data:

```js
{
  "users": {
    "uniquedoc-2": true
  }
}
```

The resulting bound object stored in `this.state.user` will be:

```js
{
  ".key": "uniquedoc-2",
  ".value": true
}
```

As another example, let's assume the `uniquedoc-2` document contains an object:

```js
{
  "users": {
    {
      "_id": "uniquedoc-2",
      "first": "lucy",
      "last": "Furious"
    }
  }
}
```

The resulting bound object stored in `this.state.user` will be:

```js
{
  ".key": "uniquedoc-2",
  "first": "Lucy",
  "last": "Furious"
}
```

As a final example, let's assume the `uniquedoc-2` document does not exist (that is, it has a value of
`null`). The resulting bound object stored in `this.state.user` will be:

```js
{
  ".key": "uniquedoc-2",
  ".value": null
}
```


## unbind(bindVar)

### Description

Unbinds the binding between your database and the inputted bind variable.

### Arguments

| Argument | Type | Description |
|----------|------|-------------|
| `bindVar` | string | The name of the attribute within `this.state` which will be unbound from your database. |

The following code will unbind `this.state.items` and set its value to `undefined`:

```js
componentWillUnmount: function() {
  this.unbind("items");
}
```
