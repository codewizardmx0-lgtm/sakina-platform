import { Head, Link, useForm } from '@inertiajs/react';
import SakinaLayout from '@/Layouts/SakinaLayout';
import SakinaLogo from '@/Components/SakinaLogo';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    const fillDemo = (email) => {
        setData({
            ...data,
            email,
            password: 'password',
        });
    };

    return (
        <SakinaLayout>
            <Head title="تسجيل الدخول - منصة سكينة" />

            <div className="max-w-5xl mx-auto px-4 py-10 sm:py-14">
                <div className="bg-white rounded-3xl shadow-xl shadow-sakina-900/5 border border-cream-200 overflow-hidden grid grid-cols-1 md:grid-cols-12">
                    {/* Form Side */}
                    <div className="md:col-span-7 p-6 sm:p-10">
                        {/* Tabs */}
                        <div className="flex gap-2 p-1 bg-cream-100 rounded-2xl mb-6">
                            <span className="flex-1 py-2.5 text-center rounded-xl bg-sakina-700 text-white font-bold text-sm">
                                تسجيل دخول
                            </span>
                            <Link
                                href={route('register')}
                                className="flex-1 py-2.5 text-center rounded-xl text-gray-600 font-bold text-sm hover:text-sakina-700 transition"
                            >
                                حساب جديد
                            </Link>
                        </div>

                        <div className="mb-6">
                            <h1 className="text-2xl font-extrabold text-sakina-800">
                                أهلاً بعودتك إلى سكينة
                            </h1>
                            <p className="text-sm text-gray-500 mt-1">
                                سجل دخولك لمتابعة تقييماتك النفسية أو لوحتك الخاصة
                            </p>
                        </div>

                        {status && (
                            <div className="mb-4 p-3 rounded-xl bg-emerald-50 text-emerald-700 text-sm font-semibold">
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

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1.5">
                                    كلمة المرور
                                </label>
                                <input
                                    type="password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full rounded-xl border-cream-300 bg-cream-50/50 focus:border-sakina-500 focus:ring-sakina-500 text-sm py-3"
                                    required
                                />
                                {errors.password && (
                                    <p className="text-xs text-red-600 mt-1">{errors.password}</p>
                                )}
                            </div>

                            <div className="flex items-center justify-between text-sm">
                                <label className="flex items-center gap-2 text-gray-600 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={data.remember}
                                        onChange={(e) => setData('remember', e.target.checked)}
                                        className="rounded border-gray-300 text-sakina-600 focus:ring-sakina-500"
                                    />
                                    <span>تذكرني</span>
                                </label>
                                {canResetPassword && (
                                    <Link
                                        href={route('password.request')}
                                        className="text-sakina-600 font-semibold hover:underline"
                                    >
                                        نسيت كلمة المرور؟
                                    </Link>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full py-3.5 rounded-xl bg-sakina-600 text-white font-bold text-base hover:bg-sakina-700 transition shadow-sm disabled:opacity-50"
                            >
                                {processing ? 'جاري الدخول...' : 'دخول آمن'}
                            </button>
                        </form>

                        {/* Quick Demo Accounts for Testing */}
                        <div className="mt-6 pt-5 border-t border-cream-200">
                            <p className="text-xs font-bold text-gray-500 mb-2">
                                ⚡ حسابات تجريبية سريعة (للعرض والاختبار):
                            </p>
                            <div className="flex flex-wrap gap-2">
                                <button
                                    type="button"
                                    onClick={() => fillDemo('user@sakina.com')}
                                    className="px-3 py-1.5 rounded-lg bg-sakina-50 text-sakina-700 text-xs font-bold hover:bg-sakina-100"
                                >
                                    👤 مستفيد
                                </button>
                                <button
                                    type="button"
                                    onClick={() => fillDemo('ahmad@sakina.com')}
                                    className="px-3 py-1.5 rounded-lg bg-amber-50 text-amber-800 text-xs font-bold hover:bg-amber-100"
                                >
                                    🩺 مستشار نفسي
                                </button>
                                <button
                                    type="button"
                                    onClick={() => fillDemo('admin@sakina.com')}
                                    className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-800 text-xs font-bold hover:bg-slate-200"
                                >
                                    ⚙️ الإدارة (/Admin)
                                </button>
                            </div>
                        </div>

                        {/* Security Note */}
                        <div className="mt-5 p-3 rounded-xl bg-sakina-50 border border-sakina-100 flex items-center gap-2.5 text-xs text-sakina-800 font-semibold">
                            <span>🛡️</span>
                            <span>بياناتك مشفرة ولا تظهر للمختصين إلا بإذنك</span>
                        </div>
                    </div>

                    {/* Right Calming Visual Side */}
                    <div className="md:col-span-5 relative overflow-hidden bg-sakina-700 text-white p-8 flex flex-col justify-between items-center text-center">
                        <img
                            src="/images/auth-calm.jpg"
                            alt="سكينة"
                            className="absolute inset-0 w-full h-full object-cover opacity-35"
                        />
                        <div className="relative z-10 flex flex-col justify-between items-center h-full">
                            <SakinaLogo light />
                            <div className="my-8 space-y-4">
                                <div className="w-32 h-32 mx-auto rounded-full overflow-hidden border-2 border-white/50 shadow-lg">
                                    <img
                                        src="/images/auth-calm.jpg"
                                        alt="الهدوء النفسي"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <h2 className="text-2xl font-extrabold leading-relaxed drop-shadow-sm">
                                    &ldquo;هنا... يمكنك أن تكون على طبيعتك&rdquo;
                                </h2>
                                <p className="text-sm text-sakina-50 leading-relaxed">
                                    خطوتك الأولى نحو الهدوء تبدأ في مساحة تحترم خصوصيتك ومشاعرك دون أي أحكام.
                                </p>
                            </div>
                            <div className="text-xs text-sakina-100">
                                سرية تامة • دعم أولي موثوق
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </SakinaLayout>
    );
}
