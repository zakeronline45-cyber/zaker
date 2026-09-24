import {requireUser} from './_security.js';
const SUPABASE_URL='https://llhmkyighydokneqwrdj.supabase.co';
const SUPABASE_KEY='sb_publishable_bGxbtk2yxjDaFACjEGrBWA_1MBC1i77';
export default async function handler(req,res){
  if(req.method!=='POST') return res.status(405).json({error:'Method not allowed'});
  const authCtx=await requireUser(req,res,{bucket:'grade',limit:180,windowSeconds:60});
  if(!authCtx)return;
  const {subject='Science',lesson,module,id,childId,studentAnswer,studyLanguage='English'}=req.body||{};
  const modularSubjects=['English','Arabic','Social Studies','Math','Mathematics Arabic','P4 Math','P4 Mathematics Arabic','P4 Science','P4 Science Arabic','P4 English','P4 Arabic','P4 Social Studies'];
  if(!id || !childId || (subject==='Science'&&!lesson) || (modularSubjects.includes(subject)&&!module)) return res.status(400).json({error:'بيانات السؤال غير مكتملة'});
  try{
    const kr=await fetch(SUPABASE_URL+'/rest/v1/rpc/get_authorized_question_key',{
      method:'POST',
      headers:{'apikey':SUPABASE_KEY,'Authorization':'Bearer '+authCtx.token,'Content-Type':'application/json'},
      body:JSON.stringify({
        p_child_id:childId,
        p_subject:subject,
        p_module_key:modularSubjects.includes(subject)?String(module||''):'',
        p_lesson_no:subject==='Science'?(Number(lesson)||0):0,
        p_question_id:String(id)
      })
    });
    const q=await kr.json().catch(()=>null);
    if(!kr.ok){
      const msg=String(q?.message||q?.error||'تعذر التحقق من السؤال');
      const status=/subscription required|student access denied/i.test(msg)?403:400;
      return res.status(status).json({error:msg});
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
    const strictText=s=>String(s??'').trim().toLowerCase().replace(/\s+/g,' ');
    const answerMatches=accepted.some(ans=>normalize(studentAnswer)===normalize(ans));
    const punctuationMatches=accepted.some(ans=>strictText(studentAnswer)===strictText(ans));
    if(q.type==='punctuation'){
      correct=punctuationMatches;
    }else if(exactTypes.includes(q.type)){
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
    return res.status(200).json({correct,correctAnswer:correct?null:q.answer});
  }catch(e){return res.status(500).json({error:e?.message||'تعذر تصحيح الإجابة'})}
}