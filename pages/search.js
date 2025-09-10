import React from "react";
import Layout from "../components/layouts/Layout";
import Config from "../config";
import axios from "axios";
import { Row, Col, Modal, Tabs, Input } from "antd";
import Link from "next/link";
import Router from "next/router";
import { withRouter } from "next/router";
import { __, regex } from "../utils";

const { TabPane } = Tabs;
const { Search } = Input;

class SearchComponent extends React.Component {
  state = {
    value: this.props.router.query.key,
    loading: false,
    results: [],
    resultsPage: [],
    visible: false,
    modalPost: {},
  };

  componentDidMount() {
    return this.renderSearchResult();
  }
  hideModal = () => {
    this.setState({
      visible: false,
    });
  };

  handleSearchValue = (value) => {
    this.setState({ value }, () => {
      Router.push({
        pathname: "/search",
        query: { key: value },
      });
      return this.renderSearchResult();
    });
  };

  renderSearchResult() {
    const { value } = this.state;

    axios
      .get(`${Config().apiUrl}/wp/v2/posts?per_page=100&search=${value}`)
      .then((res) =>
        this.setState({
          results: res.data,
          loading: true,
        })
      )
      .catch((err) => console.log(err));
    axios
      .get(`${Config().apiUrl}/wp/v2/pages?per_page=100&search=${value}`)
      .then((res) =>
        this.setState({
          resultsPage: res.data,
          loading: true,
        })
      )
      .catch((err) => console.log(err));
  }

  renderResults(item, i, isVendor) {
    const href =
      item.type === "post"
        ? `/d/[slug]`
        : item.type === "page"
        ? `/p/[slug]`
        : `/c/[slug]`;

    const url =
      item.type === "post"
        ? `/d/${item.slug}`
        : item.type === "page"
        ? `/p/${item.slug}`
        : `/c/${item.slug}`;
    if (isVendor) {
      return (
        <li
          key={i}
          className="single-result"
          onClick={() =>
            this.setState({
              visible: true,
              modalPost: item,
            })
          }
        >
          <Row>
            <Col md={18}>
              <h3>{regex(item.title.rendered)}</h3>
              <div
                dangerouslySetInnerHTML={{
                  __html: item.excerpt.rendered,
                }}
              />
            </Col>
          </Row>
        </li>
      );
    }
    return (
      <li key={i} className="single-result">
        <Row>
          <Col md={18}>
            <Link href={href} as={url}>
              <a rel="noopener noreferrer nofollow">
                <h3>{regex(item.title.rendered)}</h3>
                <div
                  dangerouslySetInnerHTML={{
                    __html: item.excerpt.rendered,
                  }}
                />
              </a>
            </Link>
          </Col>
        </Row>
      </li>
    );
  }

  renderModal() {
    const { modalPost } = this.state;

    if (!modalPost || !modalPost.title) {
      return null;
    }

    return (
      <Modal
        title={regex(modalPost.title.rendered)}
        visible={this.state.visible}
        onCancel={this.hideModal}
        footer={null}
        width={992}
        wrapClassName="vendor-modal"
      >
        <div dangerouslySetInnerHTML={{ __html: modalPost.content.rendered }} />
      </Modal>
    );
  }

  renderContent() {
    const { results, resultsPage, loading, value } = this.state;

    if (loading && results.length === 0 && resultsPage.length === 0) {
      return (
        <h4 className="mt-1">
          {__("Хайлтад илэрц олдсонгүй. Өөр түлхүүр үг ашиглаж үзнэ үү")}.
        </h4>
      );
    }
    if (!value) {
      return <h4 className="mt-1">{__("Та хайх утгаа оруулна уу")}.</h4>;
    }

    const postVendor = results.filter((result) =>
      result.categories.includes(4)
    );
    const vendorLength = postVendor.length + resultsPage.length;

    const postProduct = results.filter((result) =>
      result.categories.includes(3)
    );
    const productLength = postProduct.length + resultsPage.length;

    const postOther = results.filter(
      (result) =>
        !result.categories.includes(3) ||
        !result.categories.includes(6) ||
        !result.categories.includes(7) ||
        !result.categories.includes(8) ||
        !result.categories.includes(9) ||
        !result.categories.includes(4)
    );
    const otherLength = postOther.length + resultsPage.length;

    return (
      <>
        <Tabs className="my-20" defaultActiveKey="1">
          <TabPane
            className="mt-20"
            tab={`${__("Бүтээгдэхүүн үйлчилгээ")} (${productLength})`}
            key="1"
          >
            {postProduct.map((item, i) => {
              return this.renderResults(item, i);
            })}
            {resultsPage.map((item, i) => {
              return this.renderResults(item, i);
            })}
          </TabPane>
          <TabPane
            className="mt-20"
            tab={`${__("Нийлүүлэгч")} (${vendorLength})`}
            key="2"
          >
            {postVendor.map((item, i) => {
              return this.renderResults(item, i, true);
            })}
            {resultsPage.map((item, i) => {
              return this.renderResults(item, i, true);
            })}
          </TabPane>
          <TabPane
            className="mt-20"
            tab={`${__("Бусад")} (${otherLength})`}
            key="3"
          >
            {postOther.map((item, i) => {
              return this.renderResults(item, i);
            })}
            {resultsPage.map((item, i) => {
              return this.renderResults(item, i);
            })}
          </TabPane>
        </Tabs>
        {this.renderModal()}
      </>
    );
  }

  render() {
    const { loading, mainMenu, stickyMenu } = this.props;
    return (
      <Layout
        loading={loading}
        title={__("Хайлт")}
        menu={mainMenu}
        stickyMenu={stickyMenu}
      >
        <div className="content-wrapper">
          <div className="w-100 page-wrapper transparent">
            <Row justify="center" className="h-100">
              <Col xs={24} sm={22} md={20} lg={20} xl={16} className="h-100">
                <div className="page-wrapper-content h-100">
                  <Row justify="center" className="pt-2">
                    <Col span={22} justify="center" className="center">
                      <h2 className="my-2 title upper-case">{__("Хайлт")}</h2>

                      <Search
                        className="search"
                        placeholder={__("Хайх утга аа оруулна уу")}
                        defaultValue={this.state.value}
                        onSearch={(value) => this.handleSearchValue(value)}
                        enterButton
                      />
                      {this.renderContent()}
                    </Col>
                  </Row>
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

export default withRouter(SearchComponent);
