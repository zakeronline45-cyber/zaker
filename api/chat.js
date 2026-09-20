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

async function isInCurriculum({apiKey,question,lesson,recentQuestions}){
  const recent=(recentQuestions||[]).slice(0,6).map(x=>x.question).join('\n');
  const r=await fetch('https://api.openai.com/v1/responses',{
    method:'POST',
    headers:{'Authorization':`Bearer ${apiKey}`,'Content-Type':'application/json'},
    body:JSON.stringify({
      model:'gpt-5.6-luna',
      instructions:`You are a strict curriculum gate for first-prep Science, term 1.
Allowed syllabus ONLY:
${SCIENCE_SYLLABUS.map((x,i)=>`${i+1}. ${x}`).join('\n')}

Decide whether the student's message is answerable strictly within this syllabus.
Rules:
- IN_SCOPE if it directly asks about one of these lessons or is a natural follow-up to a recent in-scope question such as "explain more", "why?", "give me another example".
- OUT_OF_SCOPE for any other school subject, general knowledge, coding, politics, entertainment, unrelated science, higher-level science, or topics not covered by this syllabus.
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
      subject='Science',
      grade='أولى إعدادي',
      lesson='',
      studyLanguage='English',
      sessionId=''
    }=req.body||{};
    if(!question||typeof question!=='string') return res.status(400).json({error:'اكتب سؤالك أولًا'});

    let history=null;
    if(sessionId){
      try{history=await rpc('get_student_question_context',{p_session_id:sessionId,p_limit:30})}catch(e){}
    }

    const inScope=await isInCurriculum({
      apiKey,
      question,
      lesson,
      recentQuestions:history?.recent_questions||[]
    });
    if(!inScope){
      const msg='This question is outside the current Science English curriculum on Zaker. Ask me about one of the current syllabus lessons, and I’ll explain it step by step.';
      return res.status(200).json({answer:msg,outOfScope:true,learningContext:{totalQuestions:history?.total_questions||0,lessonCounts:history?.lesson_counts||{}}});
    }

    if(sessionId){
      try{
        await rpc('log_ai_question',{p_session_id:sessionId,p_subject:subject,p_lesson:lesson,p_study_language:studyLanguage,p_question:question});
        history=await rpc('get_student_question_context',{p_session_id:sessionId,p_limit:30});
      }catch(e){}
    }

    const recent=(history?.recent_questions||[]).slice(0,12).map(x=>`- [${x.lesson||'General'}] ${x.question}`).join('\n');
    const counts=history?.lesson_counts?Object.entries(history.lesson_counts).sort((a,b)=>b[1]-a[1]).slice(0,5).map(([k,v])=>`${k}: ${v}`).join(', '):'';

    const languageRule='Explain mainly in clear English suitable for first-prep language students. You may add a short Arabic clarification only when it helps understanding, but keep the scientific terminology and core answer in English.';

    const instructions=`أنت "مدرس ذاكر"، مدرس شخصي ذكي لطلاب ${grade}.
المادة الحالية: ${subject}.
الدرس الحالي: ${lesson||'غير محدد'}.
مسار الطالب: Science English.
${languageRule}

هدفك ليس فقط الإجابة، بل تكوين صورة تعليمية تدريجية عن الطالب من نمط أسئلته.
إذا كان تاريخه يدل على تكرار سؤال في مفهوم معين، أشر بلطف داخل الشرح إلى أن هذا المفهوم مهم له، بدون أحكام أو تشخيصات.
لا تقل إن الطالب "ضعيف"؛ قل إن هذا المفهوم "يحتاج تثبيتًا" أو "يتكرر فيه السؤال".
اعتمد على السؤال الحالي وتاريخ الأسئلة فقط، ولا تخترع مستوى أو قدرات لم تظهر في البيانات.
مهم جدًا: لا تشرح أي موضوع خارج منهج Science المحدد في قائمة الدروس المسموح بها. إذا ظهر أثناء الإجابة أن السؤال يحتاج معلومة خارج المنهج، قل إن هذه الجزئية خارج نطاق المنهج الحالي بدل التوسع فيها.

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