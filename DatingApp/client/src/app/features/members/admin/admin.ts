import { Component, inject } from '@angular/core';
import { AccountService } from '../../../_services/account';
import { CommonModule } from '@angular/common';
import { UserManagement } from "../../user-management/user-management";
import { PhotoManagenent } from "../../photo-managenent/photo-managenent";

@Component({
  selector: 'app-admin',
  imports: [CommonModule, UserManagement, PhotoManagenent],
  templateUrl: './admin.html',
  styleUrl: './admin.css'
})
export class Admin {

  protected accountService = inject(AccountService);
  activeTab = 'photos';
  tabs = [
    {label: 'Photo moderation', value: 'photos'},
    {label: 'User management', value: 'roles'},
  ]

  setTab(tab: string) {
    this.activeTab = tab;
  }

}
