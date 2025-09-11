import React, { useEffect, useState } from "react";
import Layout from "../components/layouts/Layout";
import { Col, Row, Modal, Card } from "antd";
import { __ } from "../utils";
import { useGraphQL } from "../providers/ApolloProvider";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

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

const NewCarVendorsPage = ({ loading, mainMenu, stickyMenu }) => {
  const { query } = useGraphQL();
  const [graphqlVendors, setGraphqlVendors] = useState([]);
  const [vendorsLoading, setVendorsLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState(4);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [isDarkTheme, setIsDarkTheme] = useState(false);

  const fetchVendorsWithGraphQL = async () => {
    setVendorsLoading(true);

    try {
      const variables = {
        clientPortalId: process.env.NEXT_PUBLIC_ERXES_CLIENT_PORTAL_ID || "cp-wzk8M6gshwVUeGnfdR",
        tagIds: ["yPfazYFeIaYr1OY5mhUxH"],
        page: 1,
        perPage: 100,
      };

      console.log("Fetching vendors with GraphQL...", variables);
      const result = await query(GET_VENDORS, variables);
      console.log("GraphQL vendors result:", result);

      if (result?.cmsPostList?.posts) {
        console.log("Raw vendor data:", result.cmsPostList.posts);
        setGraphqlVendors(result.cmsPostList.posts);
      }

      // Categories are now hardcoded based on excerpt values
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

  // Transform GraphQL data to match VendorList expected props
  const transformedVendorPosts = graphqlVendors.map((vendor) => {
    const categoryId = getCategoryFromExcerpt(vendor.excerpt);
    console.log(`Vendor: ${vendor.title}, Excerpt: ${vendor.excerpt}, Category ID: ${categoryId}`);

    return {
      id: vendor._id,
      title: { rendered: vendor.title },
      content: { rendered: vendor.excerpt || "" }, // Use excerpt as content if no content
      excerpt: { rendered: vendor.excerpt || "" },
      slug: vendor.slug || vendor._id,
      categories: [categoryId], // Set category based on excerpt
      _embedded: vendor.thumbnail
        ? [
            {
              "wp:featuredmedia": [
                {
                  source_url: vendor.thumbnail.url.startsWith("http")
                    ? vendor.thumbnail.url
                    : `https://xacleasing.app.erxes.io/gateway/read-file?key=${vendor.thumbnail.url}`,
                },
              ],
            },
          ]
        : [],
    };
  });

  console.log("Transformed vendor posts:", transformedVendorPosts);
  console.log("Current theme state:", isDarkTheme);

  // Count vendors by category
  const getVendorCount = (categoryId) => {
    if (categoryId === 4) return transformedVendorPosts.length;
    return transformedVendorPosts.filter((vendor) => vendor.categories.includes(categoryId)).length;
  };

  // All categories including "Бүгд" (All)
  const allCategories = [
    { id: 4, name: `Бүгд (${getVendorCount(4)})` },
    { id: 2, name: `Шинэ автомашин нийлүүлэгч (${getVendorCount(2)})` },
    { id: 3, name: `Машин механизм нийлүүлэгч (${getVendorCount(3)})` },
    { id: 1, name: `Тоног төхөөрөмж нийлүүлэгч (${getVendorCount(1)})` },
  ];

  // Filter vendors by category
  const filteredVendors =
    activeCategory === 4
      ? transformedVendorPosts
      : transformedVendorPosts.filter((vendor) => vendor.categories && vendor.categories.includes(activeCategory));

  // Handle vendor card click
  const handleVendorClick = (vendor) => {
    setSelectedVendor(vendor);
    setModalVisible(true);
  };

  // Slider settings
  const sliderSettings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: true,
    dotsClass: "slick-dots slick-thumb",
    appendDots: (dots) => (
      <div style={{ marginTop: "20px" }}>
        <ul style={{ margin: "0px" }}> {dots} </ul>
      </div>
    ),
    customPaging: (i) => (
      <div
        style={{
          width: "10px",
          height: "10px",
          borderRadius: "50%",
          backgroundColor: "#ccc",
          margin: "0 5px",
        }}
      ></div>
    ),
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          dots: true,
          arrows: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          dots: true,
          arrows: true,
        },
      },
    ],
  };

  return (
    <Layout loading={loading} title={__("Шинэ автомашины борлуулагчид")} menu={mainMenu} stickyMenu={stickyMenu}>
      <div className="content-wrapper">
        <div className="w-100 page-wrapper transparent">
          <Row justify="center" className="h-100">
            <Col xs={22} sm={22} md={20} lg={18} xl={16} className="h-100">
              <div className="page-wrapper-content h-100">
                <div className="page-wrapper p-3 w-100">
                  {vendorsLoading && (
                    <div style={{ textAlign: "center", padding: "40px" }}>
                      <p>Өгөгдөл ачааллаж байна...</p>
                    </div>
                  )}

                  {!vendorsLoading && (
                    <>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                        <h2 className="title pb-2 purple mt-4">{__("ХАМТРАН АЖИЛЛАДАГ НИЙЛҮҮЛЭГЧ БАЙГУУЛЛАГУУД")}</h2>
                      </div>
                      <Row justify="center" align="middle" gutter={92} className="mt-2 overflow">
                        <Col xs={24} sm={10} lg={8}>
                          <div
                            className="category-filter"
                            style={{ display: "flex", flexDirection: "column", gap: "10px", alignItems: "flex-start" }}
                          >
                            {allCategories.map((category) => (
                              <button
                                key={category.id}
                                type="button"
                                className={`category-btn ${activeCategory === category.id ? "active" : ""}`}
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  console.log("Category clicked:", category.name, "ID:", category.id);
                                  setActiveCategory(category.id);
                                }}
                                style={{
                                  border: "none",
                                  padding: "12px 16px",
                                  margin: "4px 0",
                                  backgroundColor: "transparent",
                                  color: activeCategory === category.id ? "#fec637" : "",
                                  transition: "all 0.3s ease",
                                }}
                              >
                                {category.name}
                              </button>
                            ))}
                          </div>
                        </Col>
                        <Col xs={24} sm={14} lg={16} className="vendorlist">
                          {filteredVendors.length > 0 ? (
                            <div style={{ position: "relative" }}>
                              <style jsx>{`
                                .vendor-slider .slick-prev,
                                .vendor-slider .slick-next {
                                  width: 40px;
                                  height: 40px;
                                  z-index: 1;
                                }
                                .vendor-slider .slick-prev {
                                  left: -50px;
                                }
                                .vendor-slider .slick-next {
                                  right: -50px;
                                }
                                .vendor-slider .slick-dots {
                                  bottom: -50px;
                                }
                                .vendor-slider .slick-dots li {
                                  margin: 0 3px;
                                }
                                .vendor-slider .slick-dots li button:before {
                                  font-size: 12px;
                                  color: #ccc;
                                }
                                .vendor-slider .slick-dots li.slick-active button:before {
                                  color: #1890ff;
                                }
                              `}</style>
                              <Slider className="vendor-slider" {...sliderSettings}>
                                {filteredVendors.map((vendor, index) => (
                                  <div key={vendor.id || index} className="vendor-item-wrapper">
                                    <Card
                                      hoverable
                                      className="vendor-card"
                                      style={{
                                        height: "300px",
                                        margin: "10px",
                                        backgroundColor: "white",
                                        zIndex: 3,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        flexDirection: "column",
                                      }}
                                      cover={
                                        vendor._embedded?.[0]?.["wp:featuredmedia"]?.[0]?.source_url && (
                                          <img
                                            alt={vendor.title.rendered}
                                            src={vendor._embedded[0]["wp:featuredmedia"][0].source_url}
                                            style={{ height: 200, objectFit: "contain", padding: "10px" }}
                                          />
                                        )
                                      }
                                    >
                                      <Card.Meta title={vendor.title.rendered} />
                                    </Card>
                                  </div>
                                ))}
                              </Slider>
                            </div>
                          ) : (
                            <div className="no-data">{__("Мэдээлэл байхгүй байна")}</div>
                          )}
                        </Col>
                      </Row>

                      {/* Vendor Detail Modal */}
                    </>
                  )}

                  {!vendorsLoading && transformedVendorPosts.length === 0 && (
                    <div style={{ textAlign: "center", padding: "40px" }}>
                      <p>Борлуулагч олдсонгүй</p>
                    </div>
                  )}
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </div>
    </Layout>
  );
};

export async function getStaticProps() {
  return {
    props: {},
    revalidate: 300,
  };
}

export default NewCarVendorsPage;
