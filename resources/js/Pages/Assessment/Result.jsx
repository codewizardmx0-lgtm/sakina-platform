import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';
import SakinaLayout from '@/Layouts/SakinaLayout';
import BreathingModal from '@/Components/BreathingModal';
import ConsultationModal from '@/Components/ConsultationModal';

const SEVERITY_STYLES = {
    low: {
        bg: 'bg-emerald-50 border-emerald-200 text-emerald-900',
        badge: 'bg-emerald-600 text-white',
        icon: '🌿',
        label: 'مستوى منخفض (مستقر)',
    },
    moderate: {
        bg: 'bg-amber-50 border-amber-200 text-amber-900',
        badge: 'bg-amber-500 text-white',
        icon: '🌤️',
        label: 'مستوى متوسط',
    },
    high: {
        bg: 'bg-rose-50 border-rose-200 text-rose-900',
        badge: 'bg-rose-600 text-white',
        icon: '❤️‍🩹',
        label: 'مستوى مرتفع (يستدعي الاهتمام)',
    },
};

export default function AssessmentResult({ assessment, specialists = [] }) {
    const [breathingOpen, setBreathingOpen] = useState(false);
    const [selectedSpecialist, setSelectedSpecialist] = useState(null);
    const style = SEVERITY_STYLES[assessment.severity_level] || SEVERITY_STYLES.moderate;

    const axes = [
        {
            name: 'محور المزاج والاكتئاب',
            score: assessment.mood_score,
            max: 15,
            ratio: assessment.mood_score / 15,
        },
        {
            name: 'محور التوتر والقلق',
            score: assessment.anxiety_score,
            max: 15,
            ratio: assessment.anxiety_score / 15,
        },
        {
            name: 'محور الضغوط والاحتراق',
            score: assessment.burnout_score,
            max: 12,
            ratio: assessment.burnout_score / 12,
        },
    ];

    const highestRatio = Math.max(...axes.map((a) => a.ratio));

    return (
        <SakinaLayout>
            <Head title="نتيجة التقييم النفسي - منصة سكينة" />

            <div className="max-w-5xl mx-auto px-4 py-8 sm:py-12 space-y-8">
                {/* Print Header (only visible when printing PDF) */}
                <div className="hidden print:flex items-center justify-between border-b-2 border-sakina-700 pb-4 mb-6">
                    <div>
                        <h2 className="text-2xl font-extrabold text-sakina-800">منصة سكينة للدعم النفسي</h2>
                        <p className="text-xs text-gray-500">تقرير التقييم النفسي الأولي السري</p>
                    </div>
                    <div className="text-xs text-gray-500">
                        تاريخ التقرير: {new Date(assessment.created_at).toLocaleDateString('ar-EG')}
                    </div>
                </div>

                {/* Top Action Bar */}
                <div className="flex flex-wrap items-center justify-between gap-3 print:hidden">
                    <h1 className="text-2xl font-extrabold text-sakina-800">
                        📊 تقرير التقييم النفسي الأولي
                    </h1>
                    <div className="flex flex-wrap gap-2">
                        <button
                            type="button"
                            onClick={() => window.print()}
                            className="px-4 py-2 rounded-xl bg-sakina-700 text-white text-xs sm:text-sm font-bold hover:bg-sakina-600 transition shadow-sm"
                        >
                            🖨️ طباعة / حفظ التقرير PDF
                        </button>
                        <button
                            type="button"
                            onClick={() => setBreathingOpen(true)}
                            className="px-4 py-2 rounded-xl bg-sakina-100 text-sakina-800 text-xs sm:text-sm font-bold hover:bg-sakina-200 transition"
                        >
                            🌬️ تمرين تنفس هادئ
                        </button>
                        <Link
                            href={route('assessment.index')}
                            className="px-4 py-2 rounded-xl bg-white border border-cream-200 text-xs sm:text-sm font-bold text-sakina-700 hover:bg-sakina-50 transition"
                        >
                            🔄 إعادة الاختبار
                        </Link>
                    </div>
                </div>

                {/* Main Result Banner */}
                <div className={`rounded-3xl p-6 sm:p-8 border-2 shadow-sm ${style.bg}`}>
                    <div className="flex flex-col sm:flex-row items-center gap-6">
                        <div className="w-20 h-20 rounded-full bg-white/80 flex items-center justify-center text-4xl shadow-sm shrink-0">
                            {style.icon}
                        </div>
                        <div className="flex-1 text-center sm:text-right space-y-2">
                            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
                                <span className={`px-3.5 py-1 rounded-full text-xs font-bold ${style.badge}`}>
                                    {style.label}
                                </span>
                                <span className="text-sm font-bold opacity-80">
                                    الدرجة الكلية: {assessment.total_score} من 42
                                </span>
                            </div>
                            <p className="text-sm sm:text-base leading-relaxed font-medium">
                                {assessment.recommendation}
                            </p>
                            <p className="text-xs opacity-75">
                                * تنويه: هذا التقييم هو مؤشر توعوي أولي ولا يُعد تشخيصاً طبياً.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Crisis Safety Support Banner (for High Severity) */}
                {assessment.severity_level === 'high' && (
                    <div className="rounded-3xl p-6 bg-rose-50 border-2 border-rose-300 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="space-y-1 text-center sm:text-right">
                            <h3 className="text-base font-extrabold text-rose-900">
                                🤍 لست وحدك — الدعم متاح لك الآن
                            </h3>
                            <p className="text-xs sm:text-sm text-rose-800 leading-relaxed">
                                إذا كنت تمر بضائقة حادة أو تحتاج للتحدث مع شخص مختص فوراً، لا تتردد في الاتصال بالمختص المناوب أو خدمات الطوارئ المحلية.
                            </p>
                        </div>
                        {specialists[0] && (
                            <a
                                href={`tel:${specialists[0].contact_phone}`}
                                className="shrink-0 px-5 py-3 rounded-2xl bg-rose-600 text-white text-xs sm:text-sm font-extrabold hover:bg-rose-700 transition shadow-sm"
                            >
                                📞 اتصال عاجل: {specialists[0].contact_phone}
                            </a>
                        )}
                    </div>
                )}

                {/* 3 Axes Breakdown */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    {axes.map((axis) => {
                        const isHighest = axis.ratio === highestRatio && axis.score > 0;
                        return (
                            <div
                                key={axis.name}
                                className={`bg-white rounded-2xl p-5 border shadow-sm text-center ${
                                    isHighest ? 'border-amber-300 ring-2 ring-amber-100' : 'border-cream-200'
                                }`}
                            >
                                <div className="text-xs font-bold text-gray-500 mb-1">
                                    {axis.name} {isHighest && <span className="text-amber-600">(الأعلى)</span>}
                                </div>
                                <div className="text-3xl font-extrabold text-sakina-800 my-2">
                                    {axis.score} <span className="text-base font-semibold text-gray-400">/ {axis.max}</span>
                                </div>
                                <div className="h-2 bg-cream-100 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full rounded-full ${
                                            isHighest ? 'bg-amber-500' : 'bg-sakina-500'
                                        }`}
                                        style={{ width: `${Math.round(axis.ratio * 100)}%` }}
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Practical Recommendations */}
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-cream-200 shadow-sm space-y-4">
                    <h2 className="text-lg font-extrabold text-sakina-800 flex items-center gap-2">
                        <span>💡</span>
                        <span>إرشادات وتوصيات مخصصة لحالتك</span>
                    </h2>
                    <ul className="space-y-2.5 text-sm text-gray-700 leading-relaxed list-disc list-inside">
                        <li>ممارسة تمارين التنفس العميق (4 ثوانٍ شهيق، 7 حبس، 8 زفير) مرتين يومياً لتقليل التوتر الجسدي.</li>
                        <li>تقليل التعرض للشاشات والأخبار المقلقة قبل النوم بساعة، وتدوين المهام لتخفيف التفكير الزائد.</li>
                        <li>التحدث مع مختص نفسي للحصول على خطة دعم مخصصة تساعدك على تجاوز الضغوط الحالية.</li>
                    </ul>
                </div>

                {/* Specialists Direct Contact */}
                <div className="space-y-4 print:hidden">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-extrabold text-sakina-800">
                            🩺 أرقام المختصين للتواصل المباشر أو طلب استشارة
                        </h2>
                        <Link
                            href={route('specialists.directory')}
                            className="text-sm font-bold text-sakina-700 hover:underline"
                        >
                            عرض الدليل الكامل ←
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        {specialists.map((sp) => (
                            <div
                                key={sp.id}
                                className="bg-white rounded-2xl p-5 border border-cream-200 shadow-sm flex flex-col justify-between"
                            >
                                <div>
                                    <h3 className="font-bold text-sakina-800 text-base">
                                        {sp.user?.name}
                                    </h3>
                                    <p className="text-xs font-semibold text-sakina-600 mt-0.5">
                                        {sp.specialty}
                                    </p>
                                    <p className="text-xs text-gray-600 mt-2 leading-relaxed">
                                        {sp.bio}
                                    </p>
                                </div>
                                <div className="mt-4 space-y-2">
                                    <button
                                        type="button"
                                        onClick={() => setSelectedSpecialist(sp)}
                                        className="w-full py-2.5 rounded-xl bg-sakina-700 text-white text-center text-xs font-bold hover:bg-sakina-600 transition"
                                    >
                                        📩 طلب تواصل أولي
                                    </button>
                                    <a
                                        href={`tel:${sp.contact_phone}`}
                                        className="block w-full py-2 rounded-xl bg-sakina-50 text-sakina-700 border border-sakina-200 text-center text-xs font-bold hover:bg-sakina-100 transition"
                                    >
                                        📞 اتصال: {sp.contact_phone}
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <BreathingModal isOpen={breathingOpen} onClose={() => setBreathingOpen(false)} />
            <ConsultationModal
                specialist={selectedSpecialist}
                assessmentId={assessment.id}
                onClose={() => setSelectedSpecialist(null)}
            />
        </SakinaLayout>
    );
}
