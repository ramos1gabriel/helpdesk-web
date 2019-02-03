import { TicketService } from './../../services/ticket.service';
import { Component, OnInit } from '@angular/core';
import { Summary } from 'src/app/model/summary.model';
import { ResponseApi } from 'src/app/model/response-api';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.css']
})
export class SummaryComponent implements OnInit {

  summary : Summary = new Summary();
  message : {};
  classCss : {};

  constructor(
    private ticketService : TicketService
  ) { }

  ngOnInit() {
    this.ticketService.summary()
    .subscribe((responseApi : ResponseApi) => {
      this.summary = responseApi.data;
    }, err => {
      this.showMessage({
        type : 'error',
        text : err['error']['errors'][0]
      });
    });
  }

  // classes default
  private showMessage(message : {type : string, text : string}) : void {
    this.message = message;
    this.buildClasses(message.type);
    setTimeout(() => { //LIMPA MENSAGEM
      this.message = undefined;
    }, 3000);
  }

  private buildClasses(type : string) : void {
    this.classCss = {
      'alert' : true
    }
    this.classCss['alert-'+type] = true;
  }
}
