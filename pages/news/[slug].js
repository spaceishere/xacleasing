import React, { useState, useEffect } from "react";
import WPAPI from "wpapi";
import Error from "next/error";
import { Col, Divider, Row, Menu, Dropdown } from "antd";
import config, { generateLink } from "../../config";
import Layout from "../../components/layouts/Layout";
import { getData, __, regex } from "../../utils";
import MyLink from "../../components/MyLink";
import useTranslation from "next-translate/useTranslation";
import { useGraphQL } from "../../providers/ApolloProvider";

import { ShareAltOutlined, FacebookFilled, TwitterOutlined, LinkedinFilled } from "@ant-design/icons";
import { FacebookShareButton, TwitterShareButton, LinkedinShareButton } from "react-share";

const GET_NEWS_DETAIL = `
query Post($id: String) {
  cmsPost(_id: $id) {
    _id
    type
    clientPortalId
    title
    slug
    content
    excerpt
    categoryIds
    status
    tagIds
    authorId
    featured
    featuredDate
    scheduledDate
    autoArchiveDate
    reactions
    reactionCounts
    thumbnail {
      url
      type
      name
      __typename
    }
    images {
      url
      type
      name
      __typename
    }
    video {
      url
      type
      name
      __typename
    }
    audio {
      url
      type
      name
      __typename
    }
    documents {
      url
      type
      name
      __typename
    }
    attachments {
      url
      type
      name
      __typename
    }
    pdfAttachment {
      pages {
        url
        name
        type
        size
        duration
        __typename
      }
      __typename
    }
    videoUrl
    createdAt
    updatedAt
    authorKind
    author {
      ... on User {
        _id
        username
        email
        details {
          fullName
          shortName
          avatar
          firstName
          lastName
          middleName
          __typename
        }
        __typename
      }
      ... on ClientPortalUser {
        _id
        fullName
        firstName
        lastName
        email
        username
        customer {
          avatar
          __typename
        }
        __typename
      }
      __typename
    }
    categories {
      _id
      name
      slug
      __typename
    }
    tags {
      _id
      name
      __typename
    }
    customFieldsData
    __typename
  }
}
`;

const NewsDetail = ({ category, post, loading, mainMenu, stickyMenu }) => {
  const { t } = useTranslation("common");
  const [width, setWidth] = useState(0);
  const [graphqlPost, setGraphqlPost] = useState(null);
  const [graphqlLoading, setGraphqlLoading] = useState(false);
  const [graphqlError, setGraphqlError] = useState(null);
  const { query } = useGraphQL();

  useEffect(() => {
    if (typeof window !== "undefined") {
      setWidth(window.innerWidth);
    }
  }, []);

  const fetchNewsDetail = async (identifier) => {
    if (!identifier) return;

    setGraphqlLoading(true);
    setGraphqlError(null);

    try {
      const variables = {
        id: identifier,
      };

      const result = await query(GET_NEWS_DETAIL, variables);

      if (result?.cmsPost) {
        setGraphqlPost(result.cmsPost);
      } else if (result?.data?.cmsPost) {
        setGraphqlPost(result.data.cmsPost);
      }
    } catch (error) {
      console.error("GraphQL error:", error);
      setGraphqlError(error.message);
    } finally {
      setGraphqlLoading(false);
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const pathParts = window.location.pathname.split("/");
      const urlSlug = pathParts[pathParts.length - 1];
      if (urlSlug && urlSlug !== "news") {
        fetchNewsDetail(urlSlug);
      }
    }
  }, []);

  useEffect(() => {
    const postIdentifier = post?.slug || post?._id || post?.id;
    if (postIdentifier && postIdentifier !== post?.slug) {
      fetchNewsDetail(postIdentifier);
    }
  }, [post]);

  const currentPost = graphqlPost || post;

  if (!currentPost) {
    return <Error statusCode={404} />;
  }

  const renderNewsShare = () => {
    const shareUrl = `https://xacleasing.mn/news/${currentPost.slug || currentPost._id}`;
    const shareTitle = currentPost.title?.rendered || currentPost.title || "";

    const menu = (
      <Menu>
        <Menu.Item>
          <FacebookShareButton url={shareUrl} quote={regex(shareTitle)} hashtag="#xacleasing">
            <FacebookFilled className="mr-2" /> Facebook
          </FacebookShareButton>
        </Menu.Item>
        <Menu.Item>
          <TwitterShareButton url={shareUrl} hashtag={["#xacleasing"]} title={regex(shareTitle)}>
            <TwitterOutlined className="mr-2" /> Twitter
          </TwitterShareButton>
        </Menu.Item>
        <Menu.Item>
          <LinkedinShareButton url={shareUrl} title={regex(shareTitle)} source="https://xacleasing.mn/">
            <LinkedinFilled className="mr-2" /> Linkedin
          </LinkedinShareButton>
        </Menu.Item>
      </Menu>
    );

    return (
      <div className="d-flex justify-content-center">
        <Dropdown overlay={menu} placement="topCenter" trigger={["click"]}>
          <div className="ant-btn mt-2 ml-1 d-flex" onClick={(e) => e.preventDefault()}>
            <ShareAltOutlined />
            <span className="ml-1">{t("Түгээх")}</span>
          </div>
        </Dropdown>
      </div>
    );
  };

  const renderBackBtn = () => {
    return <MyLink title={t("Буцах")} slug="news" type="c" className="back-btn" icon />;
  };

  const postTitle = currentPost.title?.rendered || currentPost.title || "";
  const postContent = currentPost.content?.rendered || currentPost.content || "";
  const postImage =
    currentPost.thumbnail?.url ||
    (currentPost.images && currentPost.images[0]?.url) ||
    currentPost.featuredImage?.url ||
    getData(currentPost._embedded, "image") ||
    "";

  return (
    <Layout menu={mainMenu} loading={loading || graphqlLoading} title={regex(postTitle)} image={postImage} stickyMenu={stickyMenu}>
      <div className="content-wrapper">
        <div className="w-100 page-wrapper transparent">
          <Row justify="center" className="h-100">
            <Col xs={22} sm={22} md={20} lg={18} xl={16} className="h-100">
              <div className="page-wrapper-content h-100">
                <Row justify="center pt-2">
                  <Col span={22}>
                    <h2 className="title my-2 pl-2 upper-case">{regex(postTitle)}</h2>
                    {postImage && (
                      <img className="w-100 p-1" src={`https://xacleasing.app.erxes.io/gateway/read-file?key=${postImage}`} alt={postTitle} />
                    )}
                  </Col>
                  <Col xs={20} lg={22} className="post-detail p-1">
                    <div className="my-2" dangerouslySetInnerHTML={{ __html: postContent }} />

                    {graphqlError && (
                      <div className="error-message">
                        <p>GraphQL алдаа: {graphqlError}</p>
                      </div>
                    )}
                  </Col>
                </Row>
                {renderNewsShare()}
              </div>
            </Col>
          </Row>
        </div>
        <div className="footer-content">
          <Row justify={width < 576 ? "center" : "end"} className="w-100">
            <Col xs={22} sm={12} md={10} lg={12} xl={16}>
              {renderBackBtn()}
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
  const slug = context.params?.slug;

  try {
    // Эхлээд slug-аар хайх (WordPress)
    let post = await wp
      .posts()
      .slug(slug)
      .embed()
      .then((data) => data[0])
      .catch(() => null);

    // Олдохгүй бол ID-аар хайх (WordPress-ын ID байж болно)
    if (!post && slug && !isNaN(slug)) {
      post = await wp
        .posts()
        .id(slug)
        .embed()
        .then((data) => data)
        .catch(() => null);
    }

    // GraphQL ID format байж болно - dummy post үүсгэх
    if (!post) {
      post = {
        id: slug,
        _id: slug,
        slug: slug,
        title: { rendered: "" },
        content: { rendered: "" },
        excerpt: { rendered: "" },
        categories: [],
      };
    }

    let category = null;
    if (post && post.categories && post.categories.length > 0) {
      category = await wp
        .categories()
        .id(post.categories[0])
        .perPage(1)
        .embed()
        .then((data) => data[0])
        .catch(() => null);
    }

    // Default news category
    if (!category) {
      category = await wp
        .categories()
        .slug("news")
        .embed()
        .then((data) => data[0])
        .catch(() => ({ slug: "news", name: "News" }));
    }

    return {
      props: { post, category },
      revalidate: 300,
    };
  } catch (error) {
    console.error("Error fetching news detail:", error);
    return {
      props: {
        post: {
          id: slug,
          _id: slug,
          slug: slug,
          title: { rendered: "" },
          content: { rendered: "" },
          excerpt: { rendered: "" },
          categories: [],
        },
        category: { slug: "news", name: "News" },
      },
      revalidate: 300,
    };
  }
}

export async function getStaticPaths(context) {
  // Бүх slug-уудыг runtime-д шийдэхийн тулд хоосон paths буцаах
  // Энэ нь GraphQL ID болон WordPress slug хоёулангийг дэмжинэ
  return {
    paths: [],
    fallback: "blocking",
  };
}

export default NewsDetail;
