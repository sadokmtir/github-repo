export default class QueryBuilder {
    private query: string;

    public constructor() {
        this.query = 'q=';
    }

    public since(since: string): this {
        this.query += `created:>${since}`;
        return this;
    }

    public withLanguageFilter(language: string): this {
        this.query += `+language:${language}`;
        return this;
    }

    public sort(isAscending = false): this {
        this.query += `&sort:${isAscending ? 'asc': 'desc'}`;
        return this;
    }

    public maxPerPage(maxPerPage: number = 30): this {
        this.query += `&per_page=${maxPerPage}`;
        return this;

    }

    public getQuery(): string {
        return this.query;
    }

}