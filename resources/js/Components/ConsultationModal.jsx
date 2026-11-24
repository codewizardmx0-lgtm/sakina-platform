import { useForm, usePage } from '@inertiajs/react';

export default function ConsultationModal({ specialist, assessmentId = null, onClose }) {
    const { auth } = usePage().props;
    const user = auth?.user;

    const { data, setData, post, processing, errors, reset } = useForm({
        specialist_profile_id: specialist?.id || '',
        assessment_id: assessmentId,
        share_assessment: Boolean(assessmentId),
        beneficiary_name: user?.name || '',
        beneficiary_phone: user?.phone || '',
        preferred_time: 'المساء (5:00 - 8:00)',
        notes: '',
    });

    if (!specialist) return null;

    const submit = (e) => {
        e.preventDefault();
        post(route('consultations.store'), {
            onSuccess: () => {
                reset();
                onClose();
            },
        });
    };

    return (
        <div
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-cream-200 space-y-5"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-start justify-between">
                    <div>
                        <span className="text-xs font-bold text-sakina-600 bg-sakina-50 px-3 py-1 rounded-full">
                            📩 طلب تواصل أولي سري
                        </span>
                        <h3 className="text-xl font-extrabold text-sakina-800 mt-2">
                            طلب استشارة مع {specialist.user?.name}
                        </h3>
                        <p className="text-xs text-gray-500 mt-0.5">{specialist.specialty}</p>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200">
                        ✕
                    </button>
                </div>

                <form onSubmit={submit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">الاسم (أو اسم مستعار للخصوصية)</label>
                        <input
                            type="text"
                            value={data.beneficiary_name}
                            onChange={(e) => setData('beneficiary_name', e.target.value)}
                            className="w-full rounded-xl border-cream-300 text-sm"
                            required
                        />
                        {errors.beneficiary_name && <p className="text-xs text-rose-600 mt-1">{errors.beneficiary_name}</p>}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">رقم التواصل / واتساب</label>
                            <input
                                type="text"
                                value={data.beneficiary_phone}
                                onChange={(e) => setData('beneficiary_phone', e.target.value)}
                                placeholder="77xxxxxxx"
                                className="w-full rounded-xl border-cream-300 text-sm"
                                required
                            />
                            {errors.beneficiary_phone && <p className="text-xs text-rose-600 mt-1">{errors.beneficiary_phone}</p>}
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">الوقت المفضل للتواصل</label>
                            <select
                                value={data.preferred_time}
                                onChange={(e) => setData('preferred_time', e.target.value)}
                                className="w-full rounded-xl border-cream-300 text-sm"
                            >
                                <option value="الصباح (9:00 - 12:00)">الصباح (9:00 - 12:00)</option>
                                <option value="الظهيرة (1:00 - 4:00)">الظهيرة (1:00 - 4:00)</option>
                                <option value="المساء (5:00 - 8:00)">المساء (5:00 - 8:00)</option>
                                <option value="أي وقت مناسب">أي وقت مناسب</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">ملاحظة مختصرة للمستشار (اختياري)</label>
                        <textarea
                            rows="3"
                            value={data.notes}
                            onChange={(e) => setData('notes', e.target.value)}
                            placeholder="اكتب باختصار ما تشعر به أو سبب طلب التواصل..."
                            className="w-full rounded-xl border-cream-300 text-sm"
                        />
                    </div>

                    {assessmentId && (
                        <label className="flex items-start gap-2.5 p-3 rounded-xl bg-sakina-50 border border-sakina-200 cursor-pointer text-xs text-sakina-900">
                            <input
                                type="checkbox"
                                checked={data.share_assessment}
                                onChange={(e) => setData('share_assessment', e.target.checked)}
                                className="mt-0.5 rounded border-sakina-400 text-sakina-700 focus:ring-sakina-500"
                            />
                            <span>
                                <strong>موافقة الخصوصية:</strong> أوافق على مشاركة نتيجة تقييمي النفسي الحالي مع هذا المختص لتسهيل فهم حالتي.
                            </span>
                        </label>
                    )}

                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full py-3.5 rounded-xl bg-sakina-700 text-white font-bold text-sm hover:bg-sakina-600 transition"
                    >
                        {processing ? 'جاري الإرسال...' : 'إرسال طلب التواصل الآمن'}
                    </button>
                </form>
            </div>
        </div>
    );
}
