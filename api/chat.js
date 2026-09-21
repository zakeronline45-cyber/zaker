const SUPABASE_URL='https://llhmkyighydokneqwrdj.supabase.co';
const SUPABASE_KEY='sb_publishable_bGxbtk2yxjDaFACjEGrBWA_1MBC1i77';
const SCIENCE_SYLLABUS = [
  'Structure of the Atom',
  'The Periodic Table of Elements',
  'Matter and Its Properties',
  'Chemical Bonds',
  'Electric Forces',
  'Magnetic Forces',
  'Gravitational Forces',
  'Cells and Life',
  'General Characteristics of Living Organisms',
  'Microbes',
  'The Earth and the Solar System',
  'Lunar Eclipse'
];
const ENGLISH_SYLLABUS = [
  'A Day in My Digital Life & How We Use Technology','Digital Devices','An Email to a Friend & Team-Project Roundtable',
  'My Learning Journey & Learning Challenges and Solutions','Benefits of Learning Together','My Learning Plan & Team-Project Roundtable',
  'An Egyptian Hero & Heroes and Role Models','A Great Egyptian Thinker — Dr. Gomaa Hamdan','A Hero Who Made a Difference — Dr. Mohamed Ghoneim & Team-Project Roundtable',
  'Think Before You Choose & Decisions and Consequences','An Interview with an Athlete','Asking for and Giving Advice & Team-Project Roundtable',
  'Discover Your Future! & An Interview with a Scientist','My Plan for a Future Career','My Dream Job! & Team-Project Roundtable',
  'Being a Global Citizen & Global Citizen Talk','Ocean Circle',"Let's Make a Difference & Team-Project Roundtable",
  'The Magic Classroom','The Dream Team'
];
const ARABIC_SYLLABUS = [
  'مصر مهد العلم — د. أحمد زويل','أسطورة مصرية — البطل أحمد منسي','رسالة إلى المرأة المصرية — نعمات أحمد فؤاد','وجه الوطن — فاروق جويدة',
  'تاريخنا أساس لمستقبلنا — المتحف المصري الكبير','أشياء صنعت مني كاتبًا — العقاد','بطولات مصرية — محمد صلاح وعلي فرج وأحمد الجندي','شباب اليوم صناع الغد — إبراهيم ناجي',
  'دروس من الحياة','رحمة تداوي وعلم ينقذ','إنسان في عصر التكنولوجيا','دعاء شاعرة — جليلة رضا',
  'التشبيه','الأسلوب الخبري والأسلوب الإنشائي','الصور الحسية','العلاقات بين الجمل',
  'الفعل اللازم والفعل المتعدي','الفعل المجرد والفعل المزيد','أنواع الفعل المعتل','أنواع الفعل الصحيح','ظن وأخواتها',
  'كتابة الهمزة على الألف','كتابة الهمزة على الواو','كتابة الهمزة على الياء','الخط العربي','السيرة الذاتية','السيرة الغيرية'
];
const MATH_SYLLABUS = [
'Proportion','Applications of Ratio and Proportion — Scale Drawings','Applications of Ratio and Proportion — Proportional Division','Applications of Ratio and Proportion — Percentages','Sets and Their Operations','Operations on Integers','Operations on Rational Numbers','Mathematical Expressions and Formulas / Algebraic Terms','Addition and Subtraction of Algebraic Expressions','Linear Equations','Types of Angles and Relationships Between Them','More Angle Relationships','Parallelism','The Triangle','Quadrilaterals','Special Quadrilaterals','Polygons','Coordinates','Organizing Data','Arithmetic Mean','Pie Charts'
];
const MATH_AR_SYLLABUS = [
'التناسب','تطبيقات النسبة والتناسب — مقياس الرسم','تطبيقات النسبة والتناسب — التقسيم التناسبي','تطبيقات النسبة والتناسب — تطبيقات النسبة المئوية','المجموعات والعمليات عليها','العمليات على الأعداد الصحيحة','العمليات على الأعداد النسبية','التعبيرات والصيغ الرياضية والحدود الجبرية','جمع وطرح التعبيرات الجبرية','المعادلات الخطية','الزوايا وأنواعها والعلاقات بينها','تابع العلاقات بين الزوايا','التوازي','المثلث','الأشكال الرباعية','تابع الأشكال الرباعية الخاصة','المضلعات','الإحداثيات','تنظيم البيانات','الوسط الحسابي','القطاعات الدائرية'
];
const SOCIAL_STUDIES_SYLLABUS = [
  'قارة أفريقيا — الموقع والكشوف الجغرافية','مظاهر سطح قارة أفريقيا','نهر النيل والحضارات القديمة في أفريقيا',
  'عصر الدولة القديمة — عصر بناة الأهرام','عصر الدولة الوسطى — عصر الرخاء الاقتصادي','عصر الدولة الحديثة — عصر المجد الحربي',
  'نظم الغابات في أفريقيا — الغابات المدارية المطيرة وغابات البحر المتوسط','نظم الحشائش والصحاري الحارة في أفريقيا','النظم البيئية المائية في أفريقيا',
  'انتشار الإسلام في أفريقيا','دور مصر الحضاري في قارة أفريقيا'
];

async function isInCurriculum({apiKey,question,lesson,recentQuestions,subject}){
  const recent=(recentQuestions||[]).slice(0,6).map(x=>x.question).join('\n');
  const r=await fetch('https://api.openai.com/v1/responses',{
    method:'POST',
    headers:{'Authorization':`Bearer ${apiKey}`,'Content-Type':'application/json'},
    body:JSON.stringify({
      model:'gpt-5.6-luna',
      instructions:`You are a strict curriculum gate for first-prep ${subject}, term 1.\nAllowed syllabus ONLY:\n${(subject==='English'?ENGLISH_SYLLABUS:subject==='Arabic'?ARABIC_SYLLABUS:subject==='Social Studies'?SOCIAL_STUDIES_SYLLABUS:subject==='Math'?MATH_SYLLABUS:subject==='Mathematics Arabic'?MATH_AR_SYLLABUS:SCIENCE_SYLLABUS).map((x,i)=>`${i+1}. ${x}`).join('\n')}

Decide whether the student's message is answerable strictly within this syllabus.
Rules:
- IN_SCOPE if it directly asks about one of these lessons or is a natural follow-up to a recent in-scope question such as "explain more", "why?", "give me another example".
- OUT_OF_SCOPE for any other school subject, general knowledge, coding, politics, entertainment, or topics not covered by this syllabus.
- Do not expand the syllabus using general knowledge.
Return exactly one token: IN_SCOPE or OUT_OF_SCOPE.`,
      input:`Current lesson: ${lesson||'unspecified'}\nRecent student questions:\n${recent||'(none)'}\n\nNew message: ${question}`
    })
  });
  const j=await r.json().catch(()=>({}));
  let out=j?.output_text||'';
  if(!out&&Array.isArray(j?.output)) out=j.output.flatMap(x=>x.content||[]).map(x=>x.text||'').join(' ');
  return /^IN_SCOPE\b/i.test(out.trim());
}


async function rpc(name,body){
  const r=await fetch(`${SUPABASE_URL}/rest/v1/rpc/${name}`,{
    method:'POST',
    headers:{'apikey':SUPABASE_KEY,'Authorization':`Bearer ${SUPABASE_KEY}`,'Content-Type':'application/json'},
    body:JSON.stringify(body)
  });
  if(!r.ok) throw new Error('Supabase RPC '+r.status);
  const txt=await r.text();
  return txt?JSON.parse(txt):null;
}

export default async function handler(req,res){
  if(req.method!=='POST') return res.status(405).json({error:'Method not allowed'});
  const apiKey=process.env.OPENAI_API_KEY;
  if(!apiKey) return res.status(500).json({error:'OPENAI_API_KEY غير موجود داخل Vercel'});
  try{
    const {
      question,
      grade='أولى إعدادي',
      lesson='',
      subject='Science',
      studyLanguage='English',
      sessionId=''
    }=req.body||{};
    const safeSubject=subject==='English'?'English':subject==='Arabic'?'Arabic':subject==='Social Studies'?'Social Studies':subject==='Math'?'Math':subject==='Mathematics Arabic'?'Mathematics Arabic':'Science';
    if(!question||typeof question!=='string') return res.status(400).json({error:'اكتب سؤالك أولًا'});

    let history=null;
    if(sessionId){
      try{history=await rpc('get_student_question_context',{p_session_id:sessionId,p_limit:30})}catch(e){}
    }

    const inScope=await isInCurriculum({
      apiKey,
      question,
      lesson,
      recentQuestions:history?.recent_questions||[],
      subject:safeSubject
    });
    if(!inScope){
      const msg=safeSubject==='English'?'This question is outside the current First Prep English curriculum on Zaker. Ask me about the current units, language, vocabulary, skills, or stories.':safeSubject==='Arabic'?'هذا السؤال خارج منهج اللغة العربية الحالي للصف الأول الإعدادي على ذاكر. اسألني عن القراءة والنصوص أو البلاغة أو النحو أو التعبير الموجود في المنهج.':safeSubject==='Social Studies'?'هذا السؤال خارج منهج الدراسات الاجتماعية الحالي للصف الأول الإعدادي على ذاكر. اسألني عن دروس الجغرافيا أو التاريخ أو الحضارة أو النظم البيئية الموجودة في المنهج.':safeSubject==='Math'?'This question is outside the current First Prep Math Term 1 curriculum on Zaker. Ask me about one of the current Math lessons.':safeSubject==='Mathematics Arabic'?'هذا السؤال خارج منهج رياضيات الصف الأول الإعدادي الترم الأول على ذاكر. اسألني عن أحد دروس الرياضيات الحالية.':'This question is outside the current Science English curriculum on Zaker. Ask me about one of the current syllabus lessons, and I’ll explain it step by step.';
      return res.status(200).json({answer:msg,outOfScope:true,learningContext:{totalQuestions:history?.total_questions||0,lessonCounts:history?.lesson_counts||{}}});
    }

    if(sessionId){
      try{
        await rpc('log_ai_question',{p_session_id:sessionId,p_subject:safeSubject,p_lesson:lesson,p_study_language:studyLanguage,p_question:question});
        history=await rpc('get_student_question_context',{p_session_id:sessionId,p_limit:30});
      }catch(e){}
    }

    const recent=(history?.recent_questions||[]).slice(0,12).map(x=>`- [${x.lesson||'General'}] ${x.question}`).join('\n');
    const counts=history?.lesson_counts?Object.entries(history.lesson_counts).sort((a,b)=>b[1]-a[1]).slice(0,5).map(([k,v])=>`${k}: ${v}`).join(', '):'';

    const languageRule=safeSubject==='English'?'Explain in clear English suitable for first-prep students. Keep the answer in English unless the student explicitly asks for an Arabic clarification. Focus on vocabulary, grammar, reading, writing, speaking and story comprehension within the listed syllabus.':(safeSubject==='Arabic'||safeSubject==='Social Studies'||safeSubject==='Mathematics Arabic')?'اشرح باللغة العربية الفصحى المبسطة المناسبة لطالب الصف الأول الإعدادي. التزم بمصطلحات المنهج الحالي فقط، واستخدم أمثلة قصيرة واضحة ولا تخرج عن الدروس المسموح بها.':safeSubject==='Math'?'Explain in clear English suitable for first-prep Math students. Show steps, formulas, and a short worked example when useful. Stay strictly within the listed Term 1 lessons.':'Explain mainly in clear English suitable for first-prep language students. You may add a short Arabic clarification only when it helps understanding, but keep the scientific terminology and core answer in English.';

    const instructions=`أنت "مدرس ذاكر"، مدرس شخصي ذكي لطلاب ${grade}.
المادة الحالية: ${safeSubject}.
الدرس الحالي: ${lesson||'غير محدد'}.
مسار الطالب: ${safeSubject==='English'?'English — shared across Arabic and Languages tracks':safeSubject==='Arabic'?'Arabic — shared across Arabic and Languages tracks':safeSubject==='Social Studies'?'Social Studies — Arabic UI shared across Arabic and Languages tracks':'Science English'}.
${languageRule}

هدفك ليس فقط الإجابة، بل تكوين صورة تعليمية تدريجية عن الطالب من نمط أسئلته.
إذا كان تاريخه يدل على تكرار سؤال في مفهوم معين، أشر بلطف داخل الشرح إلى أن هذا المفهوم مهم له، بدون أحكام أو تشخيصات.
لا تقل إن الطالب "ضعيف"؛ قل إن هذا المفهوم "يحتاج تثبيتًا" أو "يتكرر فيه السؤال".
اعتمد على السؤال الحالي وتاريخ الأسئلة فقط، ولا تخترع مستوى أو قدرات لم تظهر في البيانات.
مهم جدًا: لا تشرح أي موضوع خارج منهج ${safeSubject} المحدد في قائمة الدروس المسموح بها. إذا ظهر أثناء الإجابة أن السؤال يحتاج معلومة خارج المنهج، قل إن هذه الجزئية خارج نطاق المنهج الحالي بدل التوسع فيها.

ملخص تاريخ الأسئلة لهذا الطالب:
إجمالي الأسئلة المسجلة: ${history?.total_questions||1}
أكثر الدروس تكرارًا: ${counts||'لا توجد بيانات كافية بعد'}
آخر الأسئلة:
${recent||'- هذا أول سؤال مسجل تقريبًا'}

قواعد التدريس:
- اشرح الفكرة خطوة بخطوة وبأسلوب مناسب لعمر الطالب.
- استخدم مثالًا بسيطًا عند الحاجة.
- ركز على الفهم قبل الحفظ.
- إذا لاحظت خلطًا بين مفهومين، وضح الفرق مباشرة.
- لا تعطِ معلومة تخص المنهج إذا لم تكن متأكدًا منها.
- اختم بسؤال تحقق صغير عندما يكون مناسبًا.`;

    const r=await fetch('https://api.openai.com/v1/responses',{
      method:'POST',
      headers:{'Authorization':`Bearer ${apiKey}`,'Content-Type':'application/json'},
      body:JSON.stringify({model:'gpt-5.6-luna',instructions,input:question})
    });
    const j=await r.json().catch(()=>({}));
    if(!r.ok) return res.status(r.status).json({error:j?.error?.message||j?.message||`OpenAI error ${r.status}`});
    let answer=j?.output_text;
    if(!answer&&Array.isArray(j?.output)) answer=j.output.flatMap(x=>x.content||[]).map(x=>x.text||x.value||'').filter(Boolean).join('\n');
    if(!answer) return res.status(502).json({error:'OpenAI رجع استجابة بدون نص'});
    return res.status(200).json({answer,learningContext:{totalQuestions:history?.total_questions||1,lessonCounts:history?.lesson_counts||{}}});
  }catch(e){return res.status(500).json({error:e?.message||'تعذر تشغيل المدرس الذكي الآن'})}
}