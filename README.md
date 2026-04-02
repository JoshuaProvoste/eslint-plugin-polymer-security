# eslint-plugin-polymer-security

ESLint rules for securing Polymer applications against common DOM-based XSS sinks.

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

## License

MIT
