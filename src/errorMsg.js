import React from "react";

class ErrorMsg extends React.Component {
  constructor(props) {
    super(props);
    this.state = this.updateProps(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.setState(this.updateProps(nextProps));
  }

  updateProps = props => {
    let _props = {},
      style = {
        display: "none"
      },
      msg = "";
    if (props.show === true) {
      style = {};
    }
    if (props.msg !== undefined && props.msg !== "") {
      msg = props.msg;
    }
    _props = {
      msg: msg,
      style: style
    };
    return _props;
  };

  render() {
    return (
      <div className="errorMsg" style={this.state.style}>
        {this.state.msg}
      </div>
    );
  }
}

export default ErrorMsg;
