import Document, { Html, Head, Main, NextScript } from 'next/document';
import React from 'react';
import { getLangParam } from '../utils';

export default class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    return (
      <Html lang={getLangParam()}>
        <Head>
          {/* Google Tag manager */}
          <script
            dangerouslySetInnerHTML={{
              __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                        new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                        'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                        })(window,document,'script','dataLayer','GTM-MPQD53D');`,
            }}
          />
        </Head>

        <body style={{ margin: 0 }}>
          {/* TagManager */}
          <noscript
            dangerouslySetInnerHTML={{
              __html: `<iframe src="https://www.googletagmanager.com/ns.html?id=GTM-MPQD53D"
                        height="0" width="0" style="display:none;visibility:hidden"></iframe>`,
            }}
          />

          {/* Erxes chat */}
          <script
            dangerouslySetInnerHTML={{
              __html: `
                        window.erxesSettings = {
                            messenger: {
                              brand_id: "exdvMb",
                              css: '.erxes-launcher { background-size: 30px; right: 12px; }'
                            },
                          };
                          (function() {
                            var script = document.createElement('script');
                            script.src = "https://erxes.xacleasing.mn/widgets/build/messengerWidget.bundle.js";
                            script.async = true;
                            var entry = document.getElementsByTagName('script')[0];
                            entry.parentNode.insertBefore(script, entry);
                          })()`,
            }}
          />

          {/* FB chat */}
          <div id="fb-root"></div>
          <div id="fb-customer-chat" className="fb-customerchat">
            {' '}
          </div>
          <script
            dangerouslySetInnerHTML={{
              __html: `var chatbox = document.getElementById('fb-customer-chat');
                        chatbox.setAttribute("page_id", "163328540412640");
                        chatbox.setAttribute("attribution", "biz_inbox");
                        window.fbAsyncInit = function() {
                            FB.init({
                            xfbml            : true,
                            version          : 'v11.0'
                            });
                        };

                        (function(d, s, id) {
                            var js, fjs = d.getElementsByTagName(s)[0];
                            if (d.getElementById(id)) return;
                            js = d.createElement(s); js.id = id;
                            js.src = 'https://connect.facebook.net/en_US/sdk/xfbml.customerchat.js';
                            fjs.parentNode.insertBefore(js, fjs);
                        }(document, 'script', 'facebook-jssdk'));`,
            }}
          />

          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
