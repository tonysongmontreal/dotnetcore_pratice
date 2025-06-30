import { Component, inject,ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AccountService } from '../_services/account';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';



@Component({
  selector: 'app-nav',
  standalone:true,
  imports: [FormsModule,BsDropdownModule],
  templateUrl: './nav.html',
  styleUrl: './nav.css'
})
export class Nav {

  private accountService= inject(AccountService);
   private cdr = inject(ChangeDetectorRef);

  loggedIn=false;
   model: any = {};

     login() {
    this.accountService.login(this.model).subscribe({
      next: response => {
        console.log(response);
        this.loggedIn=true;
           this.cdr.detectChanges();
      },
      error: error => console.log(error)
    });

  }

  logout() {
       this.loggedIn=false;
       this.cdr.detectChanges();
  }

}
