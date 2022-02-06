import { Injectable } from '@angular/core';
import {Web3ModalService} from '@mindsorg/web3modal-angular';
import { Web3Provider } from '@ethersproject/providers';
import {BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DAppService {
  private web3js: Web3Provider;
  private provider: any;
  public accounts: string[];

  private connected = new BehaviorSubject<boolean>(false);
  public isConnected$ = this.connected.asObservable();

  constructor(private web3ModalService: Web3ModalService) { }

  public async connect() {
    this.web3ModalService.clearCachedProvider();

    this.provider = await this.web3ModalService.open();
    this.web3js = new Web3Provider(this.provider);
    this.accounts = await this.web3js.listAccounts();
    this.connected.next(true)
  }
}
