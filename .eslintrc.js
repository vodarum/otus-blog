module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ["airbnb-base", "prettier"],
  overrides: [],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  rules: {
    "import/no-extraneous-dependencies": ["error", { devDependencies: true }],
    "max-len": [
      "error",
      {
        code: 100,
        ignoreComments: true,
      },
    ],
  },
};
