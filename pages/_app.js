import React from "react";
import App from "next/app";
import "antd/dist/antd.css";
import "../public/styles/style.min.css";
import Router from "next/router";
import NProgress from "nprogress";
import { setLocale } from "../utils";
import config, { getLang, fetcher } from "../config";
import { Providers } from "../providers/index";

Router.events.on("routeChangeStart", () => {
  NProgress.start();
});

Router.events.on("routeChangeComplete", () => {
  NProgress.done();
});

Router.events.on("routeChangeError", () => NProgress.done());

function MyApp({ Component, pageProps, lang, mainMenu, stickyMenu }) {
  const [loading, setLoading] = React.useState(false);
  const [isLangSetted, setLangState] = React.useState(false);
  if (!isLangSetted) {
    setLocale(lang || "mn", () => {
      setLangState(true);
    });
  }

  React.useEffect(() => {
    const handleStart = () => NProgress.start() && setLoading(true);

    // handleComplete event was not firing
    const handleComplete = () => NProgress.done() && setLoading(false);

    Router.events.on("routeChangeStart", handleStart);
    Router.events.on("routeChangeComplete", handleComplete);
    Router.events.on("routeChangeError", handleComplete);

    return () => {
      Router.events.off("routeChangeStart", handleStart);
      Router.events.off("routeChangeComplete", handleComplete);
      Router.events.off("routeChangeError", handleComplete);
    };
  });
  if (!isLangSetted) {
    return null;
  }

  return (
    <Providers>
      <Component {...pageProps} mainMenu={mainMenu} stickyMenu={stickyMenu?.items || []} loading={loading} />
    </Providers>
  );
}

MyApp.getInitialProps = async (appContext) => {
  // calls page's `getInitialProps` and fills `appProps.pageProps`
  let mainMenu = (await fetcher(`${config(appContext.ctx.locale).apiUrl}/menus/v1/menus/main-menu`)) || { items: [] }; // Provide fallback

  const stickyMenu = (await fetcher(`${config(appContext.ctx.locale).apiUrl}/menus/v1/menus/toolbar-menu`)) || { items: [] }; // Provide fallback

  // Add static leasing pages to the menu if they don't exist
  const staticLeasingPages = [
    {
      ID: 9001,
      title: "Шинэ автомашины лизинг",
      slug: "new-car-leasing",
      url: "/new-car-leasing",
      object: "page",
    },
    {
      ID: 9002,
      title: "Машин механизмын лизинг",
      slug: "machinery-leasing",
      url: "/machinery-leasing",
      object: "page",
    },
    {
      ID: 9003,
      title: "Үйлдвэрлэлийн тоног төхөөрөмжийн лизинг",
      slug: "manufacturing-equipment-leasing",
      url: "/manufacturing-equipment-leasing",
      object: "page",
    },
    {
      ID: 9004,
      title: "Эмнэлэгийн тоног төхөөрөмжийн лизинг",
      slug: "medical-equipment-leasing",
      url: "/medical-equipment-leasing",
      object: "page",
    },
  ];

  // Find "Бүтээгдэхүүн үйлчилгээ" menu item and add leasing pages as children
  if (mainMenu.items && mainMenu.items.length > 0) {
    const productServiceItem = mainMenu.items.find(
      (item) =>
        item.title === "Бүтээгдэхүүн үйлчилгээ" ||
        item.title === "Products & Services" ||
        item.title.includes("Бүтээгдэхүүн") ||
        item.title.includes("Product")
    );

    if (productServiceItem) {
      if (!productServiceItem.child_items) {
        productServiceItem.child_items = [];
      }

      // Add static leasing pages to existing child items
      staticLeasingPages.forEach((page) => {
        const exists = productServiceItem.child_items.some((child) => child.slug === page.slug || child.title === page.title);
        if (!exists) {
          productServiceItem.child_items.push(page);
        }
      });
    }
  }

  const appProps = await App.getInitialProps(appContext);

  return { ...appProps, lang: getLang(appContext.ctx), mainMenu, stickyMenu };
};

export default MyApp;
