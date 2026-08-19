# Security

Please report security issues privately through GitHub Security Advisories.

The plugin never reads credential storage and never records full prompts. It
projects the terminal `LlmFailure` already stored in the DSH session log, then
redacts common credentials and user home paths before the value reaches the
browser. Redaction is defense in depth, not a guarantee; review a copied report
before publishing it.
