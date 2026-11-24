import { Head, Link, useForm } from '@inertiajs/react';
import SakinaLogo from '@/Components/SakinaLogo';

export default function AdminLogin() {
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
        <div className="min-h-screen bg-slate-900 flex flex-col justify-center items-center px-4" dir="rtl">
            <Head title="بوابة الإدارة - منصة سكينة" />

            <div className="w-full max-w-md bg-white rounded-3xl p-8 shadow-2xl space-y-6">
                <div className="text-center space-y-2">
                    <div className="flex justify-center">
                        <SakinaLogo />
                    </div>
                    <span className="inline-block px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-extrabold">
                        ⚙️ بوابة الإدارة المركزية (/Admin)
                    </span>
                    <h1 className="text-xl font-extrabold text-slate-800 pt-1">
                        تسجيل دخول المشرف العام
                    </h1>
                </div>

                <form onSubmit={submit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">
                            البريد الإداري
                        </label>
                        <input
                            type="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            placeholder="admin@sakina.com"
                            className="w-full rounded-xl border-slate-300 text-sm py-3 focus:border-emerald-600 focus:ring-emerald-600"
                            required
                        />
                        {errors.email && <p className="text-xs text-rose-600 mt-1">{errors.email}</p>}
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">
                            كلمة المرور
                        </label>
                        <input
                            type="password"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            placeholder="••••••••"
                            className="w-full rounded-xl border-slate-300 text-sm py-3 focus:border-emerald-600 focus:ring-emerald-600"
                            required
                        />
                        {errors.password && <p className="text-xs text-rose-600 mt-1">{errors.password}</p>}
                    </div>

                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full py-3.5 rounded-xl bg-slate-900 text-white font-bold text-sm hover:bg-slate-800 transition"
                    >
                        {processing ? 'جاري التحقق...' : 'دخول لوحة الإدارة'}
                    </button>
                </form>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                    <button
                        type="button"
                        onClick={() => setData({ ...data, email: 'admin@sakina.com', password: 'password' })}
                        className="text-emerald-700 font-bold hover:underline"
                    >
                        ⚡ تعبئة بيانات الإدارة التجريبية
                    </button>
                    <Link href={route('home')} className="text-slate-500 hover:text-slate-800">
                        العودة للمنصة ←
                    </Link>
                </div>
            </div>
        </div>
    );
}
