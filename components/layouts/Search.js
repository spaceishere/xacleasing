import Layout from '../components/layout';
import WPAPI from 'wpapi';
import React, { Component } from 'react';
import Link from 'next/link';
import Categories from '../components/Categories';
import { getData } from '../utils';

const wp = new WPAPI({ endpoint: 'https://erxes.io/blog_wp/wp-json' });

export default class Search extends Component {
  state = {
    posts: [],
    filter: '',
  };

  executeSearch = async () => {
    const { filter } = this.state;
    let posts = await wp
      .posts()
      .search(filter);

    this.setState({ posts });
  }

  render() {
    const { categories, posts } = this.props;

    if (categories.length === 0) return <Error statusCode={404} />;

    return (
      <div className="blog-header header-height">
				<div className="container container-sm">
					<div className="search-box">
						<input 
							type="text" 
							placeholder="Search" 
							onChange={e => this.setState({ filter: e.target.value })}
              onKeyDown={this.handleKeyDown}
						/>
						<img src="/search.svg" className="search-icon" alt="search" />
					</div>
					<div className="example">
						<span>
							<strong>For example:</strong> <i>marketing, growthhacking, sales</i>{' '}
						</span>
					</div>
				</div>
			</div>
    );
  }
}
