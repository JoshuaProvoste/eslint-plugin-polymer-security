/**
 * @fileoverview Disallow vulnerable inner-h-t-m-l data binding in Polymer templates.
 * @author Joshua Provoste
 */
"use strict";

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = {
  meta: {
    type: "problem",
    docs: {
      description: "Disallow vulnerable inner-h-t-m-l data binding in Polymer templates.",
      category: "Security",
      recommended: true,
      url: "https://github.com/JoshuaProvoste/eslint-plugin-polymer-security", // Link to documentation/issues
    },
    fixable: null, // This rule is not auto-fixable as it requires a change in data handling
    schema: [], // no options
    messages: {
      unexpected: "Unsanitized data binding to 'inner-h-t-m-l' detected. This is a high-risk XSS sink. Consider using a custom sanitizer via window.Polymer.sanitizeDOMValue.",
    },
  },

  create(context) {
    return {
      // Case 1: Property in an object literal (e.g., in properties getter)
      Property(node) {
        const name = node.key.name || node.key.value;
        if (typeof name === 'string' && name.toLowerCase() === 'inner-h-t-m-l') {
          context.report({
            node: node.key,
            messageId: "unexpected",
          });
        }
      },

      // Case 2: Within an 'html' tagged template (Polymer 3 style)
      TaggedTemplateExpression(node) {
        if (node.tag.type === 'Identifier' && node.tag.name === 'html') {
          node.quasi.quasis.forEach(quasi => {
            // Check for the presence of 'inner-h-t-m-l' attribute in the template string
            if (quasi.value.raw.toLowerCase().includes('inner-h-t-m-l')) {
              context.report({
                node: quasi,
                messageId: "unexpected",
              });
            }
          });
        }
      }
    };
  },
};
