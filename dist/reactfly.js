(function(root, factory) {
	'use strict';
	if (typeof define === 'function' && define.amd) {
		define([], function() {
			return (root.ReactFlyMixin = factory());
		});
	} else if (typeof exports === 'object') {
		module.exports = factory();
	} else {
		root.ReactFlyMixin = factory();
	}
}(this, function() {
	'use strict';

	function _indexForKey(list, key) {
		for (var i = 0, length = list.length; i < length; ++i) {
			if (list[i]['.key'] === key) {
				return i;
			}
		}

		return -1;
	}

	function _throwError(message) {
		throw new Error('ReactFly: ' + message);
	}

	function _validateBindVar(bindVar) {
		var errorMessage;

		if (typeof bindVar !== 'string') {
			errorMessage = 'Bind variable must be a string. Got: ' + bindVar;
		} else if (bindVar.length === 0) {
			errorMessage = 'Bind variable must be a non-empty string. Got: ""';
		} else if (bindVar.length > 768) {
			errorMessage = 'Bind variable is too long to be stored in Flybase. Got: ' + bindVar;
		} else if (/[\[\].#$\/\u0000-\u001F\u007F]/.test(bindVar)) {
			errorMessage = 'Bind variable cannot contain any of the following characters: . # $ ] [ /. Got: ' + bindVar;
		}

		if (typeof errorMessage !== 'undefined') {
			_throwError(errorMessage);
		}
	}

	function _createRecord(key, value) {
		var record = {};
		if (typeof value === 'object' && value !== null) {
			record = value;
		} else {
			record['.value'] = value;
		}
		record['.key'] = key;

		return record;
	}


	function _objectValue(bindVar, snapshot) {
		this.data[bindVar] = _createRecord( snapshot.key(), snapshot.value() );
		this.setState(this.data);
	}


	function _arrayValue(bindVar, dataSnapshot) {
		var items = [];
		dataSnapshot.forEach(function(snapshot) {
			var item = _createRecord( snapshot.key(), snapshot.value() );
			items.push( item );
		}.bind(this));
		this.data[bindVar] = items;
		this.setState(this.data);
	}

	function _arrayAdded(bindVar, snapshot, previousChildKey) {
		var array = this.data[bindVar];
		var insertionIndex;
		if (previousChildKey === null) {
			insertionIndex = 0;
		} else {
			var previousChildIndex = _indexForKey(array, previousChildKey);
			insertionIndex = previousChildIndex + 1;
		}
		var item = _createRecord( snapshot.key(), snapshot.value() );
		array.splice(insertionIndex, 0, item);
			this.setState(this.data);
	}

	function _arrayRemoved(bindVar, snapshot) {
		var array = this.data[bindVar];
		var index = _indexForKey(array, snapshot.key() );
		array.splice(index, 1);
		this.setState(this.data);
	}

	function _arrayChanged(bindVar, snapshot) {
		var array = this.data[bindVar];
		var index = _indexForKey(array, snapshot.key() );
		array[index] = _createRecord( snapshot.key(), snapshot.value() );
		this.setState(this.data);
	}

	function _bind(flybaseRef, bindVar, cancelCallback, bindAsArray) {
		if (Object.prototype.toString.call(flybaseRef) !== '[object Object]') {
			_throwError('Invalid Flybase reference');
		}

		_validateBindVar(bindVar);
		if (typeof this.flybaseRefs !== 'undefined') {
			if (typeof this.flybaseRefs[bindVar] !== 'undefined') {
				_throwError('this.state.' + bindVar + ' is already bound to a Flybase reference');
			}
		}else{
			this.flybaseRefs = [];
			this.flybaseListeners = [];
		}

		this.flybaseRefs[bindVar] = flybaseRef;

		if (bindAsArray) {
			if( typeof this.data === 'undefined' ) this.data = [];
			this.data[bindVar] = [];
			this.setState(this.data);

			this.flybaseListeners[bindVar] = {
				value: flybaseRef.on('value', _arrayValue.bind(this, bindVar), cancelCallback),
				added: flybaseRef.on('added', _arrayAdded.bind(this, bindVar), cancelCallback),
				removed: flybaseRef.on('removed', _arrayRemoved.bind(this, bindVar), cancelCallback),
				changed: flybaseRef.on('changed', _arrayChanged.bind(this, bindVar), cancelCallback),
			};
		} else {
			this.flybaseListeners[bindVar] = {
				value: flybaseRef.on('value', _objectValue.bind(this, bindVar), cancelCallback)
			};
		}
	}


	var ReactFlyMixin = {
		componentWillUnmount: function() {
			for (var bindVar in this.flybaseRefs) {
				if (this.flybaseRefs.hasOwnProperty(bindVar)) {
					this.unbind(bindVar);
				}
			}
		},


		bindAsArray: function(flybaseRef, bindVar, cancelCallback) {
			var bindPartial = _bind.bind(this);
			bindPartial(flybaseRef, bindVar, cancelCallback,	true);
		},

		bindAsObject: function(flybaseRef, bindVar, cancelCallback) {
			var bindPartial = _bind.bind(this);
			bindPartial(flybaseRef, bindVar, cancelCallback,	false);
		},

		unbind: function(bindVar, callback) {
			_validateBindVar(bindVar);

			if (typeof this.flybaseRefs[bindVar] === 'undefined') {
				_throwError('this.state.' + bindVar + ' is not bound to a Flybase reference');
			}

			for (var event in this.flybaseListeners[bindVar]) {
				if (this.flybaseListeners[bindVar].hasOwnProperty(event)) {
					var offListener = this.flybaseListeners[bindVar][event];
					this.flybaseRefs[bindVar].off(event, offListener);
				}
			}
			delete this.flybaseRefs[bindVar];
			delete this.flybaseListeners[bindVar];

			var newState = {};
			newState[bindVar] = undefined;
			this.setState(newState, callback);
		}
	};

	return ReactFlyMixin;
}));