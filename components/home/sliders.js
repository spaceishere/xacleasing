import React, { useRef, useState } from "react";
import { Col, Row } from "antd";
import { getData, regex, __, truncate } from "../../utils";
import Slider from "react-slick";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import YouTube from "react-youtube";
import MyLink from "../MyLink";
import useTranslation from "next-translate/useTranslation";

const Sliders = ({ posts, sliderCategory }) => {
  const { t } = useTranslation("common");
  const sliderRef = useRef(null);
  const [activeSlide, setActiveSlide] = useState(0);

  const next = () => sliderRef.current?.slickNext();
  const previous = () => sliderRef.current?.slickPrev();

  const renderACF = (pre_payment, rate, period) => (
    <Row className="mb-2" justify="space-between">
      <Col>
        <h2>
          {pre_payment.first_value &&
            pre_payment.first_value != 0 &&
            pre_payment.first_value + " -"}{" "}
          {pre_payment.second_value}%
        </h2>
        {t("Урьдчилгаа")}
      </Col>
      <Col>
        <h2>
          {period.value} {t("жил")}
        </h2>
        {t("Хугацаа")}
      </Col>
      <Col>
        <h2>
          {rate.first_value}% - {rate.second_value}%
        </h2>
        {t("Сарын хүү")}
      </Col>
    </Row>
  );

  const renderBtnItem = (slug, text) => (
    <a className="slider-btn" href={slug}>
      {text}
    </a>
  );

  const renderBtn = (acf) => (
    <div className="d-flex">
      {renderBtnItem(acf.btn.slug, acf.btn.btn_text)}
      {acf.footer_btn &&
        acf.footer_btn.btn_text &&
        renderBtnItem(acf.footer_btn.btn_id, acf.footer_btn.btn_text)}
    </div>
  );

  const renderSlide = (post) => {
    const img = post.acf?.img || getData(post._embedded, "image");

    return (
      <div key={post.id} className="h-100">
        <div
          className="h-100 w-100 img p-relative back-cover"
          style={{ backgroundImage: `url(${img})` }}
        >
          <Row
            justify="center"
            align="middle"
            className="h-100"
            gutter={[48, 0]}
          >
            <Col xs={22} sm={22} md={20} lg={18} xl={16}>
              <Col sm={20} md={18} lg={14} xl={12}>
                <div
                  className={
                    post.acf.backColor
                      ? "slider-descr slider-back"
                      : "slider-descr"
                  }
                >
                  {post.acf?.btn?.btn_text && renderBtn(post.acf)}
                  <h1>{regex(post.title.rendered)}</h1>
                  <div
                    className="excerpt"
                    dangerouslySetInnerHTML={{
                      __html: truncate(post.excerpt.rendered, 30),
                    }}
                  />
                  {post.acf?.pre_payment &&
                    post.acf?.interest_rate &&
                    post.acf?.period &&
                    renderACF(
                      post.acf.pre_payment,
                      post.acf.interest_rate,
                      post.acf.period
                    )}
                  <MyLink
                    title={t("Дэлгэрэнгүй")}
                    slug={post.slug}
                    type="d"
                    className="more-link"
                  />
                </div>
              </Col>
            </Col>
          </Row>
        </div>
      </div>
    );
  };

  if (!posts || posts.length === 0) return null;

  const settings1 = {
    className: "home-slider",
    autoplay: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    autoplaySpeed: 7000,
    pauseOnHover: true,
    beforeChange: (_, next) => setActiveSlide(next),
  };

  const opts = {
    height: "100%",
    width: "100%",
    playerVars: {
      autoplay: 1,
      mute: 1,
      frameborder: 0,
      loop: 1,
      controls: 0,
      rel: 0,
      showinfo: 0,
      playlist: sliderCategory.acf?.youtube_id || "",
    },
  };

  return (
    <>
      <Slider ref={sliderRef} {...settings1}>
        {posts.map((post) => renderSlide(post))}
        {sliderCategory.acf?.youtube_id && (
          <div key="youtube" className="h-100 youtube">
            <div className="video-wrap">
              <div className="video-background">
                <YouTube
                  className="video-iframe"
                  containerClassName="w-100"
                  videoId={sliderCategory.acf.youtube_id}
                  opts={opts}
                />
              </div>
            </div>
          </div>
        )}
      </Slider>

      <div className="footer-content index">
        <Row
          justify="end"
          align="middle"
          className="w-100 footer-content index"
        >
          <Col xs={20} sm={20} md={4} lg={4} className="h-100">
            <div className="h-100 arrow-wrapper">
              <div className="counter">
                <b>{activeSlide + 1}</b>/
                <span>
                  {sliderCategory.acf?.youtube_id
                    ? posts.length + 1
                    : posts.length}
                </span>
              </div>
              <button
                className="border-round custom-arrow prv"
                onClick={previous}
              >
                <LeftOutlined />
              </button>
              <button className="border-round custom-arrow nxt" onClick={next}>
                <RightOutlined />
              </button>
            </div>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default Sliders;
