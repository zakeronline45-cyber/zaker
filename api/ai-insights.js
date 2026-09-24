import {requireAdmin} from './_security.js';
import {SUPABASE_URL,SUPABASE_PUBLISHABLE_KEY} from './_config.js';

export default async function handler(req,res){
  if(req.method!=='GET') return res.status(405).json({error:'Method not allowed'});
  try{
    const auth=req.headers.authorization||'';
    const token=auth.startsWith('Bearer ')?auth.slice(7):'';
    if(!token) return res.status(401).json({error:'Unauthorized'});
    const ar=await fetch(SUPABASE_URL+'/rest/v1/rpc/is_admin',{
      method:'POST',
      headers:{'apikey':SUPABASE_PUBLISHABLE_KEY,'Authorization':'Bearer '+token,'Content-Type':'application/json'},
      body:'{}'
    });
    const isAdmin=await ar.json().catch(()=>false);
    if(!ar.ok||isAdmin!==true) return res.status(403).json({error:'Admin only'});

    const r=await fetch(SUPABASE_URL+'/rest/v1/rpc/get_cohort_question_insights',{
      method:'POST',
      headers:{'apikey':SUPABASE_PUBLISHABLE_KEY,'Authorization':'Bearer '+token,'Content-Type':'application/json'},
      body:JSON.stringify({p_subject:'Science'})
    });
    const rows=await r.json();
    if(!r.ok) return res.status(r.status).json({error:'تعذر تحميل مؤشرات الأسئلة'});
    const total=(rows||[]).reduce((a,x)=>a+Number(x.question_count||0),0);
    return res.status(200).json({total,rows:rows||[]});
  }catch(e){return res.status(500).json({error:e?.message||'تعذر تحميل المؤشرات'})}
}