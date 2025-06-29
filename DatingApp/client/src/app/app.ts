import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone:true,
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {

   http = inject(HttpClient);
   title = 'DatingApp';
   users: any;

  ngOnInit(): void {

     console.log("App component initialized");

      const title123 = 'DatingApp';
      const title456 = 'DatingApp';
    this.http.get('https://localhost:5001/api/users')
    .subscribe({
      next: response =>{
        this.users = response;
        console.log(response)
      } ,
      error: error => console.log(error),
      complete: () => console.log('Request has completed')
    })
  }

}
