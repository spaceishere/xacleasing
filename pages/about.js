import React, { useState, useEffect } from "react";
import { Col, Row } from "antd";
import { Pagination } from "react-bootstrap";
import Layout from "../components/layouts/Layout";
import ReactPageScroller from "../components/react-page-scroller";
import { __ } from "../utils";
import { useGraphQL } from "../providers/ApolloProvider";
import config from "../config";

const GET_ABOUT_POSTS = `
query PostList(
    $clientPortalId: String!
    $type: String
    $featured: Boolean
    $categoryIds: [String]
    $searchValue: String
    $status: PostStatus
    $page: Int
    $perPage: Int
    $tagIds: [String]
    $sortField: String
    $sortDirection: String
  ) {
    cmsPostList(
      clientPortalId: $clientPortalId
      featured: $featured
      type: $type
      categoryIds: $categoryIds
      searchValue: $searchValue
      status: $status
      page: $page
      perPage: $perPage
      tagIds: $tagIds
      sortField: $sortField
      sortDirection: $sortDirection
    ) {
      currentPage
      totalCount
      totalPages
      posts {
        _id
        title
        createdAt
        updatedAt
        status
        thumbnail {
          url
        }
        content
      }
    }
  }
`;

const About = ({ mainMenu, stickyMenu }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const { query } = useGraphQL();

  // Fallback function to fetch from WordPress API
  const fetchFromWordPress = async () => {
    try {
      const response = await fetch(`${config().apiUrl}/wp/v2/posts?per_page=20&categories=5`); // Assuming category 5 is for "About"
      if (!response.ok) throw new Error("WordPress API request failed");

      const wpPosts = await response.json();
      const transformedData = {
        posts: wpPosts.map((post) => ({
          _id: post.id.toString(),
          title: post.title.rendered,
          content: post.content.rendered,
          createdAt: post.date,
          updatedAt: post.modified,
          status: post.status.toUpperCase(),
          thumbnail: post.featured_media ? { url: post.featured_media } : null,
        })),
        totalCount: wpPosts.length,
        currentPage: 1,
        totalPages: 1,
      };

      setData(transformedData);
    } catch (wpError) {
      console.error("WordPress API also failed:", wpError);
      setError("Both GraphQL and WordPress API failed to load data");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const result = await query(GET_ABOUT_POSTS, {
          clientPortalId: "cp-wzk8M6gshwVUeGnfdR",
          page: 1,
          tagIds: ["MsHbm3T4hX-Xg3mF5AiMO"],
          perPage: 20,
        });

        if (result && result.cmsPostList) {
          setData(result.cmsPostList);
          console.log("Fetched data from GraphQL:", result.cmsPostList);
        } else {
          throw new Error("No data received from GraphQL query");
        }
      } catch (err) {
        console.error("GraphQL Error, trying WordPress API:", err);
        // Fallback to WordPress API
        await fetchFromWordPress();
      } finally {
        setLoading(false);
      }
    };

    if (query) {
      fetchData();
    }
  }, [query]);

  const handlePageChange = (pageNumber) => {
    const posts = data?.posts || [];
    if (pageNumber >= 0 && pageNumber < Math.min(posts.length, 2)) {
      setCurrentPage(pageNumber);
    }
  };

  const handleScrollDown = () => {
    return currentPage > 0;
  };

  const paginationClicked = (event) => {
    setCurrentPage(Number(event.target.name));
  };

  const renderSubContent = (type, post) => {
    if (type === "img" && typeof window !== "undefined" && window.innerWidth > 480) {
      const imageUrl = post?.thumbnail?.url ? `https://xacleasing.app.erxes.io/gateway/read-file?key=${post.thumbnail.url}` : "/images/logo.png"; // Fallback to existing logo

      return (
        <img
          className="w-full p-1 about-img"
          src={imageUrl}
          alt={post?.title || "About image"}
          onError={(e) => {
            e.target.src = "/images/logo.png"; // Fallback to existing logo
          }}
          style={{ maxHeight: "300px", objectFit: "cover" }}
        />
      );
    }

    if (type === "cont") {
      return (
        <div className="p-2">
          <h2 className="upper-case title">{post?.title || "About Us"}</h2>
          <div
            align="left"
            className="my-2"
            dangerouslySetInnerHTML={{
              __html: post?.content || "Content is being loaded...",
            }}
          />
        </div>
      );
    }

    return null;
  };

  const renderContent = (post) => {
    if (!post) return <div>No post data available</div>;

    let first = post?.title === "Танилцуулга" ? "img" : "cont";
    let sec = post?.title === "Танилцуулга" ? "cont" : "img";

    return (
      <Row justify="center" className="w-100" align="middle">
        <Col xs={22} sm={22} md={10} lg={9} xl={8} className="my-2">
          {renderSubContent(first, post)}
        </Col>
        <Col xs={22} sm={22} md={10} lg={9} xl={8} className="my-2">
          {renderSubContent(sec, post)}
        </Col>
      </Row>
    );
  };

  const getPagesNumbers = () => {
    const posts = data?.posts || [];
    const pageNumbers = [];

    for (let i = 0; i < Math.min(posts.length, 2); i++) {
      pageNumbers.push(<Pagination.Item key={i} name={i} active={i === currentPage} onClick={(e) => paginationClicked(e)}></Pagination.Item>);
    }
    return pageNumbers;
  };

  const posts = data?.posts || [];

  return (
    <Layout title={__("Бидний тухай")} menu={mainMenu} stickyMenu={stickyMenu}>
      {loading && (
        <div className="loading-container" style={{ textAlign: "center", padding: "50px" }}>
          <div>{__("Уншиж байна...")} ⏳</div>
        </div>
      )}

      {error && (
        <div className="error-container" style={{ textAlign: "center", padding: "50px", color: "red" }}>
          <div>
            {__("Алдаа гарлаа")}: {error}
          </div>
          <button
            onClick={() => window.location.reload()}
            style={{ marginTop: "10px", padding: "10px 20px", background: "#1890ff", color: "white", border: "none", borderRadius: "4px" }}
          >
            {__("Дахин оролдох")}
          </button>
        </div>
      )}

      {!loading && !error && posts.length === 0 && (
        <div className="no-content" style={{ textAlign: "center", padding: "50px" }}>
          <div>{__("Мэдээлэл байхгүй байна")}</div>
        </div>
      )}

      {!loading && !error && posts.length > 0 && (
        <>
          <ReactPageScroller
            pageOnChange={handlePageChange}
            customPageNumber={currentPage}
            renderAllPagesOnFirstRender={true}
            blockScrollDown={handleScrollDown}
          >
            {posts.slice(0, 2).map((post, index) => (
              <div key={post._id || index} className="component center">
                {renderContent(post)}
                {index === 0 && posts.length > 1 && <div className="icon-scroll" onClick={() => handlePageChange(1)}></div>}
              </div>
            ))}
          </ReactPageScroller>

          {posts.length > 1 && (
            <Pagination className="pagination-additional-class" size="large">
              {getPagesNumbers()}
            </Pagination>
          )}
        </>
      )}
    </Layout>
  );
};

export default About;
