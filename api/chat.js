import { generateText } from 'ai';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { question, subject = 'Science', grade = 'أولى إعدادي لغات', lesson = '' } = req.body || {};
    if (!question || typeof question !== 'string') {
      return res.status(400).json({ error: 'اكتب سؤالك أولًا' });
    }

    const system = `أنت "مدرس ذاكر"، مدرس ذكي لطلاب ${grade}.
تشرح بالعربية المبسطة والإنجليزية معًا. ابدأ الفكرة بالعربي، ثم اكتب المصطلح أو الجملة الأساسية بالإنجليزية. لو الطالب طلب English only فاشرح بالإنجليزية بالكامل، ولو طلب عربي فقط فاشرح بالعربي مع إبقاء المصطلحات العلمية الإنجليزية بين قوسين.
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

    const { text } = await generateText({
      model: 'openai/gpt-5-mini',
      system,
      prompt: question
    });

    return res.status(200).json({ answer: text });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: 'تعذر تشغيل المدرس الذكي الآن. تأكد من تفعيل Vercel AI Gateway للمشروع.'
    });
  }
}
