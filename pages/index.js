import WPAPI from "wpapi";
import React, { useState } from "react";
import { Col, Row } from "antd";
import { Pagination } from "react-bootstrap";
import Layout from "../components/layouts/Layout";
import ReactPageScroller from "../components/react-page-scroller";
import ProductList from "../components/home/product-list";
import VendorList from "../components/home/vendor-list";
import Contact from "../components/home/contact";
import Sliders from "../components/home/sliders";
import Calculator from "../components/calculator/calculator";
import config from "../config";
import { __ } from "../utils";

const Index = ({ vendorPosts, branches, products, vendorCategories, sliderCat, sliders, loading, mainMenu, stickyMenu }) => {
  const [currentPage, setCurrentPage] = useState(null);
  const paginationClicked = (event) => {
    setCurrentPage(Number(event.target.name));
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleBeforePageChange = (number) => {
    console.log(number);
  };

  const getPagesNumbers = () => {
    const pageNumbers = [];

    for (let i = 1; i <= 5; i++) {
      pageNumbers.push(<Pagination.Item key={i} name={i - 1} active={i - 1 === currentPage} onClick={(e) => paginationClicked(e)}></Pagination.Item>);
    }
    return [...pageNumbers];
  };
  return (
    <Layout loading={loading} title={__("ХасЛизинг")} menu={mainMenu} stickyMenu={stickyMenu}>
      <ReactPageScroller
        pageOnChange={handlePageChange}
        onBeforePageScroll={handleBeforePageChange}
        customPageNumber={currentPage}
        renderAllPagesOnFirstRender={true}
      >
        <div className="component center" key="home-slider">
          <Sliders posts={sliders} sliderCategory={sliderCat} />
          <div className="icon-scroll" onClick={() => handlePageChange(1)}></div>
        </div>
        <div className="component center" key="home-products">
          <ProductList products={products} />
          <div className="icon-scroll" onClick={() => handlePageChange(2)}></div>
        </div>
        <div className="component center" key="home-vendors">
          <Row justify="center" className="w-100" gutter={[48, 0]}>
            <Col xs={22} sm={22} md={20} lg={18} xl={16}>
              <VendorList vendorCategories={vendorCategories} vendorPosts={vendorPosts} />
            </Col>
          </Row>
          <div className="icon-scroll" onClick={() => handlePageChange(3)}></div>
        </div>
        <div className="component center" key="home-calculator">
          <Row justify="center" className="w-100 relative" gutter={[48, 0]}>
            <Col xs={22} sm={22} md={20} lg={18} xl={16}>
              <Calculator isIndex={true} />
            </Col>
          </Row>
          <div className="icon-scroll" onClick={() => handlePageChange(4)}></div>
        </div>
        <div className="component center" key="home-contact">
          <Row justify="center" className="w-100 contact" gutter={[48, 0]}>
            <Col xs={22} sm={22} md={20} lg={18} xl={16}>
              <Contact branches={branches} />
            </Col>
          </Row>
        </div>
      </ReactPageScroller>
      <Pagination className="pagination-additional-class" bssize="large">
        {getPagesNumbers()}
      </Pagination>
      <style global jsx>{`
        .main-header,
        .dark .main-header {
          background: transparent;
        }
        .back-img:after {
          top: 0;
        }
      `}</style>
    </Layout>
  );
};

export async function getStaticProps(context) {
  try {
    const wp = new WPAPI({
      endpoint: config(context.locale).apiUrl,
    });

    const vendor = await wp
      .categories()
      .slug("vendor-companies")
      .embed()
      .then((data) => data[0])
      .catch((error) => {
        console.error("Error fetching vendor categories:", error);
        return null;
      });

    if (!vendor) {
      return {
        props: {
          vendorPosts: [],
          branches: [],
          products: [],
          vendorCategories: [],
          sliderCat: null,
          sliders: [],
        },
        revalidate: 300,
      };
    }

    const [vendorPosts, vendorCategories, branches, products, sliderCat] = await Promise.allSettled([
      wp.posts().categories(vendor.id).perPage(40).embed(),
      wp.categories().parent(vendor.id).embed(),
      wp.posts().categories(10).embed(),
      wp.posts().categories(3).embed(),
      wp
        .categories()
        .slug("slider")
        .embed()
        .then((data) => data[0]),
    ]);

    const slidersResult =
      sliderCat.status === "fulfilled" && sliderCat.value
        ? await wp
            .posts()
            .categories(sliderCat.value.id)
            .perPage(5)
            .embed()
            .catch(() => [])
        : [];

    return {
      props: {
        vendorPosts: vendorPosts.status === "fulfilled" ? vendorPosts.value : [],
        branches: branches.status === "fulfilled" ? branches.value : [],
        products: products.status === "fulfilled" ? products.value : [],
        vendorCategories: vendorCategories.status === "fulfilled" ? vendorCategories.value : [],
        sliderCat: sliderCat.status === "fulfilled" ? sliderCat.value : null,
        sliders: slidersResult,
      },
      revalidate: 300,
    };
  } catch (error) {
    console.error("Error in getStaticProps:", error);
    return {
      props: {
        vendorPosts: [],
        branches: [],
        products: [],
        vendorCategories: [],
        sliderCat: null,
        sliders: [],
      },
      revalidate: 300,
    };
  }
}

export default Index;
