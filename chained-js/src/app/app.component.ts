import { Component, OnInit } from '@angular/core';
import { DAppService } from './services/d-app.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(private dAppService: DAppService) {}

  public ngOnInit(): void {}
}
