import React from "react";
import { __ } from "../utils";
import Link from "next/link";
import { generateLink } from "../config";
import { RightOutlined, RollbackOutlined } from "@ant-design/icons";

const MyLink = ({ className, icon, title, type, slug, url, prefetch }) => {
  return (
    <Link
      href={
        type === "about"
          ? generateLink(`/about`)
          : type === "career"
          ? generateLink(`/career/hr`)
          : type === "career-detail"
          ? generateLink(`/career/` + slug)
          : type != "custom"
          ? generateLink(`/${type}/[slug]`)
          : url
      }
      as={
        type === "about"
          ? generateLink(`/about`)
          : type === "career"
          ? generateLink(`/career/hr`)
          : type === "career-detail"
          ? generateLink(`/career/` + slug)
          : type != "custom"
          ? generateLink(`/${type}/` + slug)
          : url
      }
      passHref
    >
      <a
        rel="noopener noreferrer nofollow"
        target={type === "custom" ? "_blank" : "_self"}
        className={className || ""}
      >
        {className === "back-btn" && <RollbackOutlined />}
        {title}
        {icon && className != "back-btn" && <RightOutlined />}
      </a>
    </Link>
  );
};

export default MyLink;
