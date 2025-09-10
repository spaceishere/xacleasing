import WPAPI from "wpapi";
import React, { useEffect } from "react";
import Error from "next/error";
import Layout from "../../components/layouts/Layout";
import { Col, Row } from "antd";
import config from "../../config";
import { __, getData, regex } from "../../utils";
import Calculator from "../../components/calculator/calculator";
import Feedback from "../../components/home/feedback";
import Contact from "../../components/home/contact";

const Pages = ({ page, posts, loading, mainMenu, stickyMenu }) => {
  if (!page) {
    return <Error statusCode={404} />;
  }
  useEffect(() => {
    if (page?.acf?.id) {
      window.erxesSettings = {
        messenger: {
          brand_id: "exdvMb",
          css: ".erxes-launcher { background-size: 30px }",
        },
        forms: [
          {
            brand_id: "exdvMb",
            form_id: page.acf.id,
          },
        ],
      };
      var script = document.createElement("script");
      script.src = "https://erxes.xacleasing.mn/widgets/build/formWidget.bundle.js";
      script.async = true;

      var entry = document.getElementsByTagName("script")[0];
      entry.parentNode.insertBefore(script, entry);
    }
  }, []);

  const renderIframe = (id) => {
    return <div key={id} data-erxes-embed={id} className="page-embed"></div>;
  };

  const renderPageContent = () => {
    if (page.slug === "calculator") {
      return (
        <Row justify="center" className="pt-2">
          <Col span={22} justify="center" className="center">
            <Calculator isIndex={false} />
          </Col>
        </Row>
      );
    }
    if (page.slug === "branches") {
      return (
        <div className="page-wrapper p-3 w-100">
          <h2 className="mb-2 upper-case title" dangerouslySetInnerHTML={{ __html: regex(page.title.rendered) }} />
          <Contact branches={posts} />
        </div>
      );
    }

    if (page.slug === "feedback") {
      return (
        <Row justify="center" align="middle h-100" className="pt-2">
          <Col span={16}>
            <h2 className="my-2 upper-case title" dangerouslySetInnerHTML={{ __html: regex(page.title.rendered) }} />
            <Feedback />
          </Col>
        </Row>
      );
    }

    return (
      <Row justify="center" className="pt-2">
        <Col span={22} justify="center" className="center">
          <h2 className="my-2 pl-2 upper-case title" dangerouslySetInnerHTML={{ __html: regex(page.title.rendered) }} />

          {page?.acf?.id && renderIframe(page.acf.id)}
          <div id={`${(page.acf && page.acf.id) || ""}`} dangerouslySetInnerHTML={{ __html: page.content.rendered }} />
        </Col>
      </Row>
    );
  };

  return (
    <Layout
      loading={loading}
      title={regex(page.title.rendered)}
      image={getData(page._embedded, "image") || ""}
      menu={mainMenu}
      stickyMenu={stickyMenu}
    >
      <div className="content-wrapper">
        <div className="w-100 page-wrapper transparent">
          <Row justify="center" className="h-100">
            <Col xs={22} sm={22} md={20} lg={18} xl={16} className="h-100">
              <div className="page-wrapper-content h-100">{renderPageContent()}</div>
            </Col>
          </Row>
        </div>
      </div>
      <style global jsx>{`
        .border.absolute {
          border: none;
        }
      `}</style>
    </Layout>
  );
};

export async function getStaticProps(context) {
  try {
    const wp = new WPAPI({ endpoint: config(context).apiUrl });
    const slug = context.params?.slug;

    const [pageResult, categoryResult] = await Promise.allSettled([
      wp
        .pages()
        .slug(slug)
        .embed()
        .then((data) => data[0]),
      wp.categories().slug(slug).perPage(20).embed(),
    ]);

    const page = pageResult.status === "fulfilled" ? pageResult.value : null;
    const category = categoryResult.status === "fulfilled" ? categoryResult.value : [];

    const posts =
      category && category.length > 0
        ? await wp
            .posts()
            .categories(category[0]?.id || "")
            .perPage(16)
            .embed()
            .catch((error) => {
              console.error("Error fetching posts:", error);
              return [];
            })
        : [];

    return {
      props: { page, posts },
      revalidate: 120,
    };
  } catch (error) {
    console.error("Error in getStaticProps:", error);
    return {
      props: { page: null, posts: [] },
      revalidate: 120,
    };
  }
}

export async function getStaticPaths(context) {
  try {
    const wp = new WPAPI({ endpoint: config(context).apiUrl });

    const pageList = await wp
      .pages()
      .embed()
      .perPage(30)
      .catch((error) => {
        console.error("Error fetching pages for static paths:", error);
        return [];
      });

    return {
      paths: context.locales
        .map((locale) => {
          return pageList.map((p) => {
            return { params: { slug: p.slug }, locale };
          });
        })
        .flat(),

      fallback: false,
    };
  } catch (error) {
    console.error("Error in getStaticPaths:", error);
    return {
      paths: [],
      fallback: false,
    };
  }
}

export default Pages;
