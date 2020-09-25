import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RepositoryEntity } from '../entities/repository.entity';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  repositories: RepositoryEntity[];

  constructor(
    private http: HttpClient,
  ) {
  }

  initRepositories(data){
    this.repositories = data;
  }

  createHeaders(token: string): any {
    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };
  }

  createHttpOptions(token: string): any {
    return {
      headers: this.createHeaders(token),
    };
  }

  async getRepositoriesApi(): Promise<any>{
    const access_token = localStorage.getItem('access_token');
    const url = `http://localhost:3000/api.github/repos`;
    return await this.http.get<RepositoryEntity[]>(url, this.createHttpOptions(access_token))
      .toPromise()
        .then(res => res)
        .catch(error => console.log('Error in getRepositoriesApi()'));
  }

  async getRepositoriesApiSync(): Promise<any>{
    const access_token = localStorage.getItem('access_token');
    const url = `http://localhost:3000/api.github/repos/sync`;
    return await this.http.get<RepositoryEntity[]>(url, this.createHttpOptions(access_token))
      .toPromise()
        .then(res => res)
        .catch(error => console.log('Error in getRepositoriesApi()'));
  }

  getDataOfRepository(repo: RepositoryEntity): Promise<any>{
    const access_token = localStorage.getItem('access_token');
    const url = `http://localhost:3000/api.github/data`;
    return this.http.post<[]>(url, repo, this.createHttpOptions(access_token))
      .toPromise()
        .then(res => res)
        .catch(err => console.log('Error in function getDataOfRepository()'));
  }

  fetchDataOfRepositoryHook(repo_id: number): Promise<any>{
    const access_token = localStorage.getItem('access_token');
    const data = {
      repo_id: repo_id,
    }
    const url = `http://localhost:3000/api.github/hooks`;
    return this.http.post<[]>(url, data, this.createHttpOptions(access_token))
      .toPromise()
        .then(res => res)
        .catch(err => console.log('Error in function fetchDataOfRepositorySync()'));
  }

  async fetchDataOfRepository(repo_id: number){
    const access_token = localStorage.getItem('access_token');
    const url = `http://localhost:3000/api.github/fetch/${repo_id}`;
    return await this.http.get<any>(url, this.createHttpOptions(access_token))
      .toPromise()
        .then(res => res)
        .catch(error => console.log('Error in fetchDataOfRepository()'))
  }

  loadDataOfRepository(listRepo){
    if(listRepo){
      listRepo.map(async repo => {
        const repoSync = await this.getRepositoriesApiSync();
        const existSync = repoSync.filter(r => r.id === repo.id);
        if(existSync){
          await this.fetchDataOfRepository(repo.id);
        }
        else{
          await this.fetchDataOfRepositoryHook(repo.id);
        }
      })
    }
  }

}
