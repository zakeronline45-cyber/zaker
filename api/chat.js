export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.AI_GATEWAY_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'AI_GATEWAY_API_KEY غير موجود داخل Vercel' });
  }

  try {
    const { question, subject = 'Science', grade = 'أولى إعدادي لغات', lesson = '' } = req.body || {};
    if (!question || typeof question !== 'string') {
      return res.status(400).json({ error: 'اكتب سؤالك أولًا' });
    }

    const system = `أنت "مدرس ذاكر"، مدرس ذكي لطلاب ${grade}.
تشرح بالعربية المبسطة والإنجليزية معًا. ابدأ الفكرة بالعربي، ثم اكتب المصطلح أو الجملة الأساسية بالإنجليزية.
لو الطالب طلب English only فاشرح بالإنجليزية بالكامل.
ولو طلب عربي فقط فاشرح بالعربي مع إبقاء المصطلحات العلمية الإنجليزية بين قوسين.
النطاق الحالي: Science وMath وEnglish فقط.
المادة الحالية: ${subject}.
الدرس الحالي: ${lesson || 'غير محدد'}.
قواعدك:
- اشرح خطوة بخطوة وبأسلوب مناسب لعمر الطالب.
- لا تعطِ إجابة مختصرة بلا شرح.
- استخدم أمثلة بسيطة من الحياة اليومية عند الحاجة.
- إذا كان السؤال خارج المواد الثلاث، أخبر الطالب بلطف أن مدرس ذاكر الحالي مخصص لـ Science وMath وEnglish.
- إذا لم تكن متأكدًا من معلومة تخص المنهج المصري الحالي، قل إنك تحتاج الرجوع إلى محتوى المنهج المعتمد بدل التخمين.
- اجعل الرد مختصرًا نسبيًا ومفيدًا، ثم اختم بسؤال تحقق صغير عند الملاءمة.`;

    const r = await fetch('https://ai-gateway.vercel.sh/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'openai/gpt-5.6-luna',
        messages: [
          { role: 'system', content: system },
          { role: 'user', content: question }
        ],
        stream: false
      })
    });

    const j = await r.json().catch(() => ({}));
    if (!r.ok) {
      const msg = j?.error?.message || j?.message || `Gateway error ${r.status}`;
      return res.status(r.status).json({ error: msg, statusCode: r.status });
    }

    const answer = j?.choices?.[0]?.message?.content;
    if (!answer) {
      return res.status(502).json({ error: 'الـAI رجع استجابة بدون نص' });
    }

    return res.status(200).json({ answer });
  } catch (error) {
    return res.status(500).json({ error: error?.message || 'تعذر تشغيل المدرس الذكي الآن' });
  }
}
