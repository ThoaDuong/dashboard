import { Assignee } from './../../entities/issue-assignee.entity';
import { IssueColumnEntity } from './../../entities/issue-column.entity';
import { ProjectEntity } from './../../entities/project.entity';
import { ColumnEntity } from './../../entities/column.entity';
import { IssueEntity } from './../../entities/issue.entity';
import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/entities/user.entity';
import { DashboardService } from 'src/app/services/dashboard.service';

@Component({
  selector: 'app-issues',
  templateUrl: './issues.component.html',
  styleUrls: ['./issues.component.scss']
})
export class IssuesComponent implements OnInit {
  dbIssues: IssueEntity[] = [];
  defaultIssues: IssueEntity[] = [];
  defaultColumns: ColumnEntity[] = [];
  defaultProjects: ProjectEntity[] = [];
  defaultIssueColumns: IssueColumnEntity[] = [];
  defaultUsers : User[] = [];
  defaultIssueAssignees: Assignee[] = [];

  filterIssues: IssueEntity[] = [];

  issueState = {
    totalIssue: 0,
    openIssue: 0,
    closeIssue: 0,
  };

  all = {
    id: -1,
    name: "All",
  }

  chooseProject: any = this.all;
  chooseColumn: any = this.all;
  chooseAssignee: any = this.all;

  displayedColumns: string[] = ['id', 'name', 'number', 'state', 'author', 'content', 'repo_id'];

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    const issues = this.defaultIssues.filter(iss => iss.name.match(filterValue.trim().toLowerCase()));
    this.initFilterIssues(issues);
  }

  constructor(private dashboardService: DashboardService) { }

  ngOnInit(): void {
    const listRepo = JSON.parse(localStorage.getItem('list_repo'));
    if(listRepo){
      listRepo.map(async repo => {
        const data =  await this.dashboardService.getDataOfRepository(repo);
        this.initDBIssues(data.issues);
        this.initDefaultIssues(data.issues);
        this.initDefaultProjects(data.projects);
        this.initDefaultColumns(data.columns);
        this.initDefaultIssueColumns(data.issue_columns);
        this.initDefaultUsers(data.users);
        this.initDefaultIssueAssignees(data.issue_assignees);
        this.initFilterIssues(data.issues);
        this.initNumberOfIssue(data.issues);
      })
    }
  }

  initDBIssues(data){
    this.dbIssues = data;
  }
  initDefaultIssues(data) {
    this.defaultIssues = data;
  }
  initDefaultColumns(data){
    this.defaultColumns = data;
  }
  initDefaultProjects(data){
    this.defaultProjects = data;
  }
  initDefaultIssueColumns(data){
    this.defaultIssueColumns = data;
  }
  initDefaultUsers (data) {
    this.defaultUsers = data;
  }
  initDefaultIssueAssignees (data){
    this.defaultIssueAssignees = data;
  }
  initFilterIssues(data) {
    this.filterIssues = data;
  }
  initIssueState(total, open, close){
    this.issueState = {
      totalIssue: total,
      openIssue: open,
      closeIssue: close,
    };
  }

  initNumberOfIssue(issues){
    let total = issues.length;
    let open = 0;
    let close = 0;
    this.defaultIssues.forEach(issue => {
      if(issue.state.toLowerCase() == 'open'){
        open++;
      }
      if(issue.state.toLowerCase() == 'closed'){
        close++;
      }
    })
    this.initIssueState(total, open, close);
  }

  onSelectProject(event){
    if(event.id == -1){
      this.initFilterIssues(this.defaultIssues);
    }
    else{
      let result = this.filterIssuesByProjectColumn(event.id);
      this.initFilterIssues(result);
    }
  }

  onSelectColumn(event){
    if(event.id == -1){
      let result = this.filterIssuesByProjectColumn(this.chooseProject.id);
      this.initFilterIssues(result);
    }
    else{
      let result = this.filterIssuesByProjectColumn(this.chooseProject.id, event.id);
      this.initFilterIssues(result);
    }
  }

  onSelectAssignee(event){
    this.chooseProject = this.all;
    this.chooseColumn = this.all;
    if(event.id == -1){
      this.initDefaultIssues(this.dbIssues);
      this.initFilterIssues(this.dbIssues);
    }
    else{
      const issueByUser = this.findIssuesByUser(event);
      this.initDefaultIssues(issueByUser);
      this.initFilterIssues(issueByUser);
    }
  }

  filterIssuesByProjectColumn(proj_id: number, col_id?: number){
    let result: IssueEntity[] = [];

    if(col_id){
      this.defaultIssueColumns.map(iss_col => {
        if(iss_col.proj_id === proj_id && iss_col.col_id === col_id){
            const data = this.defaultIssues.filter(issue => issue.id === iss_col.issue_id);
            result = result.concat(data);
        }
      })
      return result;
    }
    this.defaultIssueColumns.map(iss_col => {
      if(iss_col.proj_id === proj_id){
          const data = this.defaultIssues.filter(issue => issue.id === iss_col.issue_id);
          result = result.concat(data);
      }
    })
    return result;
  }

  findIssuesByUser(user: User){
    let result: IssueEntity[] = [];

    this.defaultIssueAssignees.map(iss_ass => {
      if(iss_ass.user_id == user.id){
        const issue = this.dbIssues.filter(iss => iss.id == iss_ass.issue_id);
        result = result.concat(issue);
      }
    })
    return result;
  }

}
