import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});


app.post("/theme", async (req, res) => {
  const { type, level, time, extra } = req.body;

  // プロンプトを組み立てる
  let prompt = `
あなたは就職活動のグループディスカッション対策に精通したプロフェッショナルです。
以下の条件に基づき、実際の企業選考で出題されるレベルのグループディスカッションのお題を1つ作成してください。

【条件】
・形式：${type}
・難易度：${level}
・想定時間：${time}（目安）

【最優先ルール】
・お題のみを日本語1文で出力すること
・説明文、前置き、補足、箇条書きは一切出力しないこと
・必ず「意思決定」「優先順位付け」「選択」のいずれかが発生する問いにすること
`;

if (extra && extra.trim() !== "") {
  prompt += `・追加条件(最優先で反映すること）：${extra}\n`;
}

if (type === "選択型") {
  prompt += `
【形式ルール】
・必ず2〜3個の選択肢を含めること
・どれを選ぶべきかを明確に問う形にすること

【出力例（形式例）】
・限られた予算で注力するなら「既存顧客の深耕」か「新規顧客の獲得」のどちらを選ぶべきか。

※上記は形式の例であり、文言・構造をそのまま模倣してはならない。
`;
}

if (type === "抽象型") {
  prompt += `
【形式ルール】
・概念の定義をしなければ議論が始まらない問いにすること
・定義後に要素分解をしないと結論が出ない構造にすること
・最終的に優先順位や意思決定が必要になる問いにすること
・就活・仕事・組織に関連する内容に寄せること

【出力例（形式例）】
・信頼される社会人とは何かを定義せよ。

※上記は形式の例であり、文言・構造をそのまま模倣してはならない。
`;
}

if (type === "課題解決型") {
  prompt += `
【形式ルール】
・課題とゴールが明確な設定にすること
・施策を複数出し、優先順位を決めさせる問いにすること

【出力例（形式例）】
・売上が伸び悩んでいる店舗の売上向上を目的に施策を複数出し、優先順位を決めよ。

※上記は形式の例であり、文言・構造・語尾をそのまま模倣してはならない。
`;
}



  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "llama-3.1-8b-instant",
      messages: [
        { role: "system", content: "あなたはグループディスカッションのお題生成AIです。" },
        { role: "user", content: prompt }
      ]
    })
  });

  const data = await response.json();
  const theme = data.choices[0].message.content;

  res.json({ theme });
});


app.listen(3000, () => {
  console.log("サーバー起動中：http://localhost:3000");
});
