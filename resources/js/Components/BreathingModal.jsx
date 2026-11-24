import { useEffect, useState } from 'react';

const PHASES = [
    { label: 'شهيق عميق عبر الأنف...', seconds: 4, scale: 'scale-125 bg-sakina-500/30' },
    { label: 'احبس أنفاسك بهدوء...', seconds: 7, scale: 'scale-125 bg-sakina-600/40' },
    { label: 'زفير بطيء ومريح...', seconds: 8, scale: 'scale-95 bg-sakina-300/30' },
];

export default function BreathingModal({ isOpen, onClose }) {
    const [running, setRunning] = useState(false);
    const [phaseIdx, setPhaseIdx] = useState(0);
    const [secondsLeft, setSecondsLeft] = useState(PHASES[0].seconds);

    useEffect(() => {
        if (!isOpen) {
            setRunning(false);
            setPhaseIdx(0);
            setSecondsLeft(PHASES[0].seconds);
            return;
        }
    }, [isOpen]);

    useEffect(() => {
        if (!running) return;
        const timer = setInterval(() => {
            setSecondsLeft((prev) => {
                if (prev > 1) return prev - 1;
                const nextPhase = (phaseIdx + 1) % PHASES.length;
                setPhaseIdx(nextPhase);
                return PHASES[nextPhase].seconds;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [running, phaseIdx]);

    if (!isOpen) return null;

    const current = PHASES[phaseIdx];

    return (
        <div
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={onClose}
        >
            <div
                className="bg-cream-50 rounded-3xl max-w-md w-full p-8 shadow-2xl border border-cream-200 text-center space-y-6"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-center">
                    <h3 className="text-lg font-extrabold text-sakina-800">🌬️ تمرين التنفس الهادئ (4-7-8)</h3>
                    <button onClick={onClose} className="p-1.5 rounded-full bg-white text-gray-500 hover:bg-gray-100">
                        ✕
                    </button>
                </div>

                <p className="text-xs text-gray-600">
                    خذ دقيقة واحدة لتهدئة نبضات قلبك وتخفيف التوتر اللحظي
                </p>

                <div className="py-8 flex flex-col items-center justify-center">
                    <div
                        className={`w-40 h-40 rounded-full flex items-center justify-center transition-all duration-1000 border-4 border-sakina-400/50 ${
                            running ? current.scale : 'scale-100 bg-sakina-100/60'
                        }`}
                    >
                        <div>
                            <div className="text-4xl font-extrabold text-sakina-800">
                                {running ? secondsLeft : '4-7-8'}
                            </div>
                            <div className="text-xs font-bold text-sakina-700 mt-1">
                                {running ? 'ثانية' : 'جاهز للبدء'}
                            </div>
                        </div>
                    </div>

                    <p className="mt-6 text-base font-extrabold text-sakina-800 min-h-[24px]">
                        {running ? current.label : 'اضغط ابدأ واتبع حركة الدائرة'}
                    </p>
                </div>

                <div className="flex gap-3 justify-center">
                    <button
                        onClick={() => setRunning(!running)}
                        className="px-8 py-3 rounded-2xl bg-sakina-700 text-white font-bold text-sm hover:bg-sakina-600 transition shadow-sm"
                    >
                        {running ? '⏸️ إيقاف مؤقت' : '▶️ ابدأ التمرين'}
                    </button>
                </div>
            </div>
        </div>
    );
}
