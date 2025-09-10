import React from "react";
import { withRouter } from "next/router";
import { Row, Col, Input, Modal, Space } from "antd";
import Link from "next/link";
import Router from "next/router";
import { Button, Drawer, Switch } from "antd";
import { __, getLangParam, setUrl, regex } from "../../utils";
import MyLink from "../MyLink";
import { PhoneOutlined, SearchOutlined } from "@ant-design/icons";

const { Search } = Input;

class MenuComponent extends React.Component {
  state = {
    toggleMenu: false,
    theme: "light",
    visible: false,
    drawerVisible: false,
    width: 0,
    searchVisible: false,
  };

  componentDidMount() {
    this.updateWindowDimensions();
    window.addEventListener("resize", this.updateWindowDimensions);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateWindowDimensions);
  }

  updateWindowDimensions = () => {
    this.setState({ width: window.innerWidth });
  };

  handleSearchValue = (key) => {
    Router.push({
      pathname: `/search`,
      query: { key },
    });
  };

  showDrawer = () => {
    this.setState({
      drawerVisible: true,
    });
  };

  onClose = () => {
    this.setState({
      drawerVisible: false,
    });
  };

  onShowSearch = () => {
    this.setState({ searchVisible: true });
  };

  onCloseSearch = () => {
    this.setState({ searchVisible: false });
  };

  toggleTheme = (checked) => {
    props.toggleTheme(checked);
  };

  changeTheme(theme) {
    this.setState({ theme: theme });
  }

  toggleMenu = () => {
    this.setState({
      toggleMenu: !this.state.toggleMenu,
    });
  };

  renderLanguage() {
    const { router } = this.props;
    const currentLanguage = router.locale;
    const nextLang = currentLanguage === "mn" ? "en" : "mn";

    const onClick = () => {
      const { pathname, query } = router;
      router.push({ pathname, query }, undefined, { locale: nextLang });
    };

    return (
      <div onClick={onClick}>
        <img
          className="language-flag"
          src={
            currentLanguage === "mn"
              ? "/images/flags/mnflag.png"
              : "/images/flags/enflag.png"
          }
          alt="language-flag"
        />
      </div>
    );
  }

  renderLogo() {
    const currentLanguage = getLangParam();
    const theme = this.props.theme;
    const logo =
      currentLanguage === "mn" && theme === "light"
        ? "/images/logo_english.png"
        : currentLanguage === "mn" && theme === "dark"
        ? "/images/logo_english_dark.png"
        : currentLanguage === "en" && theme === "dark"
        ? "/images/logo-dark.png"
        : "/images/xaclogo.png";

    return (
      <Link href={"/"} as={"/"}>
        <a>
          <img key={Math.random()} src={logo} alt="xacleasing-logo" />
        </a>
      </Link>
    );
  }

  renderSwitch(object) {
    switch (object) {
      case "category":
        return "/c/";
      case "page":
        return "/p/";
      default:
        return "/d/";
    }
  }

  renderType(slug, object) {
    if (slug === "about" || slug === "career") {
      return null;
    }
    return this.renderSwitch(object);
  }
  renderChild = (subItem) => {
    if (!subItem) {
      return null;
    }
    const { ID, url, slug, object } = subItem;
    const { asPath } = this.props.router;

    const objectType = this.renderType(subItem.slug, subItem.object);
    const isActiveClass = asPath
      ? asPath.includes(objectType + slug)
      : url === pathname;

    return (
      <li key={subItem.ID} className={`${isActiveClass && "active"}`}>
        <MyLink
          title={regex(subItem.title)}
          url={url}
          slug={slug}
          prefetch={false}
          className="child"
          type={
            slug === "about"
              ? "about"
              : slug === "career"
              ? "career"
              : object === "category"
              ? `c`
              : object === "post"
              ? `d`
              : object === "page"
              ? `p`
              : "custom"
          }
        />
      </li>
    );
  };

  renderSubItem(item) {
    if (item.child_items && item.child_items.length > 0) {
      return (
        <li key={item.ID} className="main-sub-menu h-100">
          <span>{item.title}</span>
          <div className="sub-menu">
            <ul className="list-style-none">
              {item.child_items.map((subItem) => this.renderChild(subItem))}
            </ul>
          </div>
        </li>
      );
    }

    return (
      <li key={item.ID} className="main-sub-menu">
        <MyLink
          title={regex(item.title)}
          slug={item.slug}
          url={item.url}
          type={
            ID === 244 || ID === 249
              ? "about"
              : item.object === "category"
              ? `c`
              : item.object === "post"
              ? `d`
              : item.object === "page"
              ? `p`
              : "custom"
          }
        />
      </li>
    );
  }

  renderTheme() {
    const { theme, toggleTheme } = this.props;
    return (
      <div className="switch-mode">
        {/* <span key="dark">Dark</span> */}
        <Switch
          key="switch-mode"
          checked={theme === "dark" ? false : true}
          onChange={toggleTheme}
          onClick={() => this.changeTheme(toggleTheme)}
        />
        {/* <span key="light">Light</span> */}
      </div>
    );
  }

  renderMegaMenu() {
    const { menu } = this.props;
    if (!menu.items || menu.items.length === 0) {
      return null;
    }
    return (
      <Row>
        <Col span={12} className="with-border">
          <ul className="list-style-none">
            {menu.items
              .slice(0, 2)
              .map((subItem) => this.renderSubItem(subItem))}
          </ul>
        </Col>
        <Col span={12}>
          <ul className="list-style-none right-list">
            {menu.items
              .slice(2, 4)
              .map((subItem) => this.renderSubItem(subItem))}
          </ul>
        </Col>
      </Row>
    );
  }

  renderMenu() {
    const { menu } = this.props;

    if (!menu.items || menu.items.length === 0) {
      return null;
    }
    if (Number(this.state.width) < 991) {
      return (
        <>
          <div className="logo d-flex space-between mobile-logo">
            <Button
              className="mobile-menu-button h-100"
              type="link"
              onClick={this.showDrawer}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="9"
                viewBox="0 0 20 9"
              >
                <g
                  id="burgerMenu"
                  data-name="burger-menu"
                  transform="translate(-322 -61.5)"
                >
                  <line
                    id="Line_19"
                    data-name="Line 19"
                    x2="10"
                    transform="translate(322 62)"
                    fill="none"
                    stroke="#fff"
                    strokeWidth="1"
                  />
                  <line
                    id="Line_20"
                    data-name="Line 20"
                    x2="20"
                    transform="translate(322 70)"
                    fill="none"
                    stroke="#fff"
                    strokeWidth="1"
                  />
                </g>
              </svg>
            </Button>
            {this.renderLogo()}
          </div>

          <Drawer
            className="mobile-menu"
            placement="left"
            closable={false}
            onClose={this.onClose}
            visible={this.state.drawerVisible}
          >
            <ul className="list-style-none">
              {menu.items.map((subItem) => this.renderSubItem(subItem))}
            </ul>
          </Drawer>
        </>
      );
    }

    return (
      <ul className="d-flex menu-horizontal h-100">
        <div className="menu-icon" onClick={this.toggleMenu}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="9"
            viewBox="0 0 20 9"
          >
            <g
              id="burgerMenu"
              data-name="burger-menu"
              transform="translate(-322 -61.5)"
            >
              <line
                id="Line_19"
                data-name="Line 19"
                x2="10"
                transform="translate(322 62)"
                fill="none"
                stroke="#fff"
                strokeWidth="1"
              />
              <line
                id="Line_20"
                data-name="Line 20"
                x2="20"
                transform="translate(322 70)"
                fill="none"
                stroke="#fff"
                strokeWidth="1"
              />
            </g>
          </svg>
        </div>

        {menu.items.map((subItem) => this.renderSubItem(subItem))}
      </ul>
    );
  }

  renderMobileMenu() {
    return (
      <>
        <Button
          className="menu-button h-100"
          type="link"
          onClick={this.showDrawer}
        >
          <i className="fas fa-bars" />
        </Button>
        <Drawer
          className="mobile-menu"
          placement="right"
          closable={false}
          onClose={this.onClose}
          visible={this.state.drawerVisible}
        ></Drawer>
      </>
    );
  }

  render() {
    return (
      <>
        <div className="main-header">
          <Row justify="center" align="middle" className="h-100">
            <Col md={0} lg={3} xl={4}>
              <div className="logo main-logo">{this.renderLogo()}</div>
            </Col>
            <Col xs={22} sm={22} md={20} lg={18} xl={16} className="h-100">
              <div className="d-flex menu-wrapper h-100">
                {this.renderMenu()}
                <Space key="menu-space" align="center" size={[24, 0]} wrap>
                  <div
                    key="search"
                    className="search-box-menu"
                    // onClick={this.onShowSearch}
                    onClick={() => this.handleSearchValue()}
                    style={{ cursor: "pointer" }}
                  >
                    <SearchOutlined />
                  </div>
                  {this.renderTheme()}
                  <div key="lang" className="lang">
                    {this.renderLanguage()}
                  </div>
                </Space>
              </div>
            </Col>
            <Col md={0} lg={3} xl={4} align="center">
              <Space
                align="center"
                key="right-menu-space"
                size={[16, 0]}
                wrap
                className="h-100"
              >
                <a
                  key="mobile"
                  rel="noopener noreferrer nofollow"
                  href="tel:+97670112061"
                  className="telephone"
                >
                  <PhoneOutlined /> +976 7011-2061
                </a>
                {/* <a key="login" href="https://e-leasing.mn/" target="_blank" className="login-btn">
                  {__("Нэвтрэх")}
                </a> */}
              </Space>
            </Col>
          </Row>
        </div>

        <div
          className={`mega-menu ${this.state.toggleMenu && "show"}`}
          scroll="no"
        >
          <Row justify="center" align="middle" className="h-100 w-100">
            <Col span={16}>
              {this.renderMegaMenu()}
              <button onClick={this.toggleMenu} className="close-btn">
                <div className="in">
                  <div className="close-btn-block"></div>
                  <div className="close-btn-block"></div>
                </div>
                <div className="out">
                  <div className="close-btn-block"></div>
                  <div className="close-btn-block"></div>
                </div>
              </button>
            </Col>
          </Row>
          <Modal
            className="search-modal"
            title={
              <>
                <SearchOutlined />
                <span className="search-modal-title">{__("Хайх")}</span>
              </>
            }
            visible={this.state.searchVisible}
            footer={null}
            onCancel={this.onCloseSearch}
          >
            <Search
              className="search"
              size="large"
              placeholder={__("Хайх утга аа оруулна уу")}
              onSearch={(value) => this.handleSearchValue(value)}
              enterButton
            />
          </Modal>
        </div>
      </>
    );
  }
}

export default withRouter(MenuComponent);
