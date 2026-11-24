import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';
import SakinaLogo from '@/Components/SakinaLogo';

export default function SakinaLayout({ children }) {
    const { auth, flash } = usePage().props;
    const user = auth?.user;
    const [mobileOpen, setMobileOpen] = useState(false);

    const dashboardRoute =
        user?.role === 'admin'
            ? route('admin.dashboard')
            : user?.role === 'specialist'
            ? route('specialist.dashboard')
            : route('user.profile');

    const dashboardLabel =
        user?.role === 'admin'
            ? '⚙️ لوحة الإدارة'
            : user?.role === 'specialist'
            ? '🩺 لوحة المستشار'
            : '👤 ملفي الشخصي';

    return (
        <div className="min-h-screen flex flex-col bg-cream-50 text-gray-800" dir="rtl">
            {/* Header */}
            <header className="sticky top-0 z-40 bg-cream-50/90 backdrop-blur-md border-b border-cream-200 print:hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <Link href={route('home')} className="hover:opacity-90 transition">
                        <SakinaLogo />
                    </Link>

                    {/* Desktop Nav */}
                    <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-gray-700">
                        <Link
                            href={route('home')}
                            className="hover:text-sakina-600 transition py-1"
                        >
                            الرئيسية
                        </Link>
                        <Link
                            href={route('assessment.index')}
                            className="hover:text-sakina-600 transition py-1"
                        >
                            الاختبار النفسي
                        </Link>
                        <Link
                            href={route('specialists.directory')}
                            className="hover:text-sakina-600 transition py-1"
                        >
                            دليل المستشارين
                        </Link>
                        <Link
                            href={route('articles.index')}
                            className="hover:text-sakina-600 transition py-1"
                        >
                            المقالات التوعوية
                        </Link>
                    </nav>

                    {/* Auth Actions */}
                    <div className="hidden md:flex items-center gap-3">
                        {user ? (
                            <>
                                <Link
                                    href={dashboardRoute}
                                    className="px-4 py-2 rounded-xl bg-sakina-50 text-sakina-700 border border-sakina-200 text-sm font-bold hover:bg-sakina-100 transition"
                                >
                                    {dashboardLabel}
                                </Link>
                                <Link
                                    href={route('logout')}
                                    method="post"
                                    as="button"
                                    className="px-3 py-2 rounded-xl text-sm font-semibold text-gray-500 hover:text-red-600 hover:bg-red-50 transition"
                                >
                                    خروج
                                </Link>
                            </>
                        ) : (
                            <>
                                <Link
                                    href={route('login')}
                                    className="px-4 py-2 rounded-xl text-sm font-bold text-sakina-700 hover:bg-sakina-50 transition"
                                >
                                    تسجيل الدخول
                                </Link>
                                <Link
                                    href={route('register')}
                                    className="px-4 py-2 rounded-xl bg-sakina-700 text-white text-sm font-bold hover:bg-sakina-600 shadow-sm transition"
                                >
                                    حساب جديد
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Toggle */}
                    <button
                        onClick={() => setMobileOpen(!mobileOpen)}
                        className="md:hidden p-2 rounded-lg text-sakina-700 hover:bg-sakina-50"
                        aria-label="القائمة"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            {mobileOpen ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            )}
                        </svg>
                    </button>
                </div>

                {/* Mobile Menu */}
                {mobileOpen && (
                    <div className="md:hidden bg-white border-b border-cream-200 px-4 py-4 space-y-2">
                        <Link href={route('home')} className="block py-2 font-semibold text-gray-700">
                            الرئيسية
                        </Link>
                        <Link href={route('assessment.index')} className="block py-2 font-semibold text-gray-700">
                            الاختبار النفسي
                        </Link>
                        <Link href={route('specialists.directory')} className="block py-2 font-semibold text-gray-700">
                            دليل المستشارين
                        </Link>
                        <Link href={route('articles.index')} className="block py-2 font-semibold text-gray-700">
                            المقالات التوعوية
                        </Link>
                        <div className="pt-2 border-t border-cream-200 flex gap-2">
                            {user ? (
                                <>
                                    <Link
                                        href={dashboardRoute}
                                        className="flex-1 text-center py-2 rounded-xl bg-sakina-600 text-white text-sm font-bold"
                                    >
                                        {dashboardLabel}
                                    </Link>
                                    <Link
                                        href={route('logout')}
                                        method="post"
                                        as="button"
                                        className="px-4 py-2 rounded-xl bg-red-50 text-red-600 text-sm font-bold"
                                    >
                                        خروج
                                    </Link>
                                </>
                            ) : (
                                <>
                                    <Link
                                        href={route('login')}
                                        className="flex-1 text-center py-2 rounded-xl border border-sakina-600 text-sakina-700 text-sm font-bold"
                                    >
                                        تسجيل الدخول
                                    </Link>
                                    <Link
                                        href={route('register')}
                                        className="flex-1 text-center py-2 rounded-xl bg-sakina-700 text-white text-sm font-bold"
                                    >
                                        حساب جديد
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </header>

            {/* Flash Messages */}
            {(flash?.success || flash?.error) && (
                <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 mt-4">
                    {flash.success && (
                        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-semibold flex items-center gap-2">
                            <span>✅</span>
                            <span>{flash.success}</span>
                        </div>
                    )}
                    {flash.error && (
                        <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-800 text-sm font-semibold flex items-center gap-2">
                            <span>⚠️</span>
                            <span>{flash.error}</span>
                        </div>
                    )}
                </div>
            )}

            {/* Main Content */}
            <main className="flex-1">{children}</main>

            {/* Footer */}
            <footer className="bg-sakina-800 text-sakina-100 mt-16 print:hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                        <SakinaLogo light />
                        <div className="flex flex-wrap justify-center gap-6 text-sm text-sakina-200">
                            <Link href={route('home')} className="hover:text-white transition">
                                الرئيسية
                            </Link>
                            <Link href={route('assessment.index')} className="hover:text-white transition">
                                مقياس التقييم الأولي
                            </Link>
                            <Link href={route('specialists.directory')} className="hover:text-white transition">
                                دليل المستشارين
                            </Link>
                            <Link href={route('articles.index')} className="hover:text-white transition">
                                المقالات التوعوية
                            </Link>
                            <Link href={route('specialist.login')} className="hover:text-white transition text-sakina-300">
                                بوابة المختصين
                            </Link>
                            <Link href={route('admin.login')} className="hover:text-white transition text-sakina-300">
                                بوابة الإدارة
                            </Link>
                        </div>
                        <div className="text-xs bg-sakina-700/70 px-4 py-2 rounded-full border border-sakina-600 flex items-center gap-2">
                            <span>🔒</span>
                            <span>تقييم أولي غير تشخيصي • سرية تامة 100%</span>
                        </div>
                    </div>
                    <div className="border-t border-sakina-700 mt-8 pt-6 text-center text-xs text-sakina-300">
                        جميع الحقوق محفوظة © منصة سكينة للدعم والاستشارات النفسية 2026
                    </div>
                </div>
            </footer>
        </div>
    );
}
