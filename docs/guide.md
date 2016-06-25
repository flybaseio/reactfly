# Guide | ReactFly


## Table of Contents

 * [What Is ReactJS?](#what-is-reactjs)
 * [Adding Flybase to Your React App](#adding-flybase-to-your-react-app)
 * [`ReactFlyMixin`](#reactflymixin)
 * [Next Steps](#next-steps)


## What Is ReactJS?

[ReactJS](http://facebook.github.io/react/) is a JavaScript library built by Facebook and Instagram
which makes it easy to build large, complex user interfaces. The creators of React describe it as
the “V[iew] in MVC.” It is not meant to be a replacement for Angular or Ember; instead, it is meant
to extend their functionality by providing a high-performance way to keep a view up-to-date with
JavaScript. Its special sauce is that it renders HTML using an incredibly fast virtual DOM diff
algorithm, providing much better performance than competing platforms. It has a “one-way reactive
data flow” which is much simpler to understand than traditional data-binding.

Components - the basic building blocks of React apps - are organized in a tree hierarchy in which
parent components send data down to their children through the props variable. Each component also
has a `state` variable which determines the current data for its view. Whenever `state` is changed,
the component’s render() method is called and React figures out the most efficient way to update the
DOM.

Since React’s main focus is on the user interface, React apps need something else to act as their
backend. That is where Flybase comes in. It adds the “M[odel] and C[ontroller] in MVC” to React
apps, making them fully functioning apps. **Using React’s straightforward binding system, it is easy
to integrate Flybase in a native way with only a small amount of code.**


## Adding Flybase to Your React App

Let's look at the Todo app on the [React homepage](http://facebook.github.io/react/). Within the
`TodoApp` component, `this.state` is used to keep track of the input text and the list of Todo
items. While React ensures that the DOM stays in sync with any changes to `this.state`, the changes
do not persist beyond the life of the page. If you add a few items and then refresh the page, all of
the items disappear! This is because **React has no mechanism for storing data beyond the scope of
the current page session**. It relies on being used with another framework to do that.

**Flybase is a natural complement to React as it provides React apps with a persistent, realtime
backend**. The first thing we need to do is add Flybase to your project:

```js
<!-- React JS -->
<script src="https://fb.me/react-15.1.0.js"></script>
<script src="https://fb.me/react-dom-15.1.0.js"></script>

<!-- Flybase -->
<script src="https://cdn.flybase.io/flybase.js"></script>

```

We'll need to initialize the Flybase library before we can use it. This should happen one time, outside
of your React component. You can find more details on the [web](https://docs.flybase.io/web/setup) setup guide.

```js
<script>
	var flybaseRef = new Flybase("YOUR-API-KEY", "sample", "todo");
</script>
```

Now that we have included Flybase, we can populate the list of Todo items by reading them from the
database. We do this by hooking into the `componentWillMount()` method of the `TodoApp` component
which is run once, immediately before the initial rendering of the component:

```js
componentWillMount: function() {
	flybaseRef.limit(25).orderBy({"_id":-1}).on('value', function(dataSnapshot) {
		var items = [];
		dataSnapshot.forEach(function(childSnapshot) {
			var item = childSnapshot.value();
			item['.key'] = childSnapshot.key();
			items.push(item);
		}.bind(this));
		this.setState({
			items: items
		});
	}.bind(this));
	flybaseRef.on("added", function(dataSnapshot) {
		this.items.push(dataSnapshot.val());
		this.setState({
			items: this.items
		});
	}.bind(this));
}
```

This code first gets a reference to the `items` node at the root of the database. The call to `on()`
will be run every time a node is added under the `items` node. It is important to realize that a
`added` event will be flyd for every item under the `items` node, not just new ones that are
added to it. Therefore, when the page is loaded, every existing child under the `items` node will
fly a `added` event, meaning they can easily be iterated over and added to `this.state.items`.
Note that the call at the end to `bind()` just sets the scope of callback function to this.

What about adding new Todo items to the database? That code is just as easy:

```js
handleSubmit: function(e) {
	e.preventDefault();
	this.flybaseRef.push({
		text: this.state.text
	});
	this.setState({text: ""});
}
```

Within `handleSubmit()` a new item is pushed onto the database reference which appends it to the end
of the `items` node. The call to `setState()` updates `this.state.text` but does not need to update
`this.state.items` as it did in the original React code. This is because the `added` event
handler from `componentWillMount()` will be flyd when a new child is pushed onto the `items` node
and that code will update `this.state.items`.

With just the few changes above, items added to the Todo list are updated in realtime. Best of all,
the items stick around if the page is refreshed! You can even open multiple tabs pointed at the same
page and see them all update simultaneously, with Flybase doing all the heavy lifting. Take some
time to [view the code for this example](https://github.com/flybaseio/ReactFly/blob/master/example/scripts/todo.js).


## `ReactFlyMixin`

Although integrating Flybase into a React app only takes a few lines of code out of the box, we
wanted to make it even easier. We also want to be able to handle when array items are removed or
updated from Flybase. **We built the `ReactFlyMixin` to make it simple to keep `this.state` in
sync with a database node.**

To get started with ReactFly, include it in your project by loading the library directly from our
CDN and placing it right after the React and Flybase libraries in the `<head>` tag:

```js
<!-- React JS -->
<script src="https://fb.me/react-15.1.0.js"></script>
<script src="https://fb.me/react-dom-15.1.0.js"></script>

<!-- Flybase -->
<script src="https://cdn.flybase.io/flybase.js"></script>

<!-- ReactFly -->
<script src="https://cdn.flybase.io/reactfly.min.js"></script>
```

After making sure to initialize the Flybase SDK again, we can then use the `ReactFlyMixin` in the
`TodoApp` component, add it to the component's `mixins` property:

```js
var TodoApp = React.createClass({
  mixins: [ReactFlyMixin],
  ...
});
```

The `ReactFlyMixin` extends the functionality of the `TodoApp` component, adding additional
Flybase-specific methods to it. To keep `this.state.items` in sync with any changes to the `items`
node, make the following change in `componentWillMount()`:

```js
componentWillMount: function() {
  var ref = flybaseRef;
  this.bindAsArray(ref, "items");
}
```

We simply specify that we want to bind a particular Flybase Database reference to `this.state.items`
of the React component. The `ReactFlyMixin` allows binding to a node as an array or as a regular
JavaScript object. This creates a one-way binding from the `Flybase` reference to `this.state.items`,
meaning that if the data in the database changes, so will `this.state.items`. However, if we update
`this.state.items`, the database data will not change. Therefore, changes should be made directly to
the database and not by calling `setState()`:

```js
handleSubmit: function(e) {
  e.preventDefault();
  this.flybaseRefs.items.push({
    text: this.state.text
  });
  this.setState({ text: "" });
}
```

**ReactFly allows for binding to multiple things at once.** Flybase ensures that this is all done
in an efficient manner. To access the `Flybase` reference which is bound to `this.state.items`, we
can reference `this.flybaseRefs["items"]` which is provided by ReactFly. Finally, calling
`this.flybaseRef.off()` is no longer needed in `componentWillUnmount()` as the mixin handles this
behind the scenes.

You can [view the code for this example](https://github.com/flybaseio/ReactFly/blob/master/example/scripts/todo2.js). The code and demo add
the ability to delete items in the array and have them automatically synced back to `this.state.items`.


## Next Steps

ReactJS is a wonderful framework for creating user interfaces. When picking a complementary tool to
use alongside it as a backend, Flybase is the easiest and most powerful solution. In just a few
lines of code you can get a React app syncing data across hundreds of clients at once. ReactFly
makes this that much easier, getting rid of even more boilerplate code.

Head on over to the [ReactFly API reference](reference.md) and then get started building an app
with ReactFly!
