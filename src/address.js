import React from "react";
import ErrorMsg from "./errorMsg.js";

class Address extends React.Component {
  _defaultAddress = {
    first_name: {
      placeholder: "First Name",
      value: "",
      attr: {}
    },
    last_name: {
      placeholder: "Last Name",
      value: "",
      attr: {}
    },
    address_line1: {
      placeholder: "Address Line1",
      value: "",
      attr: {}
    },
    address_line2: {
      placeholder: "Address Line2",
      value: "",
      attr: {}
    },
    address_city: {
      placeholder: "City",
      value: "",
      attr: {}
    },
    address_state: {
      placeholder: "State",
      value: "",
      attr: {}
    },
    address_zipcode: {
      placeholder: "Zip code",
      value: "",
      attr: {}
    },
    address_country: {
      placeholder: "Country",
      value: "",
      attr: {}
    }
  };
  keyCode = 0;
  constructor(props) {
    super(props);
    this.state = this.prefillData();
    this.currentErrorMsg = "";
  }

  prefillData = () => {
    if (
      this.props.data !== undefined &&
      Object.keys(this.props.data).length > 0
    ) {
      var _state = {};
      for (let fieldName in this._defaultAddress) {
        if (this.props.data[fieldName] !== undefined) {
          _state[fieldName] = {
            value: this.props.data[fieldName],
            attr: this._defaultAddress[fieldName].attr,
            placeholder: this._defaultAddress[fieldName].placeholder
          };
        } else {
          _state[fieldName] = {
            value: this._defaultAddress[fieldName].value,
            attr: this._defaultAddress[fieldName].attr,
            placeholder: this._defaultAddress[fieldName].placeholder
          };
        }
      }
      return _state;
    } else {
      return [JSON.parse(JSON.stringify(this._defaultAddress))];
    }
  };

  handleChange = e => {
    let _target = e.target;
    let name = _target.getAttribute("name");
    if (
      this.validate(name, _target.value) ||
      _target.value.length == 0 ||
      this.keyCode == 8
    ) {
      let oldState = JSON.parse(JSON.stringify(this.state));
      oldState[name]["value"] =
        typeof e.value == "string" ? _target.value.trim() : _target.value;
      this.setState(oldState);
    }
  };

  handleKeyPress = e => {
    this.keyCode = e.keyCode;
  };

  renderInput = () => {
    let input = [];
    for (let fieldName in this.state) {
      input.push(
        <div className="address_input">
          <input
            type="text"
            name={fieldName}
            placeholder={this.state[fieldName]["placeholder"]}
            value={this.state[fieldName]["value"]}
            autocomplete="randomString" // Hack to stop displaying autocomplete on chrome
            onKeyDown={this.handleKeyPress}
            onChange={this.handleChange}
            className={
              this.state[fieldName]["attr"]["error"] === true ? "error" : ""
            }
          />
          <ErrorMsg
            show={this.state[fieldName].attr.msg != "" ? true : false}
            msg={this.state[fieldName].attr.msg}
          />
        </div>
      );
    }
    return <React.Fragment>{input}</React.Fragment>;
  };

  validate = (fieldName, value) => {
    let ret = true;
    value = typeof value == "string" ? value.trim() : value;
    if (value == "") {
      this.currentErrorMsg = "Please enter a value";
      ret = false;
    } else if (fieldName === "address_zipcode") {
      this.currentErrorMsg = "Please enter alphanumeric chars";
      if (/^[a-z0-9\s]*$/i.test(value) === false) {
        ret = false;
      }
    } else if (
      fieldName === "address_country" ||
      fieldName === "address_city" ||
      fieldName === "address_state" ||
      fieldName === "first_name" ||
      fieldName === "last_name"
    ) {
      if (/^[a-z\s]*$/i.test(value) === false) {
        this.currentErrorMsg = "Please enter alphabets";
        ret = false;
      }
    }
    return ret;
  };

  getData = () => {
    let _addressObj = JSON.parse(JSON.stringify(this.state));
    let ret = true;
    let _data = {};
    for (let fieldName in _addressObj) {
      let _v = _addressObj[fieldName]["value"];
      _data[fieldName] = _v;
      _addressObj[fieldName]["attr"]["error"] = false;
      _addressObj[fieldName]["attr"]["msg"] = "";
      if (!this.validate(fieldName, _v)) {
        _addressObj[fieldName]["attr"]["error"] = true;
        _addressObj[fieldName]["attr"]["msg"] = this.currentErrorMsg;
        ret = false;
      }
    }
    this.setState(_addressObj);
    if (!ret) {
      _data = {};
    }
    return _data;
  };

  render() {
    return <div className="js-input-wrapper">{this.renderInput()}</div>;
  }
}

export default Address;
