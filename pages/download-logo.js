import React, { useEffect, useState } from "react";
import WPAPI from "wpapi";
import Layout from "../components/layouts/Layout";
import { Col, Row } from "antd";
import FileItem from "../components/FileItem";
import { __, regex } from "../utils";
import config from "../config";

const DownloadLogoPage = ({ category, posts, loading, mainMenu, stickyMenu }) => {
  return (
    <Layout loading={loading} title={__("Лого татах")} menu={mainMenu} stickyMenu={stickyMenu}>
      <div className="content-wrapper">
        <div className="w-100 page-wrapper transparent">
          <Row justify="center" className="h-100">
            <Col xs={22} sm={22} md={20} lg={18} xl={16} className="h-100">
              <div className="page-wrapper-content h-100">
                <div className="page-wrapper p-3 w-100">
                  <h2 className="mb-2 upper-case title">{category ? regex(category.name) : __("Лого татах")}</h2>

                  {/* Static logo files */}
                  <Row gutter={64} className="mt-1">
                    <Col xs={24} sm={12} md={8} lg={6} xl={4}>
                      <div className="box w-100">
                        <div>
                          <h3>Группе компаниудын лого</h3>
                          <img
                            src="/images/gerege-logo.png"
                            alt="Gerege Logo"
                            style={{ maxWidth: "100%", height: "60px", objectFit: "contain", marginBottom: "10px" }}
                          />
                          <p style={{ fontSize: "12px", marginBottom: "10px" }}>1 file(s) 4.00 KB</p>
                          <a href="/images/gerege-logo.png" download="gerege-logo.png" className="btn btn-primary">
                            Татах
                          </a>
                        </div>
                      </div>
                    </Col>

                    <Col xs={24} sm={12} md={8} lg={6} xl={4}>
                      <div className="box w-100">
                        <div>
                          <h3>ХасЛизинг лого</h3>
                          <img
                            src="/images/xaclogo.png"
                            alt="XacLeasing Logo"
                            style={{ maxWidth: "100%", height: "60px", objectFit: "contain", marginBottom: "10px" }}
                          />
                          <p style={{ fontSize: "12px", marginBottom: "10px" }}>0 file(s) 86 KB</p>
                          <a href="/images/xaclogo.png" download="xaclogo.png" className="btn btn-primary">
                            Татах
                          </a>
                        </div>
                      </div>
                    </Col>
                  </Row>

                  {/* WordPress Files list - same as category.acf.type === "files" */}
                  <Row gutter={64} className="mt-1">
                    {posts && posts.length > 0 ? (
                      posts.map((post) => (
                        <Col key={post.id} xs={24} sm={12} md={8} lg={6} xl={4}>
                          <FileItem id={post.id} title={post.title.rendered} icon="fa fa-file-pdf-o" url={post.acf?.file || post.link} />
                        </Col>
                      ))
                    ) : (
                      <Col span={24} style={{ textAlign: "center", padding: "40px" }}>
                        <p>Файл олдсонгүй</p>
                      </Col>
                    )}
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

export async function getStaticProps(context) {
  try {
    const wp = new WPAPI({ endpoint: config(context).apiUrl });

    // Find download-logo category
    const category = await wp
      .categories()
      .slug("download-logo")
      .embed()
      .then((data) => {
        return data[0];
      });

    // Get posts from this category
    const posts = category ? await wp.posts().categories(category.id).perPage(100).embed() : [];

    return {
      props: {
        category: category || null,
        posts: posts || [],
      },
      revalidate: 300,
    };
  } catch (error) {
    console.error("Error fetching download-logo data:", error);
    return {
      props: {
        category: null,
        posts: [],
      },
      revalidate: 300,
    };
  }
}

export default DownloadLogoPage;
