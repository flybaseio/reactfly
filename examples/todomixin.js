var flybaseRef = new Flybase("YOUR-API-KEY", "sample", "todo");

var TodoListMixin = React.createClass({
	render: function() {
		var _this = this;
		var createItem = function(item, index) {
			return (
				<li key={ index }>
					{ item.text }
					<span onClick={ _this.props.removeItem.bind(null, item['.key']) }
								style={{ color: 'red', marginLeft: '10px', cursor: 'pointer' }}>
						X
					</span>
				</li>
			);
		};
		return <ul>{ this.props.items.map(createItem) }</ul>;
	}
});

var TodoAppMixin = React.createClass({
	mixins: [ReactFlyMixin],

	getInitialState: function() {
		return {
			items: [],
			text: ''
		};
	},

	componentWillMount: function() {
		this.bindAsArray(flybaseRef.limit(25).orderBy({"_id":-1}), 'items');
	},

	onChange: function(e) {
		this.setState({text: e.target.value});
	},

	removeItem: function(key) {
		flybaseRef.remove(key);
	},

	handleSubmit: function(e) {
		e.preventDefault();
		if (this.state.text && this.state.text.trim().length !== 0) {
			this.flybaseRefs['items'].push({
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
				<TodoListMixin items={ this.state.items } removeItem={ this.removeItem } />
				<form onSubmit={ this.handleSubmit }>
					<input onChange={ this.onChange } value={ this.state.text } />
					<button>{ 'Add #' + (this.state.items.length + 1) }</button>
				</form>
			</div>
		);
	}
});

ReactDOM.render(<TodoAppMixin />, document.getElementById('todoAppMixin'));