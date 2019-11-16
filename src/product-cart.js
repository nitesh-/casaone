import React from 'react';

class ProductCart extends React.Component {
	  constructor(props) {
			super(props);
			this.state = [{

			}];
		}

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
  			name: 'total_prie',
  			style: {}
  		},
  		{
  			label: 'Notes',
  			name: 'notes',
  			style: {}
  		}
  	];
  };

  addInput = (obj) => {
  	if(obj.label.toLowerCase() !== 'notes') {
  		return (<label className={obj.name}><input type="text" style={obj.style} /></label>)
		} else
			return (<textarea></textarea>)	
  };

  render() {
		return (<React.Fragment><div className="table" id="results">
  <div className='theader'>
  	{this.getTableArray().map( (obj) => {
  		return (<div className='table_header'>{obj.label}</div>)
  	})}
  	<div className='table_header'></div>
  </div>
  <div className='table_row'>
  	{this.getTableArray().map((obj) => {
  		return (<div className='table_small'>
	      <div className='table_cell'>{obj.label !== 'Delete' ? obj.label : ''}</div>
	      <div className='table_cell'>
	      	{this.addInput(obj)}
	      </div>
	    </div>);
  	})
  	}
  	<div className='table_small'>
	      <div className='table_cell'></div>
	      <div className='table_cell'><button type="button" class="delete">Delete</button></div>
	  </div>
  </div>
</div><button type="button" class="add">Add Product</button><div className="save">
    <button type="button" class="add">Save</button>
    </div></React.Fragment>);
	  }
}

export default ProductCart;
