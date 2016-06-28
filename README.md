[ReactJS](https://facebook.github.io/react/) is a framework for building large, complex user interfaces. 

[Flybase](https://flybase.io/) works perfectly with ReactJS by providing an easy-to-use, real-time platform for populating the `state` of React components. 

With the ReactFly helper library, it only takes a few lines of JavaScript to integrate Flybase data into React apps via the `ReactFlyMixin`.

## Getting Started With Flybase

The ReactFly helper library requires a [Flybase](https://flybase.io/) account in order to sync and store data. You can [sign up here for a free account](https://app.flybase.io/signup).

## Downloading ReactFly

In order to use ReactFly in your project, you need to include the following files in your HTML:

```html
<!-- React -->
<script src="https://fb.me/react-15.0.1.min.js"></script>
<script src="https://fb.me/react-dom-15.0.1.min.js"></script>

<!-- Flybase -->
<script src="https://cdn.flybase.io/flybase.js"></script>

<!-- ReactFly -->
<script src="https://cdn.flybase.io/reactfly.min.js"></script>
```

You can also install ReactFly via npm or Bower. If you are downloading via npm, you will have to install
React and Flybase separately (that is, they are `peerDependencies`):

```bash
$ npm install reactfly react flybase --save
```

On Bower, the React and Flybase dependencies will be downloaded automatically alongside ReactFly:

```bash
$ bower install reactfly --save
```

## Further Reading

* [Quickstart](https://docs.flybase.io/web/libraries/react/)

## Code Sample

If you check out the [examples](examples/) folder, you'll see an example of using Flybase with plain React, and using Flybase with the ReactFly Mixin, so you can see how easy it is to integrate.