const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Mock Database (In a real app, use Firebase Admin or a database)
let fridgeItems = [
  { id: 1, name: '우유', qty: 1 }
];

// 카카오톡 봇 웹훅 엔드포인트
app.post('/api/kakao-webhook', (req, res) => {
  const { userRequest, action } = req.body;
  const utterance = userRequest.utterance; // 사용자가 입력한 메시지 (예: "/입고 양파 3개 냉장")

  console.log(`수신된 메시지: ${utterance}`);

  // 매우 간단한 명령어 파싱 로직 (실제로는 정규식이나 카카오 엔티티 활용)
  if (utterance.startsWith('/입고')) {
    const parts = utterance.split(' ');
    const name = parts[1] || '이름모름';
    const qty = parseInt(parts[2]) || 1;
    const category = parts[3] || '냉장';

    const newItem = {
      id: Date.now(),
      name,
      qty,
      category,
      expDate: new Date(Date.now() + 86400000 * 7).toISOString().split('T')[0] // 기본 7일
    };
    fridgeItems.push(newItem);

    return res.json({
      version: "2.0",
      template: {
        outputs: [
          {
            simpleText: {
              text: `✅ [${name}] ${qty}개가 ${category}에 입고되었습니다!\n(유통기한: ${newItem.expDate})`
            }
          }
        ]
      }
    });
  } 
  
  if (utterance.startsWith('/출고')) {
    const parts = utterance.split(' ');
    const name = parts[1];
    
    if (!name) {
      return res.json({
        version: "2.0",
        template: { outputs: [{ simpleText: { text: "⚠️ 어떤 식재료를 출고할지 알려주세요." } }] }
      });
    }

    const itemIndex = fridgeItems.findIndex(item => item.name === name);
    
    if (itemIndex > -1) {
      fridgeItems.splice(itemIndex, 1);
      return res.json({
        version: "2.0",
        template: { outputs: [{ simpleText: { text: `👋 [${name}] 출고 완료! 맛있게 드세요.` } }] }
      });
    } else {
      return res.json({
        version: "2.0",
        template: { outputs: [{ simpleText: { text: `❓ 냉장고에 [${name}]이(가) 없습니다.` } }] }
      });
    }
  }

  // 기본 응답
  res.json({
    version: "2.0",
    template: {
      outputs: [
        {
          simpleText: { text: "명령어를 인식하지 못했어요. '/입고 [품목] [수량]' 또는 '/출고 [품목]' 형식으로 입력해주세요." }
        }
      ]
    }
  });
});

app.listen(PORT, () => {
  console.log(`Kakao Bot Webhook Server running on port ${PORT}`);
});
