import { User } from './../entities/user.entity';
import { RepositoryEntity } from './../entities/repository.entity';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  repoSync: RepositoryEntity[];

  constructor(private http: HttpClient) { }

  createHeaders(token: string): any {
    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };
  }

  initRepoSync(data){
    this.repoSync = data;
  }

  createHttpOptions(token: string): any {
    return {
      headers: this.createHeaders(token),
    };
  }

  async getUserByUsername(): Promise<any>{
    const username = localStorage.getItem('username');
    const token = localStorage.getItem('access_token');
    const url = `http://localhost:3000/api.github/user?username=${username}`;
    return await this.http.get<User>(url, this.createHttpOptions(token))
      .toPromise()
        .then(res => res)
        .catch(error => console.log('Error in getUserByUsername()'));
  }

  getRepoSync(): Promise<any>{
    const username = localStorage.getItem('username');
    const token = localStorage.getItem('access_token');
    const url = `http://localhost:3000/api.github/repos/sync?username=${username}`;
    return this.http.get<RepositoryEntity[]>(url, this.createHttpOptions(token)).toPromise().then(repos => {
      this.initRepoSync(repos);
      return repos;
    })
  }
}
