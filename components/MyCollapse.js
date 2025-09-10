import React from "react";
import { Collapse } from "antd";
import { __, regex } from "../utils";

const { Panel } = Collapse;

class MyCollapse extends React.Component {

    render() {
        const { posts } = this.props;

        const panelHeader = (title) => (
            <React.Fragment>
                <p className="mb-0 purple">{__("Асуулт")}:</p>
                {regex(title)}
            </React.Fragment>
        )

        return (
            <Collapse bordered={false} defaultActiveKey={['0']}>
                {posts.map((post, index) => (
                    <Panel header={panelHeader(post.title.rendered)} key={index}>
                        <p className="mb-0 purple">{__("Хариулт")}:</p>
                        <div dangerouslySetInnerHTML={{ __html: post.content.rendered }} />
                    </Panel>
                ))}
            </Collapse>
        )
    }
};


export default MyCollapse;
