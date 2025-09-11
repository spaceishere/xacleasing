import React, { useState, useEffect } from "react";
import { Col, Divider, Row, Menu, Dropdown, Tabs } from "antd";
import Layout from "../components/layouts/Layout";
import { __, regex } from "../utils";
import { productLabels } from "../constants";
import ProductConditions from "../components/ProductConditions";
import MyLink from "../components/MyLink";
import FooterBtn from "../components/FooterBtn";
import SendEmail from "../components/SendEmail";
import useTranslation from "next-translate/useTranslation";

import { ShareAltOutlined, FacebookFilled, TwitterOutlined, LinkedinFilled } from "@ant-design/icons";
import { FacebookShareButton, TwitterShareButton, LinkedinShareButton } from "react-share";

const { TabPane } = Tabs;

// Static data for manufacturing equipment leasing
const staticPostData = {
  id: "manufacturing-equipment-leasing-static",
  title: { rendered: "ҮЙЛДВЭРЛЭЛИЙН ТОНОГ ТӨХӨӨРӨМЖИЙН ЛИЗИНГ" },
  content: {
    rendered: `
      <p>Эрхэм та үйлдвэрлэл, үйлчилгээний тоног төхөөрөмж авахаар төлөвлөж байгаа бол бид танд хамгийн таатай нөхцөлтэй шуурхай, хялбар Лизингийн үйлчилгээг санал болгож байна.</p>
    
    `,
  },
  featured_media: "/images/logo.png",
  date: "2024-01-01T00:00:00.000Z",
  modified: "2024-01-01T00:00:00.000Z",
  categories: [3],
  template: "templates/template-cover.php",
  acf: {
    requirements: `
      <ul class="uk-list uk-list-bullet tavigdah_show">
        <li>Тухайн бизнесийн үйл ажиллагаагаа 12 сар эрхэлж буй.</li>
        <li>Идэвхитэй хугацаа хэтэрсэн болон муу зээлийн түүхгүй байх.</li>
        <li>Ашиг орлогоороо түрээсийн төлбөрийг бүрэн төлөх боломжтой байх.</li>
        <li>Үйлдвэрлэлийн тоног төхөөрөмжийг ашиглах үйлдвэрлэлийн төлөвлөгөө байх.</li>
        <li>Техникийн ур чадвар, мэргэжлийн боловсон хүчинтэй байх.</li>
      </ul>
    `,
    individuals: `
      <ul class="uk-list uk-list-bullet burduuleh_show">
        <li>Иргэний үнэмлэхний (ИҮ) хуулбар;</li>
        <li>Орлого тодорхойлох баримтууд:
          <ol class="uk-list uk-list-bullet burduuleh_show">
            <li>Дансны хуулга;</li>
            <li>Ажлын гэрээ;</li>
            <li>Өөрийн машин механизмын гэрчилгээ;</li>
            <li>Бизнес эрхлэгчийн бүртгэлийн гэрчилгээ;</li>
            <li>Үйлдвэрлэлийн лицензийн хуулбар (шаардлагатай бол).</li>
          </ol>
        </li>
      </ul>
    `,
    legal_entities: `
      <ul class="uk-list uk-list-bullet aan_show">
        <li>ААН – ийн гэрчилгээ, дүрэм;</li>
        <li>Гүйцэтгэх захирлын ИҮ-ний хуулбар;</li>
        <li>Сүүлийн 2 жилийн санхүүгийн тайлан;</li>
        <li>Эрх бүхий этгээдийн зөвшөөрөл;</li>
        <li>Бизнесийн орлого тодорхойлох баримтууд;</li>
        <li>Үйлдвэрлэлийн тоног төхөөрөмж ашиглах төлөвлөгөө, бизнес төлөвлөгөө;</li>
        <li>Үйлдвэрлэлийн лицензийн хуулбар (шаардлагатай бол).</li>
      </ul>
    `,
    interest_rate: { first_value: "1.6", second_value: "1.8", gap: "0.1", degree: "90" },
    period: { value: "4", degree: "90" },
    fee: "0.5",
    header_img: "/images/back.jpg",
    pre_payment: { first_value: "20", gap: "10", degree: "90" },
    img: "/images/back.jpg",
    lease_form: "lease-app-manufacturing-equipment",
    footer_btn: { btn_text: "", btn_id: "", file: false },
    labels: {
      requirements: "Тавигдах шалгуур",
      individuals: "Иргэн бүрдүүлэх материал",
      legal_entities: "Байгууллагын бүрдүүлэх материал",
      interest_rate: "Хүү (Сарын)",
      period: "Хугацаа",
      fee: "Үйлчилгээний шимтгэл",
      header_img: "Толгой зураг",
      pre_payment: "Урьдчилгаа",
      img: "Том зураг",
      lease_form: "Хүсэлт холбох",
      footer_btn: "footer_btn",
    },
  },
  _embedded: {
    "wp:featuredmedia": [
      {
        source_url: "/images/logo.png",
      },
    ],
  },
};

const ManufacturingEquipmentLeasing = ({ mainMenu, stickyMenu }) => {
  const { t } = useTranslation("common");
  const [width, setWidth] = useState(0);
  const post = staticPostData;

  useEffect(() => {
    if (typeof window !== "undefined") {
      setWidth(window.innerWidth);
    }
  }, []);

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
        key.includes("footer_btn") ||
        key.includes("labels") ||
        key.includes("btn") ||
        key.includes("img") ||
        key.includes("file")
      )
        return null;

      const label = acf.labels && acf.labels[key] ? acf.labels[key] : productLabels[key] || key;

      return (
        <div key={index} className="py-3">
          <Divider className="m-0" />
          <h3 className="title my-3 purple">{label}</h3>
          {renderContentChild(value, key)}
        </div>
      );
    });
  };

  const renderProductTable = () => {
    const { acf } = post;
    if (!acf) return null;

    return <ProductConditions post={post} />;
  };

  const shareUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/manufacturing-equipment-leasing`
      : "https://xacleasing.mn/manufacturing-equipment-leasing";

  const menu = (
    <Menu>
      <Menu.Item key="facebook">
        <FacebookShareButton url={shareUrl} quote={post.title.rendered}>
          <FacebookFilled style={{ fontSize: "16px", marginRight: "8px" }} />
          Facebook
        </FacebookShareButton>
      </Menu.Item>
      <Menu.Item key="twitter">
        <TwitterShareButton url={shareUrl} title={post.title.rendered}>
          <TwitterOutlined style={{ fontSize: "16px", marginRight: "8px" }} />
          Twitter
        </TwitterShareButton>
      </Menu.Item>
      <Menu.Item key="linkedin">
        <LinkedinShareButton url={shareUrl} title={post.title.rendered}>
          <LinkedinFilled style={{ fontSize: "16px", marginRight: "8px" }} />
          LinkedIn
        </LinkedinShareButton>
      </Menu.Item>
    </Menu>
  );

  const renderContent = () => {
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
  };

  const renderEmail = () => {
    return (
      <div className="d-flex justify-content-center">
        <SendEmail subject={post.title.rendered} content={post.content.rendered} acf={post.acf} />
      </div>
    );
  };

  const renderBackBtn = () => {
    return <MyLink title="Буцах" url="/p/leasing-product" slug="leasing-product" type="c" className="btn btn-primary my-3" prefetch={false} />;
  };

  return (
    <Layout menu={mainMenu} title={post.title.rendered} image={post.acf.header_img || post.featured_media} stickyMenu={stickyMenu}>
      <div className="content-wrapper">
        <div className="w-100 page-wrapper transparent">
          <Row justify="center" className="h-100">
            <Col xs={22} sm={22} md={20} lg={18} xl={16} className="h-100">
              <div className="page-wrapper-content h-100">
                <Row justify="center pt-2">
                  <Col span={22}>
                    <h2 className="title my-2 pl-2 upper-case">{post.title.rendered}</h2>
                    {post.acf.header_img && <img className="w-100 p-1" src={post.acf.header_img} alt={post.title.rendered} />}
                  </Col>
                  {renderContent()}
                </Row>
                {renderEmail()}
              </div>
            </Col>
          </Row>
        </div>
        <div className="footer-content">
          <Row justify={width < 576 ? "center" : "end"} className="w-100">
            <Col xs={22} sm={12} md={10} lg={12} xl={16}>
              <Row justify="end" className="w-100">
                <Col>{renderBackBtn()}</Col>
              </Row>
            </Col>
            <Col xs={22} sm={12} md={7} lg={6} xl={4}>
              {post.acf.lease_form && <FooterBtn btn={"Түрээсийн хүсэлт илгээх"} url={post.acf.lease_form} />}
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

// Static page generation - no server-side data fetching needed
export async function getStaticProps() {
  return {
    props: {
      // Add any static props if needed in the future
    },
  };
}

export default ManufacturingEquipmentLeasing;
