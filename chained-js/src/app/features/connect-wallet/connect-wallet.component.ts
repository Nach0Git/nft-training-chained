import { Component, OnInit } from '@angular/core';
import {DAppService} from '../../services/d-app.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-connect-wallet',
  templateUrl: './connect-wallet.component.html',
  styleUrls: ['./connect-wallet.component.scss']
})
export class ConnectWalletComponent implements OnInit {
  constructor(private dAppService: DAppService, private router: Router) {}

  public ngOnInit(): void {
    this.dAppService.isConnected$.subscribe(connected => {
      if (connected){
        this.router.navigateByUrl('/contract').then();
      }
    })
  }

  public async connect() {
    await this.dAppService.connect().then(val => {

    }, err => {
    })
  }
}
