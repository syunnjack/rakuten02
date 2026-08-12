const input = document.getElementById('input');
const output = document.getElementById('output');
document.getElementById('run').addEventListener('click', () => {
  const text = (input.value || '').trim();
  const lines = text ? text.split(/\n+/).filter(Boolean) : ['（入力例を入れて生成してください）'];
  output.value = [
    '【アフィ開示文・PR表記ジェネレータ】',
    '',
    ...lines.map((l, i) => `${i + 1}. ${l}`),
    '',
    '— 知多丸 / 積み上げログ',
    '※必要に応じて文言を調整してください。'
  ].join('\n');
});
document.getElementById('copy').addEventListener('click', async () => {
  if (!output.value) return;
  await navigator.clipboard.writeText(output.value);
  alert('コピーしました');
});
