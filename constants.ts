
import type { Article } from './types';
import { ArticleLayout } from './types';

export const STYLE_PROMPT_SUFFIX = 'High-editorial, glossy magazine illustration, professional photography, dramatic lighting, sharp focus';

export const INITIAL_ARTICLE: Omit<Article, 'id'> = {
    headline: 'New Article Headline',
    author: 'Author Name',
    body: 'Start writing your article body here. The first letter will automatically be a drop cap. You can add more paragraphs as needed to fill the page.',
    illustrationPrompt: 'An interesting illustration that matches the headline.',
    imageUrl: null,
    layout: ArticleLayout.IMAGE_TOP,
};
