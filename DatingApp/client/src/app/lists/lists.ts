import { Component, inject, OnInit, signal } from '@angular/core';
import { LikesService } from '../_services/likes-service';
import { PaginatedResult } from '../_models/pagination';
import { Member } from '../_models/member';
import { Paginator } from "../../shared/paginator/paginator";
import { MemberCard } from "../features/members/member-card/member-card";

@Component({
  selector: 'app-lists',
  imports: [Paginator, MemberCard],
  templateUrl: './lists.html',
  styleUrl: './lists.css'
})
export class Lists implements OnInit {


  private likesService = inject(LikesService);
  protected paginatedResult = signal<PaginatedResult<Member> | null>(null);
  protected predicate = 'liked';
  protected pageNumber = 1;
  protected pageSize = 5;

  tabs = [
    {label: 'Liked', value: 'liked'},
    {label: 'Liked me', value: 'likedBy'},
    {label: 'Mutual', value: 'mutual'},
  ]

  ngOnInit(): void {
    this.loadLikes();
  }



  setPredicate(predicate: string) {
    if (this.predicate !== predicate) {
      this.predicate = predicate;
      this.pageNumber = 1;
      this.loadLikes();
    }
  }

  loadLikes() {
    this.likesService.getLikes(this.predicate, this.pageNumber, this.pageSize).subscribe({
      next: (response: PaginatedResult<Member>)  => this.paginatedResult.set(response)
    })
  }

  onPageChange(event: { pageNumber: number, pageSize: number }) {
    this.pageSize = event.pageSize;
    this.pageNumber = event.pageNumber;
    this.loadLikes();
  }

}
