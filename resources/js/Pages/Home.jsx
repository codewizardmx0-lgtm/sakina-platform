import { Head, Link, usePage } from '@inertiajs/react';
import { useState } from 'react';
import SakinaLayout from '@/Layouts/SakinaLayout';
import BreathingModal from '@/Components/BreathingModal';

export default function Home({ articles = [], specialists = [], questionsCount = 14 }) {
    const { auth } = usePage().props;
    const user = auth?.user;
    const [selectedArticle, setSelectedArticle] = useState(null);
    const [breathingOpen, setBreathingOpen] = useState(false);

    return (
        <SakinaLayout>
            <Head title="الرئيسية - منصة سكينة" />

            {/* Hero Section */}
            <section className="relative overflow-hidden bg-gradient-to-b from-cream-100 to-cream-50 border-b border-cream-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                        {/* Right Text Hero */}
                        <div className="lg:col-span-7 space-y-6">
                            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sakina-100 text-sakina-700 text-xs font-bold">
                                <span>🌿</span>
                                <span>مساحتك الرقمية الآمنة للدعم النفسي</span>
                            </div>

                            <h1 className="text-3xl sm:text-5xl font-extrabold text-sakina-800 leading-tight">
                                مساحة آمنة لتهدأ...
                                <span className="block text-sakina-600 mt-1">وتفهم نفسك</span>
                            </h1>

                            <p className="text-base sm:text-lg text-gray-600 leading-relaxed max-w-2xl">
                                منصة سكينة توفر لك تقييماً نفسياً أولياً موثوقاً من {questionsCount} سؤالاً، ومحتوى توعوياً هادئاً، واتصالاً مباشراً بمختصين معتمدين لدعم صحتك النفسية بكل سرية وخصوصية.
                            </p>

                            <div className="flex flex-wrap gap-3 pt-2">
                                <Link
                                    href={route('assessment.index')}
                                    className="px-7 py-3.5 rounded-2xl bg-sakina-700 text-white font-bold text-base hover:bg-sakina-600 shadow-md shadow-sakina-700/15 transition flex items-center gap-2"
                                >
                                    <span>📝 ابدأ التقييم المجاني</span>
                                </Link>
                                <Link
                                    href={route('specialists.directory')}
                                    className="px-6 py-3.5 rounded-2xl bg-white text-sakina-700 border border-sakina-200 font-bold text-base hover:bg-sakina-50 transition"
                                >
                                    🩺 تصفح المختصين
                                </Link>
                                <button
                                    type="button"
                                    onClick={() => setBreathingOpen(true)}
                                    className="px-5 py-3.5 rounded-2xl bg-sakina-100 text-sakina-800 font-bold text-sm hover:bg-sakina-200 transition flex items-center gap-1.5"
                                >
                                    <span>🌬️ تمرين تنفس هادئ</span>
                                </button>
                            </div>

                            {/* Trust Badges */}
                            <div className="flex flex-wrap items-center gap-5 pt-3 text-xs sm:text-sm font-semibold text-gray-600">
                                <span className="flex items-center gap-1.5">
                                    <span className="w-2.5 h-2.5 rounded-full bg-sakina-500"></span>
                                    مختصون مرخصون
                                </span>
                                <span className="flex items-center gap-1.5">
                                    <span className="w-2.5 h-2.5 rounded-full bg-sakina-500"></span>
                                    تقييم أولي غير تشخيصي
                                </span>
                                <span className="flex items-center gap-1.5">
                                    <span className="w-2.5 h-2.5 rounded-full bg-sakina-500"></span>
                                    سرية تامة 100%
                                </span>
                            </div>
                        </div>

                        {/* Left Visual & Access Portal */}
                        <div className="lg:col-span-5">
                            <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-xl shadow-sakina-900/5 border border-cream-200 space-y-5">
                                {/* Generated Watercolor Illustration */}
                                <div className="rounded-2xl overflow-hidden border border-cream-200 relative">
                                    <img
                                        src="/images/hero-meditation.jpg"
                                        alt="مساحة آمنة للهدوء النفسي"
                                        className="w-full h-52 object-cover"
                                    />
                                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-sakina-900/80 via-sakina-900/30 to-transparent p-4 text-white">
                                        <p className="font-bold text-sm">
                                            &ldquo;هنا... يمكنك أن تكون على طبيعتك&rdquo;
                                        </p>
                                    </div>
                                </div>

                                {/* Access Gate */}
                                <div>
                                    <h3 className="text-sm font-bold text-sakina-800 mb-3 text-center">
                                        🔐 بوابة الوصول السريع للمستفيدين
                                    </h3>
                                    {user ? (
                                        <div className="space-y-2.5">
                                            <div className="p-3 rounded-xl bg-sakina-50 text-center text-sm font-semibold text-sakina-800">
                                                مرحباً بك، {user.name}
                                            </div>
                                            <Link
                                                href={route('dashboard')}
                                                className="block w-full py-3 rounded-xl bg-sakina-700 text-white text-center font-bold text-sm hover:bg-sakina-600 transition"
                                            >
                                                الانتقال إلى لوحتي
                                            </Link>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-2 gap-2.5">
                                            <Link
                                                href={route('login')}
                                                className="py-3 rounded-xl bg-sakina-700 text-white text-center font-bold text-sm hover:bg-sakina-600 transition"
                                            >
                                                تسجيل الدخول
                                            </Link>
                                            <Link
                                                href={route('register')}
                                                className="py-3 rounded-xl bg-sakina-50 text-sakina-700 border border-sakina-200 text-center font-bold text-sm hover:bg-sakina-100 transition"
                                            >
                                                إنشاء حساب
                                            </Link>
                                        </div>
                                    )}
                                </div>

                                <div className="border-t border-cream-200 pt-3">
                                    <Link
                                        href={route('specialists.directory')}
                                        className="block w-full py-2.5 rounded-xl bg-amber-50 text-amber-800 border border-amber-200 text-center font-bold text-xs sm:text-sm hover:bg-amber-100 transition"
                                    >
                                        📞 أرقام المختصين وطلب التواصل المباشر
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* How Sakina Works (3 Steps) */}
            <section className="py-12 bg-sakina-50/70 border-b border-cream-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-10">
                        <h2 className="text-2xl sm:text-3xl font-extrabold text-sakina-800">
                            كيف تعمل سكينة؟
                        </h2>
                        <p className="text-sm sm:text-base text-gray-600 mt-1">
                            ثلاث خطوات بسيطة للبدء في رحلتك نحو الهدوء والاتزان النفسي
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            {
                                num: '1',
                                icon: '📋',
                                title: 'أجب على التقييم',
                                desc: 'أجب عن 14 سؤالاً علمياً مقسمة على محاور المزاج والقلق والضغوط خلال 3 دقائق فقط.',
                            },
                            {
                                num: '2',
                                icon: '📊',
                                title: 'احصل على رؤى شخصية',
                                desc: 'يحتسب النظام نتيجتك آلياً ويعرض لك تفصيلاً دقيقاً مع إمكانية طباعة التقرير PDF.',
                            },
                            {
                                num: '3',
                                icon: '🩺',
                                title: 'تواصل مع مختص',
                                desc: 'اختر المستشار المناسب من الدليل المعتمد وأرسل طلب تواصل أو اتصل به مباشرة بكل سرية.',
                            },
                        ].map((step) => (
                            <div
                                key={step.num}
                                className="bg-white rounded-2xl p-6 border border-cream-200 shadow-sm relative"
                            >
                                <span className="absolute top-4 left-4 w-8 h-8 rounded-full bg-sakina-700 text-white text-sm font-bold flex items-center justify-center">
                                    {step.num}
                                </span>
                                <div className="text-3xl mb-3">{step.icon}</div>
                                <h3 className="text-lg font-bold text-sakina-800 mb-2">{step.title}</h3>
                                <p className="text-sm text-gray-600 leading-relaxed">{step.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Educational Articles Section */}
            <section className="py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                    <div>
                        <h2 className="text-2xl sm:text-3xl font-extrabold text-sakina-800">
                            📖 المقالات التوعوية
                        </h2>
                        <p className="text-sm text-gray-600 mt-1">
                            محتوى إرشادي هادئ يساعدك على فهم مشاعرك والتعامل مع الضغوط اليومية
                        </p>
                    </div>
                    <Link
                        href={route('articles.index')}
                        className="text-sm font-bold text-sakina-700 hover:text-sakina-500 transition"
                    >
                        عرض جميع المقالات ←
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                    {articles.map((article) => (
                        <div
                            key={article.id}
                            onClick={() => setSelectedArticle(article)}
                            className="cursor-pointer bg-white rounded-2xl p-5 border border-cream-200 shadow-sm hover:shadow-md hover:border-sakina-300 transition flex flex-col justify-between"
                        >
                            <div>
                                <div className="flex items-center justify-between text-xs mb-3">
                                    <span className="px-2.5 py-1 rounded-full bg-sakina-50 text-sakina-700 font-bold">
                                        {article.category}
                                    </span>
                                    <span className="text-gray-400">{article.reading_time} دقائق</span>
                                </div>
                                <h3 className="font-bold text-sakina-800 text-base mb-2 leading-snug">
                                    {article.title}
                                </h3>
                                <p className="text-xs text-gray-600 leading-relaxed line-clamp-3">
                                    {article.summary}
                                </p>
                            </div>
                            <div className="mt-4 pt-3 border-t border-cream-100 flex items-center justify-between text-xs">
                                <span className="text-gray-500">{article.author?.name}</span>
                                <span className="font-bold text-sakina-600">اقرأ المزيد</span>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Recommended Specialists Section */}
            <section className="py-12 bg-cream-100/80 border-t border-cream-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                        <div>
                            <h2 className="text-2xl sm:text-3xl font-extrabold text-sakina-800">
                                🩺 المختصون الموصى بهم
                            </h2>
                            <p className="text-sm text-gray-600 mt-1">
                                جميع البيانات والسير الذاتية موثقة ومعتمدة من إدارة منصة سكينة
                            </p>
                        </div>
                        <Link
                            href={route('specialists.directory')}
                            className="px-5 py-2.5 rounded-xl bg-sakina-700 text-white text-sm font-bold hover:bg-sakina-600 transition"
                        >
                            دليل المستشارين الكامل
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {specialists.map((sp) => (
                            <div
                                key={sp.id}
                                className="bg-white rounded-2xl p-6 border border-cream-200 shadow-sm flex flex-col justify-between"
                            >
                                <div>
                                    <div className="flex items-center gap-3.5 mb-4">
                                        <div className="w-12 h-12 rounded-2xl bg-sakina-100 text-sakina-700 flex items-center justify-center text-xl font-bold">
                                            👨‍⚕️
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-sakina-800 text-base">
                                                {sp.user?.name}
                                            </h3>
                                            <p className="text-xs font-semibold text-sakina-600">
                                                {sp.specialty}
                                            </p>
                                        </div>
                                    </div>
                                    <p className="text-xs text-gray-600 leading-relaxed mb-4">
                                        {sp.bio}
                                    </p>
                                </div>

                                <div className="pt-4 border-t border-cream-100 flex items-center justify-between">
                                    <span className="text-xs font-semibold text-gray-500">
                                        خبرة {sp.experience_years} سنوات
                                    </span>
                                    <a
                                        href={`tel:${sp.contact_phone}`}
                                        className="px-4 py-2 rounded-xl bg-sakina-50 text-sakina-700 border border-sakina-200 text-xs font-bold hover:bg-sakina-700 hover:text-white transition"
                                    >
                                        📞 {sp.contact_phone}
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Article Reader Modal */}
            {selectedArticle && (
                <div
                    className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
                    onClick={() => setSelectedArticle(null)}
                >
                    <div
                        className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 max-h-[85vh] overflow-y-auto shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-start justify-between gap-4 mb-4">
                            <div>
                                <span className="px-3 py-1 rounded-full bg-sakina-50 text-sakina-700 text-xs font-bold">
                                    {selectedArticle.category}
                                </span>
                                <h3 className="text-xl sm:text-2xl font-extrabold text-sakina-800 mt-3">
                                    {selectedArticle.title}
                                </h3>
                                <p className="text-xs text-gray-500 mt-1">
                                    بقلم: {selectedArticle.author?.name} • وقت القراءة: {selectedArticle.reading_time} دقائق
                                </p>
                            </div>
                            <button
                                onClick={() => setSelectedArticle(null)}
                                className="p-2 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="prose prose-sm max-w-none text-gray-700 leading-loose whitespace-pre-line border-t border-cream-200 pt-4">
                            {selectedArticle.content}
                        </div>

                        <div className="mt-6 pt-4 border-t border-cream-200 flex justify-end">
                            <button
                                onClick={() => setSelectedArticle(null)}
                                className="px-5 py-2 rounded-xl bg-sakina-700 text-white text-sm font-bold hover:bg-sakina-600"
                            >
                                إغلاق
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <BreathingModal isOpen={breathingOpen} onClose={() => setBreathingOpen(false)} />
        </SakinaLayout>
    );
}
