import React, { useEffect, useState } from "react";
import Layout from "../components/layouts/Layout";
import { Col, Row } from "antd";
import Contact from "../components/home/contact";
import { __ } from "../utils";
import { useGraphQL } from "../providers/ApolloProvider";

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
        excerpt
        customFieldsData
      }
    }
  }
`;

const BranchesPage = ({ loading, mainMenu, stickyMenu }) => {
  const { query } = useGraphQL();
  const [graphqlBranches, setGraphqlBranches] = useState([]);
  const [branchesLoading, setBranchesLoading] = useState(false);
  const [branchesError, setBranchesError] = useState(null);

  const fetchBranchesWithGraphQL = async () => {
    setBranchesLoading(true);
    setBranchesError(null);

    try {
      const variables = {
        clientPortalId: "cp-wzk8M6gshwVUeGnfdR",
        page: 1,
        tagIds: ["QvfsMABCYqhBXdBhMfCVR"],
        perPage: 20,
      };

      console.log("Fetching branches with GraphQL...", variables);
      const result = await query(GET_ABOUT_POSTS, variables);
      console.log("GraphQL branches result:", result);

      if (result?.cmsPostList?.posts) {
        setGraphqlBranches(result.cmsPostList.posts);
      }
    } catch (error) {
      console.error("Error fetching branches:", error);
      setBranchesError(error.message);
    } finally {
      setBranchesLoading(false);
    }
  };

  useEffect(() => {
    fetchBranchesWithGraphQL();
  }, []);

  return (
    <Layout loading={loading} title={__("Салбарууд")} menu={mainMenu} stickyMenu={stickyMenu}>
      <div className="content-wrapper">
        <div className="w-100 page-wrapper transparent">
          <Row justify="center" className="h-100">
            <Col xs={22} sm={22} md={20} lg={18} xl={16} className="h-100">
              <div className="page-wrapper-content h-100">
                <div className="page-wrapper p-3 w-100">
                  <h2 className="mb-2 upper-case title">{__("Салбарууд")}</h2>
                  <Contact branchList={true} graphqlBranches={graphqlBranches} graphqlLoading={branchesLoading} graphqlError={branchesError} />
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
    revalidate: 120,
  };
}

export default BranchesPage;
