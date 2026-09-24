export default async function handler(req,res){
  if(req.method!=='POST') return res.status(405).json({error:'Method not allowed'});
  const {subject='Science',lesson,module,id,studentAnswer,studyLanguage='English'}=req.body||{};
  const modularSubjects=['English','Arabic','Social Studies','Math','Mathematics Arabic','P4 Math','P4 Mathematics Arabic','P4 Science','P4 Science Arabic','P4 English','P4 Arabic','P4 Social Studies'];
  if(!id || (subject==='Science'&&!lesson) || (modularSubjects.includes(subject)&&!module)) return res.status(400).json({error:'بيانات السؤال غير مكتملة'});
  try{
    const host=req.headers.host;
    const proto=(req.headers['x-forwarded-proto']||'https');
    let q=null;
    if(modularSubjects.includes(subject)){
      const fileMap={
        'Arabic':'arabic-term1.json','Social Studies':'social-studies-term1.json','Math':'math-term1.json','Mathematics Arabic':'math-ar-term1.json','English':'english-term1.json',
        'P4 Math':'p4-math-term1.json','P4 Mathematics Arabic':'p4-math-ar-term1.json','P4 Science':'p4-science-term1.json','P4 Science Arabic':'p4-science-ar-term1.json',
        'P4 English':'p4-english-term1.json','P4 Arabic':'p4-arabic-term1.json','P4 Social Studies':'p4-social-studies-term1.json'
      };
      const file=fileMap[subject];
      const r=await fetch(`${proto}://${host}/content/${file}`,{cache:'no-store'});
      if(!r.ok) return res.status(404).json({error:subject+' question bank unavailable'});
      const bank=await r.json();
      let modules=bank.modules||[];
      if(Array.isArray(bank.moduleFiles)&&bank.moduleFiles.length){
        const parts=await Promise.all(bank.moduleFiles.map(async p=>{const pr=await fetch(`${proto}://${host}${p}`,{cache:'no-store'});if(!pr.ok)return {modules:[]};return pr.json()}));
        modules=parts.flatMap(x=>x.modules||[]);
      }
      q=modules.find(x=>Number(x.id)===Number(module))?.questions?.find(x=>x.id===id);
    }else{
      const r=await fetch(`${proto}://${host}/content/questions/science-term1-u1-l${lesson}.json`,{cache:'no-store'});
      if(!r.ok) return res.status(404).json({error:'بنك الأسئلة غير متاح'});
      const bank=await r.json();
      q=bank.questions?.find(x=>x.id===id);
    }
    if(!q) return res.status(404).json({error:'السؤال غير موجود'});
    const normalize=s=>String(s??'')
      .trim()
      .toLowerCase()
      .replace(/[<>=,;:!?|/\\()\[\]{}\-–—]+/g,' ')
      .replace(/\s+/g,' ')
      .trim();
    const tokenList=s=>normalize(s).split(' ').filter(Boolean);
    let correct=false;
    const accepted=[q.answer,...(Array.isArray(q.accepted_answers)?q.accepted_answers:[])].filter(x=>x!==null&&x!==undefined&&String(x).trim()!=='');
    const exactTypes=['mcq','reading_mcq','true_false','listening_mcq','listening_true_false','complete','dialogue_complete','correct_form','correction','punctuation','reorder','solve'];
    const answerMatches=accepted.some(ans=>normalize(studentAnswer)===normalize(ans));
    if(exactTypes.includes(q.type)){
      correct=answerMatches;
    }else if(answerMatches){
      correct=true;
    }else{
      const key=process.env.OPENAI_API_KEY;
      if(!key){
        correct=normalize(studentAnswer).length>0 && normalize(q.answer).split(' ').filter(w=>w.length>4).some(w=>normalize(studentAnswer).includes(w));
      }else{
        const gr=await fetch('https://api.openai.com/v1/responses',{
          method:'POST',
          headers:{'Authorization':`Bearer ${key}`,'Content-Type':'application/json'},
          body:JSON.stringify({
            model:'gpt-5.6-luna',
            instructions:`You are grading a ${subject} answer for the grade supplied by the platform. Compare the student answer with the reference by meaning and task requirements. Return only CORRECT or INCORRECT. For English writing/rewrite tasks, accept grammatically reasonable answers that satisfy the prompt even if wording differs. For Arabic writing, reading, rhetoric and grammar tasks, accept equivalent correct Arabic meanings and valid formulations; do not require exact wording unless the item is a fixed grammar/spelling answer. For Social Studies, accept equivalent correct Arabic explanations of geographic, historical, economic, or civic ideas when the meaning matches the reference. For Math and Mathematics Arabic, accept mathematically equivalent answers and equivalent numeric forms. Ignore harmless punctuation differences.`,
            input:`Question: ${q.text}\nReference answer: ${q.answer}\nStudent answer: ${studentAnswer||''}`
          })
        });
        const gj=await gr.json().catch(()=>({}));
        let out=gj?.output_text||'';
        if(!out&&Array.isArray(gj?.output)) out=gj.output.flatMap(x=>x.content||[]).map(x=>x.text||'').join(' ');
        correct=/CORRECT/i.test(out)&&!/INCORRECT/i.test(out);
      }
    }
    return res.status(200).json({correct});
  }catch(e){return res.status(500).json({error:e?.message||'تعذر تصحيح الإجابة'})}
}