import { Head, Link, useForm } from '@inertiajs/react';
import SakinaLayout from '@/Layouts/SakinaLayout';

export default function ForgotPassword({ status }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('password.email'));
    };

    return (
        <SakinaLayout>
            <Head title="استعادة كلمة المرور - منصة سكينة" />

            <div className="max-w-md mx-auto px-4 py-14">
                <div className="bg-white rounded-3xl p-8 shadow-lg border border-cream-200 space-y-5">
                    <div className="text-center">
                        <div className="w-14 h-14 mx-auto rounded-full bg-sakina-50 text-sakina-700 flex items-center justify-center text-2xl mb-3">
                            🔑
                        </div>
                        <h1 className="text-xl font-extrabold text-sakina-800">
                            استعادة كلمة المرور
                        </h1>
                        <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                            أدخل بريدك الإلكتروني المسجل وسنرسل لك رابطاً لإعادة تعيين كلمة المرور بأمان.
                        </p>
                    </div>

                    {status && (
                        <div className="p-3 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-semibold">
                            {status}
                        </div>
                    )}

                    <form onSubmit={submit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1.5">
                                البريد الإلكتروني
                            </label>
                            <input
                                type="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                placeholder="example@email.com"
                                className="w-full rounded-xl border-cream-300 bg-cream-50/50 focus:border-sakina-500 focus:ring-sakina-500 text-sm py-3"
                                required
                            />
                            {errors.email && (
                                <p className="text-xs text-red-600 mt-1">{errors.email}</p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full py-3 rounded-xl bg-sakina-700 text-white font-bold text-sm hover:bg-sakina-600 transition disabled:opacity-50"
                        >
                            {processing ? 'جاري الإرسال...' : 'إرسال رابط الاستعادة'}
                        </button>
                    </form>

                    <div className="text-center pt-2">
                        <Link
                            href={route('login')}
                            className="text-xs font-bold text-sakina-600 hover:underline"
                        >
                            ← العودة لتسجيل الدخول
                        </Link>
                    </div>
                </div>
            </div>
        </SakinaLayout>
    );
}
