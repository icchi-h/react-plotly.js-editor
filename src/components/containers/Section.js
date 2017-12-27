import Info from '../fields/Info';
import MenuPanel from './MenuPanel';
import React, {Component, cloneElement} from 'react';
import PropTypes from 'prop-types';
import unpackPlotProps from '../../lib/unpackPlotProps';
import {containerConnectedContextTypes} from '../../lib/connectToContainer';

export default class Section extends Component {
  constructor(props, context) {
    super(props, context);

    this.children = null;
    this.menuPanel = null;
    this.sectionVisible = false;

    this.processAndSetChildren(props, context);
  }

  componentWillReceiveProps(nextProps, nextContext) {
    this.processAndSetChildren(nextProps, nextContext);
  }

  processAndSetChildren(nextProps, nextContext) {
    this.sectionVisible = false;

    const children = React.Children.toArray(nextProps.children);
    this.children = [];
    let menuPanel = null;

    for (let i = 0; i < children.length; i++) {
      const child = children[i];
      if (!child) {
        continue;
      }
      if (child.type === MenuPanel) {
        // Process the first menuPanel. Ignore the rest. MenuPanel does
        // not affect visibility.
        if (menuPanel) {
          continue;
        }
        menuPanel = child;
        continue;
      }

      const isAttr = Boolean(child.props.attr);
      let plotProps;
      let newProps = {};
      if (child.plotProps) {
        plotProps = child.plotProps;
      } else if (isAttr) {
        if (child.type.supplyPlotProps) {
          plotProps = child.type.supplyPlotProps(child.props, nextContext);
          if (child.type.modifyPlotProps) {
            child.type.modifyPlotProps(child.props, nextContext, plotProps);
          }
        } else {
          plotProps = unpackPlotProps(child.props, nextContext);
        }

        // assign plotProps as a prop of children. If they are connectedToContainer
        // it will see plotProps and skip recomputing them.
        newProps = {plotProps};
        this.sectionVisible = this.sectionVisible || plotProps.isVisible;
        this.children.push(cloneElement(child, newProps));
      } else if (child.type === Info) {
        // Info panels do not change section visibility.
        this.children.push(child);
      } else {
        // custom UI currently forces section visibility.
        this.sectionVisible = true;
        this.children.push(child);
      }
    }

    this.menuPanel = menuPanel;
  }

  render() {
    return this.sectionVisible ? (
      <div className="section">
        <div className="section__heading">
          {this.props.name}
          {this.menuPanel}
        </div>
        {this.children}
      </div>
    ) : null;
  }
}

Section.propTypes = {
  children: PropTypes.node,
  name: PropTypes.string,
};

Section.contextTypes = containerConnectedContextTypes;
