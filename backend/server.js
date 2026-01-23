import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

// CORS
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});

// 動作確認用
app.get("/", (req, res) => {
  res.send("Backend is running!");
});

// テーマ生成API
app.post("/theme", async (req, res) => {
  try {
    const { type, level, time, extra } = req.body;

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
    let companyHint = "";

    if (extra && extra.includes("オリエンタルランド")) {
      companyHint = `
【企業特性ヒント】
・東京ディズニーリゾートを運営する企業であることを前提にすること
・顧客体験、ホスピタリティ、安全性、現場オペレーション、満足度を重視したテーマにすること
・テーマパーク運営・キャスト・来園者体験に関連づけること
`;
    }

    if (extra && extra.trim() !== "") {
    prompt += `
    【追加条件（最優先・必ず反映）】
    ${extra}
    ・この条件に該当する企業・業界・組織が実際に出題しそうなテーマに必ず寄せること
    `;
    }


    if (type === "選択型") {
      prompt += `
【形式ルール】
・必ず2〜3個の選択肢を含めること
・どれを選ぶべきかを明確に問う形にすること
`;
    }

    if (type === "抽象型") {
      prompt += `
【形式ルール】
・概念の定義をしなければ議論が始まらない問いにすること
・最終的に優先順位や意思決定が必要になる問いにすること
`;
    }

    if (type === "課題解決型") {
      prompt += `
【形式ルール】
・課題とゴールが明確な設定にすること
・施策を複数出し、優先順位を決めさせる問いにすること
`;
    }

// =========================
// 難易度別ルール
// =========================

    if (level === "易しい") {
     prompt += `
【難易度ルール（易しい）】
・前提知識をほとんど必要としない内容にすること
・短時間でも結論が出やすい問いにすること
・インターン初期選考や練習用レベルを想定すること
`;
    }

    if (level === "普通") {
    prompt += `
【難易度ルール（普通）】
・複数の観点や評価軸が存在するテーマにすること
・時間内に整理と意思決定が必要になる構造にすること
・本選考初期〜中盤レベルを想定すること
`;
    }   

    if (level === "難しい") {
    prompt += `
【難易度ルール（難しい）】
・前提の定義や整理をしないと議論が始まらない問いにすること
・評価軸の設定や抽象化が必要になるテーマにすること
・難関企業・最終選考レベルを想定すること
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

  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "生成エラー" });
  }
});

// Render対応ポート
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`サーバー起動中：${PORT}`);
});

