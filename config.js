import queryString from "query-string";
import axios from "axios";

export const fetcher = (url) => axios.get(url).then((res) => res.data);

export const getLang = (context) => {
  let lang = getParam("lang") || "";
  if (typeof window === "undefined" && context) {
    lang = context.query?.lang || "";
  }

  return lang;
};

export const getParam = (name) => {
  if (typeof window !== "undefined") {
    const parsed = queryString.parse(location.search);

    return parsed[name];
  }

  return null;
};

const config = (locale) => {
  // Remove language prefix from API URL to avoid redirect issues
  // The WordPress API doesn't need language-specific endpoints
  return {
    apiUrl: `https://admin.xacleasing.mn/wp-json`,
  };
};

export const generateLink = (url) => {
  return `${url}`;
};

export default config;
