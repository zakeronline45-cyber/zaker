(function(){
const dict={
'الرئيسية':'Home','شرح المنهج':'Lessons','الاختبارات':'Tests','التقارير':'Reports','حسابي':'My Account','خروج':'Logout',
'الطالب':'Student','الصف':'Grade','المسار':'Track','مسار لغات':'Languages Track','مسار عربي':'Arabic Track','تغيير الطالب':'Change Student',
'اختر مادتك وواصل الرحلة':'Choose your subject and continue','المادة الحالية':'Current subject','قريبًا':'Coming soon',
'الأهداف المستهدفة من الدرس':'Learning Objectives','اسأل مدرس ذاكر':'Ask Zaker AI','ملفي':'My Profile',
'المفاهيم الأساسية':'Key Concepts','الشرح المبسط عربي + English':'Lesson Explanation','لازم تكون فاهم إيه في الدرس؟':'What should you understand?','أمثلة مبسطة':'Examples',
'اختبار الدرس الحالي — 10 أسئلة':'Current lesson test — 10 questions','اعمل امتحان على كذا درس':'Build a multi-lesson test',
'اختار الدروس اللي عايز تمتحن عليها، والامتحان هيسحب أسئلة عشوائية منها.':'Choose the lessons and the test will draw random questions from them.',
'ابدأ امتحان الدروس المختارة — 20 سؤال':'Start selected lessons test — 20 questions','امتحان شامل بعد أول 4 دروس':'Cumulative test after first 4 lessons',
'امتحان شامل بعد 8 دروس':'Cumulative test after 8 lessons','امتحان شامل المنهج':'Full syllabus exam','ابدأ الامتحان الشامل':'Start cumulative test',
'عدد الاختبارات':'Tests','متوسط الدرجات':'Average Score','الدروس التي زرتها':'Lessons Viewed','أخطاء تحتاج مراجعة':'Mistakes to Review',
'آخر الاختبارات':'Recent Tests','نقاط الضعف وخطة المراجعة':'Weaknesses & Review Plan','تقدمك اليوم':'Today’s Progress','بنك الأسئلة':'Question Bank','آخر نتيجة':'Last Score',
'كل سؤال تحله يقربك خطوة من هدفك!':'Every solved question brings you closer to your goal!',
'اختيار نوع الأسئلة':'Choose question type','متنوع':'Mixed','اختياري':'Multiple Choice','أكمل':'Complete','علّل':'Give Reason','مسألة':'Problem',
'اختر نوع الأسئلة قبل بدء الاختبار.':'Choose a question type before starting the test.',
'متابعة ولي الأمر':'Parent Dashboard','متابعة:':'Viewing:','الاشتراكات':'Subscriptions','ملف الطالب':'Student Profile',
'متوسط الاختبارات':'Test Average','الدروس التي زارها':'Lessons Viewed','إجابات تحتاج مراجعة':'Answers to Review',
'تحليل ذاكر':'Zaker Analysis','الأسئلة التي أخطأ فيها الطالب':'Incorrect Answers','لا توجد اختبارات بعد.':'No tests yet.','لا يوجد نشاط بعد.':'No activity yet.',
'بيانات ولي الأمر':'Parent Details','اسم ولي الأمر':'Parent Name','رقم الموبايل':'Mobile Number','حفظ التعديلات':'Save Changes',
'الأبناء والاشتراكات':'Children & Subscriptions','كل ابن له مساره وصفه واشتراكاته بشكل مستقل.':'Each child has an independent track, grade and subscription.'
};
function translate(root=document.body){
 if(!root)return;
 const lang=localStorage.getItem('zaker_ui_lang')||'ar';
 document.documentElement.dataset.zakerLang=lang;document.documentElement.lang=lang;document.documentElement.dir=lang==='en'?'ltr':'rtl';
 const sw=document.getElementById('zakerLangSwitch');if(sw)sw.value=lang;
 if(lang!=='en')return;
 const w=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);const nodes=[];while(w.nextNode())nodes.push(w.currentNode);
 nodes.forEach(n=>{const t=n.nodeValue.trim();if(dict[t])n.nodeValue=n.nodeValue.replace(t,dict[t])});
 root.querySelectorAll('[placeholder]').forEach(e=>{const p=e.getAttribute('placeholder');const pd={'اكتب سؤالك هنا':'Type your question here','اكتب سؤالك هنا...':'Type your question here...','اكتب إجابتك هنا...':'Type your answer here...'}[p];if(pd)e.setAttribute('placeholder',pd)});
}
window.setZakerLanguage=function(lang){localStorage.setItem('zaker_ui_lang',lang==='en'?'en':'ar');location.reload()};
window.zakerTranslatePage=translate;
document.addEventListener('DOMContentLoaded',()=>{translate();const obs=new MutationObserver(ms=>{for(const m of ms)for(const n of m.addedNodes)if(n.nodeType===1)translate(n)});obs.observe(document.body,{childList:true,subtree:true})});
})();