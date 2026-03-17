import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';

// PrimeNG
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { ToolbarModule } from 'primeng/toolbar';
import { TagModule } from 'primeng/tag';
import { CheckboxModule } from 'primeng/checkbox';
import { InputNumberModule } from 'primeng/inputnumber';
import { TextareaModule } from 'primeng/textarea';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DatePickerModule } from 'primeng/datepicker';
import { TooltipModule } from 'primeng/tooltip';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';

// Services
import { EventService } from '../../../services/event.service';
import { ProductService } from '../../../services/product.service';

@Component({
  selector: 'app-events',
  templateUrl: './events.html',
  styleUrl: './events.scss',
  standalone: true,
  providers: [ConfirmationService, MessageService],
  imports: [
    CommonModule, FormsModule,
    TableModule, ButtonModule, InputTextModule, DialogModule,
    ToolbarModule, TagModule, CheckboxModule, InputNumberModule,
    TextareaModule, ToastModule, ConfirmDialogModule, DatePickerModule,
    TooltipModule, IconFieldModule, InputIconModule
  ]
})
export class Events implements OnInit {

  constructor(
    private eventService: EventService,
    private productService: ProductService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.loadEvents();
    this.loadAllProducts();
  }

  // ─────────────────────────────────────────────
  // DATA
  // ─────────────────────────────────────────────
  events: any[] = [];
  selectedEvents: any[] = [];
  allProducts: any[] = [];

  get activeEventCount(): number {
    const now = new Date();
    return this.events.filter(e =>
      e.isActive &&
      new Date(e.startDate) <= now &&
      new Date(e.endDate) >= now
    ).length;
  }

  // ─────────────────────────────────────────────
  // LOAD DATA
  // ─────────────────────────────────────────────
  loadEvents() {
    this.eventService.getAllEvents().subscribe({
      next: (res: any) => {
        this.events = Array.isArray(res) ? res : res.data || [];
      },
      error: () => this.messageService.add({
        severity: 'error', summary: 'Lỗi', detail: 'Không thể tải danh sách event'
      })
    });
  }

  loadAllProducts() {
    this.productService.getAllProducts().subscribe({
      next: (res: any) => {
        this.allProducts = Array.isArray(res) ? res : res.data || [];
      }
    });
  }

  // ─────────────────────────────────────────────
  // STATUS HELPERS
  // ─────────────────────────────────────────────
  getEventStatus(event: any): string {
    if (!event.isActive) return 'Tắt';
    const now = new Date();
    const start = new Date(event.startDate);
    const end = new Date(event.endDate);
    if (now < start) return 'Sắp diễn ra';
    if (now > end) return 'Đã kết thúc';
    return 'Đang chạy';
  }

  getEventStatusSeverity(event: any): "success" | "info" | "warn" | "danger" | "secondary" | "contrast" | null | undefined {
    const status = this.getEventStatus(event);
    switch (status) {
      case 'Đang chạy': return 'success';
      case 'Sắp diễn ra': return 'info';
      case 'Đã kết thúc': return 'secondary';
      default: return 'danger';
    }
  }

  getEventStatusIcon(event: any): string {
    const status = this.getEventStatus(event);
    switch (status) {
      case 'Đang chạy': return 'pi pi-bolt';
      case 'Sắp diễn ra': return 'pi pi-clock';
      case 'Đã kết thúc': return 'pi pi-times-circle';
      default: return 'pi pi-ban';
    }
  }

  // ─────────────────────────────────────────────
  // DIALOG THÊM / SỬA EVENT
  // ─────────────────────────────────────────────
  eventDialog: boolean = false;
  submitted: boolean = false;
  isEditMode: boolean = false;
  event: any = this.emptyEvent();

  emptyEvent() {
    return {
      eventId: null,
      name: '',
      description: '',
      discountPercent: 10,
      colorTheme: '#FF6B35',
      bannerUrl: null,
      startDate: new Date(),
      endDate: new Date(),
      isActive: true
    };
  }

  openNew() {
    this.event = this.emptyEvent();
    this.isEditMode = false;
    this.submitted = false;
    this.eventDialog = true;
  }

  editEvent(event: any) {
    this.event = {
      ...event,
      startDate: new Date(event.startDate),
      endDate: new Date(event.endDate)
    };
    this.isEditMode = true;
    this.submitted = false;
    this.eventDialog = true;
  }

  hideDialog() {
    this.eventDialog = false;
    this.submitted = false;
  }

  saveEvent() {
    this.submitted = true;
    if (!this.event.name) return;

    if (this.isEditMode) {
      // Update
      this.eventService.updateEvent(
        this.event.eventId,
        this.event.name,
        this.event.description,
        this.event.discountPercent,
        this.event.colorTheme,
        this.event.bannerUrl,
        this.event.startDate,
        this.event.endDate,
        this.event.isActive,
        'update'
      ).subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'Thành công', detail: 'Đã cập nhật event' });
          this.loadEvents();
          this.hideDialog();
        },
        error: () => this.messageService.add({ severity: 'error', summary: 'Lỗi', detail: 'Cập nhật thất bại' })
      });
    } else {
      // Create
      this.eventService.createEvent(
        this.event.name,
        this.event.description,
        this.event.discountPercent,
        this.event.colorTheme,
        this.event.bannerUrl,
        this.event.startDate,
        this.event.endDate,
        this.event.isActive
      ).subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'Thành công', detail: 'Đã tạo event mới' });
          this.loadEvents();
          this.hideDialog();
        },
        error: () => this.messageService.add({ severity: 'error', summary: 'Lỗi', detail: 'Tạo event thất bại' })
      });
    }
  }

  // ─────────────────────────────────────────────
  // XÓA EVENT
  // ─────────────────────────────────────────────
  deleteEvent(event: any) {
    this.confirmationService.confirm({
      message: `Bạn có chắc muốn xóa event "${event.name}"?`,
      header: 'Xác nhận xóa',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.eventService.updateEvent(
          event.eventId, null, null, null, null, null, null, null, false, 'delete'
        ).subscribe({
          next: () => {
            this.messageService.add({ severity: 'success', summary: 'Đã xóa', detail: 'Event đã được tắt' });
            this.loadEvents();
          }
        });
      }
    });
  }

  deleteSelectedEvents() {
    this.confirmationService.confirm({
      message: `Bạn có chắc muốn xóa ${this.selectedEvents.length} event đã chọn?`,
      header: 'Xác nhận xóa',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        const deletes = this.selectedEvents.map(e =>
          this.eventService.updateEvent(e.eventId, null, null, null, null, null, null, null, false, 'delete')
        );
        Promise.all(deletes.map(d => d.toPromise())).then(() => {
          this.messageService.add({ severity: 'success', summary: 'Đã xóa', detail: 'Các event đã được tắt' });
          this.selectedEvents = [];
          this.loadEvents();
        });
      }
    });
  }

  // ─────────────────────────────────────────────
  // DIALOG GÁN SẢN PHẨM
  // ─────────────────────────────────────────────
  assignDialog: boolean = false;
  selectedEvent: any = null;
  assignedProducts: any[] = [];

  openAssignProducts(event: any) {
    this.selectedEvent = event;
    // Pre-select các sản phẩm đang thuộc event này
    this.assignedProducts = this.allProducts.filter(p => p.eventId === event.eventId);
    this.assignDialog = true;
  }

  saveAssignProducts() {
    const currentAssigned = this.allProducts.filter(p => p.eventId === this.selectedEvent.eventId);
    const newAssigned = this.assignedProducts;

    // Sản phẩm cần gán thêm
    const toAssign = newAssigned.filter(p => !currentAssigned.find(c => c.productId === p.productId));
    // Sản phẩm cần gỡ ra
    const toRemove = currentAssigned.filter(p => !newAssigned.find(n => n.productId === p.productId));

    const assigns = [
      ...toAssign.map(p => this.eventService.assignProductToEvent(p.productId, this.selectedEvent.eventId)),
      ...toRemove.map(p => this.eventService.assignProductToEvent(p.productId, null))
    ];

    if (assigns.length === 0) {
      this.assignDialog = false;
      return;
    }

    Promise.all(assigns.map(a => a.toPromise())).then(() => {
      this.messageService.add({ severity: 'success', summary: 'Thành công', detail: 'Đã cập nhật sản phẩm trong event' });
      this.loadAllProducts();
      this.assignDialog = false;
    });
  }
}
