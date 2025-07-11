import { Component, ElementRef, inject, signal, ViewChild } from '@angular/core';
import { MembersService } from '../../_services/MembersService';

import { Member, MemberParams } from '../../_models/member';

import { MemberCard } from "../../features/members/member-card/member-card";
import { PaginatedResult } from '../../_models/pagination';
import { Paginator } from "../../../shared/paginator/paginator";
import { FilterModal } from '../../features/members/fileter-modal/fileter-modal';





@Component({
  selector: 'app-member-list',
  imports: [ MemberCard, Paginator,FilterModal],
  templateUrl: './member-list.html',
  styleUrl: './member-list.css'
})
export class MemberList {



    @ViewChild('filterModal') modal!: FilterModal;


  private memberService = inject(MembersService);

  protected paginatedMembers = signal<PaginatedResult<Member> | null>(null);
  protected memberParams = new MemberParams();
  private updatedParams = new MemberParams();


  constructor() {


      const filters = localStorage.getItem('filters');
    if (filters) {
      this.memberParams = JSON.parse(filters);
      this.updatedParams = JSON.parse(filters)
    }
  }

    ngOnInit(): void {
    this.loadMembers();
  }

   ngAfterViewInit() {
    console.log('Parent AfterViewInit - filterModal:', this.modal);
  }


    loadMembers() {

      // this.paginatedMembers$ = this.memberService.getMembers(this.memberParams);
    this.memberService.getMembers(this.memberParams).subscribe({
      next: result => {
        this.paginatedMembers.set(result)
      }
    })



  }

    onPageChange(event: {pageNumber: number, pageSize: number}) {
    this.memberParams.pageSize = event.pageSize;
    this.memberParams.pageNumber = event.pageNumber;
    this.loadMembers();
  }

    onFilterChange(data: MemberParams) {
    this.memberParams = {...data};
    this.updatedParams = {...data};
    this.loadMembers();
  }

 openModal() {
    console.log('Parent openModal called');
    if (this.modal) {

      console.log('Parent Modal before called');
      this.modal.open();

       console.log('Parent Modal after called');
    } else {
      console.error('filterModal reference not found');
    }
  }

   onClose() {
    console.log('Modal closed');
  }


  resetFilters() {
    this.memberParams = new MemberParams();
    this.updatedParams = new MemberParams();
    this.loadMembers();
  }

  






}
