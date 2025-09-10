import React, { useState, useEffect } from "react";
import WPAPI from "wpapi";
import Error from "next/error";
import { Col, Divider, Row, Menu, Dropdown, Tabs } from "antd";
import config, { generateLink } from "../../config";
import Layout from "../../components/layouts/Layout";
import { getData, __, regex } from "../../utils";
import { productLabels } from "../../constants";
import ProductConditions from "../../components/ProductConditions";
import MyLink from "../../components/MyLink";
import FooterBtn from "../../components/FooterBtn";
import SendEmail from "../../components/SendEmail";
import useTranslation from "next-translate/useTranslation";

import { DownloadOutlined, ShareAltOutlined, FacebookFilled, TwitterOutlined, LinkedinFilled } from "@ant-design/icons";
import { FacebookShareButton, TwitterShareButton, LinkedinShareButton } from "react-share";

const { TabPane } = Tabs;

const PostDetail = ({ category, post, loading, mainMenu, stickyMenu }) => {
  const { t } = useTranslation("common");
  const [width, setWidth] = useState(0);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setWidth(window.innerWidth);
    }
  }, []);

  if (!post) {
    return <Error statusCode={404} />;
  }

  const renderContentChild = (value, className) => {
    let content = regex(value);
    return <div key={className} className={"contentSection " + className} dangerouslySetInnerHTML={{ __html: content }} />;
  };

  const renderACF = () => {
    const { acf } = post;
    if (!acf || Object.keys(acf).length === 0) return null;

    return Object.entries(acf).map(([key, value], index) => {
      if (
        key.includes("period") ||
        key.includes("fee") ||
        key.includes("interest_rate") ||
        key.includes("pre_payment") ||
        key.includes("header_img") ||
        key.includes("lease-form") ||
        key.includes("file") ||
        key.includes("file_individual") ||
        (value && value.length === 0)
      ) {
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
          <Col xs={20} xl={12}>
            {renderContentChild(value, className)}
          </Col>
          <Divider />
        </Row>
      );
    });
  };

  const renderContent = () => {
    if (post.template) {
      return (
        <>
          <Col xs={20} sm={20} lg={14}>
            <div align="center" className="my-2" dangerouslySetInnerHTML={{ __html: post.content.rendered }} />
          </Col>
          <Col span={20}>
            <ProductConditions post={post} />
          </Col>
          <Col span={18} className="post-detail">
            {renderACF()}
          </Col>
        </>
      );
    }

    return (
      <Col xs={20} lg={22} className="post-detail p-1">
        <div className="my-2" dangerouslySetInnerHTML={{ __html: post.content.rendered }} />
        <div style={{ overflowX: "auto" }} className="tse-table" dangerouslySetInnerHTML={{ __html: post.acf.table }} />
        {renderACF()}
      </Col>
    );
  };

  const renderEmail = () => {
    if (category.slug === "slider" || post.id === 712) return null;

    if (post.template) {
      return (
        <div className="d-flex justify-content-center">
          <SendEmail subject={post.title.rendered} content={post.content.rendered} acf={post.acf} />
          {post.acf.file_individual && (
            <a href={post.acf.file_individual} download target="_blank" className="ant-btn mt-2 ml-1">
              <DownloadOutlined /> {t("Иргэн")}
            </a>
          )}
          {post.acf.file && (
            <a href={post.acf.file} download target="_blank" className="ant-btn mt-2 ml-1">
              <DownloadOutlined /> {t("Байгууллага")}
            </a>
          )}
        </div>
      );
    }

    return <SendEmail subject={post.title.rendered} content={post.content.rendered} acf={post.acf} />;
  };

  const renderNewsShare = () => {
    const menu = (
      <Menu>
        <Menu.Item>
          <FacebookShareButton url={`https://xacleasing.mn/d/${post.slug}`} quote={regex(post.title.rendered)} hashtag="#xacleasing">
            <FacebookFilled className="mr-2" /> Facebook
          </FacebookShareButton>
        </Menu.Item>
        <Menu.Item>
          <TwitterShareButton url={`https://xacleasing.mn/d/${post.slug}`} hashtag={["#xacleasing"]} title={regex(post.title.rendered)}>
            <TwitterOutlined className="mr-2" /> Twitter
          </TwitterShareButton>
        </Menu.Item>
        <Menu.Item>
          <LinkedinShareButton url={`https://xacleasing.mn/d/${post.slug}`} title={regex(post.title.rendered)} source="https://xacleasing.mn/">
            <LinkedinFilled className="mr-2" /> Linkedin
          </LinkedinShareButton>
        </Menu.Item>
      </Menu>
    );

    return (
      <div className="d-flex justify-content-center">
        <Dropdown overlay={menu} placement="topCenter" trigger={["click"]}>
          <div className="ant-btn mt-2 ml-1 d-flex" onClick={(e) => e.preventDefault()}>
            <ShareAltOutlined />
            <span className="ml-1">{t("Түгээх")}</span>
          </div>
        </Dropdown>
      </div>
    );
  };

  const renderBackBtn = () => {
    return <MyLink title={t("Буцах")} slug={category.slug} type="c" className="back-btn" icon />;
  };

  const renderProviderTabs = () => {
    return (
      <Col xs={20} lg={22} className="post-detail p-1">
        <div className="my-2">
          <Tabs defaultActiveKey="1" className="mt-1">
            <TabPane tab={post.acf.tab1} key="1">
              <Row justify="center">
                <Col xs={24} lg={12}>
                  <div
                    className="my-2 providerTab"
                    dangerouslySetInnerHTML={{
                      __html: post.acf.avProduct,
                    }}
                  />
                </Col>
                <Col xs={24} lg={12}>
                  <div
                    className="my-2 providerTab"
                    dangerouslySetInnerHTML={{
                      __html: post.acf.avProduct2,
                    }}
                  />
                </Col>
              </Row>
            </TabPane>
            <TabPane tab={post.acf.tab2} key="2">
              <div
                className="my-2 providerTab"
                dangerouslySetInnerHTML={{
                  __html: post.acf.requirement,
                }}
              />
            </TabPane>
            <TabPane tab={post.acf.tab3} key="3">
              <div
                className="my-2 providerTab"
                dangerouslySetInnerHTML={{
                  __html: post.acf.materials,
                }}
              />
            </TabPane>
          </Tabs>
        </div>
      </Col>
    );
  };

  return (
    <Layout
      menu={mainMenu}
      loading={loading}
      title={regex(post.title.rendered)}
      image={post.acf.headerImage || getData(post._embedded, "image")}
      stickyMenu={stickyMenu}
    >
      <div className="content-wrapper">
        <div className="w-100 page-wrapper transparent">
          <Row justify="center" className="h-100">
            <Col xs={22} sm={22} md={20} lg={18} xl={16} className="h-100">
              <div className="page-wrapper-content h-100">
                <Row justify="center pt-2">
                  <Col span={22}>
                    <h2 className="title my-2 pl-2 upper-case">{regex(post.title.rendered)}</h2>
                    {(post._embedded["wp:featuredmedia"] || post.acf.header_img) && (
                      <img
                        className="w-100 p-1"
                        src={post.acf.header_img ? post.acf.header_img : getData(post._embedded, "image")}
                        alt={post.title.rendered}
                      />
                    )}
                  </Col>
                  {post.acf.provider ? renderProviderTabs() : renderContent()}
                </Row>
                {category.slug !== "news" ? renderEmail() : renderNewsShare()}
              </div>
            </Col>
          </Row>
        </div>
        <div className="footer-content">
          <Row justify={width < 576 ? "center" : "end"} className="w-100">
            <Col xs={22} sm={12} md={10} lg={12} xl={16}>
              {category && renderBackBtn()}
            </Col>
            <Col xs={22} sm={12} md={7} lg={6} xl={4}>
              {post.template && post.acf.lease_form ? (
                <FooterBtn btn={"Түрээсийн хүсэлт илгээх"} url={post.acf.lease_form} />
              ) : (
                post.acf.footer_btn && post.acf.footer_btn.btn_text && <FooterBtn btn={post.acf.footer_btn} />
              )}
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
};

PostDetail.getInitialProps = async (context) => {
  const slug = context.query.slug;
  const wp = new WPAPI({ endpoint: config(context).apiUrl });

  const apiMethod = wp.posts();
  const post = await apiMethod
    .slug(slug)
    .embed()
    .then((data) => data[0]);

  if (post) {
    const category = await wp.categories().id(post.categories[0]).perPage(1).embed();

    return { post, category };
  }

  return { post };
};

export default PostDetail;
