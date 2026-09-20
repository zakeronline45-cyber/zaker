const SUPABASE_URL='https://llhmkyighydokneqwrdj.supabase.co';
const SUPABASE_ANON='sb_publishable_bGxbtk2yxjDaFACjEGrBWA_1MBC1i77';

function amountFor(subjectCount,childIndex){
  const n=Math.max(1,Math.min(Number(subjectCount)||1,10));
  const base=250+(n-1)*225;
  return childIndex===2?Math.round(base*0.75*100)/100:base;
}
function refCode(){
  return 'ZK-'+Date.now().toString(36).slice(-5).toUpperCase()+'-'+Math.random().toString(36).slice(2,6).toUpperCase();
}
async function rest(path,{method='GET',token,body,prefer}={}){
 const r=await fetch(SUPABASE_URL+'/rest/v1/'+path,{
  method,
  headers:{'apikey':SUPABASE_ANON,'Authorization':'Bearer '+token,'Content-Type':'application/json',...(prefer?{'Prefer':prefer}:{})},
  body:body?JSON.stringify(body):undefined
 });
 const txt=await r.text(),data=txt?JSON.parse(txt):null;
 if(!r.ok) throw new Error(data?.message||data?.error||'Database error '+r.status);
 return data;
}
export default async function handler(req,res){
 if(req.method!=='POST') return res.status(405).json({error:'Method not allowed'});
 try{
   const auth=req.headers.authorization||'',token=auth.startsWith('Bearer ')?auth.slice(7):'';
   if(!token) return res.status(401).json({error:'سجّل الدخول أولًا'});
   const ur=await fetch(SUPABASE_URL+'/auth/v1/user',{headers:{'apikey':SUPABASE_ANON,'Authorization':'Bearer '+token}});
   const user=await ur.json();
   if(!ur.ok||!user?.id) return res.status(401).json({error:'الجلسة غير صالحة'});

   const subjectCount=Math.max(1,Math.min(Number(req.body?.subjectCount)||1,10));
   const childIndex=Number(req.body?.childIndex)===2?2:1;
   const amount=amountFor(subjectCount,childIndex);
   const reference=refCode();

   const subs=await rest('subscriptions',{method:'POST',token,prefer:'return=representation',body:{
     user_id:user.id,plan_code:'single',status:'pending',amount_egp:amount
   }});
   const subscription=subs[0];
   const pays=await rest('payments',{method:'POST',token,prefer:'return=representation',body:{
     user_id:user.id,subscription_id:subscription.id,provider:'bank',payment_method:'bank_transfer',
     plan_code:'subjects',amount_egp:amount,currency:'EGP',status:'pending',
     reference_code:reference,subject_count:subjectCount,child_index:childIndex
   }});
   return res.status(200).json({payment:pays[0],reference_code:reference,amount});
 }catch(e){return res.status(500).json({error:e?.message||'تعذر إنشاء طلب التحويل'})}
}