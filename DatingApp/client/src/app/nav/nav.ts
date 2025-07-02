import { Component, inject,ChangeDetectorRef, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AccountService } from '../_services/account';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { User } from '../_models/user';
import { Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { TitleCasePipe } from '@angular/common';




@Component({
  selector: 'app-nav',
  standalone:true,
  imports: [FormsModule,
    BsDropdownModule,
    RouterLink,
  TitleCasePipe],
  templateUrl: './nav.html',
  styleUrl: './nav.css'
})
export class Nav  {

   accountService= inject(AccountService);
   private cdr = inject(ChangeDetectorRef);
   private router = inject(Router);
  private toastr = inject(ToastrService);

      model: any = {};

     login() {
    this.accountService.login(this.model).subscribe({
      next: () => {

          this.router.navigateByUrl('/members')

           this.cdr.detectChanges();
      },
      // error: error => console.log(error)
        error: error =>
          {
            this.toastr.error(error.error);
          }
    });
  }

  logout() {

    this.accountService.logout();
      this.router.navigateByUrl('/');
       this.cdr.detectChanges();
  }

}
