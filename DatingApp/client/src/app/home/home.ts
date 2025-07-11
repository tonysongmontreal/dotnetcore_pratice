import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, ElementRef, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { environment } from '../../environments/environment';
import { FormsModule } from '@angular/forms';
import { Register } from "../register/register";

@Component({
  selector: 'app-home',
  imports: [FormsModule, Register],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home implements OnInit ,AfterViewInit{

     @ViewChild('myModal', { static: false }) myModal!: ElementRef<HTMLDialogElement>;

  http = inject(HttpClient);
  registerMode = false;
  users: any;

  ngOnInit(): void {

  }

   ngAfterViewInit() {
    console.log('ViewChild after init:', this.myModal);
  }

  registerToggle() {
    this.registerMode = !this.registerMode
  }

   cancelRegisterMode(event: boolean) {
    this.registerMode = event;
  }


openModal() {
  console.log('openModal called');
  console.log('Modal ViewChild:', this.myModal);

  if (this.myModal && this.myModal.nativeElement) {
    console.log('Modal element found via ViewChild');
    console.log('Modal element:', this.myModal.nativeElement);

    // 检查元素是否存在于DOM中
    console.log('Modal in DOM:', document.contains(this.myModal.nativeElement));

    this.myModal.nativeElement.showModal();

    // 检查模态框是否真的打开了
    console.log('Modal open after showModal:', this.myModal.nativeElement.open);
  } else {
    console.error('Modal ViewChild not found');
  }
}

    closeModal() {
    if (this.myModal && this.myModal.nativeElement) {
      this.myModal.nativeElement.close();
    }
  }




}
