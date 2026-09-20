const SUPABASE_URL='https://llhmkyighydokneqwrdj.supabase.co';
const SUPABASE_KEY='sb_publishable_bGxbtk2yxjDaFACjEGrBWA_1MBC1i77';

export default async function handler(req,res){
  if(req.method!=='GET') return res.status(405).json({error:'Method not allowed'});
  try{
    const r=await fetch(`${SUPABASE_URL}/rest/v1/rpc/get_cohort_question_insights`,{
      method:'POST',
      headers:{'apikey':SUPABASE_KEY,'Authorization':`Bearer ${SUPABASE_KEY}`,'Content-Type':'application/json'},
      body:JSON.stringify({p_subject:'Science'})
    });
    const rows=await r.json();
    if(!r.ok) return res.status(r.status).json({error:'تعذر تحميل مؤشرات الأسئلة'});
    const total=(rows||[]).reduce((a,x)=>a+Number(x.question_count||0),0);
    return res.status(200).json({total,rows:rows||[]});
  }catch(e){return res.status(500).json({error:e?.message||'تعذر تحميل المؤشرات'})}
}