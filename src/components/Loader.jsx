/** @jsx jsx */

import * as React from "react";
import { keyframes, css, jsx } from "@emotion/core";

const commonValues = {
  loading: true,
  color: "#000000",
  css: "",
};

export function sizeDefaults(sizeValue) {
  return Object.assign({}, commonValues, { size: sizeValue });
}

const clip = keyframes`
  0% {transform: rotate(0deg) scale(1)}
  100% {transform: rotate(360deg) scale(1)}
`;

class Loader extends React.PureComponent {
  static defaultProps = sizeDefaults(35);

  style = () => {
    const { size, color } = this.props;

    return css`
      background: transparent !important;
      width: ${size};
      height: ${size};
      border-radius: 100%;
      border: 2px solid;
      border-color: ${color};
      border-bottom-color: transparent;
      display: inline-block;
      animation: ${clip} 0.75s 0s infinite linear;
      animation-fill-mode: both;
    `;
  };

  render() {
    const { loading, css } = this.props;

    return loading ? <div css={[this.style(), css]} role="Loading" /> : null;
  }
}

export default Loader;
