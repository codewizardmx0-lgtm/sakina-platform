export default function SakinaLogo({ className = 'h-10 w-10', showText = true, light = false }) {
    return (
        <div className="inline-flex items-center gap-2.5 select-none">
            <div
                className={`${className} rounded-full flex items-center justify-center shadow-sm ${
                    light
                        ? 'bg-white/20 text-white border border-white/30'
                        : 'bg-sakina-600 text-white'
                }`}
            >
                <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    className="w-6 h-6"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <path d="M12 21c-4.5-3-7-7-7-11.5C5 5.9 8.1 3 12 3s7 2.9 7 6.5C19 14 16.5 18 12 21z" />
                    <path d="M12 7v14" />
                    <path d="M12 13l3.5-2.5" />
                    <path d="M12 16l-3.5-2.5" />
                </svg>
            </div>
            {showText && (
                <div className="leading-tight">
                    <span
                        className={`block text-xl font-extrabold tracking-tight ${
                            light ? 'text-white' : 'text-sakina-700'
                        }`}
                    >
                        سكينة
                    </span>
                    <span
                        className={`block text-[11px] font-medium tracking-wider uppercase ${
                            light ? 'text-sakina-100' : 'text-sakina-500'
                        }`}
                    >
                        Sakina
                    </span>
                </div>
            )}
        </div>
    );
}
