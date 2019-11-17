import React from "react";
import ReactDOM from "react-dom";
import "./scss/index.scss";
import Address from "./address.js";
import ProductCart from "./product-cart.js";
import Dates from "./Dates.js";
import Data from "./data/data.json";

class Index extends React.Component {
  constructor(props) {
    super(props);

    this.childRef = {
      shipping_details: React.createRef(),
      billing_details: React.createRef(),
      delivery_date: React.createRef(),
      order_date: React.createRef(),
      product_cart: React.createRef()
    };
  }

  componentDidMount() {
    document.title = "Casaone - Task";
  }

  onSave = () => {
    let _obj = {};
    for (let componentName in this.childRef) {
      _obj[componentName] = this.childRef[componentName].current.getData();
    }
    let hasError = false;
    for(let i in _obj) {
      if(typeof _obj[i] === 'object') {
        if(_obj[i].length !== undefined && _obj[i].length == 0) { // Array
          hasError = true;
          break;
        } else if(Object.keys(_obj[i]).length == 0) {
          hasError = true;
          break;
        }
      } else if(typeof _obj[i] === 'string' && _obj[i].length == 0) {
        hasError = true;
        break;
      }
    }
    console.info(hasError ? {} : _obj);
  };

  handleChange = date => {
    this.setState({
      order_date: (Data.order_date && Data.order_date !== "") || new Date(),
      expected_delivery_date:
        (Data.expected_delivery_date && Data.expected_delivery_date !== "") ||
        new Date()
    });
  };

  getDataFromComponents = () => {};

  render() {
    return (
      <React.Fragment>
        <div className="container">
          <div className="row">
            <div className="col-half">
              <div className="label">Billing Address</div>
              <Address
                data={Data.billing_details}
                ref={this.childRef["billing_details"]}
              />
            </div>
            <div className="col-half">
              <div className="label">Shipping Address</div>
              <Address
                data={Data.shipping_details}
                ref={this.childRef["shipping_details"]}
              />
            </div>
          </div>
          <div className="row">
            <div className="col-half">
              <div className="label">Order Date</div>
              <Dates
                data={Data.order_date}
                type="order_date"
                getData={this.getDataFromComponents}
                ref={this.childRef["order_date"]}
              />
            </div>
            <div className="col-half">
              <div className="label">Expected Delivery Date</div>
              <Dates
                data={Data.expected_delivery_date}
                type="delivery_date"
                ref={this.childRef["delivery_date"]}
              />
            </div>
          </div>
        </div>
        <div className="container">
          <div className="row">
            <div className="col-full">
              <ProductCart
                data={Data.productCart}
                ref={this.childRef["product_cart"]}
              />
            </div>
          </div>
          <div className="container">
            <div className="row">
              <div className="col-full">
                <button
                  type="button"
                  className="add save"
                  onClick={this.onSave}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

var $root = document.getElementById("root");
ReactDOM.render(<Index />, $root);

export default Index;