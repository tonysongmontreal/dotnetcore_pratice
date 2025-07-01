import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { environment } from '../../environments/environment';
import { FormsModule } from '@angular/forms';
import { Register } from "../register/register";

@Component({
  selector: 'app-home',
  imports: [FormsModule, Register],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home implements OnInit {

  http = inject(HttpClient);
  registerMode = false;
  users: any;

  ngOnInit(): void {
    this.getUsers();
  }

  registerToggle() {
    this.registerMode = !this.registerMode
  }

   getUsers() {
    this.http.get(environment.apiUrl+'users').subscribe({
      next: response =>{
      this.users = response;
      },
      error: error => console.log(error),
      complete: () => console.log('Request has completed')
    })
  }

   cancelRegisterMode(event: boolean) {
    this.registerMode = event;
  }


}
