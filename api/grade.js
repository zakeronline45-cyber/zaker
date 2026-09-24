import {requireUser} from './_security.js';
const SUPABASE_URL='https://llhmkyighydokneqwrdj.supabase.co';
const SUPABASE_KEY='sb_publishable_bGxbtk2yxjDaFACjEGrBWA_1MBC1i77';

async function rpcWithUser(name,token,body){
  const r=await fetch(SUPABASE_URL+'/rest/v1/rpc/'+name,{
    method:'POST',
    headers:{'apikey':SUPABASE_KEY,'Authorization':'Bearer '+token,'Content-Type':'application/json'},
    body:JSON.stringify(body)
  });
  const data=await r.json().catch(()=>null);
  return {ok:r.ok,status:r.status,data};
}

async function serverQuestionKey(subject,moduleKey,lessonNo,id){
  const secret=process.env.SUPABASE_SERVICE_ROLE_KEY;
  if(!secret)return null;
  const qs=new URLSearchParams({
    subject:'eq.'+subject,
    module_key:'eq.'+(moduleKey||''),
    lesson_no:'eq.'+String(lessonNo||0),
    question_id:'eq.'+String(id),
    select:'question_type,question_text,answer,accepted_answers'
  });
  const r=await fetch(SUPABASE_URL+'/rest/v1/question_answer_keys?'+qs.toString(),{
    headers:{'apikey':secret,'Authorization':'Bearer '+secret}
  });
  if(!r.ok)return null;
  const rows=await r.json().catch(()=>[]);
  return rows?.[0]||null;
}

export default async function handler(req,res){
  if(req.method!=='POST')return res.status(405).json({error:'Method not allowed'});
  const authCtx=await requireUser(req,res,{bucket:'grade',limit:180,windowSeconds:60});
  if(!authCtx)return;

  const {subject='Science',lesson,module,id,childId,studentAnswer,studyLanguage='English'}=req.body||{};
  const modularSubjects=['English','Arabic','Social Studies','Math','Mathematics Arabic','P4 Math','P4 Mathematics Arabic','P4 Science','P4 Science Arabic','P4 English','P4 Arabic','P4 Social Studies'];
  if(!id||!childId||(subject==='Science'&&!lesson)||(modularSubjects.includes(subject)&&!module)){
    return res.status(400).json({error:'بيانات السؤال غير مكتملة'});
  }

  const moduleKey=modularSubjects.includes(subject)?String(module||''):'';
  const lessonNo=subject==='Science'?(Number(lesson)||0):0;

  try{
    const safe=await rpcWithUser('grade_question_safe',authCtx.token,{
      p_child_id:childId,
      p_subject:subject,
      p_module_key:moduleKey,
      p_lesson_no:lessonNo,
      p_question_id:String(id),
      p_student_answer:String(studentAnswer??'')
    });
    if(!safe.ok){
      const msg=String(safe.data?.message||safe.data?.error||'تعذر التحقق من الإجابة');
      const status=/subscription required|student access denied/i.test(msg)?403:/authentication required/i.test(msg)?401:400;
      return res.status(status).json({error:msg});
    }
    if(safe.data===true)return res.status(200).json({correct:true});

    const q=await serverQuestionKey(subject,moduleKey,lessonNo,id);
    if(!q)return res.status(200).json({correct:false});

    const exactTypes=['mcq','reading_mcq','true_false','listening_mcq','listening_true_false','complete','dialogue_complete','correct_form','correction','punctuation','reorder','solve'];
    if(exactTypes.includes(q.question_type)){
      return res.status(200).json({correct:false,correctAnswer:q.answer});
    }

    const key=process.env.OPENAI_API_KEY;
    if(!key)return res.status(200).json({correct:false,correctAnswer:q.answer});

    const gr=await fetch('https://api.openai.com/v1/responses',{
      method:'POST',
      headers:{'Authorization':'Bearer '+key,'Content-Type':'application/json'},
      body:JSON.stringify({
        model:'gpt-5.6-luna',
        instructions:`You are grading a ${subject} answer for the grade supplied by the platform. Compare the student answer with the reference by meaning and task requirements. Return only CORRECT or INCORRECT. For English writing/rewrite tasks, accept grammatically reasonable answers that satisfy the prompt even if wording differs. For Arabic writing, reading, rhetoric and grammar tasks, accept equivalent correct Arabic meanings and valid formulations; do not require exact wording unless the item is a fixed grammar/spelling answer. For Social Studies, accept equivalent correct Arabic explanations of geographic, historical, economic, or civic ideas when the meaning matches the reference. For Math and Mathematics Arabic, accept mathematically equivalent answers and equivalent numeric forms. Ignore harmless punctuation differences.`,
        input:`Question: ${q.question_text}\nReference answer: ${q.answer}\nStudent answer: ${studentAnswer||''}`
      })
    });
    const gj=await gr.json().catch(()=>({}));
    let out=gj?.output_text||'';
    if(!out&&Array.isArray(gj?.output))out=gj.output.flatMap(x=>x.content||[]).map(x=>x.text||'').join(' ');
    const correct=/CORRECT/i.test(out)&&!/INCORRECT/i.test(out);
    return res.status(200).json({correct,correctAnswer:correct?null:q.answer});
  }catch(e){
    return res.status(500).json({error:e?.message||'تعذر تصحيح الإجابة'});
  }
}
