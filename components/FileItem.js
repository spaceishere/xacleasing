import React from "react";
import { __ } from "../utils";
import MyLink from "./MyLink";

class FileItem extends React.Component {
  render() {
    const { post } = this.props;
    if (!post) {
      return null;
    }

    // console.log(this.props.post);
    if (post.content && post.content.rendered.includes("w3eden")) {
      const item = post.content.rendered
        .replace("Download", `${__("Татах")}`)
        .replace("data-downloadurl", `href`)
        .split("href='#'");

      if (post.acf.file) {
        let t = item[1].split(">");
        let h = t[0].replace(/".*"/, `"${post.acf.file}"`);
        h = h + " download" + " target='_blank'";
        t[0] = h;
        item[1] = t.join(">");
      }

      return (
        <div key={post.id} className="box w-100">
          <div dangerouslySetInnerHTML={{ __html: item }} />
        </div>
      );
    }
    return (
      <a href="">
        <div key={post.id} className="box w-100">
          <div dangerouslySetInnerHTML={{ __html: post.content.rendered }} />
        </div>
      </a>
    );
  }
}

export default FileItem;
