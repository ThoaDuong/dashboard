import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DashboardService } from 'src/app/services/dashboard.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(
    private userService: UserService,
    private route: Router,
    private dashboardService: DashboardService,
  ) {
    window.addEventListener('message', this.listenEvent.bind(this));
  }

  ngOnInit(): void {
  }

  async listenEvent(event){
    if(event.data && typeof event.data === 'string'){
      const res = event.data.split(' ');
      localStorage.setItem('username', res[0]);
      localStorage.setItem('access_token', res[1]);

      const username = localStorage.getItem('username');
      const access_token = localStorage.getItem('access_token');
      if(username && access_token){
        const repos = await this.userService.getRepoSync();

        this.onCheckData(repos);
      }
    }
  }

  loginWithGithub(){
    window.open(`http://localhost:3000/api.github/login`, '_black');
  }

  onCheckData(repos){
    console.log('repos', repos);
    if(repos.length > 0){
      console.log('Ton tai');
      localStorage.setItem('list_repo', JSON.stringify(repos));
      this.route.navigateByUrl('admin');
    }else{
      console.log('Khong ton tai');
      this.route.navigateByUrl('repos');
    }
  }

}
