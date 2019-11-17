import React from "react";
import moment from "moment";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ErrorMsg from "./errorMsg.js";

class Dates extends React.Component {
  _momentDateFormat = "DD/MM/YYYY";
  constructor(props) {
    super(props);
    this.state = {
      date: this.prefillData()
    };
  }

  componentDidMount() {
    this._defaultDateMoment = moment(moment().format("YYYY-MM-DD"));
    this._defaultDate =
      this.props.type == "order_date"
        ? new Date()
        : moment(this._defaultDateMoment).add(1, "d");
  }

  prefillData = () => {
    let _obj = {
      value: this._defaultDate,
      attr: {
        error: false
      }
    };

    _obj["value"] = moment(this.props.data, "DD/MM/YYYY").toDate();
    if (this.validate(this.props.data)) {
      _obj["attr"]["error"] = false;
    }
    return _obj;
  };

  handleChange = date => {
    if (this.validate(date)) {
      this.setState({
        date: {
          value: date,
          attr: { error: false }
        }
      });
    }
  };

  getData = () => {
    let ret = "";
    if (
      this.state.date !== undefined &&
      this.state.date.value &&
      moment(this.state.date.value).isValid()
    ) {
      if (this.validate(this.state.date.value)) {
        ret = moment(this.state.date.value).format(this._momentDateFormat);
      } else {
        this.setState({
          date: {
            value: this.state.date.value,
            attr: {
              error: true,
              msg:
                this.props.type == "order_date"
                  ? "Date must be today or within last 30 days"
                  : "Date must be today or within next 20 days"
            }
          }
        });
      }
    }
    return ret;
  };

  validate = date => {
    let ret = false;
    let _date;

    if (moment(date, this._momentDateFormat).isValid()) {
      _date = moment(date, this._momentDateFormat);
      ret = true;
    } else if (moment(date).isValid()) {
      _date = moment(date);
      ret = true;
    }
    if (ret) {
      if (this.props.type == "order_date") {
        if (
          moment(_date).isAfter(this._defaultDateMoment) ||
          moment(_date).isBefore(
            moment(this._defaultDateMoment).subtract(30, "d")
          )
        ) {
          ret = false;
        }
      } else if (this.props.type == "delivery_date") {
        if (
          moment(_date).isSameOrBefore(this._defaultDateMoment) ||
          moment(_date).isAfter(moment(this._defaultDateMoment).add(20, "d"))
        ) {
          ret = false;
        }
      }
    }
    return ret;
  };

  render() {
    return (
      <React.Fragment>
        <label className="datepicker">
          <DatePicker
            className={this.state.date.attr.error === true ? "error" : ""}
            selected={this.state.date.value}
            onChange={this.handleChange}
            minDate={
              this.props.type == "delivery_date"
                ? moment().toDate()
                : this.props.type == "order_date"
                ? moment()
                    .subtract(30, "d")
                    .toDate()
                : ""
            }
            maxDate={
              this.props.type == "order_date"
                ? new Date()
                : this.props.type == "delivery_date"
                ? moment()
                    .add(20, "d")
                    .toDate()
                : ""
            }
            dateFormat="dd/MM/yyyy"
          />
        </label>
        <ErrorMsg
          show={this.state.date.attr.msg != "" ? true : false}
          msg={this.state.date.attr.msg}
        />
      </React.Fragment>
    );
  }
}

export default Dates;
