import React, { useState, useEffect } from "react";
import { Col, Menu, Modal, Row } from "antd";
import { getData, regex } from "../../utils";
import Slider from "react-slick";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import useTranslation from "next-translate/useTranslation";
import { useGraphQL } from "../../providers/ApolloProvider";

const GET_VENDORS = `
query PostsList(
    $clientPortalId: String!
    $tagIds: [String]
    $categoryIds: [String]
    $page: Int
    $perPage: Int
  ) {
    cmsPostList(
      clientPortalId: $clientPortalId
      tagIds: $tagIds
      categoryIds: $categoryIds
      page: $page
      perPage: $perPage
    ) {
      posts {
        _id
        title
        excerpt
        thumbnail {
          url
        }
        images {
          url
        }
        createdAt
        updatedAt
      }
    }
  }
`;

function VendorList(props) {
  const { t } = useTranslation("common");
  const { query } = useGraphQL();
  const [active, setActive] = useState(4);
  const [activeName, setActiveName] = useState("Бүгд");
  const [graphqlVendors, setGraphqlVendors] = useState([]);
  const [vendorsLoading, setVendorsLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [modalPost, setModalPost] = useState({});

  // Fetch vendors using GraphQL
  const fetchVendorsWithGraphQL = async () => {
    setVendorsLoading(true);
    try {
      const variables = {
        clientPortalId: process.env.NEXT_PUBLIC_ERXES_CLIENT_PORTAL_ID || "cp-wzk8M6gshwVUeGnfdR",
        tagIds: ["yPfazYFeIaYr1OY5mhUxH"],
        page: 1,
        perPage: 100,
      };

      const result = await query(GET_VENDORS, variables);

      if (result?.cmsPostList?.posts) {
        setGraphqlVendors(result.cmsPostList.posts);
      }
    } catch (error) {
      console.error("Error fetching vendors:", error);
    } finally {
      setVendorsLoading(false);
    }
  };

  useEffect(() => {
    fetchVendorsWithGraphQL();
  }, []);

  // Function to get category ID based on excerpt
  const getCategoryFromExcerpt = (excerpt) => {
    switch (excerpt?.toLowerCase()) {
      case "car":
        return 2; // Шинэ автомашин нийлүүлэгч
      case "machine":
        return 3; // Машин механизм нийлүүлэгч
      case "tool":
        return 1; // Тоног төхөөрөмж нийлүүлэгч
      default:
        return 4; // Бүгд
    }
  };

  // Transform GraphQL data to match existing component structure
  const transformedVendorPosts = graphqlVendors.map((vendor) => {
    const categoryId = getCategoryFromExcerpt(vendor.excerpt);
    return {
      id: vendor._id,
      title: { rendered: vendor.title },
      content: { rendered: vendor.excerpt || "" },
      excerpt: { rendered: vendor.excerpt || "" },
      slug: vendor.slug || vendor._id,
      categories: [categoryId],
      _embedded: vendor.thumbnail
        ? {
            "wp:featuredmedia": [
              {
                source_url: vendor.thumbnail.url.startsWith("http")
                  ? vendor.thumbnail.url
                  : `https://xacleasing.app.erxes.io/gateway/read-file?key=${vendor.thumbnail.url}`,
              },
            ],
          }
        : {},
    };
  });

  const renderData = () => {
    // Use GraphQL data if available, otherwise fallback to props
    const vendorData = transformedVendorPosts.length > 0 ? transformedVendorPosts : props.vendorPosts || [];

    if (Number(active) === 4) return vendorData;

    return vendorData.filter((post) => post.categories && post.categories.includes(Number(active)));
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

  // Array of background colors for vendors
  const backgroundColors = [
    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
    "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
    "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
    "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
    "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
    "linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)",
    "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)",
    "linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)",
    "linear-gradient(135deg, #fad0c4 0%, #ffd1ff 100%)",
  ];

  const renderPostItem = (post, index) => {
    if (!post || (post.categories && post.categories.includes(17))) return null;

    const imageUrl = getData(post._embedded, "image") || post._embedded?.["wp:featuredmedia"]?.[0]?.source_url;
    const backgroundColor = backgroundColors[index % backgroundColors.length];

    return (
      <div
        key={post.id}
        className="slider-item slider-logo vendor-with-background"
        onClick={() => {
          setModalPost(post);
          setVisible(true);
        }}
        style={{
          position: "relative",
          background: backgroundColor,
          borderRadius: "12px",
          overflow: "hidden",
          margin: "0 5px",
          height: "130px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
          transition: "all 0.3s ease",
          cursor: "pointer",
        }}
      >
        {imageUrl && (
          <div
            style={{
              position: "relative",
              zIndex: 2,
              backgroundColor: "rgba(255, 255, 255, 0.9)",
              borderRadius: "8px",
              padding: "10px",
              margin: "10px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "calc(100% - 20px)",
              height: "calc(100% - 20px)",
            }}
          >
            <img
              className="dark-img"
              src={imageUrl}
              alt={post.title.rendered}
              style={{
                maxWidth: "100%",
                maxHeight: "100%",
                objectFit: "contain",
              }}
            />
            <img
              className="light-img"
              src={post.acf?.logo || imageUrl}
              alt={post.title.rendered}
              style={{
                maxWidth: "100%",
                maxHeight: "100%",
                objectFit: "contain",
              }}
            />
          </div>
        )}
        {!imageUrl && (
          <div
            className="vendor-placeholder"
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontWeight: "500",
              textAlign: "center",
              padding: "10px",
            }}
          >
            {post.title.rendered}
          </div>
        )}
      </div>
    );
  };

  // Count vendors by category
  const getVendorCount = (categoryId) => {
    if (categoryId === 4) return transformedVendorPosts.length;
    return transformedVendorPosts.filter((vendor) => vendor.categories && vendor.categories.includes(categoryId)).length;
  };

  // Static categories based on new-car-vendors page
  const staticCategories = [
    { id: 2, name: `Шинэ автомашин нийлүүлэгч` },
    { id: 3, name: `Машин механизм нийлүүлэгч` },
    { id: 1, name: `Тоног төхөөрөмж нийлүүлэгч` },
  ];

  const renderMenuList = () => {
    // Use static categories with vendor counts
    return staticCategories.map((category) => (
      <Menu.Item key={category.id} className={category.id === active ? "ant-menu-item-selected" : ""}>
        {category.name} ({getVendorCount(category.id)})
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
      <style jsx>{`
        .vendor-with-background:hover {
          transform: scale(1.05) !important;
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2) !important;
        }

        .vendor-with-background:hover::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(255, 255, 255, 0.1);
          z-index: 1;
          border-radius: 12px;
        }

        .vendor-slider .slick-slide {
          padding: 0 5px;
        }

        .vendor-slider .slick-list {
          margin: 0 -5px;
        }
      `}</style>
      <h2 className="title pb-2 purple mt-4">{t("ХАМТРАН АЖИЛЛАДАГ НИЙЛҮҮЛЭГЧ БАЙГУУЛЛАГУУД")}</h2>
      <Row justify="center" align="middle" gutter={32} className={`${props.type !== "inside" ? "mt-2" : ""} overflow`}>
        <Col xs={24} sm={10} lg={8}>
          <Menu onClick={handleClick} defaultSelectedKeys={[String(active)]} mode="inline" className="tabMenu">
            <Menu.Item key="4" className={active === 4 ? "ant-menu-item-selected" : ""}>
              {t("Бүгд")} ({getVendorCount(4)})
            </Menu.Item>
            {renderMenuList()}
          </Menu>
        </Col>
        <Col xs={24} sm={14} lg={16} className="vendorlist">
          {vendorsLoading ? (
            <div className="loading" style={{ textAlign: "center", padding: "40px" }}>
              {t("Өгөгдөл ачааллаж байна...")}
            </div>
          ) : dataLength > 0 ? (
            <Slider className="vendor-slider" {...settings}>
              {renderData().map((post, index) => renderPostItem(post, index))}
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
