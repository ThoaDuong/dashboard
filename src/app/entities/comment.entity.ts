export interface CommentEntity{
    id: number;
    external_id: number;
    issue_id: number;
    author: string;
    content: string;
    created_at: Date;
    updated_at: Date;
}
