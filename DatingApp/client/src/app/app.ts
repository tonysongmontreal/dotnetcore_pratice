import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { Nav } from "./nav/nav";

// Define the User interface
interface User {
  id: number;
  userName: string;
  // Add other properties as needed
}

@Component({
  selector: 'app-root',
  standalone:true,
  imports: [CommonModule, Nav],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {


   http = inject(HttpClient);
  cdr = inject(ChangeDetectorRef);
   title = 'DatingApp';
   users: User[] = [];


  ngOnInit(): void {

     console.log("App component initialized");


    this.http.get<User[]>('https://localhost:5001/api/users')
    .subscribe({
      next: response =>{
        this.users = response;
         this.cdr.detectChanges();
      } ,
      error: error => console.log(error),
      complete: () => console.log('Request has completed')
    });



  }

}
