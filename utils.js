import T from "i18n-react";
import useTranslation from "next-translate/useTranslation";

export const setLocale = (currentLanguage, callback) => {
  import(`./locales/${currentLanguage}/common.json`)
    .then((data) => {
      const translations = data.default;
      T.setTexts(translations);

      callback && callback();
    })
    .catch((e) => console.log(e)); // tslint:disable-line
};

export const getData = (object, type) => {
  switch (type) {
    case "categories":
      return object && object["wp:term"] && object["wp:term"][0] ? object["wp:term"][0] : [];
    case "tags":
      return object && object["wp:term"] && object["wp:term"][1] ? object["wp:term"][1] : [];
    case "author":
      return object && object["author"] && object["author"][0] ? object["author"][0] : null;
    case "image":
      return object && object["wp:featuredmedia"] && object["wp:featuredmedia"][0] && object["wp:featuredmedia"][0].source_url
        ? object["wp:featuredmedia"][0].source_url
        : null;
    default:
      break;
  }
};

export const __ = (key, options) => {
  // const { t } = useTranslation("common");
  return key;
};

export const getLangParam = () => (typeof window !== "undefined" && window.location.href.indexOf("=en") > -1 ? "en" : "mn");

export const setParams = (router, query) => {
  if (typeof window !== "undefined") {
    const parsed = queryString.parse(location.search);
    Object.assign(parsed, query);
    const stringified = queryString.stringify(parsed);

    router.push(`${location.pathname}?${stringified}`);
  }
};

export const setUrl = (url) => {
  if (typeof window !== "undefined") {
    return (window.location.href = url);
  }

  return null;
};

export const getUrlPath = () => {
  if (typeof window !== "undefined") {
    return window.location.pathname;
  }

  return null;
};

export const regex = (content) => {
  if (!content) {
    return "";
  }

  return content
    .toString()
    .replace(/&amp;#8221;|&#8221;|&amp;#8220;|&#8220;/gi, '"')
    .replace(/&#8211;/gi, "-")
    .replace(/&#8230;/gi, "...");
};

export const cleanContent = (cont) => {
  if (!cont) {
    return "";
  }
  return cont.toString().replace(/<.+?>|&#8221;|&#8221;|&#8220;|&#8220;|&#8211;/g, "");
};

export const truncate = (str, no_words) => {
  if (!str || typeof str !== "string") {
    return "";
  }
  return str.split(" ").splice(0, no_words).join(" ");
};

export const prefixer = (url) => {
  if (process.env.NODE_ENV !== "production") {
    return url;
  }

  return `/${url}`;
};

export const calcI = (rate, nper = 0) => {
  // rate - /yearly/
  // nper - period /month/

  let itg = 1,
    sum = 0;

  for (var st = 1; st <= nper; st++) {
    itg = (1 / (((rate / 100 / 365) * 365) / 12 + 1)) * itg;
    sum += itg;
  }

  return sum;
};

export const calcMonthlyPayment = (rate, nper, pv, fv = 0) => {
  // rate - /yearly/
  // nper - period /month/
  // pv - present value
  // fv - future_value

  let itg = 1,
    sum = 0;

  for (var st = 1; st <= nper; st++) {
    itg = (1 / (((rate / 100 / 365) * 365) / 12 + 1)) * itg;
    sum += itg;
  }

  return (pv - (pv / 100) * fv) / sum;
};
export const addDays = (date, days) => {
  let result = new Date(Number(date));
  result.setDate(date.getDate() + Number(days));
  return result;
};
export const restTime = (enddate) => {
  return enddate.getTime() - new Date().getTime();
};
