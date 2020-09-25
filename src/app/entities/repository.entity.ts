export interface RepositoryEntity{
  id: number;
  name: string;
  user_id: string;
  external_id: string;
  owner: string;
  sync: boolean;
  created_at: Date;
  updated_at: Date;
}
