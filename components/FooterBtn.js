import { generateLink } from "../config";
import { CloudDownloadOutlined, RightOutlined } from "@ant-design/icons";

const FooterBtn = (data) => {
  if (!data || !data.btn) {
    return null;
  }
  const { btn, url } = data;

  if (btn.file) {
    return (
      <div className="footer-btn-wrapper">
        <a href={btn.file} download target="_blank">
          {btn.btn_text} <CloudDownloadOutlined />
        </a>
      </div>
    );
  }

  return (
    <div className="footer-btn-wrapper">
      <a href={url ? generateLink(`/p/` + url) : "#"}>
        {btn.btn_text || btn} <RightOutlined />
      </a>
    </div>
  );
};

export default FooterBtn;
