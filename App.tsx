
import React, { useState, useCallback } from 'react';
import { EditorPanel } from './components/EditorPanel';
import { PreviewPanel } from './components/PreviewPanel';
import { generateMagazineImage, generateArticleFromSource, extractTextFromFile } from './services/geminiService';
import type { Article, Source } from './types';
import { ArticleLayout } from './types';
import { INITIAL_ARTICLE } from './constants';

const App: React.FC = () => {
    const [magazineTitle, setMagazineTitle] = useState('The Modern Times');
    const [issueDate, setIssueDate] = useState(new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long' }));
    const [mainTheme, setMainTheme] = useState('The Future of Technology');

    const [coverImage, setCoverImage] = useState<string | null>('https://picsum.photos/id/10/840/1188');
    const [coverPrompt, setCoverPrompt] = useState('An abstract geometric design representing the future of technology, minimalist style.');
    
    const [articles, setArticles] = useState<Article[]>([]);

    const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});
    const [sources, setSources] = useState<Source[]>([]);
    const [generatingArticleStates, setGeneratingArticleStates] = useState<Record<string, boolean>>({});
    const [isExtractingText, setIsExtractingText] = useState(false);


    const handleAddArticle = useCallback(() => {
        setArticles(prev => [...prev, { ...INITIAL_ARTICLE, id: `article-${Date.now()}` }]);
    }, []);

    const handleRemoveArticle = useCallback((id: string) => {
        setArticles(prev => prev.filter(article => article.id !== id));
    }, []);

    const handleUpdateArticle = useCallback(<K extends keyof Article>(id: string, field: K, value: Article[K]) => {
        setArticles(prev => prev.map(article => article.id === id ? { ...article, [field]: value } : article));
    }, []);

    const handleShuffleLayout = useCallback((id: string) => {
        setArticles(prev => prev.map(article => {
            if (article.id === id) {
                const newLayout = article.layout === ArticleLayout.IMAGE_TOP ? ArticleLayout.IMAGE_MIDDLE : ArticleLayout.IMAGE_TOP;
                return { ...article, layout: newLayout };
            }
            return article;
        }));
    }, []);

    const handleGenerateImage = useCallback(async (id: string, prompt: string) => {
        setLoadingStates(prev => ({ ...prev, [id]: true }));
        try {
            const imageUrl = await generateMagazineImage(prompt);
            if (id === 'cover') {
                setCoverImage(imageUrl);
            } else {
                handleUpdateArticle(id, 'imageUrl', imageUrl);
            }
        } catch (error) {
            console.error('Failed to generate image:', error);
            alert(`Error generating image: ${error instanceof Error ? error.message : String(error)}`);
        } finally {
            setLoadingStates(prev => ({ ...prev, [id]: false }));
        }
    }, [handleUpdateArticle]);

    const handleAddSource = useCallback(() => {
        setSources(prev => [...prev, { id: `source-${Date.now()}`, content: '' }]);
    }, []);

    const handleRemoveSource = useCallback((id: string) => {
        setSources(prev => prev.filter(source => source.id !== id));
    }, []);

    const handleUpdateSource = useCallback((id: string, content: string) => {
        setSources(prev => prev.map(source => source.id === id ? { ...source, content } : source));
    }, []);

    const handleGenerateArticleFromSource = async (sourceId: string, sourceContent: string) => {
        if (!sourceContent.trim()) {
            alert('Please provide some source content to generate an article.');
            return;
        }
        setGeneratingArticleStates(prev => ({ ...prev, [sourceId]: true }));
        try {
            // Step 1: Generate article text content
            const generatedContent = await generateArticleFromSource(sourceContent);
            
            // Step 2: Create the illustration prompt from the new headline
            const illustrationPrompt = `An interesting illustration that matches the headline: ${generatedContent.headline}`;
            
            // Step 3: Generate the illustration
            const imageUrl = await generateMagazineImage(illustrationPrompt);

            // Step 4: Create the new article with all generated content
            const newArticle: Article = {
                ...INITIAL_ARTICLE,
                ...generatedContent,
                id: `article-${Date.now()}`,
                illustrationPrompt,
                imageUrl,
            };
            
            setArticles(prev => [newArticle, ...prev]);
            handleRemoveSource(sourceId);
        } catch (error) {
            console.error('Failed to generate article and/or image:', error);
            alert(`Error generating article: ${error instanceof Error ? error.message : String(error)}`);
        } finally {
            setGeneratingArticleStates(prev => {
                const newStates = { ...prev };
                delete newStates[sourceId];
                return newStates;
            });
        }
    };
    
    const handleFileUpload = useCallback(async (file: File) => {
        const supportedDocTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
        
        if (file.type === 'text/plain') {
            const reader = new FileReader();
            reader.onload = (event) => {
                const text = event.target?.result;
                if (typeof text === 'string') {
                    setSources(prev => [...prev, {id: `source-${Date.now()}`, content: text, fileName: file.name}]);
                }
            };
            reader.onerror = (error) => {
                console.error("Error reading file:", error);
                alert("Failed to read the file.");
            };
            reader.readAsText(file);
        } else if (supportedDocTypes.includes(file.type)) {
            setIsExtractingText(true);
            try {
                const text = await extractTextFromFile(file);
                setSources(prev => [...prev, {id: `source-${Date.now()}`, content: text, fileName: file.name}]);
            } catch (error) {
                console.error("Error extracting text from file:", error);
                alert(`Failed to extract text from file: ${error instanceof Error ? error.message : String(error)}`);
            } finally {
                setIsExtractingText(false);
            }
        } else {
            alert('Unsupported file type. Please upload a .txt, .pdf, or .docx file.');
        }
    }, []);

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="flex flex-col md:flex-row h-screen bg-gray-900 text-white font-sans">
            <EditorPanel
                magazineTitle={magazineTitle}
                setMagazineTitle={setMagazineTitle}
                issueDate={issueDate}
                setIssueDate={setIssueDate}
                mainTheme={mainTheme}
                setSetMainTheme={setMainTheme}
                coverPrompt={coverPrompt}
                setCoverPrompt={setCoverPrompt}
                articles={articles}
                onAddArticle={handleAddArticle}
                onRemoveArticle={handleRemoveArticle}
                onUpdateArticle={handleUpdateArticle}
                onShuffleLayout={handleShuffleLayout}
                onGenerateImage={handleGenerateImage}
                loadingStates={loadingStates}
                onPrint={handlePrint}
                sources={sources}
                onAddSource={handleAddSource}
                onRemoveSource={handleRemoveSource}
                onUpdateSource={handleUpdateSource}
                generatingArticleStates={generatingArticleStates}
                onGenerateArticleFromSource={handleGenerateArticleFromSource}
                onFileUpload={handleFileUpload}
                isExtractingText={isExtractingText}
            />
            <PreviewPanel
                magazineTitle={magazineTitle}
                issueDate={issueDate}
                mainTheme={mainTheme}
                coverImage={coverImage}
                articles={articles}
            />
        </div>
    );
};

export default App;
