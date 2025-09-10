import React from "react";
import Header from "./header";
import Menu from "./menu";
import StickyMenu from "./sticky-menu";
import Socials from "../Socials";
import BackImg from "./backImg";

const Layout = (props) => {
  const { children, title, image, menu, stickyMenu } = props;
  const [theme, setTheme] = React.useState(localStorage.theme || "dark");
  React.useEffect(() => {
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = (checked) => {
    setTheme(checked ? "light" : "dark");
  };
  return (
    <div className={theme}>
      <Header title={title} image={image} />
      <main className="relative">
        <Menu toggleTheme={toggleTheme} theme={theme} menu={menu} />
        <div className="back-img">
          <BackImg />
        </div>
        <div className="border h-100 ml-16"></div>
        <div className={"border h-100 ml-50 absolute"}></div>
        <div className={"border h-100 ml-83"}></div>
        <div className="main">{children}</div>
        <StickyMenu items={stickyMenu} />
        <Socials />
      </main>
      <footer className="pt-30 pb-30"></footer>
    </div>
  );
};

export default Layout;
