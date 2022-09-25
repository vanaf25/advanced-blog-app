module.exports = {
  images: {
    domains:["localhost"],

  },
  resolve: { extensions: ['', '.ts', '.tsx','.css',".scss",".module.scss"]},
  experimental: { images: { layoutRaw: true } },
  env: {
    // declare here all your variables
    CLIENT_URL: process.env.CLIENT_URL,
    SERVER_URL:process.env.SERVER_URL
  }
};
