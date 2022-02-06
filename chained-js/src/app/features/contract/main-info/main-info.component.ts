import { Component, OnInit } from '@angular/core';
import {DAppService} from '../../../services/d-app.service';

@Component({
  selector: 'app-main-info',
  templateUrl: './main-info.component.html',
  styleUrls: ['./main-info.component.scss']
})
export class MainInfoComponent implements OnInit {

  constructor(public dAppService: DAppService) { }

  public ngOnInit(): void {
  }

}
