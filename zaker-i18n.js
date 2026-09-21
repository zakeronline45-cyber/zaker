(function(){
const exact={
'ذاكر | الرئيسية':'Zaker | Home','ذاكر | الطالب':'Zaker | Student','ذاكر | متابعة ولي الأمر':'Zaker | Parent Dashboard','ذاكر | حسابي':'Zaker | My Account','ذاكر | الدخول وإنشاء حساب':'Zaker | Login & Sign Up','ذاكر | الاشتراك':'Zaker | Subscription',
'ذاكر':'Zaker','رحلتك نحو التفوق':'Your Journey to Excellence','الرئيسية':'Home','شرح المنهج':'Lessons','الاختبارات':'Tests','التقارير':'Reports','حسابي':'My Account','خروج':'Logout','الاشتراكات':'Subscriptions',
'أهلًا يا':'Welcome','بطل':'Champion','ابدأ من آخر نقطة وصلت لها، وذاكر براحتك خطوة بخطوة.':'Continue from where you stopped and study step by step at your own pace.','كمّل مذاكرتك ←':'Continue Studying →','ملخصك الدراسي':'Study Summary','آخر نتيجة':'Last Score','إجمالي الاختبارات':'Total Tests','الأداء العام':'Overall Performance','ابدأ من هنا':'Start Here','كل ما تحتاجه في مكان واحد':'Everything you need in one place',
'شرح مبسط عربي + English':'Clear English Explanation','تدريبات الدروس':'Lesson Practice','اختبر فهمك بعد كل درس':'Test your understanding after each lesson','اختبار مخصص':'Custom Test','اختر أكثر من درس':'Choose multiple lessons','امتحان شامل':'Full Exam','اختبارات مجمعة للمنهج':'Cumulative syllabus tests','مدرس ذاكر AI':'Zaker AI Tutor','اسأل وافهم أي نقطة':'Ask about anything you do not understand','تقارير الأخطاء':'Mistake Reports','اعرف أخطاءك وراجعها':'Review your mistakes','تقارير الأداء':'Performance Reports','نتائجك وتقدمك بالتفصيل':'Your results and progress in detail','التحليلات المحفوظة':'Saved Analyses','ارجع لأي تحليل واطبعه':'Open and print any saved analysis','إحصائياتك':'Your Statistics','متوسط الأداء':'Average Performance','أفضل نتيجة':'Best Score','أخطاء للمراجعة':'Mistakes to Review','المواد':'Subjects','المتاح حاليًا':'Currently Available','ابدأ الآن':'Start Now','قريبًا':'Coming Soon','العربي':'Arabic','الدراسة':'Study','اختباراتي':'My Tests','تقاريري':'My Reports','الصف الدراسي':'Grade','جاري التحميل...':'Loading...',
'الطالب':'Student','الصف':'Grade','المسار':'Track','مسار لغات':'Languages Track','مسار عربي':'Arabic Track','تغيير الطالب':'Change Student','لغات':'Languages','عربي':'Arabic',
'اختار مسارك الدراسي':'Choose Your Study Track','الاختيار ده هيحدد المواد والمناهج والاختبارات ومدرس ذاكر AI اللي هتظهر لك.':'Your choice determines the subjects, curriculum, tests, and Zaker AI Tutor you will use.','🌐 مسار لغات':'🌐 Languages Track','📘 مسار عربي':'📘 Arabic Track','العلوم والرياضيات بالعربي':'Science and Math in Arabic',
'رحلتك نحو التفوق 🌱':'Your Journey to Excellence 🌱','كل درس يقربك من حلمك — المعرفة تصنع مستقبلك!':'Every lesson brings you closer to your goal — knowledge builds your future!','البداية':'Start','خطوة جديدة':'Next Step','أنت هنا':'You Are Here','الدرس الحالي':'Current Lesson','اختبار قصير':'Quick Test','مستقبلك أجمل':'A Brighter Future','🎮 اختر مادتك وواصل الرحلة':'🎮 Choose Your Subject and Continue','المادة الحالية':'Current Subject','الدراسات':'Social Studies','أولى إعدادي لغات':'First Prep — Languages',
'Science English: شرح مبسط داعم بالعربي عند الحاجة، وأسئلة وامتحانات أصلها English من كتب Science لغات.':'Science in English with clear explanations and English questions based on the Languages curriculum.',
'الأهداف المستهدفة من الدرس':'Learning Objectives','اسأل مدرس ذاكر':'Ask Zaker AI','ملفي':'My Profile','ملفي الدراسي':'My Study Profile','المفاهيم الأساسية':'Key Concepts','الشرح المبسط عربي + English':'English Explanation','لازم تكون فاهم إيه في الدرس؟':'What You Should Understand','أمثلة مبسطة':'Examples',
'اسأل عن الدرس الحالي، ومدرس ذاكر مخصص لمنهج Science English الحالي، ويتذكر الأسئلة المتكررة عندك.':'Ask about the current lesson. Zaker AI is focused on your Science English curriculum and remembers your recurring questions.','اسأل':'Ask',
'أثناء الاختبار لن تظهر الحلول. بعد النهاية سيظهر: السؤال، الإجابة الصحيحة، إجابة الطالب، والشرح.':'Answers stay hidden during the test. After finishing, you will see the question, correct answer, your answer, and explanation.',
'اختيار نوع الأسئلة':'Choose Question Type','اختر نوع الأسئلة قبل بدء الاختبار.':'Choose the question type before starting.','متنوع':'Mixed','اختياري':'Multiple Choice','أكمل':'Complete','علّل':'Give Reason','مسألة':'Problem','قارن':'Compare','صح / خطأ':'True / False','اختيار من متعدد':'Multiple Choice',
'اختبار الدرس الحالي — 10 أسئلة':'Current Lesson Test — 10 Questions','اعمل امتحان على كذا درس':'Build a Multi-Lesson Test','اختار الدروس اللي عايز تمتحن عليها، والامتحان هيسحب أسئلة عشوائية منها.':'Choose the lessons you want and the test will draw random questions from them.','ابدأ امتحان الدروس المختارة — 20 سؤال':'Start Selected Lessons Test — 20 Questions','امتحان شامل بعد أول 4 دروس':'Cumulative Test After 4 Lessons','امتحان شامل بعد 8 دروس':'Cumulative Test After 8 Lessons','امتحان شامل المنهج':'Full Syllabus Exam','ابدأ الامتحان الشامل':'Start Cumulative Test',
'عدد الاختبارات':'Tests','متوسط الدرجات':'Average Score','الدروس التي زرتها':'Lessons Viewed','أخطاء تحتاج مراجعة':'Mistakes to Review','آخر الاختبارات':'Recent Tests','نقاط الضعف وخطة المراجعة':'Weaknesses & Review Plan','📊 تقدمك اليوم':'📊 Today’s Progress','بنك الأسئلة':'Question Bank','🏆 كل سؤال تحله يقربك خطوة من هدفك!':'🏆 Every solved question brings you closer to your goal!',
'المحتوى':'Content','المحتوى لم يُرفع بعد':'Content Is Not Available Yet','سيتم تفعيل المحتوى من الكتب الأصلية الخاصة بالمسار والصف.':'Content will be activated from the original books for this track and grade.','العودة لحساب ولي الأمر':'Back to Parent Account',
'🤖 مساعدك الذكي':'🤖 Your AI Assistant','أسألك، أشرح لك، وأدلك على المكان الصح.':'Ask me, learn with me, and I will guide you to the right place.','📖 اشرح الدرس':'📖 Explain the Lesson','📝 فين الاختبارات؟':'📝 Where Are the Tests?','🧭 استخدام الموقع':'🧭 How to Use the Site','⭐ تقدمي':'⭐ My Progress',
'متابعة ولي الأمر':'Parent Dashboard','ولي الأمر':'Parent','متابعة:':'Viewing:','ملف الطالب':'Student Profile','متوسط الاختبارات':'Test Average','الدروس التي زارها':'Lessons Viewed','إجابات تحتاج مراجعة':'Answers to Review','آخر النشاطات':'Recent Activity','تحليل ذاكر':'Zaker Analysis','الأسئلة التي أخطأ فيها الطالب':'Incorrect Answers','السؤال، إجابة الطالب، الإجابة الصحيحة، والشرح المبسط فقط — بدون مراجع صفحات.':'Question, student answer, correct answer, and a clear explanation.','لا توجد اختبارات بعد.':'No tests yet.','لا يوجد نشاط بعد.':'No activity yet.','أكثر درس يحتاج مراجعة':'Lesson Needing the Most Review','لا توجد أخطاء مسجلة حتى الآن.':'No recorded mistakes yet.','خطة المراجعة الحالية':'Current Review Plan','إجابة الطالب':'Student Answer','الإجابة الصحيحة':'Correct Answer','لا توجد إجابات خاطئة مسجلة.':'No incorrect answers recorded.',
'بيانات ولي الأمر':'Parent Details','اسم ولي الأمر':'Parent Name','رقم الموبايل':'Mobile Number','حفظ التعديلات':'Save Changes','إضافة ابن':'Add Child','اسم الابن / الابنة':'Child Name','المسار':'Track','حفظ الابن':'Save Child','إلغاء التعديل':'Cancel Edit','الأبناء والاشتراكات':'Children & Subscriptions','كل ابن له مساره وصفه واشتراكاته بشكل مستقل.':'Each child has an independent track, grade, and subscription.','عدد الأبناء':'Children','اشتراكات نشطة':'Active Subscriptions','الحساب':'Account','ولي أمر':'Parent','دخول ملف الطالب':'Open Student Profile','متابعة الأداء':'View Performance','الاشتراك / التجديد':'Subscribe / Renew','تعديل':'Edit','حذف':'Delete','لم تتم إضافة أبناء حتى الآن.':'No children have been added yet.',
'العودة للرئيسية':'Back to Home','تسجيل الدخول':'Login','إنشاء حساب':'Sign Up','أهلًا بيك':'Welcome','سجّل دخولك وكمّل مذاكرتك من آخر نقطة وصلت لها.':'Sign in and continue studying from where you stopped.','البريد الإلكتروني':'Email','كلمة المرور':'Password','دخول':'Login','اعمل حساب ولي أمر':'Create Parent Account','حساب واحد لمتابعة الأبناء والاشتراكات والنتائج.':'One account to manage children, subscriptions, and results.','المسار الدراسي':'Study Track','إنشاء الحساب':'Create Account','تعليم أذكى.. ومتابعة أسهل':'Smarter Learning. Easier Follow-up.','من الحساب تضيف أبناءك، ولكل ابن بياناته ومساره وصفه واشتراكاته ونتائجه بشكل مستقل.':'Add your children from one account. Each child keeps separate profile, track, grade, subscription, and results.','ملف طالب دائم':'Permanent Student Profile','بدل حفظ البيانات على جهاز واحد فقط.':'Your data stays with the account, not one device.','نتائج واختبارات':'Results & Tests','تتجمع على الحساب وتبقى جاهزة للمتابعة.':'Results stay organized and ready to review.','الاشتراك':'Subscription','بعد الدخول تقدر تختار الباقة وتكمل الدفع.':'After login, choose a plan and complete payment.','المسار العربي واللغات منفصلين؛ كل طالب يشوف محتوى مساره فقط.':'Arabic and Languages tracks are separate; every student sees only their own track.','✓ شرح مبسط':'✓ Clear Explanation','✓ اختبارات بلا وقت':'✓ Untimed Tests','✓ تحليل أخطاء':'✓ Mistake Analysis','✓ تقارير محفوظة':'✓ Saved Reports',
'اشتراك ذاكر':'Zaker Subscription','أول مادة بـ250 جنيه شهريًا، وكل مادة إضافية تضيف 225 جنيه فقط. الطفل الثاني يحصل على خصم 25% من إجمالي اشتراكه.':'First subject: EGP 250/month. Each extra subject adds EGP 225. The second child receives a 25% discount.','جاري تحميل حالة الاشتراك...':'Loading subscription status...','عندك كود دعائي؟':'Have a Promo Code?','اختار الابن واكتب الكود لتفعيل الفترة المجانية على حسابه.':'Choose the child and enter the code to activate the free period.','الابن / الابنة':'Child','الكود الدعائي':'Promo Code','تفعيل الكود':'Activate Code','احسب اشتراكك':'Calculate Your Subscription','عدد المواد':'Number of Subjects','مادة واحدة':'1 Subject','مادتان':'2 Subjects','3 مواد':'3 Subjects','4 مواد':'4 Subjects','5 مواد':'5 Subjects','جنيه / شهر':'EGP / month','1 مادة × 250 جنيه.':'1 subject × EGP 250.','ابدأ طلب تحويل بنكي':'Start Bank Transfer Request','بيانات التحويل البنكي':'Bank Transfer Details','كود الطلب:':'Request Code:','المبلغ المطلوب:':'Amount Due:','جنيه':'EGP','اسم المحوّل':'Sender Name','رقم مرجع التحويل':'Transfer Reference','صورة الإيصال / PDF':'Receipt Image / PDF','رفعت التحويل — إرسال للمراجعة':'Submit Transfer for Review',
'أولى إعدادي':'First Prep','تانية إعدادي':'Second Prep','تالتة إعدادي':'Third Prep','العلوم':'Science','الرياضيات':'Math',
'تحقق من فهمك قبل الاختبار':'Check Your Understanding Before the Test','مثال من فكرة الكتاب':'Curriculum Example','مثال مبسط':'Simple Example','إرسال الإجابة':'Submit Answer','السؤال':'Question','من':'of','نتيجتك':'Your Result','إيه اللي محتاج تفهمه وتراجعه؟':'What You Need to Understand and Review','ممتاز، مفيش أخطاء محتاجة مراجعة في الاختبار ده.':'Excellent — there are no mistakes to review in this test.','خطة المراجعة قبل إعادة الاختبار':'Review Plan Before Retaking the Test','راجع الأهداف والشرح الآن':'Review Objectives and Explanation Now','🖨️ طباعة التحليل':'🖨️ Print Analysis','📝 طباعة نسخة الامتحان':'📝 Print Test Copy','اختبار جديد':'New Test','التحليل:':'Analysis:','تحليل محفوظ:':'Saved Analysis:','ممتاز، لا توجد أخطاء في هذا الاختبار.':'Excellent — no mistakes in this test.','خطة المراجعة':'Review Plan','عرض التحليل المحفوظ':'View Saved Analysis','لسه مفيش اختبارات محفوظة.':'No saved tests yet.','لا توجد نقاط ضعف مسجلة.':'No recorded weaknesses.','إجابات صحيحة':'Correct Answers','تفاصيل الإجابات':'Answer Details','تحليل الأخطاء':'Mistake Analysis','صحيحة ✓':'Correct ✓','تحتاج مراجعة ✗':'Needs Review ✗','مفتوح':'Open','اسم الطالب:':'Student Name:','المادة:':'Subject:','عدد الأسئلة:':'Number of Questions:','الزمن:':'Time:','التاريخ:':'Date:','الدرجة:':'Score:','الاختبار:':'Test:'
};
const attrs={
'اكتب سؤالك هنا':'Type your question here','اكتب سؤالك هنا...':'Type your question here...','اكتب إجابتك هنا...':'Type your answer here...','اكتب اسم الابن':'Enter child name','مثال: SCHOOL14':'Example: SCHOOL14'
};
const partial=[
[/أهلًا يا\s*/g,'Welcome '],[/متابعة\s+/g,'Viewing '],[/ — لغات/g,' — Languages'],[/ — عربي/g,' — Arabic'],[/ — خصم الطفل الثاني 25%/g,' — 25% second-child discount'],[/ — ينتهي:/g,' — ends:'],[/أخطاء/g,'mistakes'],[/خطأ/g,'Mistake'],[/يوم/g,'days'],[/مادة/g,'subject'],[/طالب/g,'student'],[/لغات/g,'Languages'],[/عربي/g,'Arabic'],[/جنيه/g,'EGP']
];
function lang(){return localStorage.getItem('zaker_ui_lang')||'ar'}
function translateText(text){
 const trimmed=String(text||'').trim();
 if(!trimmed)return text;
 if(exact[trimmed]) return String(text).replace(trimmed,exact[trimmed]);
 let out=String(text);
 for(const [re,val] of partial)out=out.replace(re,val);
 return out;
}
function translate(root=document.body){
 if(!root)return;
 const l=lang();
 document.documentElement.dataset.zakerLang=l;document.documentElement.lang=l;document.documentElement.dir=l==='en'?'ltr':'rtl';
 const sw=document.getElementById('zakerLangSwitch');if(sw)sw.value=l;
 if(l!=='en')return;
 const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);
 const nodes=[];while(walker.nextNode())nodes.push(walker.currentNode);
 nodes.forEach(n=>{const next=translateText(n.nodeValue);if(next!==n.nodeValue)n.nodeValue=next});
 root.querySelectorAll('[placeholder]').forEach(e=>{const p=e.getAttribute('placeholder');if(attrs[p])e.setAttribute('placeholder',attrs[p])});
 root.querySelectorAll('[aria-label]').forEach(e=>{const a=e.getAttribute('aria-label');if(exact[a])e.setAttribute('aria-label',exact[a])});
}
function audit(){
 if(lang()!=='en')return [];
 const hits=[];
 const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);
 while(walker.nextNode()){const t=walker.currentNode.nodeValue.trim();if(/[\u0600-\u06FF]/.test(t)&&walker.currentNode.parentElement?.offsetParent!==null)hits.push(t)}
 return [...new Set(hits)];
}
window.setZakerLanguage=function(v){localStorage.setItem('zaker_ui_lang',v==='en'?'en':'ar');location.reload()};
window.zakerTranslatePage=translate;
window.zakerLang=lang;
window.zakerT=function(ar,en){return lang()==='en'?en:ar};
window.zakerAuditArabic=audit;
document.addEventListener('DOMContentLoaded',()=>{
 translate();
 const obs=new MutationObserver(ms=>{
  for(const m of ms){
   if(m.type==='characterData')translate(m.target.parentElement||document.body);
   for(const n of m.addedNodes)if(n.nodeType===1)translate(n);else if(n.nodeType===3&&n.parentElement)translate(n.parentElement);
  }
 });
 obs.observe(document.body,{childList:true,subtree:true,characterData:true});
 setTimeout(()=>translate(),50);setTimeout(()=>translate(),300);
});
})();