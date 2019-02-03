import { ActivatedRoute } from '@angular/router';
import { SharedService } from 'src/app/services/shared.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Ticket } from 'src/app/model/ticket.model';
import { TicketService } from 'src/app/services/ticket.service';
import { ResponseApi } from 'src/app/model/response-api';

@Component({
  selector: 'app-ticket-new',
  templateUrl: './ticket-new.component.html',
  styleUrls: ['./ticket-new.component.css']
})
export class TicketNewComponent implements OnInit {

  @ViewChild("form")
  form: NgForm

  ticket = new Ticket('', 0, '', '', '', '', null, null, '', null);
  shared : SharedService;
  message : {};
  classCss : {};

  constructor(
    private ticketService : TicketService,
    private route : ActivatedRoute
  ) {
    this.shared = SharedService.getInstance();
  }

  ngOnInit() {
    let id : string = this.route.snapshot.params['id'];
    if(id != undefined){
      this.findById(id);
    }
  }

  findById(id : string) {
    this.ticketService.findById(id).subscribe((responseApi : ResponseApi) => {
      this.ticket = responseApi.data;
    }, err => {
      this.showMessage({
        type : 'error',
        text : err['error']['errors'][0]
      });
    });
  }

  register(){
    this.message = {};
    this.ticketService.createOrUpdate(this.ticket).subscribe((responseApi : ResponseApi) => {
      this.ticket = new Ticket('', 0, '', '', '', '', null, null, '', null);
      let ticket : Ticket = responseApi.data;
      this.form.resetForm();
      this.showMessage({
        type : 'success',
        text : `${ticket.title} cadastrado com sucesso`
      });
    }, err => {
      this.showMessage({
        type : 'error',
        text : err['error']['errors'][0]
      });
    });
  }

  //GRAVAR IMAGEM
  onFileChange(event) : void {
    if(event.target.files[0].size > 2000000){
      this.showMessage({
        type : 'error',
        text : 'Tamanho máximo da imagem: 2 MB'
      });
    } else {
      this.ticket.image = '';
      var reader = new FileReader();
      reader.onloadend = (e : Event) => {
        this.ticket.image = reader.result as string; //CAST string
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  }

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

  getFromGroupClass(isInvalid : boolean, isDirty): {} {
    return {
      'form-group' : true,
      'has-error' : isInvalid && isDirty,
      'has-success' : !isInvalid && isDirty
    };
  }
}