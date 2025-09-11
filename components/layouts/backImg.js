import React from "react";
import config from "../../config";
import axios from "axios";
import { getData } from "../../utils";

class BackImg extends React.Component {
  state = {
    page: [],
    loading: true,
    imageLoaded: false,
    useWordPressImage: false,
  };

  componentDidMount() {
    // Always show fallback image initially
    this.setState({ loading: false });

    // Try to load WordPress image in background
    axios
      .get(`${config().apiUrl}/wp/v2/pages?_embed&slug=backimg`)
      .then((res) => {
        if (res.data && res.data.length > 0) {
          const imageUrl = getData(res.data[0]._embedded, "image");
          if (imageUrl) {
            // Test if the WordPress image can be loaded
            const testImg = new Image();
            testImg.onload = () => {
              this.setState({
                page: res.data,
                useWordPressImage: true,
                imageLoaded: true,
              });
            };
            testImg.onerror = () => {
              console.log("WordPress image failed to load, using fallback");
              this.setState({ useWordPressImage: false, imageLoaded: true });
            };
            testImg.src = imageUrl;
          } else {
            this.setState({ useWordPressImage: false, imageLoaded: true });
          }
        } else {
          this.setState({ useWordPressImage: false, imageLoaded: true });
        }
      })
      .catch((err) => {
        console.log("BackImg API error:", err);
        this.setState({ useWordPressImage: false, imageLoaded: true });
      });
  }

  render() {
    const { page, loading, useWordPressImage, imageLoaded } = this.state;

    // Show fallback image by default or if WordPress image failed
    if (loading || !useWordPressImage) {
      return (
        <img
          src="/images/back.jpg"
          alt="Background"
          style={{
            display: "block",
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      );
    }

    // Show WordPress image only if it successfully loaded
    if (useWordPressImage && page && page.length > 0) {
      const imageUrl = getData(page[0]._embedded, "image");
      return (
        <img
          src={imageUrl}
          alt="Background"
          style={{
            display: "block",
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      );
    }

    // Fallback case
    return (
      <img
        src="/images/back.jpg"
        alt="Background"
        style={{
          display: "block",
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
      />
    );
  }
}

export default BackImg;
