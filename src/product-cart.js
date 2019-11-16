import React from 'react';

class ProductCart extends React.Component {
		_defaultRow = {
			product_id: {
				value: '100100',
				attr: {}
			},
			product_name: {
				value: '',
				attr: {}
			},
			qty: {
				value: 0,
				attr: {}
			},
			unit_price: {
				value: 0,
				attr: {}
			},
			total_price: {
				value: 0,
				attr: {}
			},
			notes: {
				value: 'sss',
				attr: {}
			}
		};
	  constructor(props) {
			super(props);
			this.state = {
				productArray: this.prefillData()
			};
		}

		prefillData = () => {
			if(this.props.data !== undefined && this.props.data.length > 0) {
				var _state = [];
				for(let rowNo in this.props.data) {
					let _obj = {};
					for(let fieldName in this._defaultRow) {
						if(this.props.data[rowNo][fieldName] !== undefined) {
							if(fieldName == 'total_price') {
								this.props.data[rowNo][fieldName] = 0;
								if(this.props.data[rowNo]['qty'] > 0 && this.props.data[rowNo]['unit_price'] > 0) {
									this.props.data[rowNo][fieldName] = this.props.data[rowNo]['qty'] * this.props.data[rowNo]['unit_price'];
								}
							}
							_obj[fieldName] = {
								value: this.props.data[rowNo][fieldName],
								attr: this._defaultRow[fieldName].attr
							};
						}
					}
					_state.push(_obj);
				}
				return _state;
			} else {
				return [JSON.parse(JSON.stringify(this._defaultRow))];
			}
		};

  updateState = (e) => {
  	let _target = e.target;
  	let oldState = this.state;
  	let name = _target.getAttribute('name');
  	oldState[name]['value'] = e.value;
  	this.setState(oldState);
  	//_target.value
  };

  getTableArray = () => {
  	return [
  		{
  			label: 'Product ID',
  			name: 'product_id',
  			style: {}
  		},
  		{
  			label: 'Product Name',
  			name: 'product_name',
  			style: {}
  		},
  		{
  			label: 'QTY',
  			name: 'qty',
  			style: {}
  		},
  		{
  			label: 'Unit Price',
  			name: 'unit_price',
  			style: {}
  		},
  		{
  			label: 'Total Price',
  			name: 'total_price',
  			style: {}
  		},
  		{
  			label: 'Notes',
  			name: 'notes',
  			style: {}
  		}
  	];
  };

  /**
   * Returns label from the fieldName
   *
   */
  getLabel = (fieldName) => {
  	let _t = this.getTableArray();
  	for(let i in _t) {
  		if(_t[i]['name'] === fieldName) {
  			return _t[i]['label'];
  		}
  	}
  };

  /**
   * Returns total_price based on unit_price and qty
   *
   */
  getTotalPrice = (className, obj, currentValue) => {
  	let qty = obj['qty']['value'], unit_price = obj['unit_price']['value'];
  	if(className === 'qty') {
  		qty = parseInt(currentValue);
  	} else if(className === 'unit_price') {
  		unit_price = parseInt(currentValue);
  	}
  	return unit_price > 0 && qty > 0 ? unit_price * qty : 0;
  };

  /**
   * Adds a product row
   *
   */
  addProductRow = () => {
  	let productArray = this.state.productArray;
  	productArray.push(JSON.parse(JSON.stringify(this._defaultRow)));
  	this.setState({
  		productArray: productArray
  	});
  };

  /**
   * Deletes a product row
   *
   */
  deleteProductRow = (e) => {
  	let _target = e.target;
  	let _index = parseInt(_target.parentNode.parentNode.parentNode.getAttribute('data-row-id'));
  	if(_index > 0) {
	  	let productArray = this.state.productArray;
	  	productArray.splice(_index, 1);
	  	this.setState({
	  		productArray: productArray
	  	});
	  }
  };

  /**
   * Renders Input/Textarea field
   *
   */
  renderInput = (fieldName, obj) => {
  	if(fieldName.toLowerCase() !== 'notes') {
  		return (<label className={fieldName}><input type="text" value={obj.value} className={obj.attr.error ? 'error' : ''} onChange={this.onChange} /></label>)
		} else
			return (<textarea onChange={this.onChangeValidate}>{obj.value}</textarea>)	
  };

  /**
   * Run series of function when input changes
   *
   */
  onChange = (e) => {
  	let _target = e.target;
  	let _index = parseInt(_target.parentNode.parentNode.parentNode.parentNode.getAttribute('data-row-id'));
  	if(_index > -1) {
	  	let className = _target.parentNode.getAttribute('class');
	  	let productArray = this.state.productArray;
	  	if(this.validate(className, _target.value)) {
	  		productArray[_index][className]['value'] = _target.value;

	  		let totalPrice = this.getTotalPrice(className, productArray[_index], _target.value);
	  		productArray[_index]['total_price']['value'] = totalPrice;
	  		this.setState({
		  		productArray: productArray
		  	});
	  	}
	  }
  };

  /**
   * Validate data on input change
   *
   */
  validate = (className, value) => {
  	let ret = true;
  	if(className === 'product_id' || className === 'qty' || className === 'unit_price') {
  		value = value.trim();
  		if(isNaN(value) || value < 1) {
  			ret = false;
  		}
  	} else if(className === 'total_price') { // Total_price should never be received from user
  		ret = false;
  	} else if(className === 'product_name') {
  		if(value == "") {
  			ret = false;
  		}
  	}
  	return ret;
  };

  getProductArray = () => {
  	let _productArray = this.state.productArray;
  	let ret = true;
  	for(let rowNo in _productArray) {
  		for(let fieldName in _productArray[rowNo]) {
	  		let _v = _productArray[rowNo][fieldName]['value'];
	  		_productArray[rowNo][fieldName]['attr']['error'] = false;
	  		if(this.validate(fieldName, _v)) {
	  			_productArray[rowNo][fieldName]['attr']['error'] = true;
  				ret = false;
	  		}
	  	}
  	}
  	return ret;
  };

  render() {
		return (<React.Fragment><div className="table" id="results">
  <div className='theader'>
  	{this.getTableArray().map((obj) => {
  		return (<div className='table_header'>{obj.label}</div>)
  	})}
  	<div className='table_header'></div>
  </div>
  {this.state.productArray.map((obj, i) => {
  return (<div className='table_row' data-row-id={i}>
  	{Object.keys(obj).map((fieldName) => {
  		return (<div className='table_small'>
	      <div className='table_cell'>{this.getLabel(fieldName)}</div>
	      <div className='table_cell'>
	      	{this.renderInput(fieldName, obj[fieldName])}
	      </div>
	    </div>)
  	})}
  	<div className='table_small'>
	      <div className='table_cell'></div>
	      <div className='table_cell'>
	      	<button type="button" className="delete" onClick={this.deleteProductRow}>Delete</button>
	      </div>
	  </div>
  </div>)})}
</div><button type="button" className="add" onClick={this.addProductRow}>Add Product</button><div className="save">
    <button type="button" className="add">Save</button>
    </div></React.Fragment>);
	  }
}

export default ProductCart;
