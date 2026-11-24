import { Head } from '@inertiajs/react';
import { useState } from 'react';
import SakinaLayout from '@/Layouts/SakinaLayout';

export default function ArticlesIndex({ articles = [] }) {
    const [selectedArticle, setSelectedArticle] = useState(null);
    const [activeCategory, setActiveCategory] = useState('الكل');

    const categories = ['الكل', ...new Set(articles.map((a) => a.category))];
    const filtered =
        activeCategory === 'الكل'
            ? articles
            : articles.filter((a) => a.category === activeCategory);

    return (
        <SakinaLayout>
            <Head title="المقالات التوعوية - منصة سكينة" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="text-center max-w-2xl mx-auto mb-8">
                    <h1 className="text-3xl font-extrabold text-sakina-800">
                        📖 مكتبة المقالات التوعوية
                    </h1>
                    <p className="text-gray-600 mt-2 text-sm sm:text-base">
                        مقالات علمية مبسطة كتبها مستشارو منصة سكينة لمساعدتك على الهدوء النفسي والتوازن
                    </p>
                </div>

                {/* Category Filter */}
                <div className="flex flex-wrap justify-center gap-2 mb-8">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`px-4 py-2 rounded-full text-xs sm:text-sm font-bold transition ${
                                activeCategory === cat
                                    ? 'bg-sakina-700 text-white'
                                    : 'bg-white text-gray-600 border border-cream-200 hover:bg-sakina-50'
                            }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filtered.map((article) => (
                        <div
                            key={article.id}
                            onClick={() => setSelectedArticle(article)}
                            className="cursor-pointer bg-white rounded-2xl p-6 border border-cream-200 shadow-sm hover:shadow-md hover:border-sakina-300 transition flex flex-col justify-between"
                        >
                            <div>
                                <div className="flex items-center justify-between text-xs mb-3">
                                    <span className="px-3 py-1 rounded-full bg-sakina-50 text-sakina-700 font-bold">
                                        {article.category}
                                    </span>
                                    <span className="text-gray-400">{article.reading_time} دقائق قراءة</span>
                                </div>
                                <h2 className="text-lg font-bold text-sakina-800 mb-2">
                                    {article.title}
                                </h2>
                                <p className="text-sm text-gray-600 leading-relaxed">
                                    {article.summary}
                                </p>
                            </div>
                            <div className="mt-5 pt-3 border-t border-cream-100 flex items-center justify-between text-xs">
                                <span className="text-gray-500 font-medium">{article.author?.name}</span>
                                <span className="font-bold text-sakina-600">قراءة المقال ←</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {selectedArticle && (
                <div
                    className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
                    onClick={() => setSelectedArticle(null)}
                >
                    <div
                        className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 max-h-[85vh] overflow-y-auto shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-start justify-between gap-4 mb-4">
                            <div>
                                <span className="px-3 py-1 rounded-full bg-sakina-50 text-sakina-700 text-xs font-bold">
                                    {selectedArticle.category}
                                </span>
                                <h3 className="text-xl sm:text-2xl font-extrabold text-sakina-800 mt-3">
                                    {selectedArticle.title}
                                </h3>
                                <p className="text-xs text-gray-500 mt-1">
                                    بقلم: {selectedArticle.author?.name} • {selectedArticle.reading_time} دقائق
                                </p>
                            </div>
                            <button
                                onClick={() => setSelectedArticle(null)}
                                className="p-2 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="text-gray-700 leading-loose whitespace-pre-line border-t border-cream-200 pt-4 text-sm sm:text-base">
                            {selectedArticle.content}
                        </div>
                    </div>
                </div>
            )}
        </SakinaLayout>
    );
}
