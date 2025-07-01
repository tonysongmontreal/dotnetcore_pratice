import { Component, inject, input,   output } from '@angular/core';
import { AccountService } from '../_services/account';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone:true,
  imports: [FormsModule,CommonModule],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {

   private accountService = inject(AccountService);

//  usersFromHomeComponent =input.required<any>()
//   // @Output() cancelRegister =new EventEmitter() ;
     cancelRegister = output<boolean>();
  model: any = {}

      register() {
    this.accountService.register(this.model).subscribe({
      next: response => {
        console.log(response);
        this.cancel();
      },
      error: error => console.log(error)
    })

    console.log(this.model)
  }

    cancel() {
    this.cancelRegister.emit(false);
  }

}
