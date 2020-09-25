import { Component, OnInit } from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import { RepositoryEntity } from 'src/app/entities/repository.entity';
import { User } from 'src/app/entities/user.entity';
import { UserService } from 'src/app/services/user.service';


@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  repositories: RepositoryEntity[] = [];
  user: User;

  constructor(
    private userService: UserService
  ) { }

  async ngOnInit(): Promise<void> {
    const user = await this.userService.getUserByUsername();
    this.initUser(user);
  }

  initUser(data) {
    this.user = data;
  }

  onLogout(){
    localStorage.removeItem('access_token');
    localStorage.removeItem('username');
    localStorage.removeItem('list_repo');
  }

}
