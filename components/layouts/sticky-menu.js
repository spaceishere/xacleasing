import React from "react";
import Link from "next/link";
import { generateLink } from "../../config";
import { Tooltip } from "antd";
import {
  AimOutlined,
  QuestionOutlined,
  CalculatorOutlined,
  DiffOutlined,
  PhoneOutlined,
} from "@ant-design/icons";

class StickyToolBar extends React.Component {
  state = { showMessenger: false };
  renderItem(item, icon) {
    return (
      <Tooltip key={item.ID} placement="left" title={item.title}>
        <div id={item.ID === 454 ? "fbchatbot" : ""}>
          <Link
            title={item.title}
            href={
              item.object === "category"
                ? `/c/[slug]`
                : item.object === "post"
                ? `/d/[slug]`
                : item.object === "page"
                ? `/p/[slug]`
                : item.object === "custom" && item.ID != 454
                ? "[item.url]"
                : `${item.slug}`
            }
            as={
              item.object === "category"
                ? generateLink(`/c/${item.slug}`)
                : item.object === "post"
                ? generateLink(`/d/${item.slug}`)
                : item.object === "page"
                ? generateLink(`/p/${item.slug}`)
                : item.object === "custom" && item.ID != 454
                ? `${item.url}`
                : `${generateLink(item.slug)}`
            }
          >
            <a
              target={item.object === "custom" ? "_blank" : "_self"}
              rel="noopener noreferrer nofollow"
            >
              <div className="icon">{icon}</div>
            </a>
          </Link>
        </div>
      </Tooltip>
    );
  }

  renderMenu() {
    const { items } = this.props;

    const icons = [
      <QuestionOutlined />,
      <DiffOutlined />,
      <CalculatorOutlined />,
      <AimOutlined />,
      <PhoneOutlined />,
    ];

    if (!items || items.length === 0) {
      return null;
    }

    return items.map((item, i) => this.renderItem(item, icons[i]));
  }

  render() {
    return <div className="toolbar hidden-xs">{this.renderMenu()}</div>;
  }
}

export default StickyToolBar;
