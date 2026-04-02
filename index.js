/**
 * @fileoverview ESLint rules for securing Polymer applications.
 * @author Joshua Provoste
 */
"use strict";

module.exports = {
  rules: {
    "no-inner-h-t-m-l-binding": require("./lib/rules/no-inner-h-t-m-l-binding"),
    "no-insecure-url-resolution": require("./lib/rules/no-insecure-url-resolution"),
  },
  configs: {
    recommended: {
      plugins: ["polymer-security"],
      rules: {
        "polymer-security/no-inner-h-t-m-l-binding": "error",
        "polymer-security/no-insecure-url-resolution": "error",
      },
    },
  },
};
