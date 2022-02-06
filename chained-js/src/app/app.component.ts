import {Component, OnInit} from '@angular/core';
import {Web3ModalService} from '@mindsorg/web3modal-angular';
import {DAppService} from './services/d-app.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'chained-js';

  constructor(private dAppService: DAppService) {}

  public ngOnInit(): void {
  }

  public async connect() {
    await this.dAppService.connect().then(val => {
      console.log(val)
    }, err => {
      console.log(err);
    })
  }
}
