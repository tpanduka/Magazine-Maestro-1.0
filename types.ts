
export enum ArticleLayout {
    IMAGE_TOP = 'image-top',
    IMAGE_MIDDLE = 'image-middle',
}

export interface Article {
    id: string;
    headline: string;
    author: string;
    body: string;
    illustrationPrompt: string;
    imageUrl: string | null;
    layout: ArticleLayout;
}

export interface Source {
    id: string;
    content: string;
    fileName?: string;
}
