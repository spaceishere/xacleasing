import React from "react";
import { CloseOutlined } from '@ant-design/icons';

class Marker extends React.Component {

    renderContent() {
        const {
            title,
            addr,
            img,
        } = this.props;

        return (
            <div className="branch-info">
                <div className="d-flex">
                    <img src={img} alt={title} />
                    <div className="branch-descr" dangerouslySetInnerHTML={{ __html: addr }} />
                </div>
            </div>
        )
    }
    render() {
        const { currentMarkerTitle } = this.props;
        return (
            <div>
                <img className="marker" src="/images/marker.png" alt={this.props.title} onClick={this.props.onClick.bind(this, this.props.title)} />
                <div
                    className='marker-content'
                    style={{ display: currentMarkerTitle === this.props.title ? 'block' : 'none' }}
                >
                    <div className="arrow" />
                    <CloseOutlined className="close" onClick={this.props.onClick.bind(this, '')} />
                    {this.renderContent()}
                </div>
            </div>


            // <Popover className="branch-info" content={this.renderContent()} title={this.props.title} trigger="click">
            //     <img className="marker" src="/images/marker.png" alt={this.props.title} />
            // </Popover>
        );
    }
}

export default Marker;
