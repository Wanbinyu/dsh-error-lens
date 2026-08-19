export function buildDiagnosticReport(projection, t) {
    const record = projection.latest;
    if (record === undefined)
        return '';
    const categoryKey = `category.${record.category}`;
    const hintKey = `hint.${record.category}`;
    return [
        `# ${t('reportTitle')}`,
        '',
        `- ${t('turn')}: ${record.turn}`,
        `- ${t('provider')}: ${record.provider}`,
        `- ${t('model')}: ${record.model}`,
        `- ${t('latest')}: ${t(categoryKey)}`,
        `- Code: ${record.code}`,
        ...record.status === undefined ? [] : [`- ${t('status')}: ${record.status}`],
        ...record.requestId === undefined ? [] : [`- ${t('requestId')}: ${record.requestId}`],
        `- Time: ${new Date(record.time).toISOString()}`,
        `- ${t('failureCount')}: ${projection.totalFailures}`,
        '',
        '## Message',
        '',
        '```text',
        record.message,
        '```',
        '',
        '## Suggested check',
        '',
        t(hintKey),
        '',
        `> ${t('privacy')}`,
    ].join('\n');
}
