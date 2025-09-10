import React from "react";
import { __ } from "../utils";
import { Col } from "antd";

class ProductCondition extends React.Component {
  renderRange(firstRange, lastRange, atr, gap) {
    const options = [];
    for (let i = firstRange; i <= lastRange; i += gap) {
      options.push(i);
    }

    return (
      <ul>
        <li>0{atr}</li>
        {options.map((option, index) => (
          <li key={index}>
            {option % 1 != 0 ? option.toFixed(1) : option}
            {atr}
          </li>
        ))}
      </ul>
    );
  }
  render() {
    const {
      firstRange,
      lastRange,
      gap,
      atr,
      name,
      firstValue,
      secondValue,
      degree,
    } = this.props;

    const degr = degree - 90;
    return (
      <Col xs={20} sm={20} md={8} lg={8} xl={8} className="text-center mb-2">
        <div className="measurement-wrapper">
          <img
            className="circle"
            src="/images/measurement1.svg"
            alt="measurement1"
          />
          {this.renderRange(firstRange, lastRange, atr, gap, secondValue)}
          <div
            className="needle-wrapper"
            style={{ transform: `rotate(${Number(degr)}deg)` }}
          >
            <img className="needle" src="/images/needle.png" alt="needle" />
          </div>
          <img className="dot" src="/images/dot.svg" alt="needle" />
        </div>
        <h3 className="text-center">
          <div>
            <b>
              {firstValue != 0 && firstValue}
              {secondValue &&
                secondValue != "хүртэл " &&
                firstValue != 0 &&
                `${atr} -`}{" "}
              {secondValue}
              {atr}
            </b>
          </div>
          <b>{name}</b>
        </h3>
      </Col>
    );
  }
}

export default ProductCondition;
