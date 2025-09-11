import React from "react";
import Layout from "../components/layouts/Layout";
import { Col, Row } from "antd";
import { __ } from "../utils";

const DownloadApplicationFormPage = ({ loading, mainMenu, stickyMenu }) => {
  // Static application form files from /public/materials
  const applicationFiles = [
    {
      id: 1,
      title: "Бүрдүүлэх материал (Байгууллага)",
      filename: "БҮРДҮҮЛЭХ МАТЕРИАЛ (ААНБ) (1).pdf",
      size: "126.80 KB",
      description: "Байгууллагад зориулсан бүрдүүлэх материал",
    },
    {
      id: 2,
      title: "Бүрдүүлэх материал (Бизнес эрхлэгч иргэн)",
      filename: "БҮРДҮҮЛЭХ МАТЕРИАЛ (БИЗНЕС ЭРХЛЭГЧ ИРГЭН).pdf",
      size: "89.79 KB",
      description: "Бизнес эрхлэгч иргэнд зориулсан материал",
    },
    {
      id: 3,
      title: "Ажилд орохын хүсэн өргөдөл",
      filename: "XacLeasing_job_application.pdf",
      size: "441.62 KB",
      description: "Ажилд орохын хүсэн өргөдлийн маягт",
    },
    {
      id: 4,
      title: "Бэлтгэн нийлүүлэгч байгууллагад тавигдах шаардлага, бүрдүүлэх материал",
      filename: "Tavigdah_shaardlaga_-_Beltgen_niiluulegch.pdf",
      size: "413.13 KB",
      description: "Бэлтгэн нийлүүлэгчид тавигдах шаардлага",
    },
  ];

  return (
    <Layout loading={loading} title={__("Өргөдөл, маягт татах")} menu={mainMenu} stickyMenu={stickyMenu}>
      <div className="content-wrapper">
        <div className="w-100 page-wrapper transparent">
          <Row justify="center" className="h-100">
            <Col xs={22} sm={22} md={20} lg={18} xl={16} className="h-100">
              <div className="page-wrapper-content h-100">
                <div className="page-wrapper p-3 w-100">
                  <h2 className="mb-2 upper-case title">{__("Өргөдөл, маягт татах")}</h2>

                  {/* Application form files */}
                  <Row gutter={64} className="mt-1">
                    {applicationFiles.map((file) => (
                      <Col key={file.id} xs={24} sm={12} md={8} lg={6} xl={6}>
                        <div className="box w-100">
                          <div>
                            <h3>{file.title}</h3>

                            <p style={{ fontSize: "12px", marginBottom: "5px" }}>{file.description}</p>
                            <p style={{ fontSize: "11px", marginBottom: "10px" }}>1 file(s) {file.size}</p>
                            <a href={`/materials/${encodeURIComponent(file.filename)}`} download={file.filename} className="btn btn-primary">
                              Татах
                            </a>
                          </div>
                        </div>
                      </Col>
                    ))}
                  </Row>
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

export default DownloadApplicationFormPage;
