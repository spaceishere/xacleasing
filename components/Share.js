import React from "react";
import {
  FacebookShareButton,
  EmailShareButton,
  LinkedinShareButton,
  TwitterShareButton,
  EmailIcon,
  FacebookIcon,
  TwitterIcon,
  LinkedinIcon
} from "react-share";

class Share extends React.Component {
  render() {
    const { path, title = '' } = this.props;

    return (
      <div className="share-container">
        <FacebookShareButton title={title} url={path} >
          <FacebookIcon size={32} round={true} className="mr-10" />
        </FacebookShareButton>
        <TwitterShareButton title={title} url={path} >
          <TwitterIcon size={32} round={true} className="mr-10" />
        </TwitterShareButton>
        <LinkedinShareButton title={title} url={path} >
          <LinkedinIcon size={32} round={true} className="mr-10" />
        </LinkedinShareButton>
        <EmailShareButton title={title} url={path} >
          <EmailIcon size={32} round={true} />
        </EmailShareButton>
      </div>
    );
  }
}

export default Share;
