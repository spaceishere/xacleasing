import React from "react";
import { __ } from "../utils";
import { LeftOutlined, RightOutlined } from "@ant-design/icons"

const Pagination = ({ postsPerPage, totalPosts, currentPage, paginate }) => {
    const pageNumbers = [];

    if (totalPosts <= postsPerPage) {
        return null;
    }

    for (let i = 1; i <= Math.ceil(totalPosts / postsPerPage); i++) {
        pageNumbers.push(i);
    }

    return (
        <ul className="d-flex list-style-none pagination">
            <li
                onClick={() => paginate(currentPage - 1)}
                className={`${pageNumbers[0] === currentPage && "disabled"
                    }  page-link prevNext border-round `}
            >
                <LeftOutlined />
            </li>
            {pageNumbers.map((number) => (
                <li
                    key={number}
                    className={`${currentPage === number && "active"} page-item`}
                >
                    <div
                        onClick={() => paginate(number)}
                        className={`flex justify-center align-center page-link`}
                    >
                        {number}
                    </div>
                </li>
            ))}
            <li
                onClick={() => paginate(currentPage + 1)}
                className={`${pageNumbers.reverse()[0] === currentPage && "disabled"
                    } page-link prevNext border-round`}
            >
                <RightOutlined />
            </li>
        </ul>
    );
};

export default Pagination;
