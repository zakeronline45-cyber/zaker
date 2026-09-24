import {requireUser,authorizeChildSubject} from './_security.js';
import {SUPABASE_URL,SUPABASE_PUBLISHABLE_KEY} from './_config.js';
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
  'الفعل اللازم والفعل المتعدي','الفعل المجرد والفعل المزيد','أنواع الفعل المعتل','أنواع الفعل الصحيح','ظن وأخواتها'
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


const P4_SYLLABI={
 'P4 Math':['Place Value','Addition and Subtraction Strategies','Concepts of Measurement','Area and Perimeter','Multiplication as a Relationship','Factors and Multiples','Multiplication and Division: Computation and Relationships','Order of Operations'],
 'P4 Mathematics Arabic':['القيمة المكانية','استراتيجيات الجمع والطرح','مفاهيم القياس','المساحة والمحيط','الضرب كعلاقة','العوامل والمضاعفات','الضرب والقسمة: العمليات والعلاقات','ترتيب العمليات'],
 'P4 Science':['Nature in Our Surroundings','How Insects Grow','How Plants Grow','Properties of Light','Properties of Sound','The Force of Wind','The Force of Rubber','Soil, Water, and Life in Egypt'],
 'P4 Science Arabic':['الطبيعة من حولنا','كيف تنمو الحشرات؟','كيف تنمو النباتات؟','خصائص الضوء','خصائص الصوت','قوة الرياح','قوة المطاط','التربة والماء والحياة في مصر'],
 'P4 English':['The Five Senses','My Community','Animals in Our World','Egypt My Homeland','A Day at Work','The Hundred Dresses'],
 'P4 Arabic':["كل منا له حلم","صندوق الأحلام","أنواع الكلمة وعلامات الاسم","شارك حلمك","من أنا؟","المفرد والمثنى والجمع","التحدي الكبير","اسلمي يا مصر","قوة الأخلاق في حياتنا","الغالي المجاني","الضمائر","موقف لطيف","فكر قليلًا.. تربح كثيرًا","الجملة الاسمية: المبتدأ والخبر","التحكم في المشاعر","طريق السعادة","التعبير الحقيقي والتعبير المجازي","رسالة إلى أصدقاء الطبيعة","رسالة الشجرة العجوز","المبتدأ والخبر مع المثنى","خطاب إلى الطبيعة","أفعال صغيرة ونتائج كبيرة","المبتدأ والخبر مع جمع المذكر السالم","أنا حارس البيئة","في البستان"],
 'P4 Social Studies':['الأماكن والاتجاهات من حولنا','الخريطة في حياتنا','تطور الخريطة','مصادر جمع المعلومات','كيف تبدو مدينتنا؟','تطور مدينتنا','الأماكن الخدمية في مدينتنا','مدينتنا في المستقبل','أين تقع محافظتي؟','علم وطننا مصر','مصر على خريطة العالم','تضاريس أرضنا الجميلة','ثروات مصر الطبيعية والبشرية','المعالم التاريخية في مصر']
};
function syllabusFor(subject){
 if(P4_SYLLABI[subject]) return P4_SYLLABI[subject];
 return subject==='English'?ENGLISH_SYLLABUS:subject==='Arabic'?ARABIC_SYLLABUS:subject==='Social Studies'?SOCIAL_STUDIES_SYLLABUS:subject==='Math'?MATH_SYLLABUS:subject==='Mathematics Arabic'?MATH_AR_SYLLABUS:SCIENCE_SYLLABUS;
}

async function isInCurriculum({apiKey,question,lesson,recentQuestions,subject,grade,curriculumContext}){
  const recent=(recentQuestions||[]).slice(0,6).map(x=>x.question).join('\n');
  const ctx=curriculumContext?JSON.stringify(curriculumContext).slice(0,2500):'';
  const r=await fetch('https://api.openai.com/v1/responses',{
    method:'POST',
    headers:{'Authorization':`Bearer ${apiKey}`,'Content-Type':'application/json'},
    body:JSON.stringify({
      model:'gpt-5.6-luna',
      instructions:`You are a curriculum gate for ${grade||'the current grade'} ${subject}, term 1.\nAllowed syllabus:\n${syllabusFor(subject).map((x,i)=>`${i+1}. ${x}`).join('\n')}

Current lesson: ${lesson||'unspecified'}.
Your job is to keep the tutor inside the school subject, not to reject normal lesson questions because the exact wording is not a chapter title.
Rules:
- IN_SCOPE if the question is educationally related to the current lesson or any allowed syllabus section: definitions, examples, functions, causes, results, comparisons, why/how, applications, vocabulary, or clarification.
- If a current lesson is specified, treat reasonable concepts normally taught inside that lesson as IN_SCOPE even when the exact concept is not listed as a syllabus title.
- Accept Arabic or English questions regardless of the language of the syllabus titles.
- For Primary 4/P4, be permissive with age-appropriate questions clearly related to the selected lesson. Do not require exact keyword matches.
- OUT_OF_SCOPE only when the question is clearly about another school subject or clearly unrelated general knowledge, coding, politics, entertainment, etc.
- If uncertain for a normal school question that plausibly belongs to the current lesson, choose IN_SCOPE.
Return exactly one token: IN_SCOPE or OUT_OF_SCOPE.`,
      input:`Selected lesson: ${lesson||'unspecified'}\nCurrent lesson context: ${ctx||'(not supplied)'}\nRecent student questions:\n${recent||'(none)'}\n\nStudent message: ${question}`
    })
  });
  const j=await r.json().catch(()=>({}));
  if(!r.ok){
    // Never turn an API/billing/model failure into a false "outside curriculum" rejection.
    // The main tutor call will either answer normally or use Zaker's local curriculum fallback.
    return true;
  }
  let out=j?.output_text||'';
  if(!out&&Array.isArray(j?.output)) out=j.output.flatMap(x=>x.content||[]).map(x=>x.text||'').join(' ');
  const verdict=String(out||'').trim();
  if(!verdict) return true;
  return /^IN_SCOPE\b/i.test(verdict);
}


function localCurriculumFallback({question,studyLanguage,curriculumContext,courseReference}){
  const norm=s=>String(s||'').toLowerCase().normalize('NFKD').replace(/[\u064B-\u065F\u0670]/g,'').replace(/[^\p{L}\p{N}]+/gu,' ').trim();
  const stop=new Set(['what','which','where','when','why','how','the','and','for','with','from','this','that','هو','هي','ما','ماذا','من','في','على','عن','ليه','لماذا','ازاي','كيف','اشرح','وضح','يعني']);
  const qt=norm(question).split(/\s+/).filter(x=>x.length>1&&!stop.has(x));
  const ref=courseReference||{},mods=Array.isArray(ref.modules)?ref.modules:[];
  for(const m of mods){
    for(const pair of (m.terms||[])){
      if(Array.isArray(pair)&&pair.length>=2){
        const term=norm(pair[0]);
        if(term && (norm(question).includes(term)||qt.some(t=>term.includes(t)&&t.length>2))){
          const ar=studyLanguage==='Arabic';
          return ar?('من مرجع المنهج: '+pair[0]+' — '+pair[1]):('From the curriculum reference: '+pair[0]+' — '+pair[1]);
        }
      }
    }
  }
  let best=null,bestScore=0;
  for(const m of mods){
    const hay=norm([m.title,m.kind,m.unit,m.summary,...(m.focus||[]),...(m.terms||[]).flat()].join(' '));
    const score=qt.reduce((n,t)=>n+(hay.includes(t)?1:0),0);
    if(score>bestScore){best=m;bestScore=score}
  }
  if(!best&&curriculumContext?.summary) best={title:'',summary:curriculumContext.summary,focus:curriculumContext.focus||[],terms:curriculumContext.terms||[]};
  if(best&&best.summary){
    const ar=studyLanguage==='Arabic';
    const focus=(best.focus||[]).slice(0,3).filter(Boolean);
    const terms=(best.terms||[]).slice(0,4).filter(x=>Array.isArray(x)&&x.length>=2);
    let ans=ar?('من مرجع ذاكر للمنهج'+(best.title?' — '+best.title:'')+':\n'+best.summary):('From Zaker curriculum reference'+(best.title?' — '+best.title:'')+':\n'+best.summary);
    if(focus.length) ans+='\n\n'+(ar?'النقاط الأساسية: ':'Key points: ')+focus.join(' • ');
    if(terms.length) ans+='\n\n'+(ar?'مصطلحات مهمة:\n':'Key terms:\n')+terms.map(x=>'- '+x[0]+': '+x[1]).join('\n');
    ans+='\n\n'+(ar?'ملحوظة: هذه إجابة مؤقتة من مرجع المنهج داخل ذاكر لأن خدمة الذكاء الاصطناعي المدفوعة غير متاحة حاليًا.':'Note: this is a temporary answer from Zaker\'s curriculum reference because the paid AI service is currently unavailable.');
    return ans;
  }
  return studyLanguage==='Arabic'
    ?'خدمة مدرس ذاكر بالذكاء الاصطناعي متوقفة مؤقتًا بسبب انتهاء رصيد الـAPI. الشرح والاختبارات ما زالت تعمل، وسيعود الرد الذكي بمجرد إضافة رصيد للـAPI.'
    :'Zaker AI Tutor is temporarily unavailable because the API credit balance is exhausted. Lessons and tests still work, and AI answers will resume after API credits are added.';
}

async function rpc(name,body,token){
  const r=await fetch(`${SUPABASE_URL}/rest/v1/rpc/${name}`,{
    method:'POST',
    headers:{'apikey':SUPABASE_PUBLISHABLE_KEY,'Authorization':`Bearer ${token}`,'Content-Type':'application/json'},
    body:JSON.stringify(body)
  });
  if(!r.ok) throw new Error('Supabase RPC '+r.status);
  const txt=await r.text();
  return txt?JSON.parse(txt):null;
}

export default async function handler(req,res){
  if(req.method!=='POST') return res.status(405).json({error:'Method not allowed'});
  const authCtx=await requireUser(req,res,{bucket:'ai-chat',limit:20,windowSeconds:60});
  if(!authCtx)return;
  const apiKey=process.env.OPENAI_API_KEY;
  if(!apiKey) return res.status(500).json({error:'OPENAI_API_KEY غير موجود داخل Vercel'});
  try{
    const {
      question,
      grade='أولى إعدادي',
      lesson='',
      subject='Science',
      studyLanguage='English',
      sessionId='',
      childId='',
      lessonNo=1,
      curriculumContext=null,
      courseReference=null
    }=req.body||{};
    const allowedSubjects=['English','Arabic','Social Studies','Math','Mathematics Arabic','Science','P4 Math','P4 Mathematics Arabic','P4 Science','P4 Science Arabic','P4 English','P4 Arabic','P4 Social Studies'];
    const safeSubject=allowedSubjects.includes(subject)?subject:'Science';
    if(!question||typeof question!=='string') return res.status(400).json({error:'اكتب سؤالك أولًا'});
    if(question.length>1200) return res.status(413).json({error:'السؤال طويل جدًا. اختصره إلى 1200 حرف أو أقل.'});
    if(String(sessionId||'').length>120) return res.status(400).json({error:'Invalid session id'});
    if(String(lesson||'').length>250) return res.status(400).json({error:'Invalid lesson'});
    const subjectCodeMap={
      'Science':'Science','Math':'Math','Mathematics Arabic':'الرياضيات','English':'English','Arabic':'Arabic','Social Studies':'الدراسات الاجتماعية',
      'P4 Science':'science','P4 Science Arabic':'العلوم','P4 Math':'math','P4 Mathematics Arabic':'الرياضيات','P4 English':'english','P4 Arabic':'arabic','P4 Social Studies':'studies'
    };
    const canUse=await authorizeChildSubject(authCtx,res,{childId,subjectCode:subjectCodeMap[safeSubject],lessonNo});
    if(!canUse)return;

    let history=null;
    if(sessionId){
      try{history=await rpc('get_student_question_context',{p_session_id:sessionId,p_limit:30},authCtx.token)}catch(e){}
    }

    const inScope=safeSubject.startsWith('P4 ')?true:await isInCurriculum({
      apiKey,
      question,
      lesson,
      recentQuestions:history?.recent_questions||[],
      subject:safeSubject,
      grade,
      curriculumContext
    });
    if(!inScope){
      const isArabicSubject=['Arabic','Social Studies','Mathematics Arabic','P4 Mathematics Arabic','P4 Science Arabic','P4 Arabic','P4 Social Studies'].includes(safeSubject);
      const msg=isArabicSubject?'هذا السؤال خارج منهج المادة الحالي للصف '+grade+' — الترم الأول على ذاكر. اسألني عن أحد أجزاء المنهج المسموح بها.':'This question is outside the current '+grade+' '+safeSubject+' Term 1 curriculum on Zaker. Ask me about one of the current syllabus sections.';
      return res.status(200).json({answer:msg,outOfScope:true,learningContext:{totalQuestions:history?.total_questions||0,lessonCounts:history?.lesson_counts||{}}});
    }

    if(sessionId){
      try{
        await rpc('log_ai_question',{p_session_id:sessionId,p_subject:safeSubject,p_lesson:lesson,p_study_language:studyLanguage,p_question:question},authCtx.token);
        history=await rpc('get_student_question_context',{p_session_id:sessionId,p_limit:30},authCtx.token);
      }catch(e){}
    }

    const recent=(history?.recent_questions||[]).slice(0,12).map(x=>`- [${x.lesson||'General'}] ${x.question}`).join('\n');
    const counts=history?.lesson_counts?Object.entries(history.lesson_counts).sort((a,b)=>b[1]-a[1]).slice(0,5).map(([k,v])=>`${k}: ${v}`).join(', '):'';

    const arabicSubjects=['Arabic','Social Studies','Mathematics Arabic','P4 Mathematics Arabic','P4 Science Arabic','P4 Arabic','P4 Social Studies'];
    const mathSubjects=['Math','P4 Math'];
    const englishSubjects=['English','P4 English'];
    const languageRule=englishSubjects.includes(safeSubject)?'Explain in clear English suitable for '+grade+' students. Keep the answer in English unless the student explicitly asks for Arabic clarification. Focus only on the listed curriculum.':arabicSubjects.includes(safeSubject)?'اشرح باللغة العربية الفصحى المبسطة المناسبة لطالب '+grade+'. التزم بمصطلحات المنهج الحالي فقط، واستخدم أمثلة قصيرة واضحة ولا تخرج عن الأجزاء المسموح بها.':mathSubjects.includes(safeSubject)?'Explain in clear English suitable for '+grade+' Math students. Show steps and short worked examples when useful. Stay strictly within Term 1.':'Explain mainly in clear English suitable for '+grade+' students. You may add a short Arabic clarification only when it helps understanding, but keep the subject terminology in English.';

    const instructions=`أنت "مدرس ذاكر"، مدرس شخصي ذكي لطلاب ${grade}.
المادة الحالية: ${safeSubject}.
الدرس الحالي: ${lesson||'غير محدد'}.
مسار الطالب: ${safeSubject.includes('Arabic')||safeSubject.includes('Social Studies')?'مادة مشتركة/عربي حسب إعداد المادة':safeSubject==='P4 English'?'English — shared across Arabic and Languages tracks':safeSubject.includes('Math')?'Math curriculum':'Science curriculum'}.
${languageRule}

هدفك ليس فقط الإجابة، بل تكوين صورة تعليمية تدريجية عن الطالب من نمط أسئلته.
إذا كان تاريخه يدل على تكرار سؤال في مفهوم معين، أشر بلطف داخل الشرح إلى أن هذا المفهوم مهم له، بدون أحكام أو تشخيصات.
لا تقل إن الطالب "ضعيف"؛ قل إن هذا المفهوم "يحتاج تثبيتًا" أو "يتكرر فيه السؤال".
اعتمد على السؤال الحالي وتاريخ الأسئلة فقط، ولا تخترع مستوى أو قدرات لم تظهر في البيانات.
مهم جدًا: التزم بمنهج ${safeSubject} والترم الحالي. في أي مادة من مواد P4 (رابعة ابتدائي)، اعتبر مرجع المنهج الكامل المرسل مع الطلب هو مرجعك التعليمي الأساسي. استخدم أسماء الدروس، الشرح المختصر، أهداف التعلم، المفاهيم والمصطلحات الموجودة فيه لفهم سؤال الطالب والإجابة عنه حتى لو كان السؤال من درس آخر غير الجزء المفتوح حاليًا داخل نفس المادة. لا تعتبر سؤالًا دراسيًا صحيحًا خارج المنهج لمجرد اختلاف الصياغة أو اختلاف الدرس المفتوح. في P4 Arabic الفروع المعتمدة هي الاستماع والقراءة والنحو والتحدث والنصوص والبلاغة، مع استبعاد التعبير الكتابي والإملاء والخط. وفي بقية مواد P4 التزم فقط بالمحتوى الموجود في مرجع المادة المرسل.

ملخص تاريخ الأسئلة لهذا الطالب:
إجمالي الأسئلة المسجلة: ${history?.total_questions||1}
أكثر الدروس تكرارًا: ${counts||'لا توجد بيانات كافية بعد'}
آخر الأسئلة:
${recent||'- هذا أول سؤال مسجل تقريبًا'}

سياق الجزء الحالي من المنهج:
${curriculumContext?JSON.stringify(curriculumContext).slice(0,3500):'غير متاح — اعتمد على عنوان الدرس والمنهج المسموح'}

مرجع المنهج الكامل المتاح من كتب المراجعة المعتمدة داخل ذاكر:
${courseReference?JSON.stringify(courseReference).slice(0,11000):'غير متاح'}

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
    if(!r.ok){
      const code=j?.error?.code||j?.code||'';
      const msg=j?.error?.message||j?.message||'';
      const billing=/credit_balance_exhausted|insufficient_quota|no credits remaining|spend_limit|usage_limit/i.test(code+' '+msg);
      if(billing){
        return res.status(200).json({
          answer:localCurriculumFallback({question,studyLanguage,curriculumContext,courseReference}),
          fallback:true,
          aiUnavailableReason:'billing'
        });
      }
      return res.status(r.status).json({error:studyLanguage==='Arabic'?'خدمة مدرس ذاكر غير متاحة مؤقتًا. حاول مرة أخرى بعد قليل.':'Zaker AI Tutor is temporarily unavailable. Please try again shortly.'});
    }
    let answer=j?.output_text;
    if(!answer&&Array.isArray(j?.output)) answer=j.output.flatMap(x=>x.content||[]).map(x=>x.text||x.value||'').filter(Boolean).join('\n');
    if(!answer) return res.status(502).json({error:'OpenAI رجع استجابة بدون نص'});
    return res.status(200).json({answer,learningContext:{totalQuestions:history?.total_questions||1,lessonCounts:history?.lesson_counts||{}}});
  }catch(e){return res.status(500).json({error:e?.message||'تعذر تشغيل المدرس الذكي الآن'})}
}