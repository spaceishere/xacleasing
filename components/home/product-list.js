import React from "react";
import { Col, Row } from "antd";
import { getData } from "../../utils";
import Slider from "react-slick";
import ProductItem from "../ProductItem";
import useTranslation from "next-translate/useTranslation";

function ProductList({ products }) {
  const { t } = useTranslation("common");

  const settings1 = {
    className: "product-slide",
    autoplay: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    arrows: false,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 3 } },
      { breakpoint: 768, settings: { slidesToShow: 2 } },
      { breakpoint: 480, settings: { slidesToShow: 1 } },
    ],
  };

  if (!products || products.length === 0) {
    return (
      <Row justify="center" className="w-100 relative" gutter={[48, 0]}>
        <Col xs={22} sm={22} md={20} lg={18} xl={16}>
          <div style={{ textAlign: "center", padding: "4rem 2rem" }}>
            <h2 className="title pb-2 purple">{t("БҮТЭЭГДЭХҮҮН ҮЙЛЧИЛГЭЭ")}</h2>
            <p style={{ fontSize: "1.1rem", opacity: 0.7, marginTop: "2rem" }}>
              {t("Бидний бүтээгдэхүүн, үйлчилгээний мэдээлэл удахгүй энд харагдах болно")}
            </p>
          </div>
        </Col>
      </Row>
    );
  }

  return (
    <Row justify="center" className="w-100 relative" gutter={[48, 0]}>
      <Col xs={22} sm={22} md={20} lg={18} xl={16}>
        <h2 className="title">{t("БҮТЭЭГДЭХҮҮН ҮЙЛЧИЛГЭЭ")}</h2>
        <Slider {...settings1}>
          {products.map((product) => (
            <ProductItem
              key={product.id}
              title={product.title?.rendered}
              img={getData(product._embedded, "image")}
              slug={product.slug}
              descr={product.excerpt?.rendered || ""}
            />
          ))}
        </Slider>
      </Col>
    </Row>
  );
}

export default ProductList;

//
