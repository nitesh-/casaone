import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Address from './address.js';
import ProductCart from './product-cart.js';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";


class Index extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      startDate: new Date()
    };
  }

  handleChange = date => {
    this.setState({
      startDate: date
    });
  };

  render() {
    return (<React.Fragment><div className="container">
      <div className="row">
        <div className="col-half">
          <div className="label">Billing Address</div>
          <Address />
        </div>
        <div className="col-half">
          <div className="label">Shipping Address</div>
          <Address />
        </div>
      </div>
      <div className="row">
        <div className="col-half">
          <div className="label">Order Date</div>
          <label className="datepicker">
            <DatePicker
              selected={this.state.startDate}
              onChange={this.handleChange}
              dateFormat="dd/MM/yyyy"
            /></label>
        </div>
        <div className="col-half">
          <div className="label">Expected Delivery</div>
            <label className="datepicker">
            <DatePicker
              selected={this.state.startDate}
              onChange={this.handleChange}
              dateFormat="dd/MM/yyyy"
            /></label>
        </div>
      </div>
    </div>
    <div className="container">
    <div className="row">
      <div className="col-full">
        <ProductCart />
      </div>
    </div>
    </div></React.Fragment>);
  }
}

var $root = document.getElementById('root');
ReactDOM.render(<Index />, $root);

export default Index;
