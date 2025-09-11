import React from "react";
import { __ } from "../utils";
import Link from "next/link";
import { generateLink } from "../config";
import { RightOutlined, RollbackOutlined } from "@ant-design/icons";

const MyLink = ({ className, icon, title, type, slug, url, prefetch }) => {
  // Check if this is a contact link based on title only (not branches)
  const isContactLink = title === "Холбоо барих" || slug === "contact";

  // Check if this is a branches link
  const isBranchesLink = title === "Салбарууд" || slug === "branches";

  // Check if this is a download-logo link
  const isDownloadLogoLink = title === "Лого татах" || slug === "download-logo";

  // Check if this is a download-application-form link
  const isDownloadApplicationFormLink = title === "Өргөдөл, маягт татах" || slug === "download-application-form";

  // Check if this is an about-group link
  const isAboutGroupLink = title === "Группын тухай" || slug === "about-group";

  // Check if this is a how-to-become-vendor link (check first to prioritize)
  const isHowToBecomeVendorLink =
    (title?.includes("нийлүүлэгч") && title?.includes("болох")) ||
    (title?.includes("НИЙЛҮҮЛЭГЧ") && title?.includes("БОЛОХ")) ||
    title === "нийлүүлэгчид" ||
    title === "Нийлүүлэгчид" ||
    title === "НИЙЛҮҮЛЭГЧИД" ||
    slug === "how-to-become-vendor" ||
    slug === "хаслизингтэй-хамтарч-ажиллах" ||
    title?.includes("хамтарч ажиллах") ||
    title?.includes("Хамтарч ажиллах") ||
    title?.includes("ХАМТАРЧ АЖИЛЛАХ") ||
    title?.includes("хамтран ажиллах") ||
    title?.includes("Хамтран ажиллах") ||
    title?.includes("ХАМТРАН АЖИЛЛАХ") ||
    (title?.toLowerCase().includes("нийлүүлэгч") && title?.toLowerCase().includes("хэрхэн")) ||
    (title?.toLowerCase().includes("vendor") && title?.toLowerCase().includes("become"));

  // Debug logging for vendor-related links
  if (title && (title.toLowerCase().includes("нийлүүлэгч") || title.toLowerCase().includes("хамтарч") || slug?.includes("хаслизингтэй"))) {
    console.log("🔍 MyLink Debug:", {
      title,
      slug,
      url,
      type,
      isHowToBecomeVendorLink,
      willRedirectTo: isHowToBecomeVendorLink ? "/how-to-become-vendor" : "default",
    });
  }

  // Check if this is a new-car-vendors link (exclude how-to-become cases)
  const isNewCarVendorsLink =
    !isHowToBecomeVendorLink &&
    (title === "Шинэ автомашины борлуулагчид" ||
      slug === "new-car-vendors" ||
      (title?.includes("нийлүүлэгч") && !title?.includes("болох")) ||
      title?.includes("борлуулагч") ||
      slug?.includes("vendor") ||
      slug?.includes("supplier"));

  return (
    <Link
      href={
        isHowToBecomeVendorLink
          ? generateLink(`/how-to-become-vendor`)
          : isContactLink
            ? generateLink(`/contact`)
            : isBranchesLink
              ? generateLink(`/branches`)
              : isDownloadLogoLink
                ? generateLink(`/download-logo`)
                : isDownloadApplicationFormLink
                  ? generateLink(`/download-application-form`)
                  : isAboutGroupLink
                    ? generateLink(`/about-group`)
                    : isNewCarVendorsLink
                      ? generateLink(`/new-car-vendors`)
                      : type === "about"
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
        isHowToBecomeVendorLink
          ? generateLink(`/how-to-become-vendor`)
          : isContactLink
            ? generateLink(`/contact`)
            : isBranchesLink
              ? generateLink(`/branches`)
              : isDownloadLogoLink
                ? generateLink(`/download-logo`)
                : isDownloadApplicationFormLink
                  ? generateLink(`/download-application-form`)
                  : isAboutGroupLink
                    ? generateLink(`/about-group`)
                    : isNewCarVendorsLink
                      ? generateLink(`/new-car-vendors`)
                      : type === "about"
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
      <a rel="noopener noreferrer nofollow" target={type === "custom" ? "_blank" : "_self"} className={className || ""}>
        {className === "back-btn" && <RollbackOutlined />}
        {title}
        {icon && className != "back-btn" && <RightOutlined />}
      </a>
    </Link>
  );
};

export default MyLink;
