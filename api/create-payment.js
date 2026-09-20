const SUPABASE_URL='https://llhmkyighydokneqwrdj.supabase.co';
const SUPABASE_ANON='sb_publishable_bGxbtk2yxjDaFACjEGrBWA_1MBC1i77';
const PLANS={
  single:{amount:129,name:'Zaker - Single Subject'},
  full:{amount:249,name:'Zaker - Full Plan'},
  family:{amount:399,name:'Zaker - Family Plan'}
};

async function rest(path,{method='GET',token,body,prefer}={}){
 const r=await fetch(SUPABASE_URL+'/rest/v1/'+path,{
   method,
   headers:{
    'apikey':SUPABASE_ANON,
    'Authorization':'Bearer '+token,
    'Content-Type':'application/json',
    ...(prefer?{'Prefer':prefer}:{})
   },
   body:body?JSON.stringify(body):undefined
 });
 const text=await r.text();
 const data=text?JSON.parse(text):null;
 if(!r.ok) throw new Error(data?.message||data?.error||'Database error '+r.status);
 return data;
}

export default async function handler(req,res){
 if(req.method!=='POST') return res.status(405).json({error:'Method not allowed'});
 try{
   const auth=req.headers.authorization||'';
   const token=auth.startsWith('Bearer ')?auth.slice(7):'';
   if(!token) return res.status(401).json({error:'سجّل الدخول أولًا'});
   const ur=await fetch(SUPABASE_URL+'/auth/v1/user',{headers:{'apikey':SUPABASE_ANON,'Authorization':'Bearer '+token}});
   const user=await ur.json();
   if(!ur.ok||!user?.id) return res.status(401).json({error:'الجلسة غير صالحة'});

   const {plan}=req.body||{};
   const cfg=PLANS[plan];
   if(!cfg) return res.status(400).json({error:'الباقة غير صحيحة'});

   const secret=process.env.PAYMOB_SECRET_KEY;
   const publicKey=process.env.PAYMOB_PUBLIC_KEY;
   const integrationId=Number(process.env.PAYMOB_INTEGRATION_ID||0);
   if(!secret||!publicKey||!integrationId) return res.status(503).json({error:'بوابة الدفع جاهزة في الكود لكن مفاتيح Paymob لم تُضف إلى Vercel بعد'});

   const profiles=await rest('profiles?id=eq.'+user.id+'&select=full_name,phone,track',{token});
   const profile=profiles?.[0]||{};
   const names=String(profile.full_name||'Zaker Student').trim().split(/\s+/);
   const first=names[0]||'Zaker', last=names.slice(1).join(' ')||'Student';

   const subs=await rest('subscriptions',{method:'POST',token,prefer:'return=representation',body:{
     user_id:user.id,plan_code:plan,status:'pending',amount_egp:cfg.amount
   }});
   const subscription=subs[0];
   const pays=await rest('payments',{method:'POST',token,prefer:'return=representation',body:{
     user_id:user.id,subscription_id:subscription.id,plan_code:plan,amount_egp:cfg.amount,currency:'EGP',status:'pending'
   }});
   const payment=pays[0];

   const base=(process.env.PUBLIC_BASE_URL||('https://'+req.headers.host)).replace(/\/$/,'');
   const specialReference='zaker-'+payment.id;
   const pr=await fetch('https://accept.paymob.com/v1/intention/',{
     method:'POST',
     headers:{'Authorization':'Token '+secret,'Content-Type':'application/json'},
     body:JSON.stringify({
       amount:Math.round(cfg.amount*100),
       currency:'EGP',
       payment_methods:[integrationId],
       items:[{name:cfg.name,amount:Math.round(cfg.amount*100),description:'Monthly Zaker subscription',quantity:1}],
       billing_data:{
         apartment:'NA',first_name:first,last_name:last,street:'NA',building:'NA',
         phone_number:profile.phone||'+201000000000',city:'Beni Suef',country:'EG',
         email:user.email||'student@zaker.local',floor:'NA',state:'Beni Suef'
       },
       extras:{zaker_payment_id:payment.id,zaker_subscription_id:subscription.id,zaker_user_id:user.id,plan},
       special_reference:specialReference,
       expiration:3600,
       notification_url:base+'/api/paymob-webhook',
       redirection_url:base+'/payment-result.html'
     })
   });
   const pj=await pr.json().catch(()=>({}));
   if(!pr.ok) return res.status(pr.status).json({error:pj?.detail||pj?.message||'Paymob error'});

   await rest('payments?id=eq.'+payment.id,{method:'PATCH',token,prefer:'return=minimal',body:{
     provider_intention_id:pj.id||null,
     provider_order_id:String(pj.intention_order_id||''),
     provider_reference:specialReference
   }});

   const checkout='https://accept.paymob.com/unifiedcheckout/?publicKey='+encodeURIComponent(publicKey)+'&clientSecret='+encodeURIComponent(pj.client_secret);
   return res.status(200).json({checkout_url:checkout,payment_id:payment.id});
 }catch(e){
   return res.status(500).json({error:e?.message||'تعذر بدء عملية الدفع'});
 }
}