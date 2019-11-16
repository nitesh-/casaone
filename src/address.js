import React from 'react';

class Address extends React.Component {
	  constructor(props) {
		super(props);
		this.state = {
		  first_name: {
		  	placeholder: "First Name",
		  	value: ""
		  },
		  last_name: {
		  	placeholder: "Last Name",
		  	value: ""
		  },
		  address_line1: {
		  	placeholder: "Address Line1",
		  	value: ""
		  },
			address_line2: {
		  	placeholder: "Address Line2",
		  	value: ""
		  },
			address_city: {
		  	placeholder: "City",
		  	value: ""
		  },
			address_state: {
		  	placeholder: "State",
		  	value: ""
		  },
			address_zipcode: {
		  	placeholder: "Zip code",
		  	value: ""
		  },
			address_country: {
		  	placeholder: "Country",
		  	value: ""
		  }
		}
  }

  updateState = (e) => {
  	let _target = e.target;
  	let oldState = this.state;
  	let name = _target.getAttribute('name');
  	oldState[name]['value'] = e.value;
  	this.setState(oldState);
  	//_target.value
  };

  addInput = () => {
	  let input = [];
		for (var key in this.state) {
		  input.push(<div className="address_input">
		  	<input 
		  		type="text"
		  		name={key}
		  		placeholder={this.state[key]['placeholder']}
		  		value={this.state[key]['value']}
		  		autocomplete="off"
		  		onChange={this.updateState} />
		  	</div>);
		}
		return (<React.Fragment>{input}</React.Fragment>);
  };

  getPlaceholderString = (str) => {

  }

  render() {
		return (<div className="js-input-wrapper">
		  {this.addInput()}
		  </div>);
	  }
}

export default Address;
