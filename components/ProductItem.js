import React from "react";
import Link from "next/link";
import { generateLink } from "../config";
import { truncate, regex } from "../utils";
import { LoadingOutlined, RightOutlined } from "@ant-design/icons";
import useTranslation from "next-translate/useTranslation";

function ProductItem({ id, title, descr, slug, img }) {
  const { t } = useTranslation("common");

  if (!title) {
    return (
      <div className="product-box">
        <LoadingOutlined />
      </div>
    );
  }

  return (
    <div key={id || title} className="product-item">
      <div className="product-content">
        <img className="w-100 h-100" src={`https://xacleasing.app.erxes.io/gateway/read-file?key=${img}`} alt={title} />
        <div className="product-descr">
          <h4>
            <Link href={generateLink(`/news/[id]`)} as={generateLink(`/news/${id}`)} passHref>
              <a rel="noopener noreferrer nofollow">{regex(truncate(title, 10))}</a>
            </Link>
          </h4>
          <div dangerouslySetInnerHTML={{ __html: truncate(descr, 10) }} />
        </div>
      </div>
      <Link href={generateLink(`/news/[id]`)} as={generateLink(`/news/${id}`)} passHref>
        <a rel="noopener noreferrer nofollow" className="more-btn">
          {t("Дэлгэрэнгүй")}
          <RightOutlined />
        </a>
      </Link>
    </div>
  );
}

export default ProductItem;
