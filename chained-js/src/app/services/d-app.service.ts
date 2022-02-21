import { Injectable } from '@angular/core';
import { Web3ModalService } from '@mindsorg/web3modal-angular';
import { JsonRpcSigner, Web3Provider } from '@ethersproject/providers';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DAppService {
  public isConnected$: Observable<boolean>;
  public signerAddress: string;

  private web3Provider: Web3Provider;
  private signer: JsonRpcSigner;
  private connected = new BehaviorSubject<boolean>(false);

  constructor(private web3ModalService: Web3ModalService) {
    this.isConnected$ = this.connected.asObservable();
  }

  public async connect(): Promise<any> {
    this.web3ModalService.clearCachedProvider();

    const provider: any = await this.web3ModalService.open();
    this.web3Provider = new Web3Provider(provider);
    this.signer = this.web3Provider.getSigner();
    this.signerAddress = await this.signer.getAddress();

    const network = await this.web3Provider.getNetwork();
    console.log(network);
    this.connected.next(true);
  }
}
