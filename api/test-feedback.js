export default async function handler(req,res){
  if(req.method!=='POST') return res.status(405).json({error:'Method not allowed'});
  const {subject='Science',lessonTitle,wrongAnswers=[]}=req.body||{};
  if(!Array.isArray(wrongAnswers)||!wrongAnswers.length){
    return res.status(200).json({summary:'ممتاز، لا توجد أخطاء تحتاج مراجعة.',topics:[],plan:[]});
  }
  const key=process.env.OPENAI_API_KEY;
  if(!key){
    return res.status(200).json({
      summary:'عندك أخطاء في بعض مفاهيم هذا الدرس. راجع المفاهيم المرتبطة بالأسئلة التي أخطأت فيها ثم أعد الاختبار.',
      topics:wrongAnswers.slice(0,10).map(x=>({question:x.question,studentAnswer:x.studentAnswer,correctAnswer:x.correctAnswer,explanation:'الإجابة تحتاج تعديل في الفكرة العلمية نفسها، وليس في شكل الكتابة. قارن إجابتك بالمعلومة الصحيحة وافهم الفرق قبل إعادة الحل.'})),
      plan:['افهم سبب كل خطأ من الشرح الموجود أسفل السؤال.','راجع نفس المفهوم داخل شرح الدرس.','أعد اختبارًا جديدًا بعد ما تتأكد إن الفكرة وضحت.']
    });
  }
  try{
    const input=wrongAnswers.slice(0,10).map((x,i)=>`#${i+1}
Question: ${x.question}
Student answer: ${x.studentAnswer}
Reference answer: ${x.correctAnswer}`).join('\n\n');
    const r=await fetch('https://api.openai.com/v1/responses',{
      method:'POST',
      headers:{'Authorization':`Bearer ${key}`,'Content-Type':'application/json'},
      body:JSON.stringify({
        model:'gpt-5.6-luna',
        instructions:`You are the post-test coach for "ذاكر" for first-prep ${subject}.
Create feedback ONLY from the supplied question, student answer, and reference answer.
Do not invent curriculum facts.
The student SHOULD see the correct answer after finishing the whole test.
IMPORTANT: If the student's scientific meaning is actually correct and only punctuation, separators, formatting, spelling, or wording differ, do NOT describe it as a conceptual mistake. Say that the answer is scientifically correct and the grading should accept it.
Return strict JSON only, no markdown:
{
 "summary":"Arabic summary",
 "topics":[{"question":"the question","studentAnswer":"student answer","correctAnswer":"the exact reference answer","explanation":"simple clear explanation suitable for the subject; for English, explain language/vocabulary/grammar errors in clear English"}],
 "plan":["step 1","step 2","step 3"]
}
Do not mention page numbers or tell the student to return to a specific page.`,
        input:`Subject: ${subject}\nLesson: ${lessonTitle}\n\n${input}`
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
      topics:wrongAnswers.slice(0,10).map(x=>({question:x.question,studentAnswer:x.studentAnswer,correctAnswer:x.correctAnswer,explanation:'قارن بين إجابتك والإجابة الصحيحة وركز على الفرق العلمي الحقيقي، وليس طريقة كتابة الرموز أو علامات الترقيم.'})),
      plan:['افهم سبب كل خطأ من الشرح الموجود أسفل السؤال.','راجع المفهوم نفسه داخل شرح الدرس.','أعد اختبارًا جديدًا بعد المراجعة.']
    });
  }
}