/**
 * @fileoverview Disallow insecure URL resolution in Polymer applications.
 * @author Joshua Provoste
 */
"use strict";

module.exports = {
  meta: {
    type: "problem",
    docs: {
      description: "Disallow vulnerable URL resolution that bypasses protocol sanitization in Polymer.",
      category: "Security",
      recommended: true,
      url: "https://github.com/JoshuaProvoste/eslint-plugin-polymer-security",
    },
    fixable: null,
    schema: [],
    messages: {
      insecureUrlResolution: "Insecure URL resolution detected. 'resolveUrl' bypasses protocol sanitization for schemes like 'javascript:', 'data:', and 'vbscript:'. Ensure input is sanitized or use a string literal.",
    },
  },

  create(context) {
    return {
      CallExpression(node) {
        const callee = node.callee;
        let isResolveUrl = false;

        // Check for resolveUrl(url)
        if (callee.type === "Identifier" && callee.name === "resolveUrl") {
          isResolveUrl = true;
        }

        // Check for this.resolveUrl(url)
        if (
          callee.type === "MemberExpression" &&
          callee.object.type === "ThisExpression" &&
          callee.property.type === "Identifier" &&
          callee.property.name === "resolveUrl"
        ) {
          isResolveUrl = true;
        }

        if (isResolveUrl && node.arguments.length > 0) {
          const firstArg = node.arguments[0];

          // We flag any non-literal input as potentially insecure
          const isSafeLiteral = firstArg.type === "Literal";
          const isSafeStaticTemplate = firstArg.type === "TemplateLiteral" && firstArg.expressions.length === 0;

          if (!isSafeLiteral && !isSafeStaticTemplate) {
            context.report({
              node: firstArg,
              messageId: "insecureUrlResolution",
            });
          }
        }
      },
    };
  },
};
