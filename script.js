document.getElementById("generate").addEventListener("click", async () => {
  const type = document.getElementById("type").value;
  const level = document.getElementById("level").value;
  const time = document.getElementById("time").value;
  const extra = document.getElementById("extraPrompt").value;

  const result = document.getElementById("result");
  result.textContent = "生成中…";

  try {
    const response = await fetch("http://https://gd-generator-backend.onrender.com/theme", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        type: type,
        level: level,
        time: time,
        extra: extra
      })
    });

    const data = await response.json();
    result.textContent = "お題：\n" + data.theme;

  } catch (e) {
    result.textContent = "エラー：" + e;
  }
});
