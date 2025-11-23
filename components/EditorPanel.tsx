
import React from 'react';
import type { Article, Source } from '../types';
import { DownloadIcon, PlusIcon, SparklesIcon, Trash2Icon, ShuffleIcon, FileTextIcon, UploadIcon } from './icons';

interface EditorPanelProps {
    magazineTitle: string;
    setMagazineTitle: (value: string) => void;
    issueDate: string;
    setIssueDate: (value: string) => void;
    mainTheme: string;
    setSetMainTheme: (value: string) => void;
    coverPrompt: string;
    setCoverPrompt: (value: string) => void;
    articles: Article[];
    onAddArticle: () => void;
    onRemoveArticle: (id: string) => void;
    onUpdateArticle: <K extends keyof Article>(id: string, field: K, value: Article[K]) => void;
    onShuffleLayout: (id: string) => void;
    onGenerateImage: (id: string, prompt: string) => void;
    loadingStates: Record<string, boolean>;
    onPrint: () => void;
    sources: Source[];
    onAddSource: () => void;
    onRemoveSource: (id: string) => void;
    onUpdateSource: (id: string, content: string) => void;
    generatingArticleStates: Record<string, boolean>;
    onGenerateArticleFromSource: (sourceId: string, sourceContent: string) => void;
    onFileUpload: (file: File) => void;
    isExtractingText: boolean;
}

const InputField: React.FC<{ label: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }> = ({ label, value, onChange }) => (
    <div>
        <label className="text-sm font-medium text-gray-400">{label}</label>
        <input
            type="text"
            value={value}
            onChange={onChange}
            className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
    </div>
);

const TextAreaField: React.FC<{ label: string; value: string; onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void; rows?: number }> = ({ label, value, onChange, rows = 3 }) => (
    <div>
        <label className="text-sm font-medium text-gray-400">{label}</label>
        <textarea
            value={value}
            onChange={onChange}
            rows={rows}
            className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
    </div>
);

const ActionButton: React.FC<{ onClick: () => void; loading: boolean; text: string; icon: React.ReactNode; className?: string; }> = ({ onClick, loading, text, icon, className = '' }) => (
    <button
        type="button"
        onClick={onClick}
        disabled={loading}
        className={`flex items-center justify-center gap-2 px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 disabled:cursor-not-allowed transition-colors ${className}`}
    >
        {loading ? (
            <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generating...
            </>
        ) : (
            <>
                {icon}
                {text}
            </>
        )}
    </button>
);


export const EditorPanel: React.FC<EditorPanelProps> = ({
    magazineTitle, setMagazineTitle, issueDate, setIssueDate, mainTheme, setSetMainTheme,
    coverPrompt, setCoverPrompt, articles, onAddArticle, onRemoveArticle, onUpdateArticle,
    onShuffleLayout, onGenerateImage, loadingStates, onPrint, sources, onAddSource,
    onRemoveSource, onUpdateSource, generatingArticleStates, onGenerateArticleFromSource,
    onFileUpload, isExtractingText
}) => {
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            onFileUpload(file);
            event.target.value = ''; // Reset file input to allow re-uploading the same file
        }
    };

    return (
        <div className="w-full md:w-1/3 h-full overflow-y-auto bg-gray-800 p-6 space-y-8 editor-panel">
            <header className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-white">MagazineMaestro</h1>
                    <p className="text-sm text-gray-400">Your AI-powered magazine creator.</p>
                </div>
                <button
                    onClick={onPrint}
                    className="flex items-center gap-2 px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                    <DownloadIcon className="h-5 w-5" />
                    Download PDF
                </button>
            </header>

            <div className="space-y-4 p-4 bg-gray-900/50 rounded-lg">
                <h2 className="text-lg font-semibold border-b border-gray-700 pb-2">Magazine Settings</h2>
                <InputField label="Magazine Title" value={magazineTitle} onChange={(e) => setMagazineTitle(e.target.value)} />
                <InputField label="Issue Date" value={issueDate} onChange={(e) => setIssueDate(e.target.value)} />
                <InputField label="Main Theme" value={mainTheme} onChange={(e) => setSetMainTheme(e.target.value)} />
            </div>
            
            <div className="space-y-4 p-4 bg-gray-900/50 rounded-lg">
                <h2 className="text-lg font-semibold border-b border-gray-700 pb-2">Cover Art</h2>
                <TextAreaField label="Cover Illustration Prompt" value={coverPrompt} onChange={(e) => setCoverPrompt(e.target.value)} />
                <ActionButton onClick={() => onGenerateImage('cover', coverPrompt)} loading={loadingStates['cover']} text="Generate Art" icon={<SparklesIcon className="h-5 w-5" />} className="w-full" />
            </div>

            <div className="space-y-4 p-4 bg-gray-900/50 rounded-lg">
                <h2 className="text-lg font-semibold border-b border-gray-700 pb-2 flex items-center gap-2">
                    <FileTextIcon className="h-5 w-5" />
                    Sources for Articles
                </h2>
                <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                    {sources.map((source, index) => (
                        <div key={source.id} className="p-4 bg-gray-800/70 rounded-lg space-y-3 relative">
                             <div className="flex justify-between items-center">
                                <h3 className="text-sm font-medium text-gray-300 truncate pr-8" title={source.fileName}>
                                    {source.fileName || `Text Source ${index + 1}`}
                                </h3>
                                <button onClick={() => onRemoveSource(source.id)} className="absolute top-3 right-3 p-1 text-red-400 hover:text-red-200 rounded-md transition-colors" title="Remove Source">
                                    <Trash2Icon className="h-4 w-4" />
                                </button>
                            </div>
                            <TextAreaField
                                label="Source Content"
                                value={source.content}
                                onChange={(e) => onUpdateSource(source.id, e.target.value)}
                                rows={6}
                            />
                            <ActionButton
                                onClick={() => onGenerateArticleFromSource(source.id, source.content)}
                                loading={!!generatingArticleStates[source.id]}
                                text="Generate Article"
                                icon={<SparklesIcon className="h-5 w-5" />}
                                className="w-full"
                            />
                        </div>
                    ))}
                    {sources.length === 0 && (
                        <p className="text-sm text-gray-500 text-center py-4">No sources added yet. Add one below.</p>
                    )}
                </div>
                <div className="flex gap-2 pt-4 border-t border-gray-700">
                     <button
                        onClick={onAddSource}
                        className="flex-1 cursor-pointer flex items-center justify-center gap-2 px-4 py-2 border border-gray-600 text-sm font-medium rounded-md shadow-sm text-white bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                    >
                        <PlusIcon className="h-5 w-5" />
                        Add Text
                    </button>
                    <label htmlFor="file-upload" className={`flex-1 cursor-pointer flex items-center justify-center gap-2 px-4 py-2 border border-gray-600 text-sm font-medium rounded-md shadow-sm text-white bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors ${isExtractingText ? 'opacity-50 cursor-not-allowed' : ''}`}>
                         {isExtractingText ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Extracting...
                            </>
                        ) : (
                            <>
                                <UploadIcon className="h-5 w-5" />
                                Upload File
                            </>
                        )}
                    </label>
                    <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept=".txt,.pdf,.docx" disabled={isExtractingText} />
                </div>
            </div>

            <div>
                <h2 className="text-lg font-semibold border-b border-gray-700 pb-2 mb-4">Articles</h2>
                <div className="space-y-6">
                    {articles.map((article, index) => (
                        <div key={article.id} className="p-4 bg-gray-900/50 rounded-lg space-y-4">
                             <div className="flex justify-between items-center">
                                <h3 className="text-md font-semibold text-indigo-300">Article {index + 1}</h3>
                                <div className="flex items-center gap-2">
                                     <button onClick={() => onShuffleLayout(article.id)} className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-md transition-colors" title="Shuffle Layout"><ShuffleIcon className="h-4 w-4" /></button>
                                    <button onClick={() => onRemoveArticle(article.id)} className="p-2 text-red-400 hover:text-red-200 hover:bg-gray-700 rounded-md transition-colors" title="Remove Article"><Trash2Icon className="h-4 w-4" /></button>
                                </div>
                            </div>
                            <InputField label="Headline" value={article.headline} onChange={(e) => onUpdateArticle(article.id, 'headline', e.target.value)} />
                            <InputField label="Author" value={article.author} onChange={(e) => onUpdateArticle(article.id, 'author', e.target.value)} />
                            <TextAreaField label="Body Text" value={article.body} onChange={(e) => onUpdateArticle(article.id, 'body', e.target.value)} rows={6} />
                            <TextAreaField label="Illustration Prompt" value={article.illustrationPrompt} onChange={(e) => onUpdateArticle(article.id, 'illustrationPrompt', e.target.value)} />
                            <ActionButton onClick={() => onGenerateImage(article.id, article.illustrationPrompt)} loading={loadingStates[article.id]} text="Generate Art" icon={<SparklesIcon className="h-5 w-5" />} className="w-full" />
                        </div>
                    ))}
                </div>
                 <button
                    onClick={onAddArticle}
                    className="mt-6 w-full flex items-center justify-center gap-2 px-4 py-2 border border-dashed border-gray-600 text-sm font-medium rounded-md text-gray-300 hover:bg-gray-700 hover:border-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    <PlusIcon className="h-5 w-5" />
                    Add New Article
                </button>
            </div>
        </div>
    );
};
