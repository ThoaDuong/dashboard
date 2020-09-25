export interface MilestoneEntity{
  id: number;
    number: number;
    node_id: string;
    description: string;
    name: string;
    url: string;
    creator: string;
    due_on: Date;
    closed_at: Date;
    state: string;
    repo_id: number;
    created_at: Date;
    updated_at: Date;
}
