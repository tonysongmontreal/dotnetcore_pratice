import { Component, ElementRef, inject, signal, ViewChild } from '@angular/core';
import { MembersService } from '../../_services/MembersService';

import { Member, MemberParams } from '../../_models/member';

import { MemberCard } from "../../features/members/member-card/member-card";
import { PaginatedResult } from '../../_models/pagination';
import { Paginator } from "../../../shared/paginator/paginator";
import { FileterModal } from '../../features/members/fileter-modal/fileter-modal';



@Component({
  selector: 'app-member-list',
  imports: [ MemberCard, Paginator,FileterModal],
  templateUrl: './member-list.html',
  styleUrl: './member-list.css'
})
export class MemberList {

  // @ViewChild('filterModal') modal!: FileterModal;
  // @ViewChild('filterModal', { static: false }) modal!: FileterModal;

    @ViewChild('filterModal') modal!: FileterModal;

  private memberService = inject(MembersService);
 // protected members$: Observable<Member[]>;
  // protected paginatedMembers$! : Observable<PaginatedResult<Member>>
  protected paginatedMembers = signal<PaginatedResult<Member> | null>(null);
  protected memberParams = new MemberParams();
  private updatedParams = new MemberParams();
    private elementRef = inject(ElementRef);

  constructor() {

   // this.members$ = this.memberService.getMembers();
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
      this.modal.openModal();
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

   get displayMessage(): string {
    const defaultParams = new MemberParams();

    const filters: string[] = [];

    if (this.updatedParams.gender) {
      filters.push(this.updatedParams.gender + 's')
    } else {
      filters.push('Males, Females');
    }

    if (this.updatedParams.minAge !== defaultParams.minAge
        || this.updatedParams.maxAge !== defaultParams.maxAge) {
        filters.push(` ages ${this.updatedParams.minAge}-${this.updatedParams.maxAge}`)
    }

    filters.push(this.updatedParams.orderBy === 'lastActive'
        ? 'Recently active' : 'Newest members');

    return filters.length > 0 ? `Selected: ${filters.join('  | ')}` : 'All members'
  }







}
