import { Head, Link, useForm, usePage } from '@inertiajs/react';
import SakinaLayout from '@/Layouts/SakinaLayout';

const MOOD_OPTIONS = [
    { key: 'happy', emoji: '😊', label: 'مرتاح' },
    { key: 'calm', emoji: '🌿', label: 'هادئ' },
    { key: 'anxious', emoji: '😟', label: 'قلق' },
    { key: 'sad', emoji: '😔', label: 'حزين' },
    { key: 'exhausted', emoji: '😫', label: 'مرهق' },
];

const SEVERITY_BADGES = {
    low: { label: 'منخفض (مستقر)', cls: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    moderate: { label: 'متوسط', cls: 'bg-amber-50 text-amber-800 border-amber-200' },
    high: { label: 'مرتفع', cls: 'bg-rose-50 text-rose-700 border-rose-200' },
};

const REQ_STATUS = {
    pending: { label: 'قيد الانتظار ⏳', cls: 'bg-amber-50 text-amber-800' },
    contacted: { label: 'تم التواصل 📞', cls: 'bg-sky-50 text-sky-800' },
    completed: { label: 'مكتمل ✓', cls: 'bg-emerald-50 text-emerald-700' },
    cancelled: { label: 'ملغي ✕', cls: 'bg-gray-100 text-gray-500' },
};

export default function UserProfile({ assessments = [], consultationRequests = [], moodLogs = [], chartData = [] }) {
    const { auth } = usePage().props;
    const user = auth.user;

    const moodForm = useForm({
        mood: 'calm',
        note: '',
    });

    const submitMood = (e) => {
        e.preventDefault();
        moodForm.post(route('user.moods.store'), {
            onSuccess: () => moodForm.reset('note'),
        });
    };

    // Build SVG points for progress chart (total_score out of 42)
    const width = 520;
    const height = 160;
    const padX = 36;
    const padY = 20;

    const points = chartData.map((pt, idx) => {
        const x =
            chartData.length === 1
                ? width / 2
                : padX + (idx / (chartData.length - 1)) * (width - padX * 2);
        const y = height - padY - (pt.total / 42) * (height - padY * 2);
        return { ...pt, x, y };
    });

    const polylinePoints = points.map((p) => `${p.x},${p.y}`).join(' ');

    return (
        <SakinaLayout>
            <Head title="الملف الشخصي - منصة سكينة" />

            <div className="max-w-5xl mx-auto px-4 py-8 sm:py-10 space-y-8">
                {/* User Header Card */}
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-cream-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-2xl bg-sakina-100 text-sakina-700 flex items-center justify-center text-3xl">
                            👤
                        </div>
                        <div>
                            <h1 className="text-2xl font-extrabold text-sakina-800">{user.name}</h1>
                            <p className="text-sm text-gray-500">{user.email}</p>
                            <span className="inline-block mt-1 px-3 py-0.5 rounded-full bg-sakina-50 text-sakina-700 text-xs font-bold">
                                مستفيد • بياناتك محفوظة بسرية تامة
                            </span>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-2.5">
                        <Link
                            href={route('assessment.index')}
                            className="px-5 py-2.5 rounded-xl bg-sakina-700 text-white text-sm font-bold hover:bg-sakina-600 transition"
                        >
                            📝 إجراء تقييم جديد
                        </Link>
                        <Link
                            href={route('profile.edit')}
                            className="px-4 py-2.5 rounded-xl bg-cream-100 text-gray-700 text-sm font-bold hover:bg-cream-200 transition"
                        >
                            ⚙️ تعديل الحساب
                        </Link>
                    </div>
                </div>

                {/* Progress Chart */}
                {chartData.length > 0 && (
                    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-cream-200 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h2 className="text-lg font-extrabold text-sakina-800">
                                    📈 مؤشر تطور حالتك عبر الزمن
                                </h2>
                                <p className="text-xs text-gray-500 mt-0.5">
                                    انخفاض الدرجة الكلية (من 42) يعني تحسناً واستقراراً نفسياً أكبر
                                </p>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <svg viewBox={`0 0 ${width} ${height}`} className="w-full max-w-2xl mx-auto h-44">
                                {/* Horizontal reference lines */}
                                {[0, 14, 28, 42].map((val) => {
                                    const y = height - padY - (val / 42) * (height - padY * 2);
                                    return (
                                        <g key={val}>
                                            <line
                                                x1={padX}
                                                y1={y}
                                                x2={width - padX}
                                                y2={y}
                                                stroke="#EAE3D7"
                                                strokeDasharray="4 4"
                                            />
                                            <text x={padX - 8} y={y + 4} textAnchor="end" fontSize="10" fill="#9CA3AF">
                                                {val}
                                            </text>
                                        </g>
                                    );
                                })}

                                {points.length > 1 && (
                                    <polyline
                                        fill="none"
                                        stroke="#1D6F63"
                                        strokeWidth="3"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        points={polylinePoints}
                                    />
                                )}

                                {points.map((p, i) => (
                                    <g key={i}>
                                        <circle cx={p.x} cy={p.y} r="6" fill="#2A9D8F" stroke="#fff" strokeWidth="2" />
                                        <text x={p.x} y={p.y - 10} textAnchor="middle" fontSize="11" fontWeight="bold" fill="#1B4D3E">
                                            {p.total}
                                        </text>
                                        <text x={p.x} y={height - 4} textAnchor="middle" fontSize="10" fill="#6B7280">
                                            {p.date}
                                        </text>
                                    </g>
                                ))}
                            </svg>
                        </div>
                    </div>
                )}

                {/* Daily Mood Tracker */}
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-cream-200 shadow-sm space-y-5">
                    <div>
                        <h2 className="text-xl font-extrabold text-sakina-800">
                            📓 مفكرة المزاج اليومية (خاصة بك)
                        </h2>
                        <p className="text-xs text-gray-500 mt-0.5">
                            سجل شعورك اليومي وملاحظاتك لمتابعة توازنك النفسي بين التقييمات
                        </p>
                    </div>

                    <form onSubmit={submitMood} className="space-y-4">
                        <div className="flex flex-wrap gap-2">
                            {MOOD_OPTIONS.map((m) => (
                                <button
                                    type="button"
                                    key={m.key}
                                    onClick={() => moodForm.setData('mood', m.key)}
                                    className={`px-4 py-2 rounded-2xl text-xs font-bold border transition flex items-center gap-1.5 ${
                                        moodForm.data.mood === m.key
                                            ? 'bg-sakina-700 text-white border-sakina-700'
                                            : 'bg-cream-50 text-gray-700 border-cream-200 hover:bg-sakina-50'
                                    }`}
                                >
                                    <span>{m.emoji}</span>
                                    <span>{m.label}</span>
                                </button>
                            ))}
                        </div>
                        <div className="flex flex-col sm:flex-row gap-2.5">
                            <input
                                type="text"
                                value={moodForm.data.note}
                                onChange={(e) => moodForm.setData('note', e.target.value)}
                                placeholder="اكتب ملاحظة قصيرة عن يومك (اختياري)..."
                                className="flex-1 rounded-xl border-cream-300 text-sm"
                            />
                            <button
                                type="submit"
                                disabled={moodForm.processing}
                                className="px-6 py-2.5 rounded-xl bg-sakina-700 text-white text-xs sm:text-sm font-bold hover:bg-sakina-600 transition"
                            >
                                حفظ في المفكرة
                            </button>
                        </div>
                    </form>

                    {moodLogs.length > 0 && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                            {moodLogs.slice(0, 4).map((log) => {
                                const info = MOOD_OPTIONS.find((m) => m.key === log.mood) || MOOD_OPTIONS[1];
                                return (
                                    <div key={log.id} className="p-3.5 rounded-2xl bg-cream-50/70 border border-cream-200">
                                        <div className="flex items-center justify-between text-xs font-bold">
                                            <span className="text-sakina-800">{info.emoji} {info.label}</span>
                                            <span className="text-gray-400">
                                                {new Date(log.created_at).toLocaleDateString('ar-EG')}
                                            </span>
                                        </div>
                                        {log.note && <p className="text-xs text-gray-600 mt-1">{log.note}</p>}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Consultation Requests History */}
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-cream-200 shadow-sm">
                    <div className="flex items-center justify-between mb-5">
                        <h2 className="text-xl font-extrabold text-sakina-800">
                            📩 طلبات التواصل والاستشارة المرسلة
                        </h2>
                        <Link
                            href={route('specialists.directory')}
                            className="text-xs font-bold text-sakina-700 hover:underline"
                        >
                            + طلب تواصل جديد
                        </Link>
                    </div>

                    {consultationRequests.length === 0 ? (
                        <p className="text-sm text-gray-500 text-center py-4">
                            لم ترسل أي طلبات تواصل مع المختصين حتى الآن.
                        </p>
                    ) : (
                        <div className="space-y-3">
                            {consultationRequests.map((req) => {
                                const st = REQ_STATUS[req.status] || REQ_STATUS.pending;
                                return (
                                    <div
                                        key={req.id}
                                        className="p-4 rounded-2xl border border-cream-200 bg-cream-50/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                                    >
                                        <div>
                                            <div className="font-bold text-sm text-sakina-900">
                                                المستشار: {req.specialist_profile?.user?.name}
                                            </div>
                                            <div className="text-xs text-gray-500 mt-0.5">
                                                الوقت المفضل: {req.preferred_time || 'غير محدد'} •{' '}
                                                {new Date(req.created_at).toLocaleDateString('ar-EG')}
                                            </div>
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold w-fit ${st.cls}`}>
                                            {st.label}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Assessment History */}
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-cream-200 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-extrabold text-sakina-800">
                            📊 سجل التقييمات النفسية السابقة
                        </h2>
                        <span className="text-xs font-bold text-gray-500">
                            إجمالي التقييمات: {assessments.length}
                        </span>
                    </div>

                    {assessments.length === 0 ? (
                        <div className="text-center py-10 space-y-3">
                            <p className="text-gray-500 text-sm">لم تقم بإجراء أي تقييم نفسي حتى الآن.</p>
                            <Link
                                href={route('assessment.index')}
                                className="inline-block px-6 py-2.5 rounded-xl bg-sakina-700 text-white text-sm font-bold"
                            >
                                ابدأ تقييمك الأول الآن
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {assessments.map((item) => {
                                const badge = SEVERITY_BADGES[item.severity_level] || SEVERITY_BADGES.moderate;
                                return (
                                    <div
                                        key={item.id}
                                        className="p-4 rounded-2xl border border-cream-200 bg-cream-50/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                                    >
                                        <div className="space-y-1">
                                            <div className="flex flex-wrap items-center gap-2.5">
                                                <span className={`px-3 py-0.5 rounded-full text-xs font-bold border ${badge.cls}`}>
                                                    {badge.label}
                                                </span>
                                                <span className="text-sm font-extrabold text-sakina-800">
                                                    النتيجة: {item.total_score} / 42
                                                </span>
                                                <span className="text-xs text-gray-400">
                                                    {new Date(item.created_at).toLocaleDateString('ar-EG', {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric',
                                                    })}
                                                </span>
                                            </div>
                                            <p className="text-xs text-gray-600">
                                                المزاج: {item.mood_score}/15 • القلق: {item.anxiety_score}/15 • الضغوط: {item.burnout_score}/12
                                            </p>
                                        </div>

                                        <Link
                                            href={route('assessment.result', item.id)}
                                            className="px-4 py-2 rounded-xl bg-white border border-sakina-200 text-sakina-700 text-xs font-bold hover:bg-sakina-50 transition text-center"
                                        >
                                            عرض التفاصيل وPDF ←
                                        </Link>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </SakinaLayout>
    );
}
