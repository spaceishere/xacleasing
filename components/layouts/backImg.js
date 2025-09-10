import React from "react";
import config from "../../config";
import axios from "axios";
import { getData } from "../../utils";

class BackImg extends React.Component {
  state = {
    page: [],
  };

  componentDidMount() {
    axios
      .get(`${config().apiUrl}/wp/v2/pages?_embed&slug=backimg`)
      .then((res) =>
        this.setState({
          page: res.data,
        })
      )
      .catch((err) => console.log(err));
  }

  render() {
    const { page } = this.state;

    if (!page || page.length === 0) {
      return <img src="/images/back.jpg" alt="" />;
    }

    return <img src={getData(page[0]._embedded, "image")} alt="" />;
  }
}

export default BackImg;
