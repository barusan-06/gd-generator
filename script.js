document.getElementById("generate").addEventListener("click", () => {
  const type = document.getElementById("type").value;
  const level = document.getElementById("level").value;
  const time = document.getElementById("time").value;

  const extraPrompt = document.getElementById("extraPrompt").value;

  const result = document.getElementById("result");

  // プロンプト生成（将来APIに投げる文章）
  let prompt =
`あなたは就活のグループディスカッションの出題者です。

【条件】
形式：${type}
難易度：${level}
時間：${time}
`;

  if (extraPrompt.trim() !== "") {
    prompt += `\n【追加条件】\n${extraPrompt}\n`;
  }

  prompt += `
この条件に適したお題を3つ、日本語で出してください。
`;

  // いまは疑似出力（後でAIに差し替える）
  result.textContent =
    "▼ AIに送るプロンプト案\n\n" +
    prompt +
    "\n\n（ここに後でAIのお題が入ります）";
});
