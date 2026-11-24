import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import SakinaLayout from '@/Layouts/SakinaLayout';
import ConsultationModal from '@/Components/ConsultationModal';

export default function SpecialistsDirectory({ specialists = [], filters = {} }) {
    const [search, setSearch] = useState(filters.search || '');
    const [selectedSpecialist, setSelectedSpecialist] = useState(null);

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('specialists.directory'), { search }, { preserveState: true });
    };

    return (
        <SakinaLayout>
            <Head title="دليل المستشارين النفسيين - منصة سكينة" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="text-center max-w-2xl mx-auto mb-8 space-y-2">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-sakina-50 text-sakina-700 text-xs font-bold">
                        <span>🛡️</span>
                        <span>جميع البيانات والسير الذاتية موثقة من قبل الإدارة</span>
                    </div>
                    <h1 className="text-3xl font-extrabold text-sakina-800">
                        🩺 دليل المستشارين والأخصائيين النفسيين
                    </h1>
                    <p className="text-sm sm:text-base text-gray-600">
                        اختر المختص المناسب لحالتك وأرسل طلب تواصل أولي أو تواصل مباشرة بكل سرية
                    </p>
                </div>

                {/* Search Bar */}
                <form onSubmit={handleSearch} className="max-w-xl mx-auto mb-10 flex gap-2">
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="ابحث باسم المستشار أو التخصص (مثال: القلق، الاحتراق، الأسري)..."
                        className="flex-1 rounded-2xl border-cream-300 bg-white focus:border-sakina-500 focus:ring-sakina-500 text-sm py-3 px-4 shadow-sm"
                    />
                    <button
                        type="submit"
                        className="px-6 py-3 rounded-2xl bg-sakina-700 text-white text-sm font-bold hover:bg-sakina-600 transition shadow-sm"
                    >
                        بحث
                    </button>
                </form>

                {specialists.length === 0 ? (
                    <div className="bg-white rounded-3xl p-10 text-center border border-cream-200 text-gray-500">
                        لا توجد نتائج مطابقة لبحثك حالياً.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {specialists.map((sp) => (
                            <div
                                key={sp.id}
                                className="bg-white rounded-3xl p-6 border border-cream-200 shadow-sm hover:shadow-md transition flex flex-col justify-between"
                            >
                                <div>
                                    <div className="flex items-start gap-4 mb-4">
                                        <div className="w-14 h-14 rounded-2xl bg-sakina-100 text-sakina-700 flex items-center justify-center text-2xl shrink-0">
                                            👨‍⚕️
                                        </div>
                                        <div>
                                            <span className="text-[11px] font-bold text-sakina-600 bg-sakina-50 px-2.5 py-0.5 rounded-full">
                                                {sp.title}
                                            </span>
                                            <h2 className="text-lg font-extrabold text-sakina-800 mt-1">
                                                {sp.user?.name}
                                            </h2>
                                            <p className="text-xs font-bold text-amber-700">
                                                {sp.specialty}
                                            </p>
                                        </div>
                                    </div>

                                    <p className="text-sm text-gray-600 leading-relaxed mb-4">
                                        {sp.bio}
                                    </p>

                                    {sp.certificates && (
                                        <div className="p-3 rounded-xl bg-cream-50 border border-cream-200 text-xs text-gray-600 mb-4">
                                            <span className="font-bold text-sakina-800">🎓 الشهادات: </span>
                                            {sp.certificates}
                                        </div>
                                    )}
                                </div>

                                <div className="pt-4 border-t border-cream-100 space-y-2.5">
                                    <div className="flex items-center justify-between text-xs text-gray-500 font-semibold">
                                        <span>الخبرة العملية</span>
                                        <span className="text-sakina-700 font-bold">{sp.experience_years} سنوات</span>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setSelectedSpecialist(sp)}
                                        className="w-full py-2.5 rounded-xl bg-sakina-700 text-white text-center text-xs font-bold hover:bg-sakina-600 transition"
                                    >
                                        📩 طلب تواصل / حجز أولي
                                    </button>
                                    <div className="grid grid-cols-2 gap-2">
                                        <a
                                            href={`tel:${sp.contact_phone}`}
                                            className="py-2 rounded-xl bg-sakina-50 text-sakina-700 border border-sakina-200 text-center text-xs font-bold hover:bg-sakina-100 transition"
                                        >
                                            📞 {sp.contact_phone}
                                        </a>
                                        <a
                                            href={`https://wa.me/967${sp.contact_phone}`}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="py-2 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 text-center text-xs font-bold hover:bg-emerald-100 transition"
                                        >
                                            💬 واتساب
                                        </a>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <ConsultationModal
                specialist={selectedSpecialist}
                onClose={() => setSelectedSpecialist(null)}
            />
        </SakinaLayout>
    );
}
