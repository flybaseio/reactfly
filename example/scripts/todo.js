var TodoList2 = React.createClass({
	render: function() {
		var _this = this;
		var createItem = function(item, index) {
			return (
				<li key={ index }>
				{ item.text }
				<span onClick={ _this.props.removeItem.bind(null, item['.key']) }
				style={{ color: 'red', marginLeft: '10px', cursor: 'pointer' }}>X</span>
				</li>
			);
		};
		return <ul>{ this.props.items.map(createItem) }</ul>;
	}
});
	
var TodoApp2 = React.createClass({
	getInitialState: function() {
		return {
			items: [],
			text: ''
		};
	},
	componentWillMount: function() {
		this.flybaseRef = new Flybase("YOUR-API-KEY", "sample", "todo");
		this.flybaseRef.limit(25).orderBy({"_id":-1}).on('value', function(dataSnapshot) {
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
		this.flybaseRef.on('added', function(dataSnapshot) {
			var items = this.state.items;
			var childSnapshot = dataSnapshot;
			var item = childSnapshot.value();
			item['.key'] = childSnapshot.key();
			items.push(item);
			this.setState({
				items: items
			});
		}.bind(this));

		this.flybaseRef.on('changed', function(dataSnapshot) {
			var items = this.state.items;
			var childSnapshot = dataSnapshot;
			var item = childSnapshot.value();
			item['.key'] = childSnapshot.key();

			for(var i = items.length - 1; i >= 0; i--) {
				if(items[i]['.key'] === childSnapshot.key() ) {
					items[i] = item;
				}
			}
			this.setState({
				items: items
			});
		}.bind(this));

		this.flybaseRef.on('removed', function(dataSnapshot) {
			var items = this.state.items;
			var childSnapshot = dataSnapshot;
			var item = childSnapshot.value();
			for(var i = items.length - 1; i >= 0; i--) {
				if(items[i]['.key'] === childSnapshot.key() ) {
					items.splice(i, 1);
				}
			}
			this.setState({
				items: items
			});
		}.bind(this));

	},
	componentWillUnmount: function() {
//		this.flybaseRef.off();
	},
	onChange: function(e) {
		this.setState({text: e.target.value});
	},
	removeItem: function(key) {
		var flybaseRef = new Flybase("74c8064f-cd6f-4c07-8baf-b1d241496eec", "sample", "todo");	  
		flybaseRef.remove(key);
	},
	handleSubmit: function(e) {
		e.preventDefault();
		if (this.state.text && this.state.text.trim().length !== 0) {
			this.flybaseRef.push({
				text: this.state.text
			});
			this.setState({
				text: ''
			});
		}
	},
	render: function() {
		return (
			<div>
			<TodoList2 items={ this.state.items } removeItem={ this.removeItem } />
			<form onSubmit={ this.handleSubmit }>
			<input onChange={ this.onChange } value={ this.state.text } />
			<button>{ 'Add #' + (this.state.items.length + 1) }</button>
			</form>
			</div>
		);
	}
});
	
ReactDOM.render(<TodoApp2 />, document.getElementById('todoApp2'));