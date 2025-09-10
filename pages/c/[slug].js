import WPAPI from "wpapi";
import React, { useEffect, useState } from "react";
import config from "../../config";
import Layout from "../../components/layouts/Layout";
import { __, getData, regex, truncate } from "../../utils";
import NotFound from "../notFound";
import { Col, Row } from "antd";
import ProductItem from "../../components/ProductItem";
import Pagination from "../../components/Pagination";
import Contact from "../../components/home/contact";
import VendorList from "../../components/home/vendor-list";
import Faq from "../../components/Faq";
import FileItem from "../../components/FileItem";
import FooterBtn from "../../components/FooterBtn";
import { useGraphQL } from "../../providers/ApolloProvider";

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
        excerpt
      }
    }
  }
`;

const GET_BRANCHES = `
query BranchesList(
    $clientPortalId: String!
    $tagIds: [String]
    $page: Int
    $perPage: Int
  ) {
    cmsPostList(
      clientPortalId: $clientPortalId
      tagIds: $tagIds
      page: $page
      perPage: $perPage
    ) {
      posts {
        _id
        title
        content
        excerpt
        slug
        thumbnail {
          url
        }
        images {
          url
        }
        customFieldsData
        createdAt
        updatedAt
      }
    }
  }
`;

const Cat = ({ category, categories, childCategories, parentPost, posts, loading, mainMenu, stickyMenu }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage, setPostsPerPage] = useState(8);
  const [graphqlPosts, setGraphqlPosts] = useState(null);
  const [graphqlLoading, setGraphqlLoading] = useState(false);
  const [graphqlError, setGraphqlError] = useState(null);
  const [graphqlBranches, setGraphqlBranches] = useState(null);
  const [branchesLoading, setBranchesLoading] = useState(false);
  const [branchesError, setBranchesError] = useState(null);
  const { query } = useGraphQL();

  useEffect(() => {
    setPostsPerPage(category?.acf?.pagiantion || 8);
  }, []);

  const fetchPostsWithGraphQL = async (categoryId) => {
    if (!categoryId) return;

    setGraphqlLoading(true);
    setGraphqlError(null);

    try {
      const variables = {
        clientPortalId: "cp-wzk8M6gshwVUeGnfdR",
        page: 1,
        tagIds: ["8h_2WXZAt8ANr2FWEjlze"],
        perPage: 20,
      };

      const result = await query(GET_ABOUT_POSTS, variables);

      console.log("GraphQL result:", result);
      if (result?.cmsPostList?.posts) {
        console.log("GraphQL posts:", result.cmsPostList.posts);
        setGraphqlPosts(result.cmsPostList.posts);
      } else if (result?.data?.cmsPostList?.posts) {
        console.log("GraphQL posts from data:", result.data.cmsPostList.posts);
        setGraphqlPosts(result.data.cmsPostList.posts);
      }
    } catch (error) {
      console.error("GraphQL error:", error);
      setGraphqlError(error.message);
    } finally {
      setGraphqlLoading(false);
    }
  };

  // GraphQL-ээр branches татах функц
  const fetchBranchesWithGraphQL = async () => {
    setBranchesLoading(true);
    setBranchesError(null);

    try {
      const variables = {
        clientPortalId: "cp-wzk8M6gshwVUeGnfdR",
        page: 1,
        perPage: 20,
        tagIds: ["QvfsMABCYqhBXdBhMfCVR"],
      };

      const result = await query(GET_BRANCHES, variables);

      if (result?.cmsPostList?.posts) {
        console.log("GraphQL branches result:", result.cmsPostList.posts);
        setGraphqlBranches(result.cmsPostList.posts);
      } else if (result?.data?.cmsPostList?.posts) {
        console.log("GraphQL branches from data:", result.data.cmsPostList.posts);
        setGraphqlBranches(result.data.cmsPostList.posts);
      }
    } catch (error) {
      console.error("GraphQL branches error:", error);
      setBranchesError(error.message);
    } finally {
      setBranchesLoading(false);
    }
  };

  useEffect(() => {
    if (category?.id) {
      fetchPostsWithGraphQL(category.id);
    }

    // Branch category бол branches татах
    if (category?.acf?.type === "branch") {
      fetchBranchesWithGraphQL();
    }
  }, [category?.id, currentPage, postsPerPage]);

  if (!category) {
    return <NotFound />;
  }

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const renderPosts = () => {
    // GraphQL өгөгдөл шууд ашиглах (server-side pagination)
    // WordPress өгөгдөлд client-side pagination хийх
    const postsToRender = graphqlPosts ? graphqlPosts : posts || [];
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;

    // WordPress өгөгдөлд л pagination хийх, GraphQL-д хийхгүй
    const paginatedPosts = graphqlPosts ? graphqlPosts : postsToRender.slice(indexOfFirstPost, indexOfLastPost);

    if (category?.acf && category.acf.type === "branch") {
      return (
        <div className="w-100">
          <Contact
            branches={posts}
            branchList={true}
            graphqlBranches={graphqlBranches}
            graphqlLoading={branchesLoading}
            graphqlError={branchesError}
          />
        </div>
      );
    }

    if (category.acf && category.acf.type === "vendor") {
      return (
        <VendorList
          vendorCategories={categories || []}
          vendorPosts={parentPost || []}
          currentCat={category.id}
          childCategories={childCategories || []}
          childPosts={posts || []}
          type="inside"
        />
      );
    }

    if (category.acf && category.acf.type === "faq") {
      return <Faq childCategories={childCategories || []} posts={posts || []} />;
    }

    if (category.acf && category.acf.type === "files") {
      return (
        <Row gutter={64} className="mt-1">
          {posts.map((post) => (
            <Col key={post.id} xs={24} sm={12} md={12} lg={8} xl={8}>
              <FileItem post={post} />
            </Col>
          ))}
        </Row>
      );
    }

    return (
      <>
        <Row gutter={[20, 80]}>
          {graphqlPosts && graphqlPosts.length > 0 ? (
            // GraphQL posts харуулах
            graphqlPosts.map((post) => (
              <Col key={post._id} xs={24} sm={12} md={12} lg={8} xl={6}>
                <ProductItem id={post._id} title={post.title || ""} img={post.thumbnail?.url} descr={post.excerpt} slug={post.slug || post._id} />
              </Col>
            ))
          ) : paginatedPosts && paginatedPosts.length > 0 ? (
            // WordPress posts харуулах
            paginatedPosts.map((post) => (
              <Col key={post.id} xs={24} sm={12} md={12} lg={8} xl={6}>
                <ProductItem
                  id={post.id}
                  title={post.title?.rendered || ""}
                  img={getData(post._embedded, "image")}
                  descr={regex(post.excerpt?.rendered || "")}
                  slug={post.slug}
                />
              </Col>
            ))
          ) : (
            <Col span={24}>
              <p style={{ textAlign: "center", padding: "20px" }}>{graphqlLoading ? "Ачааллаж байна..." : "Мэдээ олдсонгүй"}</p>
            </Col>
          )}
        </Row>
        {graphqlError && (
          <div className="error-message">
            <p>GraphQL алдаа: {graphqlError}</p>
          </div>
        )}
        {graphqlLoading && (
          <div className="loading-message">
            <p>GraphQL өгөгдөл ачааллаж байна...</p>
          </div>
        )}
      </>
    );
  };

  return (
    <Layout title={regex(category.name)} loading={loading} menu={mainMenu} stickyMenu={stickyMenu}>
      <div className="content-wrapper">
        <div className="w-100 page-wrapper transparent">
          <Row justify="center" className="w-100">
            <Col xs={22} sm={22} md={20} lg={18} xl={16}>
              <div className="page-wrapper p-3 w-100">
                {category.acf && category.acf.type != "vendor" && <h2 className="title mb-2 upper-case">{regex(category.name)} </h2>}
                {renderPosts()}
              </div>
            </Col>
          </Row>
        </div>

        <div className="footer-content">
          <Row justify="end" className="w-100">
            {category.acf && category.acf.pagination && (
              <Col xs={22} sm={22} md={8} lg={16} xl={16}>
                {(graphqlPosts || posts) && (
                  <Pagination
                    currentPage={currentPage}
                    postsPerPage={postsPerPage}
                    totalPosts={(graphqlPosts || posts || []).length}
                    paginate={paginate}
                  />
                )}
              </Col>
            )}
            <Col xs={22} sm={22} md={8} lg={4} xl={4}>
              {category.acf && category.acf.footer_btn && category.acf.footer_btn.btn_text && <FooterBtn btn={category.acf.footer_btn} />}
            </Col>
          </Row>
        </div>
      </div>
    </Layout>
  );
};

export async function getStaticProps(context) {
  const wp = new WPAPI({ endpoint: config(context).apiUrl });
  const slug = context.params?.slug;
  const category = await wp
    .categories()
    .slug(slug)
    .embed()
    .then((data) => {
      return data[0];
    });

  const posts = await wp
    .posts()
    .categories(category.id || "")
    .perPage(100)
    .embed();

  const categories = await wp
    .categories()
    .parent(category.parent || "")
    .embed();

  const childCategories = await wp
    .categories()
    .parent(category.id || "")
    .embed();

  const parentPost = await wp
    .posts()
    .categories(category.parent || "")
    .perPage(100)
    .embed();

  return {
    props: { category, categories, childCategories, parentPost, posts },
    revalidate: 300,
  };
}

export async function getStaticPaths(context) {
  const wp = new WPAPI({ endpoint: config(context).apiUrl });

  const cats = await wp.categories().embed().perPage(40);
  return {
    paths: context.locales
      .map((locale) => {
        return cats.map((cat) => {
          return { params: { slug: cat.slug }, locale };
        });
      })
      .flat(),

    fallback: false,
  };
}

export default Cat;
