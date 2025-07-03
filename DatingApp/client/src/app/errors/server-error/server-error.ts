import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-server-error',
  standalone:true,
  imports: [],
  templateUrl: './server-error.html',
  styleUrl: './server-error.css'
})
export class ServerError {

  error: any;
  constructor (private router: Router)
  {
    const navigation= this.router.getCurrentNavigation();
    this.error = navigation?.extras?.state?.['error'];
  }

}
