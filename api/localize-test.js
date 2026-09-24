import {requireUser} from './_security.js';
export default async function handler(req,res){
  if(req.method!=='POST') return res.status(405).json({error:'Method not allowed'});
  const authCtx=await requireUser(req,res,{bucket:'localize-test',limit:12,windowSeconds:60});
  if(!authCtx)return;
  const apiKey=process.env.OPENAI_API_KEY;
  const {questions=[],targetLanguage='English'}=req.body||{};
  if(!Array.isArray(questions)) return res.status(400).json({error:'Invalid questions'});
  if(targetLanguage!=='Arabic') return res.status(200).json({questions});
  if(!apiKey) return res.status(500).json({error:'OPENAI_API_KEY غير موجود'});
  try{
    const compact=questions.map(q=>({id:q.id,type:q.type,text:q.text,choices:q.choices||null,answer:q.answer}));
    const r=await fetch('https://api.openai.com/v1/responses',{
      method:'POST',
      headers:{'Authorization':`Bearer ${apiKey}`,'Content-Type':'application/json'},
      body:JSON.stringify({
        model:'gpt-5.6-luna',
        instructions:`Translate first-prep Science exam questions from English to clear Egyptian-school Arabic.
Keep scientific English terms in parentheses when useful.
Do not change scientific meaning, difficulty, IDs, question type, or correct option.
For True/False use "صح" and "خطأ".
Return strict JSON only:
{"questions":[{"id":"...","text":"...","choices":["..."] or null,"answer":"..."}]}`,
        input:JSON.stringify(compact)
      })
    });
    const j=await r.json().catch(()=>({}));
    let out=j?.output_text||'';
    if(!out&&Array.isArray(j?.output)) out=j.output.flatMap(x=>x.content||[]).map(x=>x.text||'').join('');
    const parsed=JSON.parse(out);
    const map=new Map((parsed.questions||[]).map(x=>[x.id,x]));
    const localized=questions.map(q=>({...q,...(map.get(q.id)||{})}));
    return res.status(200).json({questions:localized});
  }catch(e){
    return res.status(500).json({error:e?.message||'تعذر تجهيز الامتحان بالعربي'});
  }
}