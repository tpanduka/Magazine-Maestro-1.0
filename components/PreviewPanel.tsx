
import React from 'react';
import type { Article } from '../types';
import { ArticleLayout } from '../types';

interface PreviewPanelProps {
    magazineTitle: string;
    issueDate: string;
    mainTheme: string;
    coverImage: string | null;
    articles: Article[];
}

export const PreviewPanel: React.FC<PreviewPanelProps> = ({
    magazineTitle, issueDate, mainTheme, coverImage, articles
}) => {
    return (
        <div className="w-full md:w-2/3 h-full overflow-y-auto bg-gray-200 printable-area">
            {/* Cover Page */}
            <div className="page bg-white text-black font-sans break-after-page">
                {coverImage && <img src={coverImage} alt="Magazine Cover" className="w-full h-full object-cover absolute" />}
                <div className="absolute inset-0 bg-black bg-opacity-30 flex flex-col justify-end p-20">
                    <h1 className="text-8xl font-black text-white leading-none tracking-tighter" style={{ textShadow: '2px 2px 8px rgba(0,0,0,0.7)' }}>
                        {magazineTitle}
                    </h1>
                    <p className="mt-4 text-2xl text-white font-semibold tracking-wider">{issueDate}</p>
                </div>
                 <div className="absolute top-20 left-20">
                     <p className="text-white text-lg font-bold bg-red-600 px-4 py-1 uppercase tracking-widest">{mainTheme}</p>
                </div>
            </div>

            {/* Table of Contents */}
            <div className="page bg-white text-black font-sans break-after-page">
                <div className="page-content">
                    <h2 className="text-5xl font-bold mb-12 border-b-4 border-black pb-4">Contents</h2>
                    <ul className="space-y-6">
                        {articles.map((article, index) => (
                            <li key={`toc-${article.id}`} className="flex justify-between items-baseline border-b border-dotted border-gray-400 pb-2">
                                <span className="text-xl font-serif pr-4">{article.headline}</span>
                                <span className="text-lg font-bold font-sans text-gray-500">{String(index + 3).padStart(2, '0')}</span>
                            </li>
                        ))}
                    </ul>
                </div>
                <footer style={{ position: 'absolute', bottom: '10mm', left: '20mm', right: '20mm' }} className="text-xs text-gray-500 font-sans flex justify-between">
                    <span>Published By: ICT Cafe</span>
                    <span>2</span>
                </footer>
            </div>

            {/* Article Pages */}
            {articles.map((article, index) => (
                <div key={article.id} className="page bg-white text-black font-serif break-after-page">
                    <div className="page-content flex flex-col gap-6">
                        <header>
                            <h2 className="text-4xl font-sans font-extrabold tracking-tight text-gray-800">{article.headline}</h2>
                            <p className="text-lg text-gray-500 mt-2 italic">By {article.author}</p>
                        </header>
                        {article.imageUrl && article.layout === ArticleLayout.IMAGE_TOP && (
                            <img src={article.imageUrl} alt={article.headline} className="w-full h-auto max-h-1/3 object-cover my-4" />
                        )}
                        <div className="columns-2 gap-x-8 text-justify text-gray-800">
                            {article.imageUrl && article.layout === ArticleLayout.IMAGE_MIDDLE && (
                               <img src={article.imageUrl} alt={article.headline} className="w-full h-auto mb-4 object-cover" />
                            )}
                            <p 
                              className="first-letter:text-7xl first-letter:font-bold first-letter:text-black first-letter:mr-3 first-letter:float-left" 
                              style={{ lineHeight: '1.75', fontSize: '1.05rem' }}
                            >
                                {article.body}
                            </p>
                        </div>
                    </div>
                    <footer style={{ position: 'absolute', bottom: '10mm', left: '20mm', right: '20mm' }} className="text-xs text-gray-500 font-sans flex justify-between">
                        <span>Published By: ICT Cafe</span>
                        <span>{index + 3}</span>
                    </footer>
                </div>
            ))}
        </div>
    );
};
