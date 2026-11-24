import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';
import SakinaLayout from '@/Layouts/SakinaLayout';

const OPTIONS = [
    { value: 0, label: 'أبداً', sub: '0' },
    { value: 1, label: 'بعض الأيام', sub: '1' },
    { value: 2, label: 'معظم الأيام', sub: '2' },
    { value: 3, label: 'يومياً تقريباً', sub: '3' },
];

const CATEGORY_BADGES = {
    mood: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    anxiety: 'bg-amber-50 text-amber-800 border-amber-200',
    burnout: 'bg-sakina-50 text-sakina-700 border-sakina-200',
};

export default function AssessmentIndex({ questions = [] }) {
    const { data, setData, post, processing } = useForm({
        answers: {},
    });

    const [validationError, setValidationError] = useState('');
    const [focusMode, setFocusMode] = useState(false);
    const [currentIdx, setCurrentIdx] = useState(0);

    const answeredCount = Object.keys(data.answers).length;
    const totalCount = questions.length;
    const progress = totalCount > 0 ? Math.round((answeredCount / totalCount) * 100) : 0;

    const selectAnswer = (questionId, value) => {
        setValidationError('');
        setData('answers', {
            ...data.answers,
            [questionId]: value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (answeredCount < totalCount) {
            setValidationError(`يرجى الإجابة على جميع الأسئلة (${answeredCount} من ${totalCount} مكتمل).`);
            return;
        }
        post(route('assessment.store'));
    };

    const currentQuestion = questions[currentIdx];

    return (
        <SakinaLayout>
            <Head title="مقياس التقييم النفسي الأولي - منصة سكينة" />

            <div className="max-w-4xl mx-auto px-4 py-8 sm:py-10">
                {/* Sticky Progress Header */}
                <div className="sticky top-16 z-30 bg-cream-50/95 backdrop-blur-md py-4 border-b border-cream-200 mb-6">
                    <div className="flex flex-wrap items-center justify-between gap-3 mb-2.5">
                        <div>
                            <h1 className="text-xl sm:text-2xl font-extrabold text-sakina-800">
                                📋 مقياس التقييم النفسي الأولي ({totalCount} سؤالاً)
                            </h1>
                            <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                                الرجاء اختيار إجابة واحدة تعبر عن حالتك خلال الأسبوعين الماضيين • سري تماماً
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={() => setFocusMode(!focusMode)}
                                className="px-3.5 py-2 rounded-xl bg-sakina-50 border border-sakina-200 text-xs font-bold text-sakina-700 hover:bg-sakina-100 transition"
                            >
                                {focusMode ? '📄 عرض القائمة الكاملة' : '🎯 وضع التركيز (سؤال بسؤال)'}
                            </button>
                            <Link
                                href={route('home')}
                                className="px-3.5 py-2 rounded-xl bg-white border border-cream-200 text-xs font-bold text-gray-600 hover:bg-cream-100 transition"
                            >
                                🏠 الرئيسية
                            </Link>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="flex-1 h-2.5 bg-cream-200 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-sakina-600 transition-all duration-300 rounded-full"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                        <span className="text-xs font-bold text-sakina-700 whitespace-nowrap">
                            تقدم الإجابة: {answeredCount} / {totalCount} ({progress}%)
                        </span>
                    </div>
                </div>

                {validationError && (
                    <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-sm font-bold">
                        ⚠️ {validationError}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    {focusMode && currentQuestion ? (
                        /* Focus Mode: One Question at a Time */
                        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-sakina-200 shadow-md space-y-6">
                            <div className="flex items-center justify-between">
                                <span
                                    className={`px-3 py-1 rounded-full text-xs font-bold border ${
                                        CATEGORY_BADGES[currentQuestion.category] || 'bg-gray-50 text-gray-700'
                                    }`}
                                >
                                    {currentQuestion.category_label}
                                </span>
                                <span className="text-xs font-bold text-gray-400">
                                    سؤال {currentIdx + 1} من {totalCount}
                                </span>
                            </div>

                            <p className="font-extrabold text-sakina-900 text-lg sm:text-xl leading-relaxed">
                                {currentIdx + 1}. {currentQuestion.question_text}
                            </p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {OPTIONS.map((opt) => {
                                    const active = data.answers[currentQuestion.id] === opt.value;
                                    return (
                                        <button
                                            type="button"
                                            key={opt.value}
                                            onClick={() => selectAnswer(currentQuestion.id, opt.value)}
                                            className={`py-4 px-4 rounded-2xl text-sm font-bold border transition flex items-center justify-between ${
                                                active
                                                    ? 'bg-sakina-700 text-white border-sakina-700 shadow-sm'
                                                    : 'bg-cream-50/70 text-gray-700 border-cream-200 hover:bg-sakina-50'
                                            }`}
                                        >
                                            <span>{opt.label}</span>
                                            <span
                                                className={`text-xs px-2 py-0.5 rounded-lg ${
                                                    active ? 'bg-white/20 text-white' : 'bg-cream-200/70 text-gray-500'
                                                }`}
                                            >
                                                {opt.sub}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>

                            <div className="flex items-center justify-between pt-4 border-t border-cream-100">
                                <button
                                    type="button"
                                    disabled={currentIdx === 0}
                                    onClick={() => setCurrentIdx((i) => Math.max(0, i - 1))}
                                    className="px-5 py-2.5 rounded-xl bg-cream-100 text-gray-700 text-sm font-bold disabled:opacity-40"
                                >
                                    → السابق
                                </button>

                                {currentIdx < totalCount - 1 ? (
                                    <button
                                        type="button"
                                        onClick={() => setCurrentIdx((i) => Math.min(totalCount - 1, i + 1))}
                                        className="px-6 py-2.5 rounded-xl bg-sakina-700 text-white text-sm font-bold hover:bg-sakina-600"
                                    >
                                        التالي ←
                                    </button>
                                ) : (
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="px-8 py-3 rounded-xl bg-sakina-700 text-white text-sm font-extrabold hover:bg-sakina-600 shadow-md"
                                    >
                                        {processing ? 'جاري التحليل...' : '✨ إظهار النتيجة'}
                                    </button>
                                )}
                            </div>
                        </div>
                    ) : (
                        /* Full List Mode */
                        <>
                            {questions.map((q, idx) => {
                                const selected = data.answers[q.id];
                                return (
                                    <div
                                        key={q.id}
                                        className={`bg-white rounded-2xl p-5 border transition shadow-sm ${
                                            selected !== undefined
                                                ? 'border-sakina-300 bg-sakina-50/20'
                                                : 'border-cream-200'
                                        }`}
                                    >
                                        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                                            <span
                                                className={`px-3 py-1 rounded-full text-xs font-bold border ${
                                                    CATEGORY_BADGES[q.category] || 'bg-gray-50 text-gray-700'
                                                }`}
                                            >
                                                {q.category_label}
                                            </span>
                                            <span className="text-xs font-bold text-gray-400">
                                                سؤال {idx + 1} من {totalCount}
                                            </span>
                                        </div>

                                        <p className="font-bold text-sakina-900 text-base mb-4 leading-relaxed">
                                            {idx + 1}. {q.question_text}
                                        </p>

                                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                                            {OPTIONS.map((opt) => {
                                                const active = selected === opt.value;
                                                return (
                                                    <button
                                                        type="button"
                                                        key={opt.value}
                                                        onClick={() => selectAnswer(q.id, opt.value)}
                                                        className={`py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold border transition flex items-center justify-center gap-1.5 ${
                                                            active
                                                                ? 'bg-sakina-700 text-white border-sakina-700 shadow-sm'
                                                                : 'bg-cream-50/70 text-gray-700 border-cream-200 hover:bg-sakina-50 hover:border-sakina-300'
                                                        }`}
                                                    >
                                                        <span>{opt.label}</span>
                                                        <span
                                                            className={`text-[11px] px-1.5 py-0.5 rounded-md ${
                                                                active
                                                                    ? 'bg-white/20 text-white'
                                                                    : 'bg-cream-200/70 text-gray-500'
                                                            }`}
                                                        >
                                                            {opt.sub}
                                                        </span>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                );
                            })}

                            <div className="pt-4">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full py-4 rounded-2xl bg-sakina-700 text-white font-extrabold text-lg hover:bg-sakina-600 shadow-lg shadow-sakina-700/20 transition disabled:opacity-50"
                                >
                                    {processing ? 'جاري تحليل النتيجة...' : '✨ إظهار النتيجة والتوصيات'}
                                </button>
                            </div>
                        </>
                    )}
                </form>
            </div>
        </SakinaLayout>
    );
}
