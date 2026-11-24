import { Head, router, useForm } from '@inertiajs/react';
import { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function AdminDashboard({
    stats,
    chartData = { severity: { low: 0, moderate: 0, high: 0 }, axes_avg: { mood: 0, anxiety: 0, burnout: 0 } },
    users = [],
    specialists = [],
    articles = [],
    questions = [],
    consultations = [],
    scoringRules = [],
}) {
    const [tab, setTab] = useState('overview');
    const [editingQuestion, setEditingQuestion] = useState(null);
    const [showAddSpecialist, setShowAddSpecialist] = useState(false);

    const questionForm = useForm({
        category: 'mood',
        question_text: '',
    });

    const editQuestionForm = useForm({
        category: 'mood',
        question_text: '',
    });

    const specialistForm = useForm({
        name: '',
        email: '',
        password: 'password',
        title: 'استشاري نفسي',
        specialty: '',
        experience_years: 5,
        contact_phone: '',
        bio: '',
    });

    const addQuestion = (e) => {
        e.preventDefault();
        questionForm.post(route('admin.questions.store'), {
            onSuccess: () => questionForm.reset('question_text'),
        });
    };

    const startEditQuestion = (q) => {
        setEditingQuestion(q);
        editQuestionForm.setData({
            category: q.category,
            question_text: q.question_text,
        });
    };

    const saveEditQuestion = (e) => {
        e.preventDefault();
        editQuestionForm.put(route('admin.questions.update', editingQuestion.id), {
            onSuccess: () => setEditingQuestion(null),
        });
    };

    const addSpecialist = (e) => {
        e.preventDefault();
        specialistForm.post(route('admin.specialists.store'), {
            onSuccess: () => {
                specialistForm.reset();
                setShowAddSpecialist(false);
            },
        });
    };

    const navItems = [
        { id: 'overview', label: '📊 نظرة عامة والتحليلات', badge: 0 },
        { id: 'specialists', label: '🩺 المستشارون والاعتماد', badge: stats.pending_specialists },
        { id: 'articles', label: '📖 المقالات التوعوية', badge: stats.pending_articles },
        { id: 'consultations', label: '📩 طلبات الاستشارة', badge: stats.pending_consultations },
        { id: 'questions', label: '📋 أسئلة المقياس', badge: 0 },
        { id: 'rules', label: '⚖️ قواعد احتساب الدرجات', badge: 0 },
        { id: 'users', label: '👥 المستخدمون', badge: 0 },
    ];

    const totalSev =
        (chartData.severity?.low || 0) +
        (chartData.severity?.moderate || 0) +
        (chartData.severity?.high || 0);
    const pct = (val) => (totalSev > 0 ? Math.round((val / totalSev) * 100) : 0);

    return (
        <AdminLayout activeTab={tab} setActiveTab={setTab} navItems={navItems}>
            <Head title="لوحة الإدارة (/Admin) - منصة سكينة" />

            <div className="max-w-7xl mx-auto space-y-6">
                {/* KPI Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
                        <div className="text-xs font-bold text-slate-500">المستفيدون المسجلون</div>
                        <div className="text-3xl font-extrabold text-slate-900 mt-1">{stats.total_users}</div>
                    </div>
                    <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
                        <div className="text-xs font-bold text-slate-500">المستشارون المعتمدون</div>
                        <div className="text-3xl font-extrabold text-emerald-700 mt-1">{stats.total_specialists}</div>
                    </div>
                    <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
                        <div className="text-xs font-bold text-slate-500">التقييمات المنجزة</div>
                        <div className="text-3xl font-extrabold text-slate-900 mt-1">{stats.total_assessments}</div>
                    </div>
                    <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
                        <div className="text-xs font-bold text-slate-500">طلبات التواصل</div>
                        <div className="text-3xl font-extrabold text-amber-600 mt-1">{stats.total_consultations}</div>
                    </div>
                </div>

                {/* Tab 0: Overview & Visual Charts */}
                {tab === 'overview' && (
                    <div className="space-y-6">
                        <div className="flex justify-end">
                            <a
                                href={route('admin.export.assessments')}
                                className="px-5 py-2.5 rounded-xl bg-emerald-700 text-white text-xs font-bold hover:bg-emerald-800 transition shadow-sm"
                            >
                                📥 تصدير الإحصائيات المجهولة (CSV / Excel)
                            </a>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Severity Breakdown Chart */}
                            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-5">
                                <div>
                                    <h2 className="text-lg font-extrabold text-slate-800">
                                        📊 توزيع مستويات نتائج التقييم
                                    </h2>
                                    <p className="text-xs text-slate-500 mt-0.5">
                                        نسب الحالات المسجلة عبر مقياس سكينة (إجمالي {totalSev} تقييم)
                                    </p>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <div className="flex justify-between text-xs font-bold mb-1.5">
                                            <span className="text-emerald-700">🌿 مستوى منخفض (مستقر)</span>
                                            <span>{chartData.severity.low} ({pct(chartData.severity.low)}%)</span>
                                        </div>
                                        <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-emerald-500 rounded-full transition-all"
                                                style={{ width: `${pct(chartData.severity.low)}%` }}
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <div className="flex justify-between text-xs font-bold mb-1.5">
                                            <span className="text-amber-700">🌤️ مستوى متوسط</span>
                                            <span>{chartData.severity.moderate} ({pct(chartData.severity.moderate)}%)</span>
                                        </div>
                                        <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-amber-500 rounded-full transition-all"
                                                style={{ width: `${pct(chartData.severity.moderate)}%` }}
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <div className="flex justify-between text-xs font-bold mb-1.5">
                                            <span className="text-rose-700">❤️‍🩹 مستوى مرتفع (يستدعي الاهتمام)</span>
                                            <span>{chartData.severity.high} ({pct(chartData.severity.high)}%)</span>
                                        </div>
                                        <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-rose-500 rounded-full transition-all"
                                                style={{ width: `${pct(chartData.severity.high)}%` }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Axes Averages Bar Chart */}
                            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-5">
                                <div>
                                    <h2 className="text-lg font-extrabold text-slate-800">
                                        📈 متوسط درجات المحاور النفسية الثلاثة
                                    </h2>
                                    <p className="text-xs text-slate-500 mt-0.5">
                                        مقارنة متوسط الشدة لكل محور نفسي عبر جميع المستفيدين
                                    </p>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <div className="flex justify-between text-xs font-bold mb-1.5">
                                            <span className="text-slate-700">المزاج والاكتئاب (الحد الأقصى 15)</span>
                                            <span className="text-emerald-700">{chartData.axes_avg.mood} / 15</span>
                                        </div>
                                        <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-emerald-600 rounded-full"
                                                style={{ width: `${Math.round((chartData.axes_avg.mood / 15) * 100)}%` }}
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <div className="flex justify-between text-xs font-bold mb-1.5">
                                            <span className="text-slate-700">التوتر والقلق (الحد الأقصى 15)</span>
                                            <span className="text-amber-700">{chartData.axes_avg.anxiety} / 15</span>
                                        </div>
                                        <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-amber-500 rounded-full"
                                                style={{ width: `${Math.round((chartData.axes_avg.anxiety / 15) * 100)}%` }}
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <div className="flex justify-between text-xs font-bold mb-1.5">
                                            <span className="text-slate-700">الضغوط والاحتراق (الحد الأقصى 12)</span>
                                            <span className="text-sky-700">{chartData.axes_avg.burnout} / 12</span>
                                        </div>
                                        <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-sky-600 rounded-full"
                                                style={{ width: `${Math.round((chartData.axes_avg.burnout / 12) * 100)}%` }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Tab 1: Specialists */}
                {tab === 'specialists' && (
                    <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-5">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-extrabold text-slate-800">
                                اعتماد وإدارة المستشارين النفسيين
                            </h2>
                            <button
                                onClick={() => setShowAddSpecialist(!showAddSpecialist)}
                                className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800"
                            >
                                {showAddSpecialist ? '✕ إلغاء' : '+ إضافة مستشار جديد'}
                            </button>
                        </div>

                        {showAddSpecialist && (
                            <form onSubmit={addSpecialist} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                                <h3 className="font-bold text-sm text-slate-800">بيانات المستشار الجديد</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                    <input
                                        type="text"
                                        placeholder="الاسم الكامل"
                                        value={specialistForm.data.name}
                                        onChange={(e) => specialistForm.setData('name', e.target.value)}
                                        className="rounded-xl border-slate-300 text-sm"
                                        required
                                    />
                                    <input
                                        type="email"
                                        placeholder="البريد الإلكتروني"
                                        value={specialistForm.data.email}
                                        onChange={(e) => specialistForm.setData('email', e.target.value)}
                                        className="rounded-xl border-slate-300 text-sm"
                                        required
                                    />
                                    <input
                                        type="text"
                                        placeholder="رقم التواصل"
                                        value={specialistForm.data.contact_phone}
                                        onChange={(e) => specialistForm.setData('contact_phone', e.target.value)}
                                        className="rounded-xl border-slate-300 text-sm"
                                        required
                                    />
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                    <input
                                        type="text"
                                        placeholder="اللقب (مثال: دكتور واستشاري)"
                                        value={specialistForm.data.title}
                                        onChange={(e) => specialistForm.setData('title', e.target.value)}
                                        className="rounded-xl border-slate-300 text-sm"
                                        required
                                    />
                                    <input
                                        type="text"
                                        placeholder="التخصص"
                                        value={specialistForm.data.specialty}
                                        onChange={(e) => specialistForm.setData('specialty', e.target.value)}
                                        className="rounded-xl border-slate-300 text-sm"
                                        required
                                    />
                                    <input
                                        type="number"
                                        placeholder="سنوات الخبرة"
                                        value={specialistForm.data.experience_years}
                                        onChange={(e) => specialistForm.setData('experience_years', e.target.value)}
                                        className="rounded-xl border-slate-300 text-sm"
                                        required
                                    />
                                </div>
                                <textarea
                                    rows="2"
                                    placeholder="السيرة الذاتية والنبذة..."
                                    value={specialistForm.data.bio}
                                    onChange={(e) => specialistForm.setData('bio', e.target.value)}
                                    className="w-full rounded-xl border-slate-300 text-sm"
                                    required
                                />
                                <button
                                    type="submit"
                                    className="px-5 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700"
                                >
                                    حفظ واعتماد المستشار
                                </button>
                            </form>
                        )}

                        <div className="space-y-3">
                            {specialists.map((sp) => (
                                <div
                                    key={sp.id}
                                    className="p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                                >
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h3 className="font-bold text-slate-900">{sp.user?.name}</h3>
                                            <span
                                                className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                                                    sp.is_approved
                                                        ? 'bg-emerald-50 text-emerald-700'
                                                        : 'bg-amber-50 text-amber-800'
                                                }`}
                                            >
                                                {sp.is_approved ? 'معتمد في الدليل' : 'بانتظار الاعتماد'}
                                            </span>
                                        </div>
                                        <p className="text-xs text-slate-600 mt-1">
                                            {sp.specialty} • خبرة {sp.experience_years} سنوات • 📞 {sp.contact_phone}
                                        </p>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {!sp.is_approved ? (
                                            <button
                                                onClick={() => router.patch(route('admin.specialists.approve', sp.id))}
                                                className="px-3.5 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700"
                                            >
                                                ✓ اعتماد
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => router.patch(route('admin.specialists.reject', sp.id))}
                                                className="px-3.5 py-1.5 rounded-xl bg-amber-50 text-amber-800 border border-amber-200 text-xs font-bold"
                                            >
                                                إيقاف الظهور
                                            </button>
                                        )}
                                        <button
                                            onClick={() => {
                                                if (confirm('هل أنت متأكد من حذف هذا المستشار؟')) {
                                                    router.delete(route('admin.specialists.destroy', sp.id));
                                                }
                                            }}
                                            className="px-3.5 py-1.5 rounded-xl bg-rose-50 text-rose-700 border border-rose-200 text-xs font-bold hover:bg-rose-100"
                                        >
                                            حذف
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Tab 2: Articles */}
                {tab === 'articles' && (
                    <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
                        <h2 className="text-lg font-extrabold text-slate-800">
                            مراجعة واعتماد المقالات التوعوية
                        </h2>
                        <div className="space-y-3">
                            {articles.map((art) => (
                                <div
                                    key={art.id}
                                    className="p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                                >
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h3 className="font-bold text-slate-900">{art.title}</h3>
                                            <span
                                                className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                                                    art.status === 'approved'
                                                        ? 'bg-emerald-50 text-emerald-700'
                                                        : art.status === 'pending'
                                                        ? 'bg-amber-50 text-amber-800'
                                                        : 'bg-rose-50 text-rose-700'
                                                }`}
                                            >
                                                {art.status === 'approved'
                                                    ? 'منشور'
                                                    : art.status === 'pending'
                                                    ? 'قيد المراجعة'
                                                    : 'مرفوض'}
                                            </span>
                                        </div>
                                        <p className="text-xs text-slate-500 mt-1">
                                            الكاتب: {art.author?.name} • التصنيف: {art.category}
                                        </p>
                                    </div>
                                    <div className="flex gap-2">
                                        {art.status !== 'approved' && (
                                            <button
                                                onClick={() => router.patch(route('admin.articles.approve', art.id))}
                                                className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700"
                                            >
                                                ✓ قبول ونشر
                                            </button>
                                        )}
                                        {art.status !== 'rejected' && (
                                            <button
                                                onClick={() => router.patch(route('admin.articles.reject', art.id))}
                                                className="px-4 py-2 rounded-xl bg-rose-50 text-rose-700 border border-rose-200 text-xs font-bold hover:bg-rose-100"
                                            >
                                                ✕ رفض
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Tab 3: Consultations */}
                {tab === 'consultations' && (
                    <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
                        <h2 className="text-lg font-extrabold text-slate-800">
                            سجل طلبات التواصل والاستشارات الأولية
                        </h2>
                        <div className="space-y-3">
                            {consultations.map((c) => (
                                <div
                                    key={c.id}
                                    className="p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                                >
                                    <div>
                                        <div className="font-bold text-slate-900 text-sm">
                                            {c.beneficiary_name} ← {c.specialist_profile?.user?.name}
                                        </div>
                                        <div className="text-xs text-slate-500 mt-0.5">
                                            📞 {c.beneficiary_phone} • ⏰ {c.preferred_time || 'غير محدد'}
                                        </div>
                                    </div>
                                    <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold w-fit">
                                        {c.status === 'pending'
                                            ? 'قيد الانتظار'
                                            : c.status === 'contacted'
                                            ? 'تم التواصل'
                                            : 'مكتمل'}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Tab 4: Questions (Add + Edit + Toggle + Delete) */}
                {tab === 'questions' && (
                    <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-6">
                        <div>
                            <h2 className="text-lg font-extrabold text-slate-800 mb-3">
                                إدارة أسئلة المقياس النفسي
                            </h2>
                            <form onSubmit={addQuestion} className="flex flex-col sm:flex-row gap-3">
                                <select
                                    value={questionForm.data.category}
                                    onChange={(e) => questionForm.setData('category', e.target.value)}
                                    className="rounded-xl border-slate-300 text-sm"
                                >
                                    <option value="mood">المزاج والاكتئاب</option>
                                    <option value="anxiety">التوتر والقلق</option>
                                    <option value="burnout">الضغوط والاحتراق</option>
                                </select>
                                <input
                                    type="text"
                                    value={questionForm.data.question_text}
                                    onChange={(e) => questionForm.setData('question_text', e.target.value)}
                                    placeholder="اكتب نص السؤال التقييمي الجديد..."
                                    className="flex-1 rounded-xl border-slate-300 text-sm"
                                    required
                                />
                                <button
                                    type="submit"
                                    className="px-5 py-2.5 rounded-xl bg-slate-900 text-white text-sm font-bold hover:bg-slate-800"
                                >
                                    + إضافة سؤال
                                </button>
                            </form>
                        </div>

                        {editingQuestion && (
                            <form onSubmit={saveEditQuestion} className="p-4 rounded-2xl bg-amber-50 border border-amber-200 space-y-3">
                                <div className="text-xs font-bold text-amber-900">تعديل السؤال رقم #{editingQuestion.order_index}</div>
                                <div className="flex flex-col sm:flex-row gap-2">
                                    <select
                                        value={editQuestionForm.data.category}
                                        onChange={(e) => editQuestionForm.setData('category', e.target.value)}
                                        className="rounded-xl border-amber-300 text-sm"
                                    >
                                        <option value="mood">المزاج والاكتئاب</option>
                                        <option value="anxiety">التوتر والقلق</option>
                                        <option value="burnout">الضغوط والاحتراق</option>
                                    </select>
                                    <input
                                        type="text"
                                        value={editQuestionForm.data.question_text}
                                        onChange={(e) => editQuestionForm.setData('question_text', e.target.value)}
                                        className="flex-1 rounded-xl border-amber-300 text-sm"
                                        required
                                    />
                                    <button type="submit" className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold">
                                        حفظ التعديل
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setEditingQuestion(null)}
                                        className="px-4 py-2 rounded-xl bg-white border border-slate-300 text-xs font-bold"
                                    >
                                        إلغاء
                                    </button>
                                </div>
                            </form>
                        )}

                        <div className="space-y-2.5">
                            {questions.map((q, idx) => (
                                <div
                                    key={q.id}
                                    className="p-3.5 rounded-2xl border border-slate-200 flex items-center justify-between gap-4"
                                >
                                    <div>
                                        <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full ml-2">
                                            {q.category_label}
                                        </span>
                                        <span className="text-sm font-semibold text-slate-800">
                                            {idx + 1}. {q.question_text}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 shrink-0">
                                        <button
                                            onClick={() => startEditQuestion(q)}
                                            className="px-3 py-1.5 rounded-lg bg-sky-50 text-sky-700 text-xs font-bold"
                                        >
                                            تعديل
                                        </button>
                                        <button
                                            onClick={() => router.patch(route('admin.questions.toggle', q.id))}
                                            className={`px-3 py-1.5 rounded-lg text-xs font-bold ${
                                                q.is_active
                                                    ? 'bg-emerald-50 text-emerald-700'
                                                    : 'bg-slate-100 text-slate-500'
                                            }`}
                                        >
                                            {q.is_active ? 'مفعل' : 'معطل'}
                                        </button>
                                        <button
                                            onClick={() => router.delete(route('admin.questions.destroy', q.id))}
                                            className="px-3 py-1.5 rounded-lg bg-rose-50 text-rose-700 text-xs font-bold"
                                        >
                                            حذف
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Tab 5: Dynamic Scoring Rules */}
                {tab === 'rules' && (
                    <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-5">
                        <div>
                            <h2 className="text-lg font-extrabold text-slate-800">
                                ⚖️ قواعد احتساب الدرجات والتصنيف التلقائي
                            </h2>
                            <p className="text-xs text-slate-500 mt-0.5">
                                تعديل نطاق الدرجات والتوصيات الإرشادية لكل مستوى دون تعديل الكود
                            </p>
                        </div>
                        <div className="space-y-4">
                            {scoringRules.map((rule) => (
                                <ScoringRuleCard key={rule.id} rule={rule} />
                            ))}
                        </div>
                    </div>
                )}

                {/* Tab 6: Users */}
                {tab === 'users' && (
                    <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
                        <h2 className="text-lg font-extrabold text-slate-800">
                            قائمة الحسابات المسجلة
                        </h2>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-right">
                                <thead className="bg-slate-100 text-slate-800 text-xs">
                                    <tr>
                                        <th className="p-3 rounded-r-xl">الاسم</th>
                                        <th className="p-3">البريد</th>
                                        <th className="p-3">الدور</th>
                                        <th className="p-3">الحالة</th>
                                        <th className="p-3 rounded-l-xl">إجراء</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {users.map((u) => (
                                        <tr key={u.id}>
                                            <td className="p-3 font-bold text-slate-800">{u.name}</td>
                                            <td className="p-3 text-slate-500">{u.email}</td>
                                            <td className="p-3">
                                                <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-xs font-bold">
                                                    {u.role === 'admin'
                                                        ? 'إدارة'
                                                        : u.role === 'specialist'
                                                        ? 'مستشار'
                                                        : 'مستفيد'}
                                                </span>
                                            </td>
                                            <td className="p-3">
                                                <span
                                                    className={`text-xs font-bold ${
                                                        u.is_active ? 'text-emerald-600' : 'text-rose-600'
                                                    }`}
                                                >
                                                    {u.is_active ? 'نشط' : 'معطل'}
                                                </span>
                                            </td>
                                            <td className="p-3 flex gap-2">
                                                {u.role !== 'admin' && (
                                                    <>
                                                        <button
                                                            onClick={() => router.patch(route('admin.users.toggle', u.id))}
                                                            className="px-3 py-1 rounded-lg border border-slate-300 text-xs font-bold hover:bg-slate-100"
                                                        >
                                                            {u.is_active ? 'تعطيل' : 'تفعيل'}
                                                        </button>
                                                        <button
                                                            onClick={() => {
                                                                if (confirm('هل تريد حذف هذا الحساب نهائياً؟')) {
                                                                    router.delete(route('admin.users.destroy', u.id));
                                                                }
                                                            }}
                                                            className="px-3 py-1 rounded-lg bg-rose-50 text-rose-700 text-xs font-bold hover:bg-rose-100"
                                                        >
                                                            حذف
                                                        </button>
                                                    </>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}

function ScoringRuleCard({ rule }) {
    const form = useForm({
        label: rule.label,
        min_score: rule.min_score,
        max_score: rule.max_score,
        recommendation: rule.recommendation,
    });

    const save = (e) => {
        e.preventDefault();
        form.put(route('admin.scoring-rules.update', rule.id));
    };

    return (
        <form onSubmit={save} className="p-4 rounded-2xl border border-slate-200 bg-slate-50/60 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">اسم المستوى ({rule.level})</label>
                    <input
                        type="text"
                        value={form.data.label}
                        onChange={(e) => form.setData('label', e.target.value)}
                        className="w-full rounded-xl border-slate-300 text-sm"
                        required
                    />
                </div>
                <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">من درجة</label>
                    <input
                        type="number"
                        value={form.data.min_score}
                        onChange={(e) => form.setData('min_score', e.target.value)}
                        className="w-full rounded-xl border-slate-300 text-sm"
                        required
                    />
                </div>
                <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">إلى درجة</label>
                    <input
                        type="number"
                        value={form.data.max_score}
                        onChange={(e) => form.setData('max_score', e.target.value)}
                        className="w-full rounded-xl border-slate-300 text-sm"
                        required
                    />
                </div>
            </div>
            <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">الرسالة التوجيهية للمستفيد</label>
                <textarea
                    rows="2"
                    value={form.data.recommendation}
                    onChange={(e) => form.setData('recommendation', e.target.value)}
                    className="w-full rounded-xl border-slate-300 text-sm"
                    required
                />
            </div>
            <button
                type="submit"
                disabled={form.processing}
                className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700"
            >
                حفظ القاعدة
            </button>
        </form>
    );
}
