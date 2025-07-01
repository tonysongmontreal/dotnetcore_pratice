import { Component, inject,ChangeDetectorRef, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AccountService } from '../_services/account';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { User } from '../_models/user';




@Component({
  selector: 'app-nav',
  standalone:true,
  imports: [FormsModule,BsDropdownModule],
  templateUrl: './nav.html',
  styleUrl: './nav.css'
})
export class Nav  {

   accountService= inject(AccountService);
   private cdr = inject(ChangeDetectorRef);

      model: any = {};

     login() {
    this.accountService.login(this.model).subscribe({
      next: response => {
        console.log(response);

           this.cdr.detectChanges();
      },
      error: error => console.log(error)
    });

  }

  logout() {

    this.accountService.logout()

       this.cdr.detectChanges();
  }

}
