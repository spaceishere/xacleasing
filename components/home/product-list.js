import React from "react";
import { Col, Row } from "antd";
import { getData } from "../../utils";
import Slider from "react-slick";
import ProductItem from "../ProductItem";
import useTranslation from "next-translate/useTranslation";

// Static products data with proper links to leasing pages
const staticProducts = [
  {
    id: "machinery-leasing",
    title: { rendered: "МАШИН МЕХАНИЗМЫН ЛИЗИНГ" },
    slug: "machinery-leasing",
    excerpt: {
      rendered: "Уул уурхай, зам барилга, ачаа тээврийн үйлчилгээнд ашиглагдах тоног төхөөрөмж, техник, тусгай зориулалтын машин механизмын лизинг",
    },
    link: "/machinery-leasing",
    img: "/images/back.jpg",
  },
  {
    id: "manufacturing-equipment-leasing",
    title: { rendered: "ҮЙЛДВЭРЛЭЛИЙН ТОНОГ ТӨХӨӨРӨМЖИЙН ЛИЗИНГ" },
    slug: "manufacturing-equipment-leasing",
    excerpt: { rendered: "Үйлдвэрлэл, үйлчилгээний тоног төхөөрөмжийн хамгийн таатай нөхцөлтэй лизингийн үйлчилгээ" },
    link: "/manufacturing-equipment-leasing",
    img: "/images/back.jpg",
  },
  {
    id: "medical-equipment-leasing",
    title: { rendered: "ЭМНЭЛЭГИЙН ТОНОГ ТӨХӨӨРӨМЖИЙН ЛИЗИНГ" },
    slug: "medical-equipment-leasing",
    excerpt: { rendered: "Эмчилгээ, оношилгооны тоног төхөөрөмжийн хамгийн таатай нөхцөлтэй лизингийн үйлчилгээ" },
    link: "/medical-equipment-leasing",
    img: "/images/back.jpg",
  },
  {
    id: "new-car-leasing",
    title: { rendered: "ШИНЭ АВТОМАШИНЫ ЛИЗИНГ" },
    slug: "new-car-leasing",
    excerpt: { rendered: "Албан ёсны борлуулагч байгууллагуудаас шинэ автомашины хамгийн таатай нөхцөлтэй лизингийн үйлчилгээ" },
    link: "/new-car-leasing",
    img: "/images/back.jpg",
  },
];

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

  // Always use static products instead of WordPress data
  const productsToShow = staticProducts;

  return (
    <Row justify="center" className="w-100 relative" gutter={[48, 0]}>
      <Col xs={22} sm={22} md={20} lg={18} xl={16}>
        <h2 className="title">{t("БҮТЭЭГДЭХҮҮН ҮЙЛЧИЛГЭЭ")}</h2>
        <Slider {...settings1}>
          {productsToShow.map((product) => (
            <ProductItem
              key={product.id}
              title={product.title?.rendered}
              img={product.img}
              slug={product.slug}
              descr={product.excerpt?.rendered || ""}
              link={product.link}
            />
          ))}
        </Slider>
      </Col>
    </Row>
  );
}

export default ProductList;

//
