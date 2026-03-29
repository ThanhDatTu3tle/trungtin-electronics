import { Component, ChangeDetectorRef } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { Helper } from '../../../shared/helpers/_helper';

import { CategoryService } from '../../../services/category.service';
import { UploadService } from '../../../services/upload.service';

import { MenuItem, ConfirmationService, MessageService } from 'primeng/api';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { SplitButtonModule } from 'primeng/splitbutton';
import { InputTextModule } from 'primeng/inputtext';
import { Tooltip } from 'primeng/tooltip';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { DialogModule } from 'primeng/dialog';
import { FloatLabel } from 'primeng/floatlabel';
import { TextareaModule } from 'primeng/textarea';
import { FileUploadModule } from 'primeng/fileupload';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.html',
  styleUrl: './categories.scss',
  standalone: true,
  imports: [
    FormsModule,
    RouterModule,

    BreadcrumbModule,
    ToolbarModule,
    ButtonModule,
    IconFieldModule,
    InputIconModule,
    SplitButtonModule,
    InputTextModule,
    Tooltip,
    TableModule,
    TagModule,
    ToastModule,
    ConfirmPopupModule,
    DialogModule,
    FloatLabel,
    TextareaModule,
    FileUploadModule
  ],
  providers: [ConfirmationService, MessageService]
})
export class Categories {
  items: MenuItem[] = [
    { label: 'Quản lý' },
    { label: 'Danh mục sản phẩm', routerLink: '/admin/categories' },
  ];
  home: MenuItem = { icon: 'pi pi-home', routerLink: '/' };
  itemsToolbar: MenuItem[] | undefined;
  categories!: any; // Categories[]

  constructor(
    private cdr: ChangeDetectorRef,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private uploadService: UploadService,
    private categoryService: CategoryService
  ) { }

  ngOnInit() {
    this.itemsToolbar = [
      {
        label: 'Update',
        icon: 'pi pi-refresh',
      },
      {
        label: 'Delete',
        icon: 'pi pi-times',
      },
    ];

    this.loadDataCategory();
  }

  // GET
  loadDataCategory() {
    this.categoryService.getAllCategories().subscribe((response: any) => {
      if (response.message == 'success') {
        this.categories = response.data;

        this.categories.forEach((item: any) => {
          item.createdDate = Helper.formatDateTime(item.createdDate);
          item.updatedDate = Helper.formatDateTime(item.updatedDate);
          item.statusName = item.status == -1 ? 'Any' : (item.status == 1 ? 'Sẵn sàng' : 'Đã xóa')
        });
        this.cdr.detectChanges();
      }
    });
  }

  categoryId: number | undefined;
  categoryName: string | undefined;
  description: string | undefined;
  key: string | undefined;
  icon: string | undefined;
  // CREATE
  actionCategory(action: string, data?: any) {
    if (action == 'create') {
      this.visible = true;
    } else if (action == 'update') {
      this.visible = true;
    }
  }
  createCategory() {
    this.categoryService.createCategory()
  }

  // UPDATE
  visible: boolean = false;
  updateCategory(data: any) {
    this.categoryService.updateCategory()
  }

  // DELETE
  deleteCategory(event: any) {
    this.confirmationService.confirm({
      target: event.currentTarget as EventTarget,
      message: 'Bạn có chắc muốn xóa danh mục này chứ?',
      icon: 'pi pi-info-circle',
      rejectButtonProps: {
        label: 'Cancel',
        severity: 'secondary',
        outlined: true
      },
      acceptButtonProps: {
        label: 'Delete',
        severity: 'danger'
      },
      accept: () => {
        this.messageService.add({ severity: 'info', summary: 'Confirmed', detail: 'Xóa thành công', life: 2000 });
      },
      reject: () => {
        this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'Bạn đã từ chối', life: 2000 });
      }
    });
  }

  restoreCategory(event: any) {
    this.confirmationService.confirm({
      target: event.currentTarget as EventTarget,
      message: 'Bạn có chắc muốn khôi phục danh mục này chứ?',
      icon: 'pi pi-info-circle',
      rejectButtonProps: {
        label: 'Cancel',
        severity: 'secondary',
        outlined: true
      },
      acceptButtonProps: {
        label: 'Delete',
        severity: 'danger'
      },
      accept: () => {
        this.messageService.add({ severity: 'info', summary: 'Confirmed', detail: 'Khôi phục thành công', life: 2000 });
      },
      reject: () => {
        this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'Bạn đã từ chối', life: 2000 });
      }
    });
  }

  getSeverity(status: number): any {
    switch (status) {
      case 1:
        return 'success';
      case -1:
        return 'warn';
      case 0:
        return 'danger';
    }
  }

  onSelectFile(event: any) {
    const file = event.files[0];
    if (file) {
      this.uploadService.uploadImage(file).subscribe({
        next: (res) => {
          this.icon = res.url;
          this.cdr.detectChanges();
          this.messageService.add({
            severity: 'success',
            summary: 'Thành công',
            detail: 'Tải icon lên thành công',
            life: 3000,
          });
        },
        error: (err) => {
          console.error('Upload failed', err);
          this.messageService.add({
            severity: 'error',
            summary: 'Lỗi',
            detail: 'Tải icon lên thất bại',
            life: 3000,
          });
        },
      });
    }
  }
  onUploadIcon(event: any) {
    console.log(event);
  }
}
