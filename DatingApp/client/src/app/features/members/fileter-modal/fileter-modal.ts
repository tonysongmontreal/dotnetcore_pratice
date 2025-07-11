import { Component, ElementRef, model, output, ViewChild, AfterViewInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MemberParams } from '../../../_models/member';

@Component({
  selector: 'app-fileter-modal',
  imports: [FormsModule],
  templateUrl: './fileter-modal.html',
  styleUrl: './fileter-modal.css'
})
export class FilterModal  {

  @ViewChild('filterModal') modalRef!: ElementRef<HTMLDialogElement>;
  closeModal = output();
  submitData = output<MemberParams>();
  memberParams = model(new MemberParams())



  constructor() {
    const filters = localStorage.getItem('filters');
    if (filters) {
      this.memberParams.set(JSON.parse(filters));
    }
  }




  open() {
    this.modalRef.nativeElement.showModal();
  }




  close() {

  this.modalRef.nativeElement.close();
   this.closeModal.emit();

  }


  submit() {

    this.submitData.emit(this.memberParams());
    this.close();
  }




}
