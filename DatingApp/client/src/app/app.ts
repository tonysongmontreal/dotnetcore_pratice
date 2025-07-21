import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { Nav } from "./nav/nav";
import { AccountService } from './_services/account';
import { RouterOutlet } from '@angular/router';



@Component({
  selector: 'app-root',
  standalone:true,
  imports: [RouterOutlet, CommonModule, Nav],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {



  cdr = inject(ChangeDetectorRef);
  private accountService = inject(AccountService);

  async ngOnInit() {

 await this.accountService.initializeUser();

  }

 



}


