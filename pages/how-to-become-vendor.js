import React, { useState, useEffect } from "react";
import Layout from "../components/layouts/Layout";
import { Col, Row, Card, Tabs } from "antd";
import { __ } from "../utils";

const { TabPane } = Tabs;

const HowToBecomeVendorPage = ({ loading, mainMenu, stickyMenu }) => {
  const [isDarkTheme, setIsDarkTheme] = useState(false);

  useEffect(() => {
    // Check system theme preference
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    setIsDarkTheme(mediaQuery.matches);

    const handleThemeChange = (e) => setIsDarkTheme(e.matches);
    mediaQuery.addEventListener("change", handleThemeChange);

    return () => mediaQuery.removeEventListener("change", handleThemeChange);
  }, []);

  // Theme colors
  const themeColors = {
    primary: isDarkTheme ? "#ffffff" : "#000000",
    secondary: isDarkTheme ? "#e0e0e0" : "#333333",
    accent: isDarkTheme ? "#fec637" : "#5e395f",
    cardBg: isDarkTheme ? "#1f1f1f" : "#ffffff",
    borderColor: isDarkTheme ? "#404040" : "#e9ecef",
  };

  return (
    <Layout loading={loading} title={__("Нийлүүлэгч хэрхэн болох вэ?")} menu={mainMenu} stickyMenu={stickyMenu}>
      <div className="content-wrapper">
        <div className="w-100 page-wrapper transparent">
          <Row justify="center" className="h-100">
            <Col xs={22} sm={22} md={20} lg={18} xl={16} className="h-100">
              <div className="page-wrapper-content h-100">
                <div className="page-wrapper p-3 w-100">
                  {/* Header */}
                  <div style={{ textAlign: "center", marginBottom: "40px" }}>
                    <h3
                      style={{
                        fontWeight: "bold",
                        marginBottom: "20px",
                      }}
                    >
                      НИЙЛҮҮЛЭГЧ ХЭРХЭН БОЛОХ ВЭ?
                    </h3>
                  </div>

                  {/* Tabs */}
                  <Tabs defaultActiveKey="1" size="large" centered style={{ marginBottom: "30px" }}>
                    {/* Tab 1: Лизингээр олгох бүтээгдэхүүн */}
                    <TabPane tab=" Лизингээр олгох бүтээгдэхүүн" key="1">
                      <Card style={{ borderRadius: "12px", backgroundColor: "transparent", border: "none" }}>
                        {/* Боломжит бүтээгдэхүүн */}
                        <div style={{ marginBottom: "40px" }}>
                          <h3 style={{ marginBottom: "20px", textAlign: "center" }}>Боломжит бүтээгдэхүүн</h3>
                          <Row gutter={[16, 16]}>
                            <Col xs={24} sm={12} md={8}>
                              <div
                                style={{
                                  padding: "20px",
                                  borderRadius: "12px",
                                  textAlign: "center",

                                  backgroundColor: "#f9f0ff",
                                  transition: "all 0.3s ease",
                                }}
                              >
                                Газар тариалангийн техник
                              </div>
                            </Col>
                            <Col xs={24} sm={12} md={8}>
                              <div
                                style={{
                                  padding: "20px",
                                  borderRadius: "12px",
                                  textAlign: "center",

                                  backgroundColor: "#f9f0ff",
                                  transition: "all 0.3s ease",
                                }}
                              >
                                Үйлдвэрлэлийн тоног төхөөрөмж
                              </div>
                            </Col>
                            <Col xs={24} sm={12} md={8}>
                              <div
                                style={{
                                  padding: "20px",
                                  borderRadius: "12px",
                                  textAlign: "center",

                                  backgroundColor: "#f9f0ff",
                                  transition: "all 0.3s ease",
                                }}
                              >
                                Эмчилгээ оношилгооны төхөөрөмж
                              </div>
                            </Col>
                            <Col xs={24} sm={12} md={8}>
                              <div
                                style={{
                                  padding: "20px",
                                  borderRadius: "12px",
                                  textAlign: "center",

                                  backgroundColor: "#f9f0ff",
                                  transition: "all 0.3s ease",
                                }}
                              >
                                Зам, барилгын техник хэрэгсэл
                              </div>
                            </Col>
                            <Col xs={24} sm={12} md={8}>
                              <div
                                style={{
                                  padding: "20px",
                                  borderRadius: "12px",
                                  textAlign: "center",

                                  backgroundColor: "#f9f0ff",
                                  transition: "all 0.3s ease",
                                }}
                              >
                                Уул уурхайн машин механизм
                              </div>
                            </Col>
                            <Col xs={24} sm={12} md={8}>
                              <div
                                style={{
                                  padding: "20px",
                                  borderRadius: "12px",
                                  textAlign: "center",

                                  backgroundColor: "#f9f0ff",
                                  transition: "all 0.3s ease",
                                }}
                              >
                                Шинэ суудлын автомашин
                              </div>
                            </Col>
                          </Row>
                        </div>

                        {/* Давуу талууд */}
                        <div>
                          <h3 style={{ marginBottom: "20px", textAlign: "center" }}>Давуу талууд</h3>
                          <Row gutter={[16, 16]}>
                            <Col xs={24} sm={12}>
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  padding: "15px",
                                  backgroundColor: "#f9f0ff",
                                  borderRadius: "8px",
                                }}
                              >
                                <span>Борлуулалтаа нэмэгдүүлэх</span>
                              </div>
                            </Col>
                            <Col xs={24} sm={12}>
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  padding: "15px",
                                  backgroundColor: "#f9f0ff",
                                  borderRadius: "8px",
                                }}
                              >
                                <span>Худалдан авагчаа алдахгүй байх</span>
                              </div>
                            </Col>
                            <Col xs={24} sm={12}>
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  padding: "15px",
                                  backgroundColor: "#f9f0ff",
                                  borderRadius: "8px",
                                }}
                              >
                                <span>Бэлэн мөнгөний урсгалаа сайжруулах</span>
                              </div>
                            </Col>
                            <Col xs={24} sm={12}>
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  padding: "15px",
                                  backgroundColor: "#f9f0ff",
                                  borderRadius: "8px",
                                }}
                              >
                                <span>Бүтээгдэхүүний нэр төрлийг олшруулах</span>
                              </div>
                            </Col>
                            <Col xs={24}>
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  padding: "15px",
                                  backgroundColor: "#f9f0ff",
                                  borderRadius: "8px",
                                }}
                              >
                                <span>Санхүүгийн хүрэлцээ муу байгаа харилцагчиддаа бүтээгдэхүүнээ борлуулах</span>
                              </div>
                            </Col>
                          </Row>
                        </div>
                      </Card>
                    </TabPane>

                    {/* Tab 2: Тавигдах шалгуур */}
                    <TabPane tab=" Тавигдах шалгуур" key="2">
                      <Card
                        style={{
                          borderRadius: "12px",
                          backgroundColor: "transparent",
                          border: "none",
                        }}
                      >
                        <div style={{ marginBottom: "30px" }}>
                          <h3 style={{ marginBottom: "20px", textAlign: "center" }}>Үүнд:</h3>
                          <ul style={{ paddingLeft: "0", listStyle: "none", lineHeight: "2" }}>
                            <li
                              style={{
                                marginBottom: "12px",
                                padding: "12px",
                                backgroundColor: "#f9f0ff",
                                borderRadius: "8px",
                              }}
                            >
                              Сүүлийн 1 жилээс доошгүй хугацаанд үйл ажиллагаа явуулж байгаа;
                            </li>
                            <li
                              style={{
                                marginBottom: "12px",
                                padding: "12px",
                                backgroundColor: "#f9f0ff",
                                borderRadius: "8px",
                              }}
                            >
                              Монгол улсын хуулийн дагуу үүсгэн байгуулагдсан, тухайн аж ахуйн үйл ажиллагааг эрхлэх тусгай зөвшөөрлийг эрх бүхий
                              байгууллагаас авсан;
                            </li>
                            <li
                              style={{
                                marginBottom: "12px",
                                padding: "12px",
                                backgroundColor: "#f9f0ff",
                                borderRadius: "8px",
                              }}
                            >
                              Үйл ажиллагаагаа тогтвортой эрхэлдэг, үзэсгэлэнгийн танхим эсхүл эд хөрөнгө борлуулах тогтмол сувагтай;
                            </li>
                            <li
                              style={{
                                marginBottom: "12px",
                                padding: "12px",
                                backgroundColor: "#f9f0ff",
                                borderRadius: "8px",
                              }}
                            >
                              Аль нэг байгууллагын албан ёсны борлуулагч эсхүл төлөөлөгч бол эрх бүхий байгууллагаас зөвшөөрөл, итгэмжлэл авсан байх;
                            </li>
                            <li
                              style={{
                                marginBottom: "12px",
                                padding: "12px",
                                backgroundColor: "#f9f0ff",
                                borderRadius: "8px",
                              }}
                            >
                              Тухайн эд хөрөнгийг 1 жилээс доошгүй хугацаанд худалдан борлуулсан туршлагатай;
                            </li>
                            <li
                              style={{
                                marginBottom: "12px",
                                padding: "12px",
                                backgroundColor: "#f9f0ff",
                                borderRadius: "8px",
                              }}
                            >
                              НӨАТ төлөгч байгууллага байх;
                            </li>
                            <li
                              style={{
                                marginBottom: "12px",
                                padding: "12px",
                                backgroundColor: "#f9f0ff",
                                borderRadius: "8px",
                              }}
                            >
                              Нийлүүлж буй бүтээгдэхүүндээ 6 сараас дээш хугацаатай баталгаат хугацаа өгдөг байх;
                            </li>
                            <li
                              style={{
                                marginBottom: "12px",
                                padding: "12px",
                                backgroundColor: "#f9f0ff",
                                borderRadius: "8px",
                              }}
                            >
                              Шаардлагатай сэлбэг, эд ангийг нийлүүлэх буюу зуучлах боломжтой;
                            </li>
                            <li
                              style={{
                                marginBottom: "12px",
                                padding: "12px",
                                backgroundColor: "#f9f0ff",
                                borderRadius: "8px",
                              }}
                            >
                              Баталгааны хугацаанд өөрийн нөөц бололцоогоор засвар үйлчилгээ үзүүлэх боломжтой, эсхүл зуучлах боломжтой;
                            </li>
                          </ul>
                        </div>

                        {/* Онцлох шаардлагууд */}
                        <div
                          style={{
                            marginTop: "30px",
                            padding: "20px",
                            backgroundColor: "#f9f0ff",
                            borderRadius: "12px",
                          }}
                        >
                          <h4 style={{ color: "#5e395f", marginBottom: "20px", textAlign: "center", fontSize: "1.2rem" }}> Онцлох шаардлагууд</h4>
                          <Row gutter={[16, 16]}>
                            <Col xs={24} sm={12}>
                              <div style={{ display: "flex", alignItems: "center", marginBottom: "12px" }}>
                                <span>Үйл ажиллагаа: Тогтвортой, 1+ жил</span>
                              </div>
                            </Col>
                            <Col xs={24} sm={12}>
                              <div style={{ display: "flex", alignItems: "center", marginBottom: "12px" }}>
                                <span>Зөвшөөрөл: Эрх бүхий байгууллагаас</span>
                              </div>
                            </Col>
                            <Col xs={24} sm={12}>
                              <div style={{ display: "flex", alignItems: "center", marginBottom: "12px" }}>
                                <span>Баталгаа: 6+ сар</span>
                              </div>
                            </Col>
                            <Col xs={24} sm={12}>
                              <div style={{ display: "flex", alignItems: "center", marginBottom: "12px" }}>
                                <span>Засвар: Өөрийн буюу зуучлах</span>
                              </div>
                            </Col>
                          </Row>
                        </div>
                      </Card>
                    </TabPane>

                    {/* Tab 3: Бүрдүүлэх материал */}
                    <TabPane tab="Бүрдүүлэх материал" key="3">
                      <Card style={{ borderRadius: "12px", backgroundColor: "transparent", border: "none" }}>
                        <div style={{ marginBottom: "30px" }}>
                          <h3 style={{ marginBottom: "20px", textAlign: "center" }}>Энэхүү материал нь:</h3>
                          <ul style={{ paddingLeft: "0", listStyle: "none", lineHeight: "2" }}>
                            <li
                              style={{
                                marginBottom: "12px",
                                padding: "12px",
                                backgroundColor: "#f9f0ff",
                                borderRadius: "8px",
                              }}
                            >
                              Хамтран ажиллах тухай албан бичиг;
                            </li>
                            <li
                              style={{
                                marginBottom: "12px",
                                padding: "12px",
                                backgroundColor: "#f9f0ff",
                                borderRadius: "8px",
                              }}
                            >
                              Байгууллагын товч танилцуулга, бизнесийн түүх;
                            </li>
                            <li
                              style={{
                                marginBottom: "12px",
                                padding: "12px",
                                backgroundColor: "#f9f0ff",
                                borderRadius: "8px",
                              }}
                            >
                              Улсын бүртгэлийн гэрчилгээний болон НӨАТ-ын гэрчилгээний хуулбар;
                            </li>
                            <li
                              style={{
                                marginBottom: "12px",
                                padding: "12px",
                                backgroundColor: "#f9f0ff",
                                borderRadius: "8px",
                              }}
                            >
                              Үйл ажиллагаанд нь тусгай зөвшөөрөл шаардагддаг бол лиценз, зөвшөөрлийн хуулбар;
                            </li>
                            <li
                              style={{
                                marginBottom: "12px",
                                padding: "12px",
                                backgroundColor: "#f9f0ff",
                                borderRadius: "8px",
                              }}
                            >
                              Албан ёсны борлуулагч эсхүл төлөөлөгч байгууллагуудтай хийсэн гэрээ, хэлцэл, зөвшөөрөл, итгэмжлэлийн хуулбарууд;
                            </li>
                            <li
                              style={{
                                marginBottom: "12px",
                                padding: "12px",
                                backgroundColor: "#f9f0ff",
                                borderRadius: "8px",
                              }}
                            >
                              Сүүлийн улирлын Санхүүгийн тайлан, борлуулалтын тайлан;
                            </li>
                            <li
                              style={{
                                marginBottom: "12px",
                                padding: "12px",
                                backgroundColor: "#f9f0ff",
                                borderRadius: "8px",
                              }}
                            >
                              Санхүүгийн түрээсээр борлуулах барааны дэлгэрэнгүй танилцуулга болон үнийн санал, борлуулагч болон худалдааны
                              төлөөлөгчдийн талаарх холбоо тогтоох мэдээлэл зэргээс бүрдэнэ.
                            </li>
                          </ul>
                        </div>
                        <h2 style={{ marginBottom: "20px", textAlign: "center", fontSize: "1.2rem" }}> Анхаарах зүйлс</h2>
                        {/* Анхаарах зүйлс */}
                        <div
                          style={{
                            marginTop: "30px",
                            padding: "20px",
                            backgroundColor: "#f9f0ff",
                            borderRadius: "12px",
                          }}
                        >
                          <ul style={{ paddingLeft: "20px", margin: 0, lineHeight: "1.8" }}>
                            <li style={{ marginBottom: "8px" }}>Бүх материалыг албан ёсны хуулбараар бүрдүүлнэ;</li>
                            <li style={{ marginBottom: "8px" }}>
                              Гадаад хэл дээрх баримт бичгийг монгол хэл рүү орчуулан нотарийн гэрчилгээтэйгээр ирүүлнэ;
                            </li>
                            <li style={{ marginBottom: "8px" }}>Материалын хүчинтэй хугацааг анхаарна;</li>
                            <li style={{ marginBottom: "8px" }}>Шаардлагатай тохиолдолд нэмэлт материал гаргаж өгч болно.</li>
                          </ul>
                        </div>
                      </Card>
                    </TabPane>
                  </Tabs>
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

export default HowToBecomeVendorPage;
