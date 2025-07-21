import { Component, inject,ChangeDetectorRef, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AccountService } from '../_services/account';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { User } from '../_models/user';
import { Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { TitleCasePipe } from '@angular/common';
import { themes } from '../../layout/theme';
import { BusyService } from '../_services/busy-service';
import { HasRole } from '../../shared/has-role';




@Component({
  selector: 'app-nav',
  standalone:true,
  imports: [FormsModule,
    BsDropdownModule,
    RouterLink,
  TitleCasePipe,HasRole],
  templateUrl: './nav.html',
  styleUrl: './nav.css'
})
export class Nav  {

   accountService= inject(AccountService);
   private cdr = inject(ChangeDetectorRef);
   private router = inject(Router);
  private toastr = inject(ToastrService);
  protected selectedTheme = signal<string>(localStorage.getItem('theme') || 'light');
  protected themes = themes;
  protected busyService = inject(BusyService);

      model: any = {};
        protected creds: any = {}

        ngOnInit(): void {
    document.documentElement.setAttribute('data-theme', this.selectedTheme());
  }


   handleSelectTheme(theme: string) {

    this.selectedTheme.set(theme);
    localStorage.setItem('theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
    const elem = document.activeElement as HTMLDivElement;
    if (elem) elem.blur();

  }

     login() {
    this.accountService.login(this.model).subscribe({
      next: () => {

          this.router.navigateByUrl('/members')

           this.cdr.detectChanges();
      },

        error: error =>
          {
            this.toastr.error(error.error);
          }
    });
  }

  // logout() {

  //   this.accountService.logout();
  //     this.router.navigateByUrl('/');
  //      this.cdr.detectChanges();
  // }

  logout() {
    this.accountService.logout().subscribe({
      next: () => {
        console.log('Logout successful');
        this.router.navigate(['/']); // 重定向到首页或登录页
      },
      error: (error) => {
        console.error('Logout failed:', error);
        // 即使出错也重定向，因为前端状态已清理
        this.router.navigate(['/']);
      }
    });
  }

}
