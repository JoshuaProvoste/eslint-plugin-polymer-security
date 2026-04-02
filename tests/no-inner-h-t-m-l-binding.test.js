/**
 * @fileoverview Tests for the no-inner-h-t-m-l-binding rule.
 * @author Joshua Provoste
 */
"use strict";

const { RuleTester } = require("eslint");
const rule = require("../lib/rules/no-inner-h-t-m-l-binding");

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2018,
    sourceType: "module",
  },
});

ruleTester.run("no-inner-h-t-m-l-binding", rule, {
  valid: [
    "const x = { safe: 1 };",
    "class T { static get template() { return html`<div>Safe</div>`; } }",
  ],

  invalid: [
    // Simple object property
    {
      code: "const x = { 'inner-h-t-m-l': 1 };",
      errors: [{ messageId: "unexpected" }],
    },
    // Polymer properties pattern
    {
      code: "class T { static get properties() { return { 'inner-h-t-m-l': String }; } }",
      errors: [{ messageId: "unexpected" }],
    },
    // Polymer template pattern
    {
      code: "class T { static get template() { return html`<div inner-h-t-m-l='[[x]]'></div>`; } }",
      errors: [{ messageId: "unexpected" }],
    },
  ],
});

console.log("ESLint Plugin Rule Tests Passed Successfully!");
