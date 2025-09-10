import React, { useState, useEffect } from "react";
import { Col, Menu, Modal, Row } from "antd";
import { getData, regex } from "../../utils";
import Slider from "react-slick";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import useTranslation from "next-translate/useTranslation";

function VendorList(props) {
  const { t } = useTranslation("common");
  const [active, setActive] = useState(4);
  const [activeName, setActiveName] = useState("Бүгд");
  const [posts, setPosts] = useState(props.vendorPosts || []);
  const [visible, setVisible] = useState(false);
  const [modalPost, setModalPost] = useState({});

  const renderData = () => {
    const { childPosts = [], vendorPosts = [] } = props;

    if (Number(active) === 4 && vendorPosts.length > 0) return vendorPosts;

    if (vendorPosts.length < 1) {
      return childPosts.filter((post) => post.categories.includes(Number(active)));
    }

    return vendorPosts.filter((post) => post.categories.includes(Number(active)));
  };

  const handleClick = (e) => {
    setActive(Number(e.key));
    setActiveName(e.item.props.children);
  };

  const renderModal = () => {
    if (!modalPost || !modalPost.title) return null;
    return (
      <Modal
        title={regex(modalPost.title.rendered)}
        open={visible}
        onCancel={() => setVisible(false)}
        footer={null}
        width={992}
        wrapClassName="vendor-modal"
      >
        <div dangerouslySetInnerHTML={{ __html: modalPost.content.rendered }} />
      </Modal>
    );
  };

  const renderPostItem = (post) => {
    if (!post || post.categories.includes(17)) return null;

    return (
      <div
        key={post.id}
        className="slider-item slider-logo"
        onClick={() => {
          setModalPost(post);
          setVisible(true);
        }}
      >
        <img className="dark-img" src={getData(post._embedded, "image")} alt={post.title.rendered} />
        <img className="light-img" src={post.acf?.logo || getData(post._embedded, "image")} alt={post.title.rendered} />
      </div>
    );
  };

  const renderMenuList = () => {
    const { childCategories = [], vendorCategories = [] } = props;
    const categories = childCategories?.length > 0 ? childCategories : vendorCategories;

    if (!categories || categories.length === 0) return null;

    return categories.map((subcat) => (
      <Menu.Item key={subcat.id} className={subcat.id === active ? "ant-menu-item-selected" : ""}>
        {subcat.name}
      </Menu.Item>
    ));
  };

  const dataLength = renderData().length;
  const settings = {
    slidesToShow: 4,
    slidesToScroll: 1,
    speed: 500,
    rows: dataLength > 4 ? 2 : 1,
    infinite: dataLength > 8,
    autoplay: dataLength > 0,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
    responsive: [
      { breakpoint: 1200, settings: { slidesToShow: 3 } },
      { breakpoint: 991, settings: { slidesToShow: 2 } },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 2,
          rows: 1,
          autoplay: false,
        },
      },
    ],
  };

  function SamplePrevArrow({ onClick }) {
    return (
      <div className="border-round custom-arrow prv" onClick={onClick}>
        <LeftOutlined />
      </div>
    );
  }

  function SampleNextArrow({ onClick }) {
    return (
      <div className="border-round custom-arrow nxt" onClick={onClick}>
        <RightOutlined />
      </div>
    );
  }

  return (
    <>
      <h2 className="title pb-2 purple mt-4">{t("ХАМТРАН АЖИЛЛАДАГ НИЙЛҮҮЛЭГЧ БАЙГУУЛЛАГУУД")}</h2>
      <Row justify="center" align="middle" gutter={32} className={`${props.type !== "inside" ? "mt-2" : ""} overflow`}>
        <Col xs={24} sm={10} lg={8}>
          <Menu onClick={handleClick} defaultSelectedKeys={[String(active)]} mode="inline" className="tabMenu">
            <Menu.Item key="4" className={active === 4 ? "ant-menu-item-selected" : ""}>
              {t("Бүгд")}
            </Menu.Item>
            {renderMenuList()}
          </Menu>
        </Col>
        <Col xs={24} sm={14} lg={16} className="vendorlist">
          {dataLength > 0 ? (
            <Slider className="vendor-slider" {...settings}>
              {renderData().map(renderPostItem)}
            </Slider>
          ) : (
            <div className="no-data">{t("Мэдээлэл байхгүй байна")}</div>
          )}
          {renderModal()}
        </Col>
      </Row>
    </>
  );
}

export default VendorList;
