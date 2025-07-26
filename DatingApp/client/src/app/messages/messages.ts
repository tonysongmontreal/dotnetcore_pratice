import { Component, inject, OnInit, signal } from '@angular/core';
import { MessageService } from '../_services/message-service';
import { PaginatedResult } from '../_models/pagination';
import { Message } from '../_models/message';
import { Paginator } from "../../shared/paginator/paginator";
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { ConfirmDialogService } from '../_services/confirm-dialog-service';

@Component({
  selector: 'app-messages',
   imports: [Paginator, RouterLink, DatePipe],
  templateUrl: './messages.html',
  styleUrl: './messages.css'
})
export class Messages implements OnInit {

  private messageService = inject(MessageService);
  private confirmDialog=inject(ConfirmDialogService);
  protected container = 'Inbox';
  protected fetchedContainer = 'Inbox';
  protected pageNumber = 1;
  protected pageSize = 10;
  protected paginatedMessages = signal<PaginatedResult<Message> | null>(null);

    tabs = [
    { label: 'Inbox', value: 'Inbox' },
    { label: 'Outbox', value: 'Outbox' },
  ]

   ngOnInit(): void {
    this.loadMessages();
  }

    loadMessages() {
    this.messageService.getMessages(this.container, this.pageNumber, this.pageSize).subscribe({
      next: (response:PaginatedResult<Message>) => {
        this.paginatedMessages.set(response);
        this.fetchedContainer = this.container;
      }
    })
  }

  async confirmDelete(event: Event, id: string) {
    event.stopPropagation();
    const ok = await this.confirmDialog.confirm('Are you sure you want to delete this message?')
    if (ok) this.deleteMessage(id);
  }

    deleteMessage( id: string) {

    this.messageService.deleteMessage(id).subscribe({
      next: () => {

            this.loadMessages();
      }
    })
  }

    get isInbox() {
    return this.fetchedContainer === 'Inbox';
  }

    setContainer(container: string) {
    this.container = container;
    this.pageNumber = 1;
    this.loadMessages();
  }

    onPageChange(event: { pageNumber: number, pageSize: number }) {
    this.pageSize = event.pageSize;
    this.pageNumber = event.pageNumber;
    this.loadMessages();
  }



}
