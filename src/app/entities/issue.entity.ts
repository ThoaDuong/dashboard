export interface IssueEntity{
  id: number;
  external_id: number;
  number: number;
  name: string;
  state: string;
  author: string;
  content: string;
  url: string;
  mile_id: number;
  repo_id: number;
  created_at: Date;
  updated_at: Date;
}
