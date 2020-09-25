import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RepositoryEntity } from 'src/app/entities/repository.entity';
import { DashboardService } from 'src/app/services/dashboard.service';

@Component({
  selector: 'app-repositories',
  templateUrl: './repositories.component.html',
  styleUrls: ['./repositories.component.scss']
})
export class RepositoriesComponent implements OnInit {
  repositories: RepositoryEntity[] = [];
  listRepo: RepositoryEntity[] = [];

  displayedColumns: string[] = ['Choose', 'ID', 'Name', 'Owner', 'Sync', 'Created at', 'Updated at'];

  constructor(private dashboardService: DashboardService, private route: Router) { }

  async ngOnInit(): Promise<void> {
    const repos = await this.dashboardService.getRepositoriesApi();
    this.initRepositories(repos);
  }

  initRepositories(data){
    this.repositories = data;
  }

  onGetListRepo(repo, checked){
    if(checked){
      this.listRepo.push(repo);
    }
    else{
      const index = this.listRepo.findIndex(obj => obj.id == repo.id);
      this.listRepo.splice(index, 1);
    }
  }

  onLoadDataOfRepositories(){
    localStorage.setItem('list_repo', JSON.stringify(this.listRepo));
    this.dashboardService.loadDataOfRepository(this.listRepo);
    this.route.navigateByUrl('admin');
  }


}
