import { Component, inject, output, signal } from '@angular/core';
import { AccountService } from '../_services/account';
import { AbstractControl, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { CommonModule, JsonPipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { RegisterCreds } from '../_models/user';
import { TextInput } from "../../shared/text-input/text-input";
import { Router } from '@angular/router';
import { Textarea } from "../../shared/textarea/textarea";

@Component({
  selector: 'app-register',
  standalone:true,
  imports: [ReactiveFormsModule, CommonModule, TextInput, Textarea],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register  {



   private accountService = inject(AccountService);
     private router = inject(Router);

     private fb = inject(FormBuilder);

     private toastr = inject(ToastrService);

    protected creds = {} as RegisterCreds;

  cancelRegister = output<boolean>();
    model: any = {}

  protected credentialsForm: FormGroup;
  protected profileForm: FormGroup;
    protected currentStep = signal(1);
  protected validationErrors = signal<string[]>([]);

  constructor() {

    this.credentialsForm = this.fb.group({

email: ['',
  [Validators.required,Validators.email]],
 displayName: ['',Validators.required],
 password:['',[Validators.required,
  Validators.minLength(4),Validators.maxLength(8)]],
 confirmpassword: ['',[Validators.required,this.matchValues('password')]],

    });

     this.profileForm = this.fb.group({
      gender: ['male', Validators.required],
      dateOfBirth: ['', Validators.required],
      city: ['', Validators.required],
      country: ['', Validators.required],
       description: ['', [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(500)
      ]]
    })




      this.credentialsForm.controls['password'].valueChanges.subscribe(() => {
      this.credentialsForm.controls['confirmpassword'].updateValueAndValidity();
    })
  }


    matchValues(matchTo: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const parent = control.parent;
      if (!parent) return null;

      const matchValue = parent.get(matchTo)?.value;
      return control.value === matchValue ? null : { passwordMismatch: true }
    }
  }

    nextStep() {
    if (this.credentialsForm.valid) {
      this.currentStep.update(prevStep => prevStep + 1);
    }
  }

    prevStep() {
    this.currentStep.update(prevStep => prevStep - 1);
  }


  register() {
    if (this.profileForm.valid && this.credentialsForm.valid) {
      const formData = { ...this.credentialsForm.value, ...this.profileForm.value };

      this.accountService.register(formData).subscribe({
        next: () => {
           
          this.router.navigateByUrl('/members');
        },
        error: error => {
          console.log(error);
          this.validationErrors.set(error)
        }
      })
    }

  }

  getMaxDate() {
    const today = new Date();
    today.setFullYear(today.getFullYear() - 18);
    return today.toISOString().split('T')[0];
  }




  //     register() {


  //   // this.accountService.register(this.model).subscribe({
  //   //   next: response => {
  //   //     console.log(response);
  //   //     this.cancel();
  //   //   },
  //   //   error: error =>
  //   //     {
  //   //       console.log(error);
  //   //       this.toastr.error(error.error);
  //   //   }
  //   // })

  //   // console.log(this.model)

  //   console.log(this.credentialsForm.value);
  // }

    cancel() {
    this.cancelRegister.emit(false);
  }

}
