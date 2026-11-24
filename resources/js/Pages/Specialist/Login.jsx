import { Head, Link, useForm } from '@inertiajs/react';
import SakinaLogo from '@/Components/SakinaLogo';

export default function SpecialistLogin() {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('login'));
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-sakina-800 to-sakina-900 flex flex-col justify-center items-center px-4" dir="rtl">
            <Head title="بوابة المستشارين - منصة سكينة" />

            <div className="w-full max-w-md bg-white rounded-3xl p-8 shadow-2xl space-y-6">
                <div className="text-center space-y-2">
                    <div className="flex justify-center">
                        <SakinaLogo />
                    </div>
                    <span className="inline-block px-3 py-1 rounded-full bg-sakina-50 text-sakina-700 text-xs font-extrabold">
                        🩺 بوابة المستشارين والأخصائيين
                    </span>
                    <h1 className="text-xl font-extrabold text-sakina-900 pt-1">
                        تسجيل دخول المختص النفسي
                    </h1>
                </div>

                <form onSubmit={submit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1.5">
                            البريد الإلكتروني المهني
                        </label>
                        <input
                            type="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            placeholder="ahmad@sakina.com"
                            className="w-full rounded-xl border-cream-300 text-sm py-3 focus:border-sakina-600 focus:ring-sakina-600"
                            required
                        />
                        {errors.email && <p className="text-xs text-rose-600 mt-1">{errors.email}</p>}
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1.5">
                            كلمة المرور
                        </label>
                        <input
                            type="password"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            placeholder="••••••••"
                            className="w-full rounded-xl border-cream-300 text-sm py-3 focus:border-sakina-600 focus:ring-sakina-600"
                            required
                        />
                        {errors.password && <p className="text-xs text-rose-600 mt-1">{errors.password}</p>}
                    </div>

                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full py-3.5 rounded-xl bg-sakina-700 text-white font-bold text-sm hover:bg-sakina-600 transition"
                    >
                        {processing ? 'جاري الدخول...' : 'دخول إلى عيادتي'}
                    </button>
                </form>

                <div className="pt-4 border-t border-cream-200 flex items-center justify-between text-xs">
                    <button
                        type="button"
                        onClick={() => setData({ ...data, email: 'ahmad@sakina.com', password: 'password' })}
                        className="text-sakina-700 font-bold hover:underline"
                    >
                        ⚡ تعبئة حساب د. أحمد التجريبي
                    </button>
                    <Link href={route('home')} className="text-gray-500 hover:text-sakina-800">
                        العودة للمنصة ←
                    </Link>
                </div>
            </div>
        </div>
    );
}
