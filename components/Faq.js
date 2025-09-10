import React from "react";
import { Tabs } from "antd";
import { __ } from "../utils";
import MyCollapse from "./MyCollapse";

const { TabPane } = Tabs;

class Faq extends React.Component {

    renderPosts(catId) {
        const { posts } = this.props;
        if (catId) {
            return posts.filter(post => {
                if (post.categories.includes(Number(catId))) {
                    return post
                }
                return null
            })
        }
        return posts;
    }

    renderTabPane() {
        const { childCategories } = this.props;

        return (childCategories.map(cat => (
            <TabPane tab={cat.name} key={cat.id}>
                <MyCollapse posts={this.renderPosts(cat.id)} />
            </TabPane>
        )))
    }

    render() {
        const { childCategories, posts } = this.props;
        if (!posts || posts.length === 0) {
            return null
        }

        return (
            <>
                <Tabs defaultActiveKey="1" className="mt-1">
                    {childCategories && childCategories.length > 1
                        ? this.renderTabPane()
                        : <MyCollapse posts={this.renderPosts()} />
                    }
                </Tabs>
                <style global jsx>{` .border.absolute {border: none; }`}</style>
            </>
        );
    }
};

export default Faq;
