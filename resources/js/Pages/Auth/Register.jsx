import { Head, Link, useForm } from '@inertiajs/react';
import SakinaLayout from '@/Layouts/SakinaLayout';
import SakinaLogo from '@/Components/SakinaLogo';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        phone: '',
        role: 'beneficiary',
        specialty: '',
        password: '',
        password_confirmation: '',
        agree: true,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <SakinaLayout>
            <Head title="إنشاء حساب جديد - منصة سكينة" />

            <div className="max-w-5xl mx-auto px-4 py-10 sm:py-12">
                <div className="bg-white rounded-3xl shadow-xl shadow-sakina-900/5 border border-cream-200 overflow-hidden grid grid-cols-1 md:grid-cols-12">
                    {/* Form Side */}
                    <div className="md:col-span-7 p-6 sm:p-10">
                        {/* Tabs */}
                        <div className="flex gap-2 p-1 bg-cream-100 rounded-2xl mb-6">
                            <Link
                                href={route('login')}
                                className="flex-1 py-2.5 text-center rounded-xl text-gray-600 font-bold text-sm hover:text-sakina-700 transition"
                            >
                                تسجيل دخول
                            </Link>
                            <span className="flex-1 py-2.5 text-center rounded-xl bg-sakina-700 text-white font-bold text-sm">
                                حساب جديد
                            </span>
                        </div>

                        <div className="mb-5">
                            <h1 className="text-2xl font-extrabold text-sakina-800">
                                إنشاء حساب جديد
                            </h1>
                            <p className="text-sm text-gray-500 mt-1">
                                أنشئ حسابك للبدء في رحلتك نحو راحة البال
                            </p>
                        </div>

                        <form onSubmit={submit} className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">
                                        الاسم الكامل
                                    </label>
                                    <input
                                        type="text"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        placeholder="أدخل اسمك الكامل"
                                        className="w-full rounded-xl border-cream-300 bg-cream-50/50 focus:border-sakina-500 focus:ring-sakina-500 text-sm py-2.5"
                                        required
                                    />
                                    {errors.name && <p className="text-xs text-red-600 mt-1">{errors.name}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">
                                        رقم الجوال (اختياري)
                                    </label>
                                    <input
                                        type="text"
                                        value={data.phone}
                                        onChange={(e) => setData('phone', e.target.value)}
                                        placeholder="77xxxxxxx"
                                        className="w-full rounded-xl border-cream-300 bg-cream-50/50 focus:border-sakina-500 focus:ring-sakina-500 text-sm py-2.5"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">
                                    البريد الإلكتروني
                                </label>
                                <input
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    placeholder="example@email.com"
                                    className="w-full rounded-xl border-cream-300 bg-cream-50/50 focus:border-sakina-500 focus:ring-sakina-500 text-sm py-2.5"
                                    required
                                />
                                {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">
                                    نوع المستخدم
                                </label>
                                <select
                                    value={data.role}
                                    onChange={(e) => setData('role', e.target.value)}
                                    className="w-full rounded-xl border-cream-300 bg-cream-50/50 focus:border-sakina-500 focus:ring-sakina-500 text-sm py-2.5 font-semibold"
                                >
                                    <option value="beneficiary">مستفيد (باحث عن الدعم والتقييم)</option>
                                    <option value="specialist">مستشار نفسي (لتقديم الدعم والمقالات)</option>
                                </select>
                            </div>

                            {data.role === 'specialist' && (
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">
                                        التخصص النفسي
                                    </label>
                                    <input
                                        type="text"
                                        value={data.specialty}
                                        onChange={(e) => setData('specialty', e.target.value)}
                                        placeholder="مثال: استشاري القلق والاكتئاب"
                                        className="w-full rounded-xl border-cream-300 bg-cream-50/50 focus:border-sakina-500 focus:ring-sakina-500 text-sm py-2.5"
                                    />
                                </div>
                            )}

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">
                                        كلمة المرور
                                    </label>
                                    <input
                                        type="password"
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                        placeholder="••••••••"
                                        className="w-full rounded-xl border-cream-300 bg-cream-50/50 focus:border-sakina-500 focus:ring-sakina-500 text-sm py-2.5"
                                        required
                                    />
                                    {errors.password && <p className="text-xs text-red-600 mt-1">{errors.password}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">
                                        تأكيد كلمة المرور
                                    </label>
                                    <input
                                        type="password"
                                        value={data.password_confirmation}
                                        onChange={(e) => setData('password_confirmation', e.target.value)}
                                        placeholder="أعد كتابة كلمة المرور"
                                        className="w-full rounded-xl border-cream-300 bg-cream-50/50 focus:border-sakina-500 focus:ring-sakina-500 text-sm py-2.5"
                                        required
                                    />
                                </div>
                            </div>

                            <label className="flex items-center gap-2 text-xs text-gray-600 cursor-pointer pt-1">
                                <input
                                    type="checkbox"
                                    checked={data.agree}
                                    onChange={(e) => setData('agree', e.target.checked)}
                                    required
                                    className="rounded border-gray-300 text-sakina-600 focus:ring-sakina-500"
                                />
                                <span>أوافق على سياسة الخصوصية والسرية التامة لمنصة سكينة</span>
                            </label>

                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full py-3.5 rounded-xl bg-sakina-600 text-white font-bold text-base hover:bg-sakina-700 transition shadow-sm disabled:opacity-50"
                            >
                                {processing ? 'جاري الإنشاء...' : 'دخول آمن وإنشاء الحساب'}
                            </button>
                        </form>

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
                                    انضم الآن واحتفظ بسجل تقييماتك النفسية لمتابعة تطور صحتك النفسية بأمان.
                                </p>
                            </div>
                            <div className="text-xs text-sakina-100">
                                بيئة رقمية دافئة وآمنة
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </SakinaLayout>
    );
}
