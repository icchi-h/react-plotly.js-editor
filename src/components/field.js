import React, { Component } from "react";
import PropTypes from "prop-types";
import nestedProperty from "plotly.js/src/lib/nested_property";

class Field extends Component {
  constructor(props, context) {
    super(props);

    this._index = context.traceIndex;
    this._data = context.data[this._index];
    this._fullData = context.fullData[this._index];
    this._property = nestedProperty(this._data, this.props.attr);
    this._fullProperty = nestedProperty(this._fullData, this.props.attr);
    this.updatePlot = this.updatePlot.bind(this);
    this._contextUpdate = context.handleUpdate;

    this.state = {
      value: this.fullValue,
    };
  }

  componentWillReceiveProps(nextProps, nextContext) {
    this._index = nextContext.traceIndex;
    this._contextUpdate = nextContext.handleUpdate;

    if (nextContext.data) {
      this._data = nextContext.data[this._index];
    } else {
      this._data = [];
    }

    if (nextContext.fullData) {
      this._fullData = nextContext.fullData[this._index];
    } else {
      this._fullData = [];
    }
  }

  updatePlot(event) {
    this.value = event.target.value;
    this.setState({ value: event.target.value });
    this._contextUpdate && this._contextUpdate(this.props.attr, this.value);
  }

  get value() {
    return this._property.get();
  }

  get fullValue() {
    return this._fullProperty.get();
  }

  set value(newValue) {
    this._property.set(newValue);

    this._contextUpdate(gd, this._data, this.props.attr, newValue);
  }
}

Field.contextTypes = {
  data: PropTypes.array,
  fullData: PropTypes.array,
  layout: PropTypes.object,
  fullLayout: PropTypes.object,
  handleUpdate: PropTypes.func,
  traceIndex: PropTypes.number,
};

export default Field;