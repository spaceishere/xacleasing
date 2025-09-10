const nextTranslate = require("next-translate");

module.exports = nextTranslate({
  reactStrictMode: true,

  env: {
    NEXT_PUBLIC_ERXES_API_URL: "https://xacleasing.app.erxes.io/gateway/graphql",
    NEXT_PUBLIC_ERXES_APP_TOKEN:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcHAiOnsibmFtZSI6InRlc3QiLCJjcmVhdGVkQXQiOiIyMDI1LTA5LTA2VDA0OjIwOjUzLjM2N1oiLCJ1c2VyR3JvdXBJZCI6IlpjR0taWm1rQml0OWp0czhYIiwiZXhwaXJlRGF0ZSI6IjIwMjUtMTAtMTBUMTY6MDQ6MTkuNzkyWiIsIm5vRXhwaXJlIjp0cnVlLCJhbGxvd0FsbFBlcm1pc3Npb24iOnRydWUsIl9pZCI6IklfSThQNmR2VmZWRTkzQUM0RXZBeiIsIl9fdiI6MH0sImlhdCI6MTc1NzUyMDI2N30.qCJuFOB1bNuLFWkYjI2gIvYa3SEdh5f3f2mExGQ3BAk",
  },

  images: {
    domains: [
      "images-na.ssl-images-amazon.com",
      "utfs.io",
      "cdn.discordapp.com",
      "media.discordapp.net",
      "t4.ftcdn.net",
      "urangan.app.erxes.io",
      "img.freepik.com",
    ],
  },
});
