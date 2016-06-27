[ReactJS](https://facebook.github.io/react/) is a framework for building large, complex user interfaces. 

[Flybase](https://flybase.io/) complements it perfectly by providing an easy-to-use, realtime data source for populating the `state` of React components. 

With ReactFly, it only takes a few lines of JavaScript to integrate Flybase data into React apps via the `ReactFlyMixin`.

## Getting Started With Flybase

ReactFly requires a [Flybase](https://flybase.io/) account in order to sync and store data. 
Flybase is a real-time platform designed to help you develop your app, grow your user
base, and earn money. You can [sign up here for a free account](https://app.flybase.io/signup).

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

You can also install ReactFly via npm or Bower. If downloading via npm, you will have to install
React and Flybase separately (that is, they are `peerDependencies`):

```bash
$ npm install reactfly react flybase --save
```

On Bower, the React and Flybase dependencies will be downloaded automatically alongside ReactFly:


```bash
$ bower install reactfly --save
```


## Documentation

* [Quickstart](https://docs.flybase.io/web/libraries/react/quickstart)
* [Guide](https://docs.flybase.io/web/libraries/react/guide)
* [API Reference](https://docs.flybase.io/web/libraries/react/reference)

## Examples

* [Todo App](examples/)