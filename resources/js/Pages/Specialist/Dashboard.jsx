import { Head, router, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';
import SpecialistLayout from '@/Layouts/SpecialistLayout';

const STATUS_BADGES = {
    approved: { label: 'منشور ✓', cls: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    pending: { label: 'قيد المراجعة ⏳', cls: 'bg-amber-50 text-amber-800 border-amber-200' },
    rejected: { label: 'مرفوض ✕', cls: 'bg-rose-50 text-rose-700 border-rose-200' },
};

const REQ_STATUS = {
    pending: { label: 'طلب جديد ⏳', cls: 'bg-amber-50 text-amber-800 border-amber-200' },
    contacted: { label: 'تم التواصل 📞', cls: 'bg-sky-50 text-sky-800 border-sky-200' },
    completed: { label: 'مكتمل ✓', cls: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    cancelled: { label: 'ملغي ✕', cls: 'bg-gray-100 text-gray-500 border-gray-200' },
};

export default function SpecialistDashboard({
    specialistProfile,
    articles = [],
    consultationRequests = [],
}) {
    const { auth } = usePage().props;
    const user = auth.user;
    const [activeTab, setActiveTab] = useState('requests');
    const [notesMap, setNotesMap] = useState({});

    const saveNotes = (req) => {
        router.patch(route('consultations.status', req.id), {
            status: req.status,
            specialist_notes: notesMap[req.id] ?? req.specialist_notes ?? '',
        });
    };

    const pendingRequestsCount = consultationRequests.filter((r) => r.status === 'pending').length;

    const navItems = [
        { id: 'requests', label: '📩 طلبات التواصل الواردة', badge: pendingRequestsCount },
        { id: 'articles', label: '✍️ المقالات التوعوية', badge: 0 },
        { id: 'profile', label: '👨‍⚕️ ملفي المهني', badge: 0 },
    ];

    const profileForm = useForm({
        title: specialistProfile?.title || '',
        specialty: specialistProfile?.specialty || '',
        experience_years: specialistProfile?.experience_years || 1,
        bio: specialistProfile?.bio || '',
        certificates: specialistProfile?.certificates || '',
        contact_phone: specialistProfile?.contact_phone || '',
    });

    const articleForm = useForm({
        title: '',
        category: 'القلق والتوتر',
        summary: '',
        content: '',
        reading_time: 3,
    });

    const submitProfile = (e) => {
        e.preventDefault();
        profileForm.post(route('specialist.profile.update'));
    };

    const submitArticle = (e) => {
        e.preventDefault();
        articleForm.post(route('specialist.articles.store'), {
            onSuccess: () => articleForm.reset(),
        });
    };

    return (
        <SpecialistLayout activeTab={activeTab} setActiveTab={setActiveTab} navItems={navItems}>
            <Head title="بوابة المستشار النفسي - منصة سكينة" />

            <div className="max-w-5xl mx-auto space-y-6">
                {/* Approval Banner */}
                <div className="bg-white rounded-2xl p-5 border border-sakina-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-xl font-extrabold text-sakina-900">
                            مرحباً، {user.name}
                        </h1>
                        <p className="text-xs text-gray-500 mt-0.5">
                            {specialistProfile?.specialty} • خبرة {specialistProfile?.experience_years} سنوات
                        </p>
                    </div>
                    {specialistProfile?.is_approved ? (
                        <span className="px-4 py-1.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold w-fit">
                            ✓ معتمد في دليل المستشارين
                        </span>
                    ) : (
                        <span className="px-4 py-1.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-xs font-bold w-fit">
                            ⏳ حسابك قيد الاعتماد من الإدارة
                        </span>
                    )}
                </div>

                {/* Tab 1: Consultation Requests */}
                {activeTab === 'requests' && (
                    <div className="bg-white rounded-3xl p-6 border border-sakina-100 shadow-sm space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-extrabold text-sakina-800">
                                📩 طلبات التواصل والاستشارة الأولية ({consultationRequests.length})
                            </h2>
                        </div>

                        {consultationRequests.length === 0 ? (
                            <p className="text-sm text-gray-500 text-center py-8">
                                لا توجد طلبات تواصل واردة حالياً.
                            </p>
                        ) : (
                            <div className="space-y-3">
                                {consultationRequests.map((req) => {
                                    const st = REQ_STATUS[req.status] || REQ_STATUS.pending;
                                    return (
                                        <div
                                            key={req.id}
                                            className="p-4 rounded-2xl border border-gray-200 bg-gray-50/50 space-y-3"
                                        >
                                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-bold text-sakina-900 text-sm">
                                                            {req.beneficiary_name}
                                                        </span>
                                                        <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${st.cls}`}>
                                                            {st.label}
                                                        </span>
                                                    </div>
                                                    <p className="text-xs text-gray-600 mt-1">
                                                        📞 {req.beneficiary_phone} • ⏰ {req.preferred_time || 'أي وقت'}
                                                        {req.assessment && (
                                                            <span className="mr-2 text-sakina-700 font-bold">
                                                                • نتيجة التقييم المرفق: {req.assessment.total_score}/42
                                                            </span>
                                                        )}
                                                    </p>
                                                </div>

                                                <div className="flex flex-wrap gap-1.5">
                                                    <button
                                                        onClick={() =>
                                                            router.patch(route('consultations.status', req.id), {
                                                                status: 'contacted',
                                                            })
                                                        }
                                                        className="px-3 py-1.5 rounded-lg bg-sky-50 text-sky-700 border border-sky-200 text-xs font-bold hover:bg-sky-100"
                                                    >
                                                        تم التواصل
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            router.patch(route('consultations.status', req.id), {
                                                                status: 'completed',
                                                            })
                                                        }
                                                        className="px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold hover:bg-emerald-100"
                                                    >
                                                        مكتمل ✓
                                                    </button>
                                                </div>
                                            </div>

                                            {req.notes && (
                                                <p className="text-xs text-gray-600 bg-white p-3 rounded-xl border border-gray-100">
                                                    <strong>ملاحظة المستفيد:</strong> &ldquo;{req.notes}&rdquo;
                                                </p>
                                            )}

                                            {/* Private Specialist Notes */}
                                            <div className="flex flex-col sm:flex-row gap-2 pt-1">
                                                <input
                                                    type="text"
                                                    value={notesMap[req.id] ?? req.specialist_notes ?? ''}
                                                    onChange={(e) => setNotesMap({ ...notesMap, [req.id]: e.target.value })}
                                                    placeholder="ملاحظاتك الخاصة حول هذا التواصل (لا يراها المستفيد)..."
                                                    className="flex-1 rounded-xl border-gray-200 bg-white text-xs py-2"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => saveNotes(req)}
                                                    className="px-4 py-2 rounded-xl bg-sakina-700 text-white text-xs font-bold hover:bg-sakina-600"
                                                >
                                                    حفظ الملاحظة
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                )}

                {/* Tab 2: Articles */}
                {activeTab === 'articles' && (
                    <div className="space-y-6">
                        <div className="bg-white rounded-3xl p-6 border border-sakina-100 shadow-sm">
                            <h2 className="text-lg font-extrabold text-sakina-800 mb-1">
                                ✍️ نشر مقال توعوي وإرشادي جديد
                            </h2>
                            <p className="text-xs text-gray-500 mb-4">
                                يخضع المقال لمراجعة الإدارة قبل نشره للزوار والمستفيدين
                            </p>

                            <form onSubmit={submitArticle} className="space-y-3.5">
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 mb-1">عنوان المقال</label>
                                    <input
                                        type="text"
                                        value={articleForm.data.title}
                                        onChange={(e) => articleForm.setData('title', e.target.value)}
                                        placeholder="مثال: كيف تتعامل مع ضغوط الاختبارات؟"
                                        className="w-full rounded-xl border-gray-300 text-sm"
                                        required
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-700 mb-1">التصنيف</label>
                                        <select
                                            value={articleForm.data.category}
                                            onChange={(e) => articleForm.setData('category', e.target.value)}
                                            className="w-full rounded-xl border-gray-300 text-sm"
                                        >
                                            <option value="القلق والتوتر">القلق والتوتر</option>
                                            <option value="الضغوط والاحتراق">الضغوط والاحتراق</option>
                                            <option value="النوم والهدوء">النوم والهدوء</option>
                                            <option value="الصحة النفسية">الصحة النفسية</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-700 mb-1">وقت القراءة (دقائق)</label>
                                        <input
                                            type="number"
                                            min="1"
                                            max="30"
                                            value={articleForm.data.reading_time}
                                            onChange={(e) => articleForm.setData('reading_time', e.target.value)}
                                            className="w-full rounded-xl border-gray-300 text-sm"
                                            required
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 mb-1">ملخص قصير</label>
                                    <input
                                        type="text"
                                        value={articleForm.data.summary}
                                        onChange={(e) => articleForm.setData('summary', e.target.value)}
                                        className="w-full rounded-xl border-gray-300 text-sm"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 mb-1">نص المقال</label>
                                    <textarea
                                        rows="4"
                                        value={articleForm.data.content}
                                        onChange={(e) => articleForm.setData('content', e.target.value)}
                                        className="w-full rounded-xl border-gray-300 text-sm"
                                        required
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={articleForm.processing}
                                    className="px-6 py-2.5 rounded-xl bg-sakina-700 text-white text-sm font-bold hover:bg-sakina-600 transition"
                                >
                                    إرسال المقال للمراجعة
                                </button>
                            </form>
                        </div>

                        <div className="bg-white rounded-3xl p-6 border border-sakina-100 shadow-sm">
                            <h3 className="text-base font-extrabold text-sakina-800 mb-4">
                                📚 مقالاتي المرسلة ({articles.length})
                            </h3>
                            <div className="space-y-3">
                                {articles.map((art) => {
                                    const st = STATUS_BADGES[art.status] || STATUS_BADGES.pending;
                                    return (
                                        <div
                                            key={art.id}
                                            className="p-3.5 rounded-2xl border border-gray-200 flex items-center justify-between gap-3"
                                        >
                                            <div>
                                                <h4 className="font-bold text-sm text-sakina-900">{art.title}</h4>
                                                <p className="text-xs text-gray-500 mt-0.5">{art.category}</p>
                                            </div>
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold border shrink-0 ${st.cls}`}>
                                                {st.label}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                )}

                {/* Tab 3: Professional Profile */}
                {activeTab === 'profile' && (
                    <div className="bg-white rounded-3xl p-6 border border-sakina-100 shadow-sm">
                        <h2 className="text-lg font-extrabold text-sakina-800 mb-4">
                            👨‍⚕️ بياناتي المهنية في الدليل
                        </h2>
                        <form onSubmit={submitProfile} className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 mb-1">اللقب العلمي</label>
                                    <input
                                        type="text"
                                        value={profileForm.data.title}
                                        onChange={(e) => profileForm.setData('title', e.target.value)}
                                        className="w-full rounded-xl border-gray-300 text-sm"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 mb-1">التخصص</label>
                                    <input
                                        type="text"
                                        value={profileForm.data.specialty}
                                        onChange={(e) => profileForm.setData('specialty', e.target.value)}
                                        className="w-full rounded-xl border-gray-300 text-sm"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 mb-1">سنوات الخبرة</label>
                                    <input
                                        type="number"
                                        min="0"
                                        value={profileForm.data.experience_years}
                                        onChange={(e) => profileForm.setData('experience_years', e.target.value)}
                                        className="w-full rounded-xl border-gray-300 text-sm"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 mb-1">رقم التواصل المباشر</label>
                                    <input
                                        type="text"
                                        value={profileForm.data.contact_phone}
                                        onChange={(e) => profileForm.setData('contact_phone', e.target.value)}
                                        className="w-full rounded-xl border-gray-300 text-sm"
                                        required
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-1">النبذة التعريفية</label>
                                <textarea
                                    rows="3"
                                    value={profileForm.data.bio}
                                    onChange={(e) => profileForm.setData('bio', e.target.value)}
                                    className="w-full rounded-xl border-gray-300 text-sm"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-1">الشهادات والاعتمادات</label>
                                <input
                                    type="text"
                                    value={profileForm.data.certificates}
                                    onChange={(e) => profileForm.setData('certificates', e.target.value)}
                                    className="w-full rounded-xl border-gray-300 text-sm"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={profileForm.processing}
                                className="px-6 py-3 rounded-xl bg-sakina-700 text-white text-sm font-bold hover:bg-sakina-600 transition"
                            >
                                حفظ التحديثات
                            </button>
                        </form>
                    </div>
                )}
            </div>
        </SpecialistLayout>
    );
}
