# dsh-error-lens

English | [简体中文](README.md)

> Unofficial community plugin. It is not affiliated with or endorsed by DeepSeek.

Read-only, redacted model-request diagnostics for DeepSeek Harness Web. The plugin turns a generic failed-turn message into actionable facts and can copy a report suitable for a GitHub Discussion.

![dsh-error-lens showing a transport failure in DeepSeek Harness](https://raw.githubusercontent.com/Wanbinyu/dsh-error-lens/main/docs/images/dsh-error-lens.png)

## Why

OpenAI-compatible gateways often expose different failures through similar UI messages:

- `401`: missing or invalid credentials;
- `403`: credentials may be valid, but a User-Agent rule, model permission, or gateway policy rejected the request;
- `429`: request or quota rate limiting;
- `400`: incompatible model id, developer role, tool calls, or reasoning options;
- `5xx`, timeout, and connection failures: provider or network problems.

Error Lens keeps the status, stable code, request ID, provider, and model while attempting to remove API keys, bearer tokens, secret URL parameters, and user home paths before data reaches the browser.

## Features

- Shows the latest unresolved request failure above the composer;
- Classifies authentication, forbidden, rate-limit, context, compatibility, timeout, transport, and server failures;
- Displays the provider message and Request ID already persisted by DSH;
- Copies a redacted diagnostic report;
- Hides the warning after a later turn succeeds while retaining bounded session statistics;
- Does not read credential storage, save full prompts, retry requests, or mutate model traffic;
- Uses the official session projection and Web UI slot APIs without DOM injection.

## Install

Requires Node.js `>=22.19` and DeepSeek Harness `0.1.0-rc.6` or newer.
`v0.1.1` is type-checked, tested, built, and package-validated against DeepSeek Harness `0.1.1-rc.1` while retaining a compatibility branch for `0.1.0-rc.6` through `rc.8`.

```bash
dsh plugin --profile web add https://github.com/Wanbinyu/dsh-error-lens/archive/refs/tags/v0.1.1.tar.gz
```

Restart after installation or update:

```bash
dsh web
```

Remove:

```bash
dsh plugin --profile web remove dsh-error-lens
```

## Configuration

The default bundle entry in the Web profile's `cordis.patch.yml` is:

```yaml
- insert:
    - id: error-lens
      name: dsh-error-lens
      config:
        maxRecords: 10
        maxMessageLength: 2000
```

| Option | Default | Description |
| --- | ---: | --- |
| `maxRecords` | `10` | Recent failures retained per session projection, from 1 to 50 |
| `maxMessageLength` | `2000` | Maximum redacted message length, from 256 to 8000 characters |

## Privacy boundary

The plugin processes only terminal failure records already present in the DSH session log. Review a copied report before publishing it: text-based redaction cannot guarantee coverage of every provider-specific secret format.

The plugin does not:

- read keys from `settings.yaml`;
- record request bodies or full prompts;
- send telemetry to external services;
- change configuration, retry, or switch models.

## Development

```bash
npm install
npm run verify
```

`verify` runs Host/Web type checks, unit tests, the client build, and a package-content check.

## Feedback

Open issues and suggestions in [GitHub Issues](https://github.com/Wanbinyu/dsh-error-lens/issues). Before posting, use the copy button to generate a redacted diagnostic and review it once more for information you do not want to disclose.

## License

[MIT](LICENSE)
