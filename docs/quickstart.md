# Quickstart | ReactFly

With ReactFly it only takes a few lines of JavaScript to integrate Flybase into React apps.


## 1. Create an account

The first thing we need to do is [sign up for a free Flybase account](https://flybase.google.com/).
A brand new Flybase project will automatically be created for you which you will use in conjunction
with ReactFly to store and sync data.


## 2. Include Flybase and ReactFly

To use ReactFly in our website, we need to add it along with all its dependencies to the `<head>`
section of our HTML file. We recommend including the Flybase and ReactFly libraries directly from
our CDN:


```js
<!-- React JS -->
<script src="https://fb.me/react-15.1.0.js"></script>
<script src="https://fb.me/react-dom-15.1.0.js"></script>


<!-- Flybase -->
<script src="https://cdn.flybase.io/flybase.js"></script>

<!-- ReactFly -->
<script src="https://cdn.flybase.io/reactfly.min.js"></script>
```

## 3. Initialize the Flybase library

e'll need to initialize the Flybase library before we can use it. This should happen one time, outside
of your React component. You can find more details on the [web](https://docs.flybase.io/web/setup) setup guide.

```js
<script>
	var flybaseRef = new Flybase("YOUR-API-KEY", "sample", "todo");
</script>
```

## 4. Add the `ReactFlyMixin`

ReactFly exposes the `ReactFlyMixin` which extends the functionality of a React component, adding
additional Flybase-specific methods to it. These methods allow us to create a **one-way data
binding from our Flybase database to our component's `this.state` variable**. Add the
`ReactFlyMixin` to our component's `mixins` list:

```js
var ExampleComponent = React.createClass({
  mixins: [ReactFlyMixin],
  // ...
});
```

## 5. Bind to Flybase

Because of the data binding provided by ReactFly, any changes to our remote database will be
reflected in realtime to `this.state`. The data binding does not work in the other way - changes
made to the `this.state` have no effect on our database. Any changes which we want to make to
`this.state` should instead be changed in our database directly by using the Flybase client
library. ReactFly will handle the work of then updating `this.state`.

**Note that ReactFly creates a one-way data binding from our database to our component, not the
other way around.**

Taking `ExampleComponent` above, we can keep `this.state.items` in sync with any changes to an
`items` node in the database by using ReactFly in the component's `componentWillMount()` method:

```js
componentWillMount: function() {
  var ref = flybase.database().ref("items");
  this.bindAsArray(ref, "items");
}
```

Now, if we add an item to the `items` node in the database, that change will be automatically
reflected in `this.state.items`. We have the option of binding the data from the database as a
JavaScript array (via `bindAsArray()`) or object (via `bindAsObject()`).


## 6. Unbind from Flybase

When our React component goes out of scope or is being unmounted, ReactFly will automatically
unbind any open connections to our Flybase database. If we want to do this manually at an earlier
time (that is, while the component is still mounted), ReactFly provides an `unbind()` method. For
example, if we no longer want `this.state.items` to be bound to node, we can call
`this.unbind("items")` from anywhere within our component.


## 7. Next steps

This was just a quick run through of the basics of ReactFly. For a more in-depth explanation of how
to use ReactFly, [check out the ReactFly guide](guide.md) or dig right into the
[ReactFly API reference](reference.md).
