# eslint-plugin-polymer-security

ESLint rules for securing Polymer applications against common DOM-based XSS sinks.

[![npm version](https://img.shields.io/npm/v/eslint-plugin-polymer-security.svg)](https://www.npmjs.com/package/eslint-plugin-polymer-security)
[![npm downloads](https://img.shields.io/npm/dm/eslint-plugin-polymer-security.svg)](https://www.npmjs.com/package/eslint-plugin-polymer-security)

---

## The "Pit of Failure" in Polymer

Unlike modern frameworks like React and Angular, which are **Secure by Default**, Polymer (v3.5.2 and below) allows unsanitized data binding to sensitive DOM properties directly through its template syntax. This creates a "Pit of Failure" where legitimate developers can unintentionally introduce XSS vulnerabilities.

This plugin provides a proactive defense against these design-level flaws by detecting and blocking unsafe patterns at development time.

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
        "polymer-security/no-inner-h-t-m-l-binding": "error",
        "polymer-security/no-insecure-url-resolution": "error"
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

### `no-insecure-url-resolution`

Disallows calling `resolveUrl()` or `this.resolveUrl()` with dynamic (non-literal) input. Polymer's URL resolution utility uses a weak regular expression that fails to filter dangerous protocol schemes like `javascript:`, `data:`, and `vbscript:`.

**Vulnerable Code:**
```javascript
_resolve(url) {
  return this.resolveUrl(url); // Vulnerable if 'url' is untrusted
}
```

**Secure Alternative:**
Only pass hardcoded string literals to `resolveUrl()` or implement a robust protocol whitelist/sanitizer before resolution.

---

## Security Best Practices for Polymer

To proactively prevent DOM-based XSS in Polymer applications, follow these recommendations:

### 1. Avoid `inner-h-t-m-l` Bindings
Always prefer standard data binding to `textContent` or safe attributes. If you must render HTML:
- **Never** bind untrusted data directly to `inner-h-t-m-l`.
- Use a battle-tested library like **DOMPurify** to sanitize any HTML before it reaches a Polymer property.
- Register a global sanitizer using `Polymer.sanitizeDOMValue` (if using Polymer 2.x/3.x) to intercept and clean all property-to-attribute bindings.

### 2. Sanitize URL Inputs
Polymer's `resolveUrl` is a path normalization utility, **not a security sanitizer**. 
- **Whitelist Protocols**: Before passing a string to `resolveUrl`, verify that it starts with an approved scheme (e.g., `https:`, `http:`, `mailto:`, or a relative `/`).
- **Use the URL API**: Use the native `new URL(input)` constructor to parse and validate the protocol. If the protocol is `javascript:`, reject the input immediately.

### 3. Use Content Security Policy (CSP)
Implement a strict CSP to act as a secondary defense layer. A well-configured CSP can block the execution of inline scripts and unauthorized protocols even if an injection occurs.

---

## Proof of Concept (PoC)

Complete Proof of Concepts demonstrating these vulnerabilities are included in the [poc/](poc/) directory.

### 1. Unsanitized inner-h-t-m-l Binding
- **Location**: `poc/inner-h-t-m-l-binding/poc.html`
- **Description**: Demonstrates direct injection into the DOM via unsanitized data binding.
- **Evidence**:
  ![XSS Evidence](https://raw.githubusercontent.com/JoshuaProvoste/eslint-plugin-polymer-security/master/poc/inner-h-t-m-l-binding/xss.png)

### 2. Insecure URL Resolution (ABS_URL Bypass)
- **Location**: `poc/xss-url-bypass/poc.html`
- **Description**: Demonstrates how `resolveUrl` fails to filter malicious protocols, leading to XSS on user interaction.
- **Evidence**:
  ![XSS Evidence](https://raw.githubusercontent.com/JoshuaProvoste/eslint-plugin-polymer-security/master/poc/xss-url-bypass/xss.png)

### How to run the PoCs:
1. Clone this repository.
2. Serve the root directory using a local web server (e.g., `python -m http.server 8081`).
3. For **inner-h-t-m-l**: Navigate to `http://localhost:8081/poc/inner-h-t-m-l-binding/poc.html?p=<img src=x onerror=alert('XSS_SUCCESS_IN_POC')>`
4. For **URL Bypass**: Navigate to `http://localhost:8081/poc/xss-url-bypass/poc.html?url=javascript:alert('XSS_SUCCESS_URL_BYPASS')` and click the link.

## License

MIT
