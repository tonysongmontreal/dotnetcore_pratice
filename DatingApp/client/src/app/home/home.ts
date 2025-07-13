import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { Register } from "../register/register";

@Component({
  selector: 'app-home',
  imports: [FormsModule, Register],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home implements OnInit {

  // @ViewChild('myModal', { static: false }) myModal!: ElementRef<HTMLDialogElement>;

  http = inject(HttpClient);
  registerMode = false;
  users: any;

  ngOnInit(): void {

  }



  registerToggle() {
    this.registerMode = !this.registerMode
  }

   cancelRegisterMode(event: boolean) {
    this.registerMode = event;
  }


}
