export default async function handler(req,res){
  if(req.method!=='POST') return res.status(405).json({error:'Method not allowed'});
  const {lesson,id,studentAnswer}=req.body||{};
  if(!lesson||!id) return res.status(400).json({error:'بيانات السؤال غير مكتملة'});
  try{
    const host=req.headers.host;
    const proto=(req.headers['x-forwarded-proto']||'https');
    const r=await fetch(`${proto}://${host}/content/questions/science-term1-u1-l${lesson}.json`,{cache:'no-store'});
    if(!r.ok) return res.status(404).json({error:'بنك الأسئلة غير متاح'});
    const bank=await r.json();
    const q=bank.questions?.find(x=>x.id===id);
    if(!q) return res.status(404).json({error:'السؤال غير موجود'});
    const normalize=s=>String(s??'').trim().toLowerCase().replace(/\s+/g,' ').replace(/[.,;:!?]/g,'');
    let correct=false;
    if(['mcq','true_false','complete'].includes(q.type)){
      const a=normalize(studentAnswer), b=normalize(q.answer);
      if(q.type==='complete' && b.includes(';')){
        const parts=b.split(';').map(normalize).filter(Boolean);
        correct=parts.every(p=>a.includes(p));
      }else correct=a===b;
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
            instructions:'You are grading a first-prep science answer. Compare the student answer to the reference answer. Return only CORRECT or INCORRECT. Accept equivalent wording and correct scientific meaning. Do not be overly strict about grammar or spelling.',
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