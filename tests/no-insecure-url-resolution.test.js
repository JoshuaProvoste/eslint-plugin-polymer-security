/**
 * @fileoverview Tests for no-insecure-url-resolution rule.
 * @author Joshua Provoste
 */
"use strict";

const RuleTester = require("eslint").RuleTester;
const rule = require("../lib/rules/no-insecure-url-resolution");

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2018,
    sourceType: "module",
  },
});

ruleTester.run("no-insecure-url-resolution", rule, {
  valid: [
    // Static strings are considered safe
    "resolveUrl('https://example.com')",
    "this.resolveUrl('/assets/logo.png')",
    "this.resolveUrl('#anchor')",
    // Static template literals are also safe
    "this.resolveUrl(`./local/path`) ",
  ],

  invalid: [
    {
      code: "resolveUrl(userProvidedUrl)",
      errors: [{ messageId: "insecureUrlResolution" }],
    },
    {
      code: "this.resolveUrl(this.link)",
      errors: [{ messageId: "insecureUrlResolution" }],
    },
    {
      code: "this.resolveUrl(`${baseURI}/path`) ",
      errors: [{ messageId: "insecureUrlResolution" }],
    },
    {
      code: "const resolved = this.resolveUrl(window.location.search);",
      errors: [{ messageId: "insecureUrlResolution" }],
    },
    {
      code: "this.resolveUrl(getData());",
      errors: [{ messageId: "insecureUrlResolution" }],
    },
  ],
});
