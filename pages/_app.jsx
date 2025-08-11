import "../styles/globals.css";
import "react-pro-sidebar/dist/css/styles.css";
import Head from "next/head";
import ascii from "../utils/ascii";
import React from "react";

const config = {
  "site": {
    "title": "Your Portfolio Name",
    "url": "https://www.yourportfolio.com/",
    "themeColor": "#011627",
    "charset": "utf-8",
    "viewport": "width=device-width, initial-scale=1.0"
  },
  "seo": {
    "openGraph": {
      "type": "website",
      "url": "https://www.yourportfolio.com/",
      "title": "Your Portfolio Name | Portfolio",
      "description": "Personal website created by Your Name",
      "image": "https://i.imgur.com/766AFNG.png"
    },
    "twitter": {
      "card": "summary_large_image",
      "url": "https://www.yourportfolio.com/",
      "title": "Your Portfolio Name | Portfolio",
      "description": "Personal website created by Your Name available on Github",
      "image": "https://i.imgur.com/766AFNG.png"
    },
    "google": {
      "siteVerification": "any verification token"
    }
  },
  "console": {
    "ascii": {
      "enabled": true,
      "style": "color: #7488E5FF; font-family: monospace; font-size: 0.9em;"
    }
  },
  "dependencies": {
    "styles": [
      "../styles/globals.css",
      "react-pro-sidebar/dist/css/styles.css"
    ]
  }
}

function MyApp({ Component, pageProps }) {
  React.useEffect(() => {
    if (config.console.ascii.enabled) {
      console.log(ascii, config.console.ascii.style);
    }
  }, []);

  return (
    <>
      <Head>
        <title>{config.site.title}</title>
        <meta property="og:type" content={config.seo.openGraph.type} />
        <meta property="og:url" content={config.seo.openGraph.url} />
        <meta property="og:title" content={config.seo.openGraph.title} />
        <meta property="og:description" content={config.seo.openGraph.description} />
        <meta property="og:image" content={config.seo.openGraph.image} />
        <meta
          name="google-site-verification"
          content={config.seo.google.siteVerification}
        />
        <meta name="twitter:card" content={config.seo.twitter.card} />
        <meta name="twitter:url" content={config.seo.twitter.url} />
        <meta name="twitter:title" content={config.seo.twitter.title} />
        <meta name="twitter:description" content={config.seo.twitter.description} />
        <meta name="twitter:image" content={config.seo.twitter.image} />
        <meta name="theme-color" content={config.site.themeColor} />
        <meta charSet={config.site.charset} />
        <meta name="viewport" content={config.site.viewport} />
      </Head>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;