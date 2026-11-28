/* ==========================================================================
   ملف البيانات وإدارة التخزين المحلي (LocalStorage) - منصة سكينة
   يقوم هذا الملف بتخزين البيانات الأولية (الأسئلة الـ14، المختصين، المقالات،
   قواعد احتساب الدرجات، والحسابات التجريبية) في متصفح المستخدم (localStorage)
   حتى تعمل المنصة بشكل تفاعلي كامل بدون الحاجة إلى خادم أو قاعدة بيانات خارجية.
   ========================================================================== */

const STORAGE_KEY = 'sakina_platform_data_v1';
const SESSION_KEY = 'sakina_current_user_v1';
const LAST_RESULT_KEY = 'sakina_last_assessment_v1';

// البيانات الافتراضية المطابقة تماماً لقاعدة بيانات منصة سكينة
const DEFAULT_DATA = {
    // 1. الحسابات (مستفيد، مختصين، إدارة)
    users: [
        {
            id: 1,
            name: 'إدارة منصة سكينة',
            email: 'admin@sakina.com',
            password: 'password',
            role: 'admin',
            phone: '770000000',
            is_active: true
        },
        {
            id: 2,
            name: 'محمد علي',
            email: 'user@sakina.com',
            password: 'password',
            role: 'beneficiary',
            phone: '771234567',
            birth_date: '1999-05-15',
            is_active: true
        },
        {
            id: 3,
            name: 'د. أحمد المنصور',
            email: 'ahmad@sakina.com',
            password: 'password',
            role: 'specialist',
            phone: '770000001',
            is_active: true
        },
        {
            id: 4,
            name: 'أ. سارة العبدلي',
            email: 'sara@sakina.com',
            password: 'password',
            role: 'specialist',
            phone: '770000002',
            is_active: true
        },
        {
            id: 5,
            name: 'د. خالد السقاف',
            email: 'khalid@sakina.com',
            password: 'password',
            role: 'specialist',
            phone: '770000003',
            is_active: true
        },
        {
            id: 6,
            name: 'أ. ريم الحداد',
            email: 'reem@sakina.com',
            password: 'password',
            role: 'specialist',
            phone: '770000004',
            is_active: true
        }
    ],

    // 2. ملفات المستشارين والأخصائيين النفسيين
    specialists: [
        {
            id: 1,
            user_id: 3,
            name: 'د. أحمد المنصور',
            title: 'دكتور واستشاري نفسي',
            specialty: 'استشاري القلق والاكتئاب',
            experience_years: 12,
            bio: 'دكتوراه في علم النفس الإكلينيكي، خبرة 12 عاماً في العلاج المعرفي السلوكي وإدارة القلق واضطرابات المزاج.',
            certificates: 'دكتوراه علم النفس الإكلينيكي، البورد العربي للعلاج المعرفي السلوكي',
            contact_phone: '770000001',
            is_approved: true
        },
        {
            id: 2,
            user_id: 4,
            name: 'أ. سارة العبدلي',
            title: 'أخصائية نفسية أولى',
            specialty: 'أخصائية الضغوط والاحتراق النفسي',
            experience_years: 8,
            bio: 'ماجستير في الإرشاد النفسي، متخصصة في التعامل مع ضغوط العمل والدراسة واستعادة التوازن النفسي.',
            certificates: 'ماجستير الإرشاد النفسي، دبلوم اليقظة الذهنية',
            contact_phone: '770000002',
            is_approved: true
        },
        {
            id: 3,
            user_id: 5,
            name: 'د. خالد السقاف',
            title: 'معالج ومستشار أسري',
            specialty: 'معالج واستشارات أسرية ونوم',
            experience_years: 10,
            bio: 'خبرة واسعة في حل المشكلات الأسرية واضطرابات النوم والتفكير الزائد بطرق علمية هادئة.',
            certificates: 'دكتوراه الإرشاد الأسري، شهادة العلاج السلوكي للأرق',
            contact_phone: '770000003',
            is_approved: true
        },
        {
            id: 4,
            user_id: 6,
            name: 'أ. ريم الحداد',
            title: 'أخصائية دعم نفسي',
            specialty: 'الدعم النفسي للشباب',
            experience_years: 4,
            bio: 'أخصائية نفسية مهتمة بدعم طلاب الجامعات وتجاوز القلق الدراسي وبناء المرونة النفسية.',
            certificates: 'بكالوريوس علم النفس، دورات الإسعاف النفسي الأولي',
            contact_phone: '770000004',
            is_approved: false
        }
    ],

    // 3. أسئلة المقياس النفسي الأولي (14 سؤالاً مقسمة إلى 3 محاور)
    questions: [
        // محور المزاج والاكتئاب (1-5)
        { id: 1, category: 'mood', category_label: 'المزاج والاكتئاب', order_index: 1, question_text: 'هل تشعر بالحزن أو الإحباط أو اليأس معظم ساعات اليوم؟', is_active: true },
        { id: 2, category: 'mood', category_label: 'المزاج والاكتئاب', order_index: 2, question_text: 'هل فقدت الاهتمام أو المتعة في ممارسة الأنشطة التي كنت تستمتع بها عادة؟', is_active: true },
        { id: 3, category: 'mood', category_label: 'المزاج والاكتئاب', order_index: 3, question_text: 'هل تواجه صعوبة في النوم (أرق) أو النوم الزائد عن الحد بشكل مستمر؟', is_active: true },
        { id: 4, category: 'mood', category_label: 'المزاج والاكتئاب', order_index: 4, question_text: 'هل تشعر بخمول مستمر، نقص في الطاقة، أو تعب جسدي دون مجهود بدني واضح؟', is_active: true },
        { id: 5, category: 'mood', category_label: 'المزاج والاكتئاب', order_index: 5, question_text: 'هل تواجه صعوبة في التركيز على المهام اليومية (مثل القراءة أو العمل أو الدراسة)؟', is_active: true },

        // محور التوتر والقلق (6-10)
        { id: 6, category: 'anxiety', category_label: 'التوتر والقلق', order_index: 6, question_text: 'هل تشعر بالعصبية، التوتر، أو حدة المزاج بشكل مفرط؟', is_active: true },
        { id: 7, category: 'anxiety', category_label: 'التوتر والقلق', order_index: 7, question_text: 'هل تجد صعوبة في التحكم بالخوف أو القلق المستمر بشأن أمور مختلفة؟', is_active: true },
        { id: 8, category: 'anxiety', category_label: 'التوتر والقلق', order_index: 8, question_text: 'هل تشعر بضيق أو قلق يمنعك من الاسترخاء والهدوء؟', is_active: true },
        { id: 9, category: 'anxiety', category_label: 'التوتر والقلق', order_index: 9, question_text: 'هل تشعر بالقلق الشديد من أن أمراً سيئاً قد يحدث لك أو لعائلتك دون مبرر واضح؟', is_active: true },
        { id: 10, category: 'anxiety', category_label: 'التوتر والقلق', order_index: 10, question_text: 'هل تعاني من أعراض جسدية ناتجة عن التوتر (مثل ضربات قلب سريعة، شد عضلي، أو صداع)؟', is_active: true },

        // محور الضغوط والاحتراق (11-14)
        { id: 11, category: 'burnout', category_label: 'الضغوط والاحتراق', order_index: 11, question_text: 'هل تشعر بالإرهاق النفسي أو الجسدي الشديد بنهاية يوم العمل أو الدراسة؟', is_active: true },
        { id: 12, category: 'burnout', category_label: 'الضغوط والاحتراق', order_index: 12, question_text: 'هل تشعر أن الضغوط اليومية تفوق قدرتك على التكيف والتحمل؟', is_active: true },
        { id: 13, category: 'burnout', category_label: 'الضغوط والاحتراق', order_index: 13, question_text: 'هل تشعر بضعف الشغف تجاه مسؤولياتك أو رغبة متزايدة في الانعزال عن الآخرين؟', is_active: true },
        { id: 14, category: 'burnout', category_label: 'الضغوط والاحتراق', order_index: 14, question_text: 'هل يؤثر التفكير الزائد (Overthinking) في مشاكلك اليومية على جودة حياتك ونومك؟', is_active: true }
    ],

    // 4. المقالات التوعوية
    articles: [
        {
            id: 1,
            author_id: 3,
            author_name: 'د. أحمد المنصور',
            title: 'تهدئة القلق اليومي بتقنية التنفس العميق',
            category: 'القلق والتوتر',
            summary: 'تقنية التنفس العميق (4-7-8) لتهدئة نبضات القلب واستعادة الصفاء الذهني خلال دقائق.',
            content: 'يُعد القلق اليومي استجابة طبيعية من الجسم للضغوط، لكنه قد يتحول إلى عبء عندما يستمر لفترات طويلة.\n\nتُعتبر تقنية التنفس (4-7-8) من أبسط وأسرع الطرق العلمية لتفعيل الجهاز العصبي السمبتاوي المسؤول عن الاسترخاء:\n1. اجلس في وضع مريح وأغمض عينيك.\n2. استنشق الهواء ببطء عبر أنفك لمدة 4 ثوانٍ.\n3. احبس أنفاسك برفق لمدة 7 ثوانٍ.\n4. أخرج الهواء ببطء عبر فمك لمدة 8 ثوانٍ.\n\nكرر هذه الدورة 4 مرات صباحاً ومساءً، وستلاحظ انخفاضاً ملموساً في التوتر الجسدي وتسارع الأفكار.',
            reading_time: 3,
            status: 'approved'
        },
        {
            id: 2,
            author_id: 4,
            author_name: 'أ. سارة العبدلي',
            title: 'التعافي من الاحتراق النفسي واستعادة الشغف',
            category: 'الضغوط والاحتراق',
            summary: 'خطوات دافئة وعملية لاستعادة طاقتك النفسية وتنظيم حدودك بين العمل والحياة الشخصية.',
            content: 'الاحتراق النفسي ليس مجرد تعب عابر، بل هو استنزاف عاطفي وجسدي ناتج عن الضغوط المستمرة دون فترات تعافٍ كافية.\n\nللبدء برحلة التعافي:\n• اعترف بحدود طاقتك وتعلم قول (لا) للمهام الإضافية غير الضرورية.\n• خصص 30 دقيقة يومياً لنشاط لا علاقة له بالإنجاز أو العمل.\n• افصل بين وقت الراحة ورسائل العمل والالتزامات.\n\nتذكر دائماً أن طلب المساعدة من مختص نفسي هو خطوة شجاعة وواعية نحو استعادة توازنك.',
            reading_time: 4,
            status: 'approved'
        },
        {
            id: 3,
            author_id: 5,
            author_name: 'د. خالد السقاف',
            title: 'عادات مسائية مريحة لإيقاف التفكير الزائد',
            category: 'النوم والهدوء',
            summary: 'روتين مسائي بسيط يمنح عقلك الراحة قبل النوم ويقلل من دوامة التفكير المفرط.',
            content: 'كثيراً ما تزداد حدة الأفكار المقلقة في الساعات المتأخرة من الليل حين يهدأ المحيط وتخف المشتتات.\n\nجرب هذا الروتين قبل النوم بساعة:\n• تفريغ الأفكار: اكتب 3 أمور تشغل بالك على ورقة وأغلقها لتخبر عقلك أنك ستعالجها غداً.\n• إبعاد الشاشات: الإضاءة الزرقاء تبقي الدماغ في حالة تأهب.\n• إضاءة دافئة ومشروب دافئ خالٍ من الكافيين.\n\nالنوم العميق هو حجر الأساس للاستقرار النفسي والمزاج المتوازن.',
            reading_time: 3,
            status: 'approved'
        },
        {
            id: 4,
            author_id: 3,
            author_name: 'د. أحمد المنصور',
            title: 'متى يكون التحدث مع مختص نفسي خطوة ضرورية؟',
            category: 'الصحة النفسية',
            summary: 'كيف نميز بين تقلبات المزاج العابرة والحاجة إلى دعم واستشارة نفسية متخصصة.',
            content: 'يمر كل إنسان بأيام صعبة ومشاعر حزن أو قلق مؤقتة، لكن استمرار هذه المشاعر لأكثر من أسبوعين وتأثيرها على النوم أو العمل أو العلاقات هو إشارة واضحة لأهمية استشارة مختص.\n\nفي منصة سكينة، يوفر لك التقييم الأولي مؤشراً توعوياً يساعدك على فهم حالتك، ويسهل عليك الوصول الآمن والسري إلى المستشارين المعتمدين.',
            reading_time: 4,
            status: 'approved'
        },
        {
            id: 5,
            author_id: 4,
            author_name: 'أ. سارة العبدلي',
            title: 'كيف تدعم صديقاً يمر بأزمة نفسية؟',
            category: 'الدعم المجتمعي',
            summary: 'مهارات الاستماع الفعال دون إصدار أحكام وكيف تكون مساحة آمنة لمن تحب.',
            content: 'أهم ما يحتاجه الشخص المتعب نفسياً هو وجود من يستمع إليه بإنصات وتعاطف دون محاولة تقديم حلول سريعة أو التقليل من مشاعره.',
            reading_time: 3,
            status: 'pending'
        }
    ],

    // 5. قواعد احتساب الدرجات (من 0 إلى 42)
    scoringRules: [
        {
            id: 1,
            level: 'low',
            label: 'مستوى منخفض (مستقر)',
            min_score: 0,
            max_score: 14,
            recommendation: 'حالتك النفسية تبدو مستقرة ضمن النطاق الطبيعي. استمر في العادات الصحية، النوم الكافي، وتصفح المقالات التوعوية لتعزيز توازنك اليومي.'
        },
        {
            id: 2,
            level: 'moderate',
            label: 'مستوى متوسط',
            min_score: 15,
            max_score: 28,
            recommendation: 'تشير إجاباتك إلى وجود مؤشرات متوسطة للضغوط النفسية. ننصحك بتطبيق تمارين التنفس العميق (4-7-8)، وتقليل مسببات التوتر قبل النوم، كما يمكنك استشارة أحد المختصين للاطمئنان.'
        },
        {
            id: 3,
            level: 'high',
            label: 'مستوى مرتفع (يستدعي الاهتمام)',
            min_score: 29,
            max_score: 42,
            recommendation: 'تشير إجاباتك إلى ارتفاع ملحوظ في مستويات الضغط أو القلق. هذا المؤشر أولي وتوعوي، ونوصيك بشدة بالتواصل المباشر وبكل سرية مع أحد المستشارين المعتمدين أدناه للحصول على خطة دعم مناسبة.'
        }
    ],

    // 6. تقييمات تجريبية سابقة للمستفيد (محمد علي) لعرض رسم التطور البياني
    assessments: [
        {
            id: 101,
            user_id: 2,
            total_score: 30,
            mood_score: 11,
            anxiety_score: 11,
            burnout_score: 8,
            severity_level: 'high',
            recommendation: 'تشير إجاباتك إلى ارتفاع ملحوظ في مستويات الضغط أو القلق. نوصيك بالتواصل مع أحد المختصين.',
            created_at: '2026-11-05'
        },
        {
            id: 102,
            user_id: 2,
            total_score: 21,
            mood_score: 6,
            anxiety_score: 9,
            burnout_score: 6,
            severity_level: 'moderate',
            recommendation: 'تشير إجاباتك إلى وجود مؤشرات متوسطة للضغوط النفسية، وتتركز بشكل أكبر في محور (التوتر والقلق).',
            created_at: '2026-11-18'
        },
        {
            id: 103,
            user_id: 2,
            total_score: 13,
            mood_score: 4,
            anxiety_score: 5,
            burnout_score: 4,
            severity_level: 'low',
            recommendation: 'حالتك النفسية تبدو مستقرة ضمن النطاق الطبيعي. استمر في العادات الصحية وتصفح المقالات التوعوية.',
            created_at: '2026-11-26'
        }
    ],

    // 7. طلبات الاستشارة الأولية
    consultations: [
        {
            id: 201,
            user_id: 2,
            specialist_id: 1,
            specialist_name: 'د. أحمد المنصور',
            assessment_id: 102,
            assessment_score: 21,
            share_assessment: true,
            beneficiary_name: 'محمد علي',
            beneficiary_phone: '771234567',
            preferred_time: 'المساء (5:00 - 8:00)',
            notes: 'أرغب في استشارة أولية بخصوص التوتر والقلق اليومي.',
            specialist_notes: '',
            status: 'pending',
            created_at: '2026-11-26'
        }
    ],

    // 8. سجل المزاج اليومي للمستفيد
    moodLogs: [
        { id: 301, user_id: 2, mood: 'calm', note: 'شعرت بهدوء أفضل بعد ممارسة تمرين التنفس العميق.', created_at: '2026-11-25' },
        { id: 302, user_id: 2, mood: 'happy', note: 'يوم مريح ونوم جيد.', created_at: '2026-11-26' }
    ]
};

// دالة قراءة جميع بيانات المنصة من localStorage (أو تهيئتها لأول مرة)
function getSakinaData() {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_DATA));
        return JSON.parse(JSON.stringify(DEFAULT_DATA));
    }
    return JSON.parse(raw);
}

// دالة حفظ البيانات بعد أي تعديل أو إضافة
function saveSakinaData(data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

// دالة جلب المستخدم المسجل دخوله حالياً
function getCurrentUser() {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
}

// دالة تسجيل دخول المستخدم وحفظ الجلسة
function setCurrentUser(user) {
    if (user) {
        localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    } else {
        localStorage.removeItem(SESSION_KEY);
    }
}
