import * as React from "react";
import { InputNumber, Slider } from "antd";
import { __ } from "../../utils";

class InputWithSlider extends React.Component {

    render() {
        const {
            label,
            name,
            value,
            min,
            max,
            step,
            handleChange,
            precision,
            formatter,
        } = this.props;

        return (
            <div className="input-with-slider calc-row">

                <div className="d-flex space-between">
                    <label>{label && __(label)}</label>
                    <InputNumber
                        name={name}
                        min={min}
                        step={step}
                        max={max}
                        defaultValue={value}
                        value={value}
                        formatter={(data) =>
                            `${value} ${__(formatter)}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                        }
                        precision={precision ? precision : 0}
                        onChange={handleChange.bind(this, name)}
                        size="large"
                    />
                </div>

                <Slider
                    name={name}
                    min={min}
                    step={step}
                    max={max}
                    value={value}
                    tipFormatter={null}
                    onChange={handleChange.bind(this, name)}
                />
            </div>
        );
    }
}

export default InputWithSlider;
