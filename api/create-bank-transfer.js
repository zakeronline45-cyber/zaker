import {SUPABASE_URL,SUPABASE_PUBLISHABLE_KEY,requireProductionWrite} from './_config.js';

function amountFor(subjectCount,childIndex,track='languages'){
  const n=Math.max(1,Math.min(Number(subjectCount)||1,10));
  const base=track==='arabic'?200+(n-1)*175:250+(n-1)*225;
  const factor=childIndex===2?.75:childIndex===3?.50:1;
  return Math.round(base*factor*100)/100;
}
function refCode(){
  return 'ZK-'+Date.now().toString(36).slice(-5).toUpperCase()+'-'+Math.random().toString(36).slice(2,6).toUpperCase();
}
async function rest(path,{method='GET',token,body,prefer}={}){
 const r=await fetch(SUPABASE_URL+'/rest/v1/'+path,{
  method,
  headers:{'apikey':SUPABASE_PUBLISHABLE_KEY,'Authorization':'Bearer '+token,'Content-Type':'application/json',...(prefer?{'Prefer':prefer}:{})},
  body:body?JSON.stringify(body):undefined
 });
 const txt=await r.text(),data=txt?JSON.parse(txt):null;
 if(!r.ok) throw new Error(data?.message||data?.error||'Database error '+r.status);
 return data;
}
export default async function handler(req,res){
 if(req.method!=='POST') return res.status(405).json({error:'Method not allowed'});
 if(!requireProductionWrite(req,res)) return;
 try{
   const auth=req.headers.authorization||'',token=auth.startsWith('Bearer ')?auth.slice(7):'';
   if(!token) return res.status(401).json({error:'سجّل الدخول أولًا'});
   const ur=await fetch(SUPABASE_URL+'/auth/v1/user',{headers:{'apikey':SUPABASE_PUBLISHABLE_KEY,'Authorization':'Bearer '+token}});
   const user=await ur.json();
   if(!ur.ok||!user?.id) return res.status(401).json({error:'الجلسة غير صالحة'});

   const subjectCount=Math.max(1,Math.min(Number(req.body?.subjectCount)||1,10));
   const childId=String(req.body?.childId||'').trim();
   const subjects=Array.isArray(req.body?.subjects)?req.body.subjects.map(x=>String(x).trim()).filter(Boolean):[];
   if(!childId) return res.status(400).json({error:'اختر الابن أولًا'});

   const children=await rest('children?guardian_user_id=eq.'+user.id+'&is_active=eq.true&select=id,full_name,track,grade,created_at&order=created_at.asc',{token});
   const idx=children.findIndex(x=>x.id===childId);
   if(idx<0) return res.status(403).json({error:'هذا الابن غير تابع للحساب'});
   const reference=refCode();

   const result=await rest('rpc/create_bank_transfer_order',{method:'POST',token,body:{
     p_child_id:childId,
     p_subject_count:subjectCount,
     p_reference_code:reference,
     p_subjects:subjects
   }});

   return res.status(200).json({
     payment:{id:result.payment_id},
     reference_code:reference,
     amount:result.amount,
     child_index:result.child_index,
     child_name:children[idx].full_name,
     discount_applied:!!result.discount_applied,
     discount_percent:Number(result.discount_percent||0),
     base_amount:Number(result.base_amount||result.amount||0),
     track:result.track||children[idx].track
   });
 }catch(e){return res.status(500).json({error:e?.message||'تعذر إنشاء طلب التحويل'})}
}