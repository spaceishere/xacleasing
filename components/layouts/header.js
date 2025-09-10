import React from "react";
import Head from 'next/head';

function Header({ title, image }) {
  let defaultUrl = 'https://xacleasing.mn/';

  if (process.browser) {
    defaultUrl = window.location.href;
  }

  return (
    <>
      <Head>
        <title>{title || 'ХасЛизинг'}</title>
        <meta charSet="UTF-8" />
        <meta name="keywords" content="wp, gerege" />
        <meta name="description" content="ХасЛизинг компани нь Лизингийн үйлчилгээг дагнан эрхлэх зорилгоор 2007 онд ТэнГэр Санхүүгийн Нэгдэл ХХК-ийн хөрөнгө оруулалтаар үүсгэн байгуулагдсан салбартаа тэргүүлэгч лизингийн мэргэшсэн компани юм." />
        <meta name="author" content="https://xacleasing.mn/" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta httpEquiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
        <meta httpEquiv="Pragma" content="no-cache" />
        <meta httpEquiv="Expires" content="0" />

        <meta property="og:title" content={title || "ХасЛизинг"} />
        <meta property="og:description" content="ХасЛизинг компани нь Лизингийн үйлчилгээг дагнан эрхлэх зорилгоор 2007 онд ТэнГэр Санхүүгийн Нэгдэл ХХК-ийн хөрөнгө оруулалтаар үүсгэн байгуулагдсан салбартаа тэргүүлэгч лизингийн мэргэшсэн компани юм." />
        <meta property="og:url" content={defaultUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content={image || "https://xacleasing.mn/static/sites/xacleasingnew/default/images/logo/xacleasinglogo.png"} />
        <meta property="og:site_name" content="Xacleasing" />

        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={title || "ХасЛизинг"} />
        <meta name="twitter:url" content={defaultUrl || twitter.com / XacLeasing} />
        <meta name="twitter:description" content="ХасЛизинг компани нь Лизингийн үйлчилгээг дагнан эрхлэх зорилгоор 2007 онд ТэнГэр Санхүүгийн Нэгдэл ХХК-ийн хөрөнгө оруулалтаар үүсгэн байгуулагдсан салбартаа тэргүүлэгч лизингийн мэргэшсэн компани юм." />
        <meta name="twitter:image" content={image || "https://xacleasing.mn/static/sites/xacleasingnew/default/images/logo/xacleasinglogo.png"} />
        <meta name="twitter:site" content="@XacLeasing" />
        <meta name="twitter:creator" content="@your-site-twit ter-name" />
        <meta name="twitter:image:alt" content="Gerege WP Template" />

        <link rel="shortcut icon" id="favicon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        {/* <link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;600&display=swap" rel="stylesheet" /> */}
        <link rel="stylesheet" type="text/css" charset="UTF-8" href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.min.css" />
        <link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick-theme.min.css" />

      </Head>
    </>
  );
}

export default Header;
