import { Component, ElementRef, model, output, ViewChild, AfterViewInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MemberParams } from '../../../_models/member';

@Component({
  selector: 'app-fileter-modal',
  imports: [FormsModule],
  templateUrl: './fileter-modal.html',
  styleUrl: './fileter-modal.css'
})
export class FileterModal implements AfterViewInit {

  @ViewChild('filterModal', { static: false }) modalRef!: ElementRef<HTMLDialogElement>;
  closeModal = output();
  submitData = output<MemberParams>();
  memberParams = model(new MemberParams())

  private isModalReady = false;

  constructor() {
    const filters = localStorage.getItem('filters');
    if (filters) {
      this.memberParams.set(JSON.parse(filters));
    }
  }

  ngAfterViewInit() {
    console.log('AfterViewInit - modalRef:', this.modalRef);
    // 确保模态框已准备好
    setTimeout(() => {
      this.isModalReady = true;
      console.log('Modal is ready');
    }, 100);
  }

  // 修复方法名，确保与父组件调用一致
  openModal() {
    this.open();
  }

  open() {
    console.log('模态框打开方法被调用');
    console.log('modalRef:', this.modalRef);
    console.log('isModalReady:', this.isModalReady);

    // 检查模态框是否已准备好
    if (!this.isModalReady) {
      console.warn('模态框还未准备好，等待初始化完成...');
      setTimeout(() => this.open(), 100);
      return;
    }

    // 多重检查确保 modalRef 可用
    if (this.modalRef && this.modalRef.nativeElement) {
      const modal = this.modalRef.nativeElement;
      console.log('Modal element:', modal);
      console.log('Modal open state before:', modal.open);

      try {
        // 方案1：使用标准的 showModal() 方法
        modal.showModal();
        console.log('使用 showModal() 成功');
        console.log('Modal open state after showModal:', modal.open);
      } catch (error) {
        console.error('showModal 失败，使用备用方案:', error);

        // 方案2：手动控制显示
        this.manualShowModal(modal);
      }
    } else {
      console.error('modalRef 未找到或未初始化');
      console.error('modalRef:', this.modalRef);
    }
  }

  private manualShowModal(modal: HTMLDialogElement) {
    console.log('使用手动方式打开模态框');

    // 设置手动打开标识
    modal.setAttribute('data-manual-open', 'true');
    modal.setAttribute('open', '');

    // 设置样式
    modal.style.display = 'flex';
    modal.style.position = 'fixed';
    modal.style.top = '0';
    modal.style.left = '0';
    modal.style.right = '0';
    modal.style.bottom = '0';
    modal.style.zIndex = '9999';
    modal.style.background = 'rgba(0, 0, 0, 0.5)';
    modal.style.alignItems = 'center';
    modal.style.justifyContent = 'center';
    modal.style.opacity = '1';
    modal.style.pointerEvents = 'auto';

    console.log('手动打开模态框完成');
  }

  close() {
    console.log('模态框关闭方法被调用');
    if (this.modalRef?.nativeElement) {
      const modal = this.modalRef.nativeElement;
      console.log('Modal open state before close:', modal.open);

      try {
        // 如果是标准打开方式，使用标准关闭
        if (modal.open) {
          modal.close();
          console.log('使用标准方式关闭模态框');
        }
      } catch (error) {
        console.error('标准关闭方式失败:', error);
      }

      // 无论如何都执行手动关闭清理
      this.manualCloseModal(modal);
    }
    this.closeModal.emit();
  }

  private manualCloseModal(modal: HTMLDialogElement) {
    console.log('执行手动关闭清理');

    // 移除手动打开标识
    modal.removeAttribute('data-manual-open');
    modal.removeAttribute('open');

    // 清除所有样式
    modal.style.display = '';
    modal.style.position = '';
    modal.style.top = '';
    modal.style.left = '';
    modal.style.right = '';
    modal.style.bottom = '';
    modal.style.zIndex = '';
    modal.style.background = '';
    modal.style.alignItems = '';
    modal.style.justifyContent = '';
    modal.style.opacity = '';
    modal.style.pointerEvents = '';

    console.log('手动关闭清理完成');
  }

  submit() {
    console.log('提交方法被调用', this.memberParams());
    // 保存筛选器到 localStorage
    localStorage.setItem('filters', JSON.stringify(this.memberParams()));
    this.submitData.emit(this.memberParams());
    this.close();
  }

  onMinAgeChange() {
    const params = this.memberParams();
    if (params.minAge < 18) {
      params.minAge = 18;
      this.memberParams.set(params);
    }
  }

  onMaxAgeChange() {
    const params = this.memberParams();
    if (params.maxAge < params.minAge) {
      params.maxAge = params.minAge;
      this.memberParams.set(params);
    }
  }
}
