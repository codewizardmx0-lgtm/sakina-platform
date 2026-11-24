import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';
import SakinaLogo from '@/Components/SakinaLogo';

export default function SpecialistLayout({ children, activeTab, setActiveTab, navItems = [] }) {
    const { auth, flash } = usePage().props;
    const user = auth?.user;
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen flex bg-[#F4F7F6] text-gray-800" dir="rtl">
            {/* Specialist Sidebar */}
            <aside
                className={`fixed inset-y-0 right-0 z-40 w-64 bg-sakina-800 text-white flex flex-col justify-between transition-transform duration-200 lg:static lg:translate-x-0 ${
                    sidebarOpen ? 'translate-x-0' : 'translate-x-full'
                }`}
            >
                <div>
                    <div className="h-16 px-5 flex items-center justify-between border-b border-sakina-700">
                        <div className="flex items-center gap-2.5">
                            <SakinaLogo showText={false} light className="w-9 h-9" />
                            <div>
                                <div className="text-sm font-extrabold text-white">بوابة المختص</div>
                                <div className="text-[10px] text-sakina-200 font-bold tracking-wider">SPECIALIST PORTAL</div>
                            </div>
                        </div>
                        <button
                            onClick={() => setSidebarOpen(false)}
                            className="lg:hidden text-sakina-200 hover:text-white"
                        >
                            ✕
                        </button>
                    </div>

                    <nav className="p-4 space-y-1.5">
                        {navItems.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => {
                                    setActiveTab?.(item.id);
                                    setSidebarOpen(false);
                                }}
                                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold transition ${
                                    activeTab === item.id
                                        ? 'bg-white text-sakina-800 shadow-sm'
                                        : 'text-sakina-100 hover:bg-sakina-700'
                                }`}
                            >
                                <span>{item.label}</span>
                                {item.badge > 0 && (
                                    <span className="px-2 py-0.5 rounded-full bg-amber-400 text-sakina-900 text-[10px] font-extrabold">
                                        {item.badge}
                                    </span>
                                )}
                            </button>
                        ))}
                    </nav>
                </div>

                <div className="p-4 border-t border-sakina-700 space-y-2">
                    <Link
                        href={route('specialists.directory')}
                        className="block w-full py-2.5 px-3 rounded-xl bg-sakina-700 text-sakina-100 text-xs font-bold text-center hover:bg-sakina-600 transition"
                    >
                        🩺 عرضي في الدليل العام
                    </Link>
                    <Link
                        href={route('logout')}
                        method="post"
                        as="button"
                        className="block w-full py-2.5 px-3 rounded-xl bg-rose-500/20 text-rose-200 text-xs font-bold text-center hover:bg-rose-500/30 transition"
                    >
                        🚪 تسجيل الخروج
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0">
                <header className="h-16 bg-white border-b border-sakina-100 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="lg:hidden p-2 rounded-lg bg-sakina-50 text-sakina-800"
                        >
                            ☰
                        </button>
                        <span className="text-sm font-bold text-sakina-700">
                            عيادة ومكتب المستشار النفسي
                        </span>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="text-left hidden sm:block">
                            <div className="text-xs font-extrabold text-sakina-900">{user?.name}</div>
                            <div className="text-[11px] text-sakina-600 font-bold">مستشار نفسي</div>
                        </div>
                        <div className="w-9 h-9 rounded-xl bg-sakina-100 text-sakina-700 flex items-center justify-center text-base font-bold">
                            👨‍⚕️
                        </div>
                    </div>
                </header>

                {(flash?.success || flash?.error) && (
                    <div className="px-4 sm:px-8 pt-4">
                        {flash.success && (
                            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-semibold">
                                ✅ {flash.success}
                            </div>
                        )}
                        {flash.error && (
                            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm font-semibold">
                                ⚠️ {flash.error}
                            </div>
                        )}
                    </div>
                )}

                <main className="flex-1 p-4 sm:p-8">{children}</main>
            </div>
        </div>
    );
}
