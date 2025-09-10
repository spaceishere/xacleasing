import WPAPI from "wpapi";
import React, { useState } from "react";
import { Col, Row, Tabs, Collapse, Steps } from "antd";
import Layout from "../../components/layouts/Layout";
import { __, regex, restTime, addDays } from "../../utils";
import config from "../../config";
import MyLink from "../../components/MyLink";
const { TabPane } = Tabs;
const { Panel } = Collapse;
const { Step } = Steps;

const wp1 = new WPAPI({
  endpoint: config().apiUrl,
});

class OpenVacancy extends React.Component {
  static async getInitialProps(context) {
    try {
      const wp = new WPAPI({ endpoint: config(context).apiUrl });
      const category = await wp
        .categories()
        .slug("career")
        .embed()
        .then((data) => {
          return data[0];
        })
        .catch((error) => {
          console.error("Error fetching career category:", error);
          return null;
        });

      if (category) {
        const [childCategories, categories, posts] = await Promise.allSettled([
          wp.categories().parent(category.id).embed(),
          wp.categories().parent(category.parent).embed(),
          wp.posts().categories(category.id).perPage(100).embed(),
        ]);

        return {
          category,
          categories: categories.status === "fulfilled" ? categories.value : [],
          childCategories: childCategories.status === "fulfilled" ? childCategories.value : [],
          posts: posts.status === "fulfilled" ? posts.value : [],
        };
      }
      return {
        category: null,
        categories: [],
        childCategories: [],
        posts: [],
      };
    } catch (error) {
      console.error("Error in getInitialProps:", error);
      return {
        category: null,
        categories: [],
        childCategories: [],
        posts: [],
      };
    }
  }

  state = {
    childCatVacancy: {},
  };

  componentDidMount() {
    wp1
      .categories()
      .parent(104)
      .embed()
      .then((data) => {
        this.setState({ childCatVacancy: data });
      })
      .catch((err) => console.log(err));
  }

  renderPosts(catId) {
    const { posts } = this.props;
    if (catId) {
      return posts.filter((post) => {
        if (post.categories.includes(Number(catId))) {
          return post;
        }
        return null;
      });
    }
    return posts;
  }

  renderTabPane() {
    const { childCategories } = this.props;

    return childCategories.map((cat) => (
      <TabPane tab={cat.name} key={cat.id}>
        {cat.slug === "general-information" && <HrCollapse posts={this.renderPosts(cat.id)} />}
        {cat.slug === "selection-stage" && <SelectionStage posts={this.renderPosts(cat.id)} />}
        {cat.slug === "open-vacancy" && <Vacancy categoriesVacancy={this.state.childCatVacancy} posts={this.renderPosts(cat.id)} />}
      </TabPane>
    ));
  }

  render() {
    const { childCategories, posts, category, mainMenu, stickyMenu } = this.props;
    if (!posts || posts.length === 0) {
      return null;
    }

    return (
      <Layout title={category.name} loading="false" menu={mainMenu} stickyMenu={stickyMenu}>
        <div className="content-wrapper">
          <div className="w-100 page-wrapper transparent">
            <Row justify="center" className="w-100">
              <Col xs={22} sm={22} md={20} lg={18} xl={16}>
                <div className="page-wrapper p-3 w-100">
                  <h2 className="title mb-2 upper-case"> {__("Хүний нөөц")}</h2>
                  <Tabs defaultActiveKey="1" className="mt-1">
                    {childCategories && childCategories.length > 1 && this.renderTabPane()}
                  </Tabs>
                </div>
              </Col>
            </Row>
          </div>
        </div>
        <style global jsx>{`
          .border.absolute {
            border: none;
          }
        `}</style>
      </Layout>
    );
  }
}
const HrCollapse = (props) => {
  return (
    <Collapse bordered={false} defaultActiveKey={["0"]}>
      {props.posts.map((post, index) => (
        <Panel header={regex(post.title.rendered)} key={index}>
          <div dangerouslySetInnerHTML={{ __html: post.content.rendered }} />
        </Panel>
      ))}
    </Collapse>
  );
};
const SelectionStage = (props) => {
  const [innitial, setCurrent] = useState(0);
  return (
    <Steps type="navigation" responsive="true" current={innitial} onChange={(current) => setCurrent(current)} className="site-navigation-steps ts">
      {props.posts.map((post, index) => (
        <Step key={index} description={post.title.rendered} />
      ))}
    </Steps>
  );
};
const Vacancy = (props) => {
  function getStatusFromCategory(categories) {
    let stat = "";
    for (let el of props.categoriesVacancy) {
      if (categories.includes(el.id)) {
        stat = el.name;
      }
    }
    return stat;
  }

  function getStatus(end, duration) {
    const deadline = new Date(end);
    const status =
      restTime(deadline) > 0
        ? __("Өргөдөл хүлээн авч байна")
        : restTime(addDays(deadline, duration)) > 0
          ? __("Сонгон шалгаруулалт явагдаж байна")
          : __("Сонгон шалгаруулалт дууссан");
    if (status) return status;
    else return difference_In_Days;
  }
  return (
    <Collapse bordered={false} collapsible="false">
      {props.posts.map((post, index) => (
        <Panel header={regex(post.title.rendered)} key={index}>
          <Row justify="end">
            <Col lg={8} md={6} xs={12}>
              {" "}
              <b>Явц</b>
            </Col>
            <Col lg={16} md={18} xs={12}>
              {" "}
              <p>
                {!post.acf.opendate || !post.acf.closedate || !post.acf.selectionduration
                  ? getStatusFromCategory(post.categories)
                  : getStatus(post.acf.closedate, post.acf.selectionduration)}
              </p>
            </Col>
          </Row>
          <Row justify="end">
            <Col lg={8} md={6} xs={12}>
              {" "}
              <b>{__("Анкет хүлээн авах сүүлийн хугацаа")}</b>
            </Col>
            <Col lg={12} md={14} xs={12}>
              {" "}
              <p>{regex(post.acf.closedate)}</p>
            </Col>
            <Col lg={4} md={4} sm={6} xs={12}>
              {" "}
              <MyLink title={__("Дэлгэрэнгүй")} slug={post.slug} type="career-detail" className="more-btn" icon />
            </Col>
          </Row>
        </Panel>
      ))}
    </Collapse>
  );
};

export default OpenVacancy;
