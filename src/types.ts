export type DeserializedSearchResult = {
    id: string;
    snippet: {
        pre: string;
        text: string;
        post: string;
    };
    source: string;
    url: string;
    title: string;
    metadata: Record<string, unknown>;
};

export type DocMetadata = {
    name: string;
    value: string;
};
