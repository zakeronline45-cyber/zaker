(()=>{"use strict";
const URL='https://llhmkyighydokneqwrdj.supabase.co';
const KEY='sb_publishable_bGxbtk2yxjDaFACjEGrBWA_1MBC1i77';
const client=window.supabase?window.supabase.createClient(URL,KEY):null;
let settingsCache=null,contentCache=new Map();
const contentStatusLabel={active:'مفعّلة',building:'تحت الإنشاء',review:'تحت المراجعة',disabled:'غير متاحة'};
function normalizeContentSubject(s){
 s=String(s||'').trim().toLowerCase();
 if(['arabic','العربي','اللغة العربية'].includes(s))return 'arabic';
 if(['studies','social studies','social_studies','الدراسات','الدراسات الاجتماعية'].includes(s))return 'studies';
 if(['science-ar','العلوم','science arabic'].includes(s))return 'science-ar';
 if(['math-ar','الرياضيات','رياضيات','mathematics arabic'].includes(s))return 'math-ar';
 if(s==='science')return 'science';
 if(s==='math')return 'math';
 if(s==='english')return 'english';
 return s;
}
function pageContentSubject(){
 const path=location.pathname.toLowerCase();
 if(path.endsWith('/primary4.html'))return normalizeContentSubject(new URLSearchParams(location.search).get('subject')||'science');
 if(path.endsWith('/student.html'))return 'science';
 if(path.endsWith('/math.html'))return 'math';
 if(path.endsWith('/math-ar.html'))return 'math-ar';
 if(path.endsWith('/english.html'))return 'english';
 if(path.endsWith('/arabic.html'))return 'arabic';
 if(path.endsWith('/social-studies.html'))return 'studies';
 return '';
}
function releaseContentCheck(){document.documentElement.classList.remove('zk-content-check')}
if(pageContentSubject()){
 const st=document.createElement('style');st.id='zakerContentEarlyStyle';st.textContent='html.zk-content-check body{visibility:hidden!important}';document.head.appendChild(st);document.documentElement.classList.add('zk-content-check');
}
async function contentAvailability(grade,track,force=false){
 if(!client||!grade)return [];
 const key=grade+'|'+(track||'languages');
 if(contentCache.has(key)&&!force)return contentCache.get(key);
 const {data,error}=await client.rpc('get_content_availability',{p_grade:grade,p_track:track||'languages'});
 if(error)throw error;
 const rows=Array.isArray(data)?data:[];contentCache.set(key,rows);return rows;
}
function resolveContentState(rows,grade,track,subject){
 const gradeRow=(rows||[]).find(x=>x.scope==='grade'&&x.grade===grade);
 if(!gradeRow||gradeRow.status!=='active')return gradeRow||{scope:'grade',grade,track:'shared',subject_code:'',status:'building',message:'جاري تجهيز محتوى هذا الصف.'};
 const code=normalizeContentSubject(subject);
 const row=(rows||[]).find(x=>x.scope==='subject'&&x.grade===grade&&x.track===track&&normalizeContentSubject(x.subject_code)===code);
 return row||{scope:'subject',grade,track,subject_code:code,status:'building',message:'جاري تجهيز هذه المادة.'};
}
function contentDefaultMessage(state){
 if(state?.message)return state.message;
 if(state?.status==='review')return 'المادة تحت المراجعة حاليًا للتأكد من المحتوى والأسئلة.';
 if(state?.status==='disabled')return 'هذه المادة غير متاحة حاليًا.';
 return 'جاري تجهيز وتحديث هذه المادة، وستتاح فور اعتمادها من الإدارة.';
}
function showContentGate(state){
 releaseContentCheck();
 const wrap=document.createElement('div');wrap.id='zakerContentGate';wrap.style.cssText='position:fixed;inset:0;z-index:99999;background:linear-gradient(145deg,#351044,#6f2392);display:grid;place-items:center;padding:20px;font-family:Tahoma,Arial,sans-serif;direction:rtl';
 wrap.innerHTML='<div style="width:min(560px,94vw);background:#fff;border-radius:24px;padding:28px;text-align:center;box-shadow:0 30px 80px #0005;color:#241331"><div style="font-size:54px">'+(state.status==='review'?'🔍':state.status==='disabled'?'⛔':'🚧')+'</div><h1 style="margin:8px 0 10px">'+esc(contentStatusLabel[state.status]||'تحت الإنشاء')+'</h1><p style="line-height:1.9;color:#6f6478">'+esc(contentDefaultMessage(state))+'</p><a href="/" style="display:inline-block;margin-top:12px;background:#ff7418;color:#fff;text-decoration:none;padding:11px 18px;border-radius:12px;font-weight:900">العودة للرئيسية</a></div>';
 document.body.appendChild(wrap);
}
async function enforceContentGate(child){
 const subject=pageContentSubject();
 if(!subject||!child){releaseContentCheck();return true}
 try{
   const rows=await contentAvailability(child.grade,child.track);
   const state=resolveContentState(rows,child.grade,child.track,subject);
   if(state.status==='active'){releaseContentCheck();return true}
   showContentGate(state);return false;
 }catch(err){
   showContentGate({status:'review',message:'تعذر التحقق من حالة المادة الآن. حاول مرة أخرى بعد قليل.'});return false;
 }
}
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
 const p=await profile();
 let activeChild=null;
 if(p&&p.profile?.role!=='admin'){
   const children=await getChildren();
   const saved=localStorage.getItem('zaker_active_child_id');
   activeChild=children.find(x=>x.id===saved)||children[0]||null;
   if(activeChild)setChild(activeChild);
 }
 await enforceContentGate(activeChild);
 const s=await settings();updateSettingsUI(s);injectContact(s);
 if(p)await log('page_view',{role:p.profile?.role||'unknown'},activeChild?.id||null);
 await injectChildren();
 const rev=document.getElementById('zakerExamReviewNav');if(rev)rev.href='/exam-review.html';
}
window.ZakerPlatform={client,settings,session,profile,getChildren,hasAccess,setChild,log,contentAvailability,resolveContentState,normalizeContentSubject,enforceContentGate,init};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();