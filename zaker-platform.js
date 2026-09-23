(()=>{"use strict";
const URL='https://llhmkyighydokneqwrdj.supabase.co';
const KEY='sb_publishable_bGxbtk2yxjDaFACjEGrBWA_1MBC1i77';
const client=window.supabase?window.supabase.createClient(URL,KEY):null;
let settingsCache=null;
const gradeAr={p4:'رابعة ابتدائي',p5:'خامسة ابتدائي',p6:'سادسة ابتدائي',prep1:'أولى إعدادي',prep2:'ثانية إعدادي',prep3:'ثالثة إعدادي'};
const termAr=n=>Number(n)===2?'الترم الثاني':'الترم الأول';
const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
async function settings(force=false){
 if(settingsCache&&!force)return settingsCache;
 if(!client)return null;
 const {data,error}=await client.rpc('get_platform_settings');
 if(error)return null;
 settingsCache=data||null;return settingsCache;
}
async function session(){if(!client)return null;return (await client.auth.getSession()).data.session||null}
async function profile(){const s=await session();if(!s)return null;const {data}=await client.from('profiles').select('role,is_enabled,guardian_name,full_name,phone').eq('id',s.user.id).maybeSingle();return {session:s,profile:data}}
async function log(eventType,details={},childId=null){if(!client)return;try{await client.rpc('log_app_event',{p_event_type:eventType,p_page:location.pathname+location.search,p_child_id:childId,p_details:details||{}})}catch(e){}}
async function hasAccess(childId,subject,lessonNo=1){
 if(!client||!childId)return false;
 const {data,error}=await client.rpc('has_subject_access',{p_child_id:childId,p_subject_code:subject,p_lesson_no:Number(lessonNo)||1});
 return !error&&data===true;
}
async function getChildren(){
 const p=await profile();if(!p||p.profile?.role==='admin')return [];
 const {data}=await client.from('children').select('id,full_name,grade,track,is_active').eq('guardian_user_id',p.session.user.id).eq('is_active',true).order('created_at');
 return data||[];
}
function setChild(c){localStorage.setItem('zaker_active_child_id',c.id);localStorage.setItem('zaker_student_track',c.track)}
async function injectChildren(){
 if(!client)return;
 const p=await profile();if(!p)return;
 if(p.profile&&p.profile.is_enabled===false){await client.auth.signOut();alert('هذا الحساب موقوف. تواصل مع الإدارة.');location.href='/login.html';return}
 if(p.profile?.role==='admin')return;
 const children=await getChildren();if(!children.length)return;
 const saved=localStorage.getItem('zaker_active_child_id');const active=children.find(x=>x.id===saved)||children[0];setChild(active);
 const existing=document.getElementById('homeChildSwitch')||document.getElementById('zakerGlobalChildren');
 const options=children.map(c=>'<option value="'+c.id+'">'+esc(c.full_name)+' — '+esc(gradeAr[c.grade]||c.grade)+'</option>').join('');
 if(existing){existing.innerHTML=options;existing.value=active.id;return}
 const header=document.querySelector('header .topin,header .bar,header .top,header');
 if(!header)return;
 const wrap=document.createElement('div');wrap.style.cssText='display:flex;align-items:center;gap:7px';
 wrap.innerHTML='<label style="font-weight:800;color:inherit">أبنائي</label><select id="zakerGlobalChildren" style="max-width:190px;padding:8px 10px;border-radius:10px;border:1px solid #ffffff55;background:#fff;color:#351044;font-weight:800">'+options+'</select>';
 header.appendChild(wrap);
 wrap.querySelector('select').value=active.id;
 wrap.querySelector('select').onchange=()=>{const c=children.find(x=>x.id===wrap.querySelector('select').value);if(c){setChild(c);location.href='/'}};
}
function injectContact(s){
 if(!s||document.getElementById('zakerContactBtn'))return;
 const items=[];
 if(s.show_phone&&s.contact_phone)items.push(['☎️','اتصال',s.contact_phone,'tel:'+s.contact_phone]);
 if(s.show_whatsapp&&s.contact_whatsapp)items.push(['💬','WhatsApp',s.contact_whatsapp,'https://wa.me/'+String(s.contact_whatsapp).replace(/\D/g,'')]);
 if(s.show_email&&s.contact_email)items.push(['✉️','البريد',s.contact_email,'mailto:'+s.contact_email]);
 if(s.show_facebook&&s.contact_facebook)items.push(['f','Facebook','',s.contact_facebook]);
 if(s.show_instagram&&s.contact_instagram)items.push(['◎','Instagram','',s.contact_instagram]);
 if(!items.length)return;
 const style=document.createElement('style');style.textContent='.zk-contact-btn{position:fixed;right:18px;bottom:20px;z-index:90;border:0;border-radius:999px;background:#ff7418;color:#fff;padding:12px 16px;font-weight:900;box-shadow:0 10px 28px #0003}.zk-contact-box{position:fixed;right:18px;bottom:76px;z-index:91;width:min(330px,calc(100vw - 36px));background:#fff;border:1px solid #eadff0;border-radius:18px;padding:14px;box-shadow:0 18px 55px #35104435;display:none;color:#241331}.zk-contact-box.open{display:block}.zk-contact-item{display:flex;gap:10px;align-items:center;padding:10px;border-radius:11px;background:#faf7fc;margin:7px 0;text-decoration:none;color:inherit}.zk-term-banner{max-width:1180px;margin:12px auto;background:#fff4d7;border:1px solid #efcf7a;border-radius:14px;padding:12px 16px;color:#6f5113;font-weight:800}';
 document.head.appendChild(style);
 const box=document.createElement('div');box.id='zakerContactBox';box.className='zk-contact-box';box.innerHTML='<b>تواصل معنا</b>'+items.map(i=>'<a class="zk-contact-item" href="'+esc(i[3])+'" target="'+(i[3].startsWith('http')?'_blank':'_self')+'"><span>'+i[0]+'</span><div><b>'+i[1]+'</b><div style="font-size:12px;opacity:.7">'+esc(i[2])+'</div></div></a>').join('');
 const btn=document.createElement('button');btn.id='zakerContactBtn';btn.className='zk-contact-btn';btn.textContent='تواصل معنا';btn.onclick=()=>box.classList.toggle('open');
 document.body.append(box,btn);
}
function updateSettingsUI(s){
 if(!s)return;
 const set=(id,val)=>{const el=document.getElementById(id);if(el)el.textContent=val};
 set('homeActiveTermLabel',termAr(s.active_term)+' — '+s.active_academic_year);
 set('activeTermLabel',termAr(s.active_term)+' — '+s.active_academic_year);
 set('arabicFirstPrice',Number(s.arabic_first_subject_price).toLocaleString('ar-EG')+' جنيه / أول مادة');
 set('languagesFirstPrice',Number(s.languages_first_subject_price).toLocaleString('ar-EG')+' جنيه / أول مادة');
 set('arabicAdditionalPrice','كل مادة إضافية: '+Number(s.arabic_additional_subject_price).toLocaleString('ar-EG')+' جنيه');
 set('languagesAdditionalPrice','كل مادة إضافية: '+Number(s.languages_additional_subject_price).toLocaleString('ar-EG')+' جنيه');
 set('reviewPriceLabel',Number(s.exam_review_price).toLocaleString('ar-EG')+' جنيه / المادة');
 const path=location.pathname.toLowerCase();
 const term1Pages=['/student.html','/math.html','/math-ar.html','/english.html','/arabic.html','/social-studies.html','/primary4.html'];
 if(Number(s.active_term)!==1&&term1Pages.some(x=>path.endsWith(x))&&!new URLSearchParams(location.search).has('archive')){
   const b=document.createElement('div');b.className='zk-term-banner';b.innerHTML='الترم النشط الآن هو <b>'+termAr(s.active_term)+' '+esc(s.active_academic_year)+'</b>. محتوى الترم الأول محفوظ كأرشيف ولا يفتح من الواجهة الحالية. <a href="/" style="text-decoration:underline">العودة للرئيسية</a>';
   document.body.prepend(b);
   document.querySelector('main')?.setAttribute('hidden','hidden');
 }
}
async function init(){
 const s=await settings();updateSettingsUI(s);injectContact(s);const p=await profile();if(p)await log('page_view',{role:p.profile?.role||'unknown'},localStorage.getItem('zaker_active_child_id')||null);await injectChildren();
 const rev=document.getElementById('zakerExamReviewNav');if(rev)rev.href='/exam-review.html';
}
window.ZakerPlatform={client,settings,session,profile,getChildren,hasAccess,setChild,log,init};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();