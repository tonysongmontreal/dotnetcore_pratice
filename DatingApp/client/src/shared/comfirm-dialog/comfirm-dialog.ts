import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { ConfirmDialogService } from '../../app/_services/confirm-dialog-service';

@Component({
  selector: 'app-comfirm-dialog',
  imports: [],
  templateUrl: './comfirm-dialog.html',
  styleUrl: './comfirm-dialog.css'
})
export class ComfirmDialog {

 @ViewChild('dialogRef') dialogRef!: ElementRef<HTMLDialogElement>;
  message = 'Are you sure?';
  private resolver: ((result: boolean) => void) | null = null;
  //  private resolver: any = null;

  constructor() {

    inject(ConfirmDialogService).register(this)
  }

  open(message: string): Promise<boolean> {
    this.message = message;
    this.dialogRef.nativeElement.showModal();
    return new Promise(resolve => (this.resolver = resolve));
  }

  confirm() {
    this.dialogRef.nativeElement.close();
    this.resolver?.(true);
    this.resolver = null;
  }

  cancel() {
    this.dialogRef.nativeElement.close();
    this.resolver?.(false);
    this.resolver = null;
  }

}
