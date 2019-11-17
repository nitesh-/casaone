import React from "react";

class ProductCart extends React.Component {
  _defaultRow = {
    product_id: {
      value: 0,
      attr: {}
    },
    product_name: {
      value: "",
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
      value: "",
      attr: {}
    }
  };
  keyCode = 0;
  constructor(props) {
    super(props);
    this.state = {
      productArray: this.prefillData()
    };
  }

  prefillData = () => {
    if (this.props.data !== undefined && this.props.data.length > 0) {
      var _state = [];
      for (let rowNo in this.props.data) {
        let _obj = {};
        for (let fieldName in this._defaultRow) {
          if (this.props.data[rowNo][fieldName] !== undefined) {
            if (fieldName == "total_price") {
              this.props.data[rowNo][fieldName] = 0;
              if (
                this.props.data[rowNo]["qty"] > 0 &&
                this.props.data[rowNo]["unit_price"] > 0
              ) {
                this.props.data[rowNo][fieldName] =
                  this.props.data[rowNo]["qty"] *
                  parseFloat(this.props.data[rowNo]["unit_price"]);
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

  getTableArray = () => {
    return [
      {
        label: "Product ID",
        name: "product_id",
        style: {}
      },
      {
        label: "Product Name",
        name: "product_name",
        style: {}
      },
      {
        label: "QTY",
        name: "qty",
        style: {}
      },
      {
        label: "Unit Price",
        name: "unit_price",
        style: {}
      },
      {
        label: "Total Price",
        name: "total_price",
        style: {}
      },
      {
        label: "Notes",
        name: "notes",
        style: {}
      }
    ];
  };

  /**
   * Returns label from the fieldName
   *
   */
  getLabel = fieldName => {
    let _t = this.getTableArray();
    for (let i in _t) {
      if (_t[i]["name"] === fieldName) {
        return _t[i]["label"];
      }
    }
  };

  /**
   * Returns total_price based on unit_price and qty
   *
   */
  getTotalPrice = (className, obj, currentValue) => {
    let qty = obj["qty"]["value"],
      unit_price = obj["unit_price"]["value"];
    if (className === "qty") {
      qty = parseInt(currentValue);
    } else if (className === "unit_price") {
      unit_price = parseFloat(currentValue);
    }
    return unit_price > 0 && qty > 0 ? parseFloat(unit_price) * qty : 0;
  };

  /**
   * Adds a product row
   *
   */
  addProductRow = () => {
    let productArray = JSON.parse(JSON.stringify(this.state.productArray));
    productArray.push(JSON.parse(JSON.stringify(this._defaultRow)));
    this.setState({
      productArray: productArray
    });
  };

  /**
   * Deletes a product row
   *
   */
  deleteProductRow = e => {
    let _target = e.target;
    let _index = parseInt(
      _target.parentNode.parentNode.parentNode.getAttribute("data-row-id")
    );
    if (_index > 0) {
      let productArray = JSON.parse(JSON.stringify(this.state.productArray));
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
    if (fieldName.toLowerCase() !== "notes") {
      return (
        <label className={fieldName}>
          <input
            type="text"
            value={obj.value}
            className={obj.attr.error ? "error" : ""}
            onChange={this.handleChange}
            onKeyDown={this.handleKeyPress}
          />
        </label>
      );
    } else {
      return (
        <label className={fieldName}>
          <textarea
            value={obj.value}
            onChange={this.handleChange}
            onKeyDown={this.handleKeyPress}
            className={obj.attr.error ? "error" : ""}
          />
        </label>
      );
    }
  };

  /**
   * Run series of function when input changes
   *
   */
  handleChange = e => {
    let _target = e.target;
    let _index = parseInt(
      _target.parentNode.parentNode.parentNode.parentNode.getAttribute(
        "data-row-id"
      )
    );

    if (_index > -1) {
      let className = _target.parentNode.getAttribute("class");
      let productArray = JSON.parse(JSON.stringify(this.state.productArray));
      if (
        this.validate(className, _target.value) ||
        _target.value.length == 0 ||
        this.keyCode == 8
      ) {
        productArray[_index][className]["value"] =
          typeof _target.value == "string" && className !== "product_name"
            ? _target.value.trim()
            : _target.value;

        let totalPrice = this.getTotalPrice(
          className,
          productArray[_index],
          _target.value
        );
        productArray[_index]["total_price"]["value"] = totalPrice;
        this.setState({
          productArray: productArray
        });
      }
    }
  };

  handleKeyPress = e => {
    this.keyCode = e.keyCode;
  };

  /**
   * Validate data on input change
   *
   */
  validate = (className, value) => {
    let ret = true;
    value = typeof value == "string" ? value.trim() : value;
    if (
      className === "product_id" ||
      className === "qty" ||
      className === "unit_price"
    ) {
      if (isNaN(value) || value < 1) {
        ret = false;
      }
      if (className === "qty" && /[\.]/.test(value) === true) {
        ret = false;
      }
    } else if (className === "total_price" && value < 1) {
      // Total_price should never be received from user
      ret = false;
    } else if (className === "product_name") {
      if (value == "") {
        ret = false;
      }
    } else if (className == "notes") {
      if ((value || "").length > 100) {
        ret = false;
      }
    }
    return ret;
  };

  getData = () => {
    let _productArray = JSON.parse(JSON.stringify(this.state.productArray));
    let ret = true,
      _data = [];
    for (let rowNo in _productArray) {
      let _tmpObj = {};
      for (let fieldName in _productArray[rowNo]) {
        let _v = _productArray[rowNo][fieldName]["value"];
        _tmpObj[fieldName] = _v;
        _productArray[rowNo][fieldName]["attr"]["error"] = false;
        if (!this.validate(fieldName, _v)) {
          _productArray[rowNo][fieldName]["attr"]["error"] = true;
          ret = false;
        }
      }
      _data.push(_tmpObj);
    }
    this.setState({
      productArray: _productArray
    });

    if (!ret) {
      _data = [];
    }
    return _data;
  };

  render() {
    return (
      <React.Fragment>
        <div className="table" id="results">
          <div className="theader">
            {this.getTableArray().map(obj => {
              return <div className="table_header">{obj.label}</div>;
            })}
            <div className="table_header"></div>
          </div>
          {this.state.productArray.map((obj, i) => {
            return (
              <div className="table_row" data-row-id={i}>
                {Object.keys(obj).map(fieldName => {
                  return (
                    <div className="table_small">
                      <div className="table_cell">
                        {this.getLabel(fieldName)}
                      </div>
                      <div className="table_cell">
                        {this.renderInput(fieldName, obj[fieldName])}
                      </div>
                    </div>
                  );
                })}
                <div className="table_small">
                  <div className="table_cell"></div>
                  <div className="table_cell">
                    <button
                      type="button"
                      className="delete"
                      onClick={this.deleteProductRow}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <button type="button" className="add" onClick={this.addProductRow}>
          Add Product
        </button>
      </React.Fragment>
    );
  }
}

export default ProductCart;
