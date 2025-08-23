module.exports = {
  plugins: {
    "postcss-import": {},
    "@tailwindcss/postcss": {},
    "postcss-nested": {},
    "postcss-custom-properties": {
      preserve: false,
    },
    autoprefixer: {},
    ...(process.env.NODE_ENV === "production" ? { cssnano: {} } : {}),
  },
};
