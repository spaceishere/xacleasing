import React from "react";
import Link from "next/link";
import { generateLink } from "../config";
import { truncate, regex } from "../utils";
import { LoadingOutlined, RightOutlined } from "@ant-design/icons";
import useTranslation from "next-translate/useTranslation";

function ProductItem({ id, title, descr, slug, img, link }) {
  const { t } = useTranslation("common");

  if (!title) {
    return (
      <div className="product-box">
        <LoadingOutlined />
      </div>
    );
  }

  // Use the direct link if provided, otherwise fallback to old logic
  const productLink = link || generateLink(`/news/${id}`);
  const isStaticImage = img && !img.includes("xacleasing.app.erxes.io");
  const imageSrc = isStaticImage ? img : `https://xacleasing.app.erxes.io/gateway/read-file?key=${img}`;

  return (
    <div key={id || title} className="product-item">
      <div className="product-content">
        <img className="w-100 h-100" src={imageSrc} alt={title} />
        <div className="product-descr">
          <h4>
            <Link href={productLink} passHref>
              <a rel="noopener noreferrer nofollow">{regex(truncate(title, 10))}</a>
            </Link>
          </h4>
          <div dangerouslySetInnerHTML={{ __html: truncate(descr, 10) }} />
        </div>
      </div>
      <Link href={productLink} passHref>
        <a rel="noopener noreferrer nofollow" className="more-btn">
          {t("Дэлгэрэнгүй")}
          <RightOutlined />
        </a>
      </Link>
    </div>
  );
}

export default ProductItem;
