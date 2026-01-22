document.getElementById("generate").addEventListener("click", () => {
    const type = document.getElementById("type").value;
    const level = document.getElementById("level").value;
    const time = document.getElementById("time").value;
  
    const result = document.getElementById("result");
  
    result.textContent =
      "形式：" + type + "\n" +
      "難易度：" + level + "\n" +
      "時間：" + time + "\n\n" +
      "（ここに後でAIのお題が入ります）";
  });
  