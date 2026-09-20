export default async function handler(req,res){
  if(req.method!=='POST') return res.status(405).json({error:'Method not allowed'});
  const {lessonTitle,wrongAnswers=[]}=req.body||{};
  if(!Array.isArray(wrongAnswers)||!wrongAnswers.length){
    return res.status(200).json({summary:'ممتاز، لا توجد أخطاء تحتاج مراجعة.',topics:[],plan:[]});
  }
  const key=process.env.OPENAI_API_KEY;
  const pages=[...new Set(wrongAnswers.map(x=>x.sourcePage).filter(Boolean))].sort((a,b)=>a-b);
  if(!key){
    return res.status(200).json({
      summary:'عندك أخطاء في بعض مفاهيم هذا الدرس. راجع المفاهيم المرتبطة بالأسئلة التي أخطأت فيها ثم أعد الاختبار.',
      topics:wrongAnswers.slice(0,5).map(x=>({topic:x.question,explanation:'راجع الفكرة المرتبطة بهذا السؤال وحاول شرحها لنفسك قبل إعادة الحل.',page:x.sourcePage||null})),
      plan:['راجع شرح الدرس مرة أخرى.','راجع الصفحات: '+(pages.join(', ')||'المحددة في الدرس')+'.','أعد اختبارًا جديدًا بعد المراجعة.']
    });
  }
  try{
    const input=wrongAnswers.slice(0,10).map((x,i)=>`#${i+1}
Question: ${x.question}
Student answer: ${x.studentAnswer}
Reference answer: ${x.correctAnswer}
Source page: ${x.sourcePage||'unknown'}`).join('\n\n');
    const r=await fetch('https://api.openai.com/v1/responses',{
      method:'POST',
      headers:{'Authorization':`Bearer ${key}`,'Content-Type':'application/json'},
      body:JSON.stringify({
        model:'gpt-5.6-luna',
        instructions:`You are the post-test coach for "ذاكر" for first-prep Science Languages.
Create feedback ONLY from the supplied question, student answer, reference answer, and source page.
Do not invent curriculum facts.
Do NOT reveal the exact reference answer verbatim to the student.
Return strict JSON only, no markdown:
{
 "summary":"Arabic summary",
 "topics":[{"topic":"short concept name in English + Arabic","explanation":"simple Arabic explanation with essential English terms, explaining the misconception without giving the exact answer","page":number|null}],
 "plan":["step 1","step 2","step 3"]
}
The plan should say what to review, cite source pages when available, and recommend re-testing.`,
        input:`Lesson: ${lessonTitle}\n\n${input}`
      })
    });
    const j=await r.json().catch(()=>({}));
    let out=j?.output_text||'';
    if(!out&&Array.isArray(j?.output)) out=j.output.flatMap(x=>x.content||[]).map(x=>x.text||'').join('');
    const parsed=JSON.parse(out);
    return res.status(200).json(parsed);
  }catch(e){
    return res.status(200).json({
      summary:'أخطاءك تتركز في مفاهيم تحتاج مراجعة قبل إعادة الاختبار.',
      topics:wrongAnswers.slice(0,5).map(x=>({topic:x.question,explanation:'راجع المفهوم المرتبط بالسؤال وحاول فهم سبب اختيارك السابق.',page:x.sourcePage||null})),
      plan:['راجع شرح الدرس.','ركز على الصفحات: '+(pages.join(', ')||'المحددة في الدرس')+'.','أعد الاختبار بعد المراجعة.']
    });
  }
}