import React, { useState } from "react";
import WPAPI from "wpapi";
import Error from "next/error";
import { Col, Divider, Row } from "antd";
import config, { generateLink } from "../../config";
import Layout from "../../components/layouts/Layout";
import { getData, __, regex } from "../../utils";
import { productLabels } from "../../constants";
import MyLink from "../../components/MyLink";
import { RightOutlined } from "@ant-design/icons";

export default class extends React.Component {
  state = { visible: false, content: null, width: window.innerWidth };
  static async getInitialProps(context) {
    const slug = context.query.slug;
    const wp = new WPAPI({ endpoint: config(context).apiUrl });

    let apiMethod = wp.posts();
    const post = await apiMethod
      .slug(slug)
      .embed()
      .then((data) => {
        return data[0];
      });

    if (post) {
      let category = await wp
        .categories()
        .id(post.categories[0])
        .perPage(1)
        .embed();

      return { post, category };
    }

    return { post };
  }

  renderContent() {
    const { post } = this.props;
    return (
      <Col xs={22} sm={22} md={20} lg={18} xl={16} className="post-detail">
        <div
          className="my-2"
          dangerouslySetInnerHTML={{
            __html: post.content.rendered,
          }}
        />
        {this.renderACF()}
      </Col>
    );
  }

  renderContentChild(value, className) {
    let content = regex(value);
    return (
      <div
        key={className}
        className={"contentSection " + className}
        dangerouslySetInnerHTML={{ __html: content }}
      />
    );
  }

  renderACF() {
    const { post } = this.props;
    const { acf } = post;
    if (!acf || Object.keys(acf).length === 0) {
      return null;
    }

    return Object.entries(acf).map(([key, value], index) => {
      if (key.includes("header_img") || (value && value.length === 0)) {
        return null;
      }

      let className = "";
      let replacedName = "";
      productLabels.map((pLabel) => {
        if (pLabel.label === key) {
          className = pLabel.label;
          replacedName = pLabel.value;
        }
      });
      if (!replacedName || replacedName.length === 0) {
        return null;
      }
      return (
        <Row key={index}>
          <Col xs={20} xl={10}>
            <h3 className="subTitle">{__(replacedName)}:</h3>
          </Col>
          <Col m={20} xl={14}>
            {this.renderContentChild(value, className)}
          </Col>
          <Divider />
        </Row>
      );
    });
  }

  renderBackBtn() {
    const { category } = this.props;
    return (
      <MyLink title={__("Буцах")} type="career" className="back-btn" icon />
    );
  }

  render() {
    const { category, post, loading, mainMenu, stickyMenu } = this.props;

    if (!post) {
      return <Error statusCode={404} />;
    }
    return (
      <Layout
        loading={loading}
        title={regex(post.title.rendered)}
        image={post.acf.headerImage || getData(post._embedded, "image")}
        menu={mainMenu}
        stickyMenu={stickyMenu}
      >
        <div className="content-wrapper">
          <div className="w-100 page-wrapper transparent">
            <Row justify="center" className="h-100">
              <Col xs={22} sm={22} md={20} lg={18} xl={16} className="h-100">
                <div className="page-wrapper-content h-100">
                  <Row justify="center pt-2">
                    <Col span={22}>
                      <h2 className="my-2 upper-case title pl-2">
                        {post.title.rendered}
                      </h2>
                    </Col>
                    {this.renderContent()}
                  </Row>
                </div>
              </Col>
            </Row>
          </div>
          <div className="footer-content">
            <Row
              justify={Number(this.state.width) < 769 ? "center" : "end"}
              className="w-100"
            >
              <Col xs={22} sm={12} md={10} lg={12} xl={16}>
                {category && this.renderBackBtn()}
              </Col>
              <Col xs={22} sm={12} md={7} lg={6} xl={4}>
                <div className="footer-btn-wrapper">
                  <a href={generateLink(`/p/application-form`)}>
                    {__("Анкет бөглөх")}
                    <RightOutlined />
                  </a>
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
