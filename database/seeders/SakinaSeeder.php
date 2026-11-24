<?php

namespace Database\Seeders;

use App\Models\Article;
use App\Models\Assessment;
use App\Models\ConsultationRequest;
use App\Models\MoodLog;
use App\Models\Question;
use App\Models\ScoringRule;
use App\Models\SpecialistProfile;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class SakinaSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Admin Account
        $admin = User::updateOrCreate(
            ['email' => 'admin@sakina.com'],
            [
                'name' => 'إدارة منصة سكينة',
                'password' => Hash::make('password'),
                'role' => 'admin',
                'phone' => '770000000',
                'is_active' => true,
            ]
        );

        // 2. Sample Beneficiary Account
        $beneficiary = User::updateOrCreate(
            ['email' => 'user@sakina.com'],
            [
                'name' => 'محمد علي',
                'password' => Hash::make('password'),
                'role' => 'beneficiary',
                'phone' => '771234567',
                'birth_date' => '1999-05-15',
                'is_active' => true,
            ]
        );

        // 3. Specialists (3 approved + 1 pending)
        $specialistsData = [
            [
                'name' => 'د. أحمد المنصور',
                'email' => 'ahmad@sakina.com',
                'title' => 'دكتور واستشاري نفسي',
                'specialty' => 'استشاري القلق والاكتئاب',
                'experience_years' => 12,
                'bio' => 'دكتوراه في علم النفس الإكلينيكي، خبرة 12 عاماً في العلاج المعرفي السلوكي وإدارة القلق واضطرابات المزاج.',
                'certificates' => 'دكتوراه علم النفس الإكلينيكي، البورد العربي للعلاج المعرفي السلوكي',
                'contact_phone' => '770000001',
                'is_approved' => true,
            ],
            [
                'name' => 'أ. سارة العبدلي',
                'email' => 'sara@sakina.com',
                'title' => 'أخصائية نفسية أولى',
                'specialty' => 'أخصائية الضغوط والاحتراق النفسي',
                'experience_years' => 8,
                'bio' => 'ماجستير في الإرشاد النفسي، متخصصة في التعامل مع ضغوط العمل والدراسة واستعادة التوازن النفسي.',
                'certificates' => 'ماجستير الإرشاد النفسي، دبلوم اليقظة الذهنية',
                'contact_phone' => '770000002',
                'is_approved' => true,
            ],
            [
                'name' => 'د. خالد السقاف',
                'email' => 'khalid@sakina.com',
                'title' => 'معالج ومستشار أسري',
                'specialty' => 'معالج واستشارات أسرية ونوم',
                'experience_years' => 10,
                'bio' => 'خبرة واسعة في حل المشكلات الأسرية واضطرابات النوم والتفكير الزائد بطرق علمية هادئة.',
                'certificates' => 'دكتوراه الإرشاد الأسري، شهادة العلاج السلوكي للأرق',
                'contact_phone' => '770000003',
                'is_approved' => true,
            ],
            [
                'name' => 'أ. ريم الحداد',
                'email' => 'reem@sakina.com',
                'title' => 'أخصائية دعم نفسي',
                'specialty' => 'الدعم النفسي للشباب',
                'experience_years' => 4,
                'bio' => 'أخصائية نفسية مهتمة بدعم طلاب الجامعات وتجاوز القلق الدراسي وبناء المرونة النفسية.',
                'certificates' => 'بكالوريوس علم النفس، دورات الإسعاف النفسي الأولي',
                'contact_phone' => '770000004',
                'is_approved' => false,
            ],
        ];

        $specialistUsers = [];
        foreach ($specialistsData as $data) {
            $user = User::updateOrCreate(
                ['email' => $data['email']],
                [
                    'name' => $data['name'],
                    'password' => Hash::make('password'),
                    'role' => 'specialist',
                    'phone' => $data['contact_phone'],
                    'is_active' => true,
                ]
            );

            SpecialistProfile::updateOrCreate(
                ['user_id' => $user->id],
                [
                    'title' => $data['title'],
                    'specialty' => $data['specialty'],
                    'experience_years' => $data['experience_years'],
                    'bio' => $data['bio'],
                    'certificates' => $data['certificates'],
                    'contact_phone' => $data['contact_phone'],
                    'is_approved' => $data['is_approved'],
                ]
            );

            $specialistUsers[] = $user;
        }

        // 4. The 14 Exact Psychological Assessment Questions
        $questions = [
            // Mood & Depression (1-5)
            ['category' => 'mood', 'category_label' => 'المزاج والاكتئاب', 'order_index' => 1, 'question_text' => 'هل تشعر بالحزن أو الإحباط أو اليأس معظم ساعات اليوم؟'],
            ['category' => 'mood', 'category_label' => 'المزاج والاكتئاب', 'order_index' => 2, 'question_text' => 'هل فقدت الاهتمام أو المتعة في ممارسة الأنشطة التي كنت تستمتع بها عادة؟'],
            ['category' => 'mood', 'category_label' => 'المزاج والاكتئاب', 'order_index' => 3, 'question_text' => 'هل تواجه صعوبة في النوم (أرق) أو النوم الزائد عن الحد بشكل مستمر؟'],
            ['category' => 'mood', 'category_label' => 'المزاج والاكتئاب', 'order_index' => 4, 'question_text' => 'هل تشعر بخمول مستمر، نقص في الطاقة، أو تعب جسدي دون مجهود بدني واضح؟'],
            ['category' => 'mood', 'category_label' => 'المزاج والاكتئاب', 'order_index' => 5, 'question_text' => 'هل تواجه صعوبة في التركيز على المهام اليومية (مثل القراءة أو العمل أو الدراسة)؟'],

            // Stress & Anxiety (6-10)
            ['category' => 'anxiety', 'category_label' => 'التوتر والقلق', 'order_index' => 6, 'question_text' => 'هل تشعر بالعصبية، التوتر، أو حدة المزاج بشكل مفرط؟'],
            ['category' => 'anxiety', 'category_label' => 'التوتر والقلق', 'order_index' => 7, 'question_text' => 'هل تجد صعوبة في التحكم بالخوف أو القلق المستمر بشأن أمور مختلفة؟'],
            ['category' => 'anxiety', 'category_label' => 'التوتر والقلق', 'order_index' => 8, 'question_text' => 'هل تشعر بضيق أو قلق يمنعك من الاسترخاء والهدوء؟'],
            ['category' => 'anxiety', 'category_label' => 'التوتر والقلق', 'order_index' => 9, 'question_text' => 'هل تشعر بالقلق الشديد من أن أمراً سيئاً قد يحدث لك أو لعائلتك دون مبرر واضح؟'],
            ['category' => 'anxiety', 'category_label' => 'التوتر والقلق', 'order_index' => 10, 'question_text' => 'هل تعاني من أعراض جسدية ناتجة عن التوتر (مثل ضربات قلب سريعة، شد عضلي، أو صداع)؟'],

            // Burnout & Pressure (11-14)
            ['category' => 'burnout', 'category_label' => 'الضغوط والاحتراق', 'order_index' => 11, 'question_text' => 'هل تشعر بالإرهاق النفسي أو الجسدي الشديد بنهاية يوم العمل أو الدراسة؟'],
            ['category' => 'burnout', 'category_label' => 'الضغوط والاحتراق', 'order_index' => 12, 'question_text' => 'هل تشعر أن الضغوط اليومية تفوق قدرتك على التكيف والتحمل؟'],
            ['category' => 'burnout', 'category_label' => 'الضغوط والاحتراق', 'order_index' => 13, 'question_text' => 'هل تشعر بضعف الشغف تجاه مسؤولياتك أو رغبة متزايدة في الانعزال عن الآخرين؟'],
            ['category' => 'burnout', 'category_label' => 'الضغوط والاحتراق', 'order_index' => 14, 'question_text' => 'هل يؤثر التفكير الزائد (Overthinking) في مشاكلك اليومية على جودة حياتك ونومك؟'],
        ];

        foreach ($questions as $q) {
            Question::updateOrCreate(
                ['order_index' => $q['order_index']],
                $q + ['is_active' => true]
            );
        }

        // 5. Educational Articles
        $articles = [
            [
                'author_id' => $specialistUsers[0]->id,
                'title' => 'تهدئة القلق اليومي بتقنية التنفس العميق',
                'category' => 'القلق والتوتر',
                'summary' => 'تقنية التنفس العميق (4-7-8) لتهدئة نبضات القلب واستعادة الصفاء الذهني خلال دقائق.',
                'content' => "يُعد القلق اليومي استجابة طبيعية من الجسم للضغوط، لكنه قد يتحول إلى عبء عندما يستمر لفترات طويلة.\n\nتُعتبر تقنية التنفس (4-7-8) من أبسط وأسرع الطرق العلمية لتفعيل الجهاز العصبي السمبتاوي المسؤول عن الاسترخاء:\n1. اجلس في وضع مريح وأغمض عينيك.\n2. استنشق الهواء ببطء عبر أنفك لمدة 4 ثوانٍ.\n3. احبس أنفاسك برفق لمدة 7 ثوانٍ.\n4. أخرج الهواء ببطء عبر فمك لمدة 8 ثوانٍ.\n\nكرر هذه الدورة 4 مرات صباحاً ومساءً، وستلاحظ انخفاضاً ملموساً في التوتر الجسدي وتسارع الأفكار.",
                'reading_time' => 3,
                'status' => 'approved',
                'published_at' => now()->subDays(5),
            ],
            [
                'author_id' => $specialistUsers[1]->id,
                'title' => 'التعافي من الاحتراق النفسي واستعادة الشغف',
                'category' => 'الضغوط والاحتراق',
                'summary' => 'خطوات دافئة وعملية لاستعادة طاقتك النفسية وتنظيم حدودك بين العمل والحياة الشخصية.',
                'content' => "الاحتراق النفسي ليس مجرد تعب عابر، بل هو استنزاف عاطفي وجسدي ناتج عن الضغوط المستمرة دون فترات تعافٍ كافية.\n\nللبدء برحلة التعافي:\n• اعترف بحدود طاقتك وتعلم قول (لا) للمهام الإضافية غير الضرورية.\n• خصص 30 دقيقة يومياً لنشاط لا علاقة له بالإنجاز أو العمل.\n• افصل بين وقت الراحة ورسائل العمل والالتزامات.\n\nتذكر دائماً أن طلب المساعدة من مختص نفسي هو خطوة شجاعة وواعية نحو استعادة توازنك.",
                'reading_time' => 4,
                'status' => 'approved',
                'published_at' => now()->subDays(3),
            ],
            [
                'author_id' => $specialistUsers[2]->id,
                'title' => 'عادات مسائية مريحة لإيقاف التفكير الزائد',
                'category' => 'النوم والهدوء',
                'summary' => 'روتين مسائي بسيط يمنح عقلك الراحة قبل النوم ويقلل من دوامة التفكير المفرط.',
                'content' => "كثيراً ما تزداد حدة الأفكار المقلقة في الساعات المتأخرة من الليل حين يهدأ المحيط وتخف المشتتات.\n\nجرب هذا الروتين قبل النوم بساعة:\n• تفريغ الأفكار: اكتب 3 أمور تشغل بالك على ورقة وأغلقها لتخبر عقلك أنك ستعالجها غداً.\n• إبعاد الشاشات: الإضاءة الزرقاء تبقي الدماغ في حالة تأهب.\n• إضاءة دافئة ومشروب دافئ خالٍ من الكافيين.\n\nالنوم العميق هو حجر الأساس للاستقرار النفسي والمزاج المتوازن.",
                'reading_time' => 3,
                'status' => 'approved',
                'published_at' => now()->subDay(),
            ],
            [
                'author_id' => $specialistUsers[0]->id,
                'title' => 'متى يكون التحدث مع مختص نفسي خطوة ضرورية؟',
                'category' => 'الصحة النفسية',
                'summary' => 'كيف نميز بين تقلبات المزاج العابرة والحاجة إلى دعم واستشارة نفسية متخصصة.',
                'content' => "يمر كل إنسان بأيام صعبة ومشاعر حزن أو قلق مؤقتة، لكن استمرار هذه المشاعر لأكثر من أسبوعين وتأثيرها على النوم أو العمل أو العلاقات هو إشارة واضحة لأهمية استشارة مختص.\n\nفي منصة سكينة، يوفر لك التقييم الأولي مؤشراً توعوياً يساعدك على فهم حالتك، ويسهل عليك الوصول الآمن والسري إلى المستشارين المعتمدين.",
                'reading_time' => 4,
                'status' => 'approved',
                'published_at' => now(),
            ],
            [
                'author_id' => $specialistUsers[1]->id,
                'title' => 'كيف تدعم صديقاً يمر بأزمة نفسية؟',
                'category' => 'الدعم المجتمعي',
                'summary' => 'مهارات الاستماع الفعال دون إصدار أحكام وكيف تكون مساحة آمنة لمن تحب.',
                'content' => "أهم ما يحتاجه الشخص المتعب نفسياً هو وجود من يستمع إليه بإنصات وتعاطف دون محاولة تقديم حلول سريعة أو التقليل من مشاعره.",
                'reading_time' => 3,
                'status' => 'pending',
                'published_at' => null,
            ],
        ];

        foreach ($articles as $art) {
            Article::updateOrCreate(
                ['title' => $art['title']],
                $art
            );
        }

        // 6. Sample Past Assessments for Beneficiary User (multiple dates for progress chart)
        if ($beneficiary->assessments()->count() === 0) {
            Assessment::create([
                'user_id' => $beneficiary->id,
                'total_score' => 30,
                'mood_score' => 11,
                'anxiety_score' => 11,
                'burnout_score' => 8,
                'severity_level' => 'high',
                'recommendation' => 'تشير إجاباتك إلى ارتفاع ملحوظ في مستويات الضغط أو القلق. نوصيك بالتواصل مع أحد المختصين.',
                'answers' => array_fill(1, 14, 2),
                'created_at' => now()->subDays(21),
            ]);

            $latestAssessment = Assessment::create([
                'user_id' => $beneficiary->id,
                'total_score' => 21,
                'mood_score' => 6,
                'anxiety_score' => 9,
                'burnout_score' => 6,
                'severity_level' => 'moderate',
                'recommendation' => 'تشير إجاباتك إلى وجود مؤشرات متوسطة للضغوط النفسية، وتتركز بشكل أكبر في محور (التوتر والقلق). ننصحك بممارسة تمارين الاسترخاء والتنفس العميق أو التواصل مع أحد المختصين.',
                'answers' => array_fill(1, 14, 1),
                'created_at' => now()->subDays(7),
            ]);

            Assessment::create([
                'user_id' => $beneficiary->id,
                'total_score' => 13,
                'mood_score' => 4,
                'anxiety_score' => 5,
                'burnout_score' => 4,
                'severity_level' => 'low',
                'recommendation' => 'حالتك النفسية تبدو مستقرة ضمن النطاق الطبيعي. استمر في العادات الصحية وتصفح المقالات التوعوية.',
                'answers' => array_fill(1, 14, 1),
                'created_at' => now()->subDays(1),
            ]);

            $firstSpecialist = SpecialistProfile::first();
            if ($firstSpecialist) {
                ConsultationRequest::create([
                    'user_id' => $beneficiary->id,
                    'specialist_profile_id' => $firstSpecialist->id,
                    'assessment_id' => $latestAssessment->id,
                    'share_assessment' => true,
                    'beneficiary_name' => $beneficiary->name,
                    'beneficiary_phone' => $beneficiary->phone ?? '771234567',
                    'preferred_time' => 'المساء (5:00 - 8:00)',
                    'notes' => 'أرغب في استشارة أولية بخصوص التوتر والقلق اليومي.',
                    'status' => 'pending',
                ]);
            }
        }

        // 7. Dynamic Scoring Rules
        $rules = [
            [
                'level' => 'low',
                'label' => 'مستوى منخفض (مستقر)',
                'min_score' => 0,
                'max_score' => 14,
                'recommendation' => 'حالتك النفسية تبدو مستقرة ضمن النطاق الطبيعي. استمر في العادات الصحية، النوم الكافي، وتصفح المقالات التوعوية لتعزيز توازنك اليومي.',
            ],
            [
                'level' => 'moderate',
                'label' => 'مستوى متوسط',
                'min_score' => 15,
                'max_score' => 28,
                'recommendation' => 'تشير إجاباتك إلى وجود مؤشرات متوسطة للضغوط النفسية. ننصحك بتطبيق تمارين التنفس العميق (4-7-8)، وتقليل مسببات التوتر قبل النوم، كما يمكنك استشارة أحد المختصين للاطمئنان.',
            ],
            [
                'level' => 'high',
                'label' => 'مستوى مرتفع (يستدعي الاهتمام)',
                'min_score' => 29,
                'max_score' => 42,
                'recommendation' => 'تشير إجاباتك إلى ارتفاع ملحوظ في مستويات الضغط أو القلق. هذا المؤشر أولي وتوعوي، ونوصيك بشدة بالتواصل المباشر وبكل سرية مع أحد المستشارين المعتمدين أدناه للحصول على خطة دعم مناسبة.',
            ],
        ];

        foreach ($rules as $rule) {
            ScoringRule::updateOrCreate(['level' => $rule['level']], $rule);
        }

        // 8. Sample Mood Logs
        if ($beneficiary->moodLogs()->count() === 0) {
            MoodLog::create([
                'user_id' => $beneficiary->id,
                'mood' => 'calm',
                'note' => 'شعرت بهدوء أفضل بعد ممارسة تمرين التنفس العميق.',
                'created_at' => now()->subDays(2),
            ]);
            MoodLog::create([
                'user_id' => $beneficiary->id,
                'mood' => 'happy',
                'note' => 'يوم مريح ونوم جيد.',
                'created_at' => now()->subDay(),
            ]);
        }
    }
}
