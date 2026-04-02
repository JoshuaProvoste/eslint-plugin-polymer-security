# eslint-plugin-polymer-security

ESLint rules for securing Polymer applications against common DOM-based XSS sinks.

[![npm version](https://img.shields.io/npm/v/eslint-plugin-polymer-security.svg)](https://www.npmjs.com/package/eslint-plugin-polymer-security)
[![npm downloads](https://img.shields.io/npm/dm/eslint-plugin-polymer-security.svg)](https://www.npmjs.com/package/eslint-plugin-polymer-security)

---

## The "Pit of Failure" in Polymer

Unlike modern frameworks like React and Angular, which are **Secure by Default**, Polymer (v3.5.2 and below) allows unsanitized data binding to sensitive DOM properties directly through its template syntax. This creates a "Pit of Failure" where legitimate developers can unintentionally introduce XSS vulnerabilities.

This plugin provides a proactive defense against these design-level flaws by detecting and blocking unsafe bindings at development time.

## Installation

You'll first need to install [ESLint](https://eslint.org):

```bash
npm i eslint --save-dev
```

Next, install `eslint-plugin-polymer-security`:

```bash
npm install eslint-plugin-polymer-security --save-dev
```

*Note: You can also install it directly from GitHub:*
`npm install https://github.com/JoshuaProvoste/eslint-plugin-polymer-security.git --save-dev`

## Usage

Add `polymer-security` to the plugins section of your `.eslintrc` configuration file. You can omit the `eslint-plugin-` prefix:

```json
{
    "plugins": [
        "polymer-security"
    ]
}
```

Then configure the rules you want to use under the rules section.

```json
{
    "rules": {
        "polymer-security/no-inner-h-t-m-l-binding": "error"
    }
}
```

## Supported Rules

### `no-inner-h-t-m-l-binding`

Disallows the use of the `inner-h-t-m-l` property in Polymer templates and object properties (like the `properties` getter).

**Vulnerable Code:**
```javascript
static get template() {
  return html`<div inner-h-t-m-l="[[untrustedData]]"></div>`;
}
```

**Secure Alternative:**
Implement a custom sanitizer via `window.Polymer.sanitizeDOMValue` and use safe data binding patterns.

## Proof of Concept (PoC)

A complete Proof of Concept demonstrating the Polymer XSS vulnerability is included in the [poc/](poc/) directory of this repository.

- **[poc/xss-demo.html](poc/xss-demo.html)**: A minimal Polymer 3 component that binds untrusted data from a URL parameter to the `inner-h-t-m-l` sink.
- **Evidence**:
  ![XSS Evidence](https://raw.githubusercontent.com/JoshuaProvoste/eslint-plugin-polymer-security/master/poc/xss_based_on_dynamic_payload.png)

### How to run the PoC:
1. Clone this repository.
2. Serve the root directory using a local web server (e.g., `python -m http.server 8081`).
3. Navigate to: `http://localhost:8081/poc/xss-demo.html?p=<img src=x onerror=alert('XSS_SUCCESS_IN_POC')>`

## License

MIT
