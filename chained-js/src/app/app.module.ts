import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { Web3ModalModule, Web3ModalService } from '@mindsorg/web3modal-angular';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import WalletConnectProvider from '@walletconnect/web3-provider';
import { ConnectWalletComponent } from './features/connect-wallet/connect-wallet.component';

const providerOptions =  {
  walletconnect: {
    package: WalletConnectProvider,
      options: {
      infuraId: 'INFURA_ID',
    },
  },
};

@NgModule({
  declarations: [
    AppComponent,
    ConnectWalletComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    Web3ModalModule,
    NgbModule
  ],
  providers: [    {
    provide: Web3ModalService,
    useFactory: () => {
      return new Web3ModalService({
        network: "mainnet",
        cacheProvider: true,
        providerOptions,
        disableInjectedProvider: false
      });
    },
  },],
  bootstrap: [AppComponent]
})
export class AppModule { }
