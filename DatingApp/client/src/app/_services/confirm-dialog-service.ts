import { Injectable } from '@angular/core';
import { ComfirmDialog } from '../../shared/comfirm-dialog/comfirm-dialog';

@Injectable({
  providedIn: 'root'
})
export class ConfirmDialogService {

  private dialogComponent?: ComfirmDialog;

  register(component: ComfirmDialog) {
    this.dialogComponent = component;
  }

  confirm(message = 'Are you sure?'): Promise<boolean> {
    if (!this.dialogComponent) {
      throw new Error('Confirm dialog component is not registered');
    }
    return this.dialogComponent.open(message);
  }

}
