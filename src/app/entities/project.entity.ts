export interface ProjectEntity {
    id: number;
    external_id: number;
    number: number;
    name: string;
    content: string;
    state: string;
    repo_id: number;
    created_at: Date;
    updated_at: Date;
}
