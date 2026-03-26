import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { Product } from '../../../models/product.model';
import { ProductService, CreateProductRequest } from '../../../services/product.service';
import { UploadService } from '../../../services/upload.service';
import { CategoryService } from '../../../services/category.service';
import { Category } from '../../../models/category';

import { ConfirmationService, MessageService } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { Dialog } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { CommonModule } from '@angular/common';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { FileUpload } from 'primeng/fileupload';
import { SelectModule } from 'primeng/select';
import { Tag } from 'primeng/tag';
import { InputNumber } from 'primeng/inputnumber';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { Table } from 'primeng/table';
import { CheckboxModule } from 'primeng/checkbox';
import { PanelModule } from 'primeng/panel';
import { DividerModule } from 'primeng/divider';

interface Column {
  field: string;
  header: string;
  customExportHeader?: string;
}

interface ExportColumn {
  title: string;
  dataKey: string;
}

@Component({
  selector: 'app-products',
  imports: [
    TableModule,
    Dialog,

    ButtonModule,
    ToastModule,
    ToolbarModule,
    ConfirmDialog,
    InputTextModule,
    TextareaModule,
    CommonModule,
    FileUpload,
    SelectModule,
    Tag,


    FormsModule,
    InputNumber,
    IconFieldModule,
    InputIconModule,
    CheckboxModule,
    PanelModule,
    DividerModule,
  ],
  templateUrl: './products.html',
  styleUrl: './products.scss',
  standalone: true,
  providers: [ConfirmationService, MessageService],
})
export class Products {
  productDialog: boolean = false;

  products!: Product[];

  product!: Product;

  selectedProducts!: Product[] | null;

  submitted: boolean = false;

  uploading: boolean = false;

  backgroundOption: string = 'default';

  statuses!: any[];

  @ViewChild('dt') dt!: Table;

  cols!: Column[];

  exportColumns!: ExportColumn[];

  categories: Category[] = [];

  // Filter properties
  filterCode: string = '';
  filterCategoryId: number | null = null;
  filterBrand: string = '';
  filterMinPrice: number | null = null;
  filterMaxPrice: number | null = null;
  filterIsNew: boolean = false;
  filterIsFeatured: boolean = false;
  filterIsSpotlight: boolean = false;
  filterHasDiscount: boolean = false; // Filter sản phẩm có khuyến mãi
  filterMinDiscount: number | null = null;

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private uploadService: UploadService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private cd: ChangeDetectorRef,
  ) { }

  exportCSV(event: any) {
    this.dt.exportCSV();
  }

  ngOnInit() {
    this.loadProducts();
    this.loadCategories();
    this.initCols();
    this.initStatuses();
  }

  loadCategories() {
    this.categoryService.getAllCategories().subscribe({
      next: (response: any) => {
        if (response.message === 'success' || response.data) {
          this.categories = response.data || [];
        } else {
          this.categories = [];
        }
        this.cd.detectChanges();
      },
      error: (error) => {
        console.error('Error loading categories', error);
      }
    });
  }

  loadProducts() {
    this.productService.getAllProducts(
      this.filterCode,
      this.filterCategoryId ? this.filterCategoryId.toString() : undefined,
      this.filterBrand,
      this.filterMinPrice || undefined,
      this.filterMaxPrice || undefined,
      this.filterIsNew,
      this.filterIsFeatured,
      this.filterIsSpotlight
    ).subscribe({
      next: (data) => {
        // Client-side filter for discount products
        if (this.filterHasDiscount) {
          this.products = data.filter(p => {
            const hasDiscount = p.discountPrice && p.discountPrice > 0;
            if (!hasDiscount) return false;
            if (this.filterMinDiscount !== null) {
              return p.discountPrice! >= this.filterMinDiscount;
            }
            return true;
          });
        } else {
          this.products = data;
        }
        this.cd.markForCheck();
      },
      error: (error) => {
        console.error('Error loading products', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load products',
        });
      },
    });
  }

  get hasActiveFilter(): boolean {
    return !!(
      this.filterCode ||
      this.filterBrand ||
      this.filterCategoryId ||
      this.filterMinPrice !== null ||
      this.filterMaxPrice !== null ||
      this.filterIsNew ||
      this.filterIsFeatured ||
      this.filterIsSpotlight ||
      this.filterHasDiscount ||
      this.filterMinDiscount !== null
    );
  }

  clearFilter() {
    this.filterCode = '';
    this.filterBrand = '';
    this.filterCategoryId = null;
    this.filterMinPrice = null;
    this.filterMaxPrice = null;
    this.filterIsNew = false;
    this.filterIsFeatured = false;
    this.filterIsSpotlight = false;
    this.filterHasDiscount = false;
    this.filterMinDiscount = null;
    this.loadProducts();
  }

  initStatuses() {
    this.statuses = [
      { label: 'Còn hàng', value: 'instock' },
      { label: 'Sắp hết hàng', value: 'lowstock' },
      { label: 'Hết hàng', value: 'outofstock' },
    ];
  }

  initCols() {
    this.cols = [
      { field: 'code', header: 'Code', customExportHeader: 'Product Code' },
      { field: 'productName', header: 'Name' },
      { field: 'imageUrl', header: 'Image' },
      { field: 'price', header: 'Price' },
      { field: 'category', header: 'Category' },
    ];

    this.exportColumns = this.cols.map((col) => ({
      title: col.header,
      dataKey: col.field,
    }));
  }

  removeBackground: boolean = false;
  uploadingText: string = 'Đang tải ảnh...';
  onSelect(event: any) {
    const file = event.files[0];
    this.uploading = true;
    this.uploadingText = this.removeBackground ? 'Đang xóa nền...' : 'Đang tải ảnh...';

    this.uploadService.uploadImage(file).subscribe({
      next: (res) => {
        let url = res.url;
        if (this.removeBackground) {
          url = url.replace('/upload/', '/upload/e_background_removal/');
        }
        this.product.imageUrl = url;
        this.uploading = false;
      },
      error: (err) => {
        console.error('Upload thất bại:', err);
        this.uploading = false;
      }
    });
  }

  get isEditing(): boolean {
    return !!this.product?.productId;
  }

  openNew() {
    this.product = {} as Product;
    this.submitted = false;
    this.backgroundOption = 'default';
    this.productDialog = true;
  }

  editProduct(product: Product) {
    this.product = { ...product };
    this.backgroundOption = 'default';
    this.productDialog = true;
  }

  deleteSelectedProducts() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the selected products?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      rejectButtonProps: {
        label: 'No',
        severity: 'secondary',
        variant: 'text',
      },
      acceptButtonProps: {
        severity: 'danger',
        label: 'Yes',
      },
      accept: () => {
        this.products = this.products.filter(
          (val) => !this.selectedProducts?.includes(val),
        );
        this.selectedProducts = null;
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Products Deleted',
          life: 3000,
        });
      },
    });
  }

  hideDialog() {
    this.productDialog = false;
    this.submitted = false;
  }

  deleteProduct(product: Product) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete ' + product.productName + '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      rejectButtonProps: {
        label: 'No',
        severity: 'secondary',
        variant: 'text',
      },
      acceptButtonProps: {
        severity: 'danger',
        label: 'Yes',
      },
      accept: () => {
        this.products = this.products.filter((val) => val.productId !== product.productId);
        // this.product = {};
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Product Deleted',
          life: 3000,
        });
      },
    });
  }

  findIndexById(id: number): number {
    let index = -1;
    for (let i = 0; i < this.products.length; i++) {
      if (this.products[i].productId == id) {
        index = i;
        break;
      }
    }

    return index;
  }

  createId(): string {
    let id = '';
    var chars =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (var i = 0; i < 5; i++) {
      id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return id;
  }

  getSeverity(status: string): 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast' | undefined {
    switch (status) {
      case 'Còn hàng':
        return 'success';
      case 'Sắp hết hàng':
        return 'warn';
      case 'Hết hàng':
        return 'danger';
      default:
        return 'info';
    }
  }

  getStockStatus(stock: number): string {
    if (stock > 10) return 'Còn hàng';
    if (stock > 0) return 'Sắp hết hàng';
    return 'Hết hàng';
  }

  getDiscountStatus(discountPrice: number): string {
    if (discountPrice) return `Giảm ${discountPrice}%`;
    return 'Không khuyến mãi';
  }

  getSeverityDiscount(discountPrice: number): 'success' | 'danger' {
    if (discountPrice) return 'success';
    return 'danger';
  }

  saveProduct() {
    this.submitted = true;

    if (this.product.productName?.trim() && this.product.categoryId) {
      if (this.product.productId) {
        // Update existing product (TODO: call update API when available)
        this.products[this.findIndexById(this.product.productId)] = this.product;
        this.products = [...this.products];
        this.productDialog = false;
        this.messageService.add({
          severity: 'success',
          summary: 'Thành công',
          detail: 'Cập nhật sản phẩm thành công',
          life: 3000,
        });
      } else {
        // Create new product via API
        const request: CreateProductRequest = {
          categoryId: this.product.categoryId?.toString() || '',
          productName: this.product.productName,
          description: this.product.description,
          price: this.product.price || 0,
          imageUrl: this.product.imageUrl,
          code: this.product.code,
          discountPrice: this.product.discountPrice ?? undefined,
          currency: this.product.currency,
          brand: this.product.brand,
          stock: this.product.stock || 0,
          isNew: this.product.isNew || false,
          isFeatured: this.product.isFeatured || false,
          isSpotlight: this.product.isSpotlight || false,
        };

        this.productService.createProduct(request).subscribe({
          next: (res) => {
            this.product.productId = res.productId;
            this.products.push(this.product);
            this.products = [...this.products];
            this.productDialog = false;
            this.messageService.add({
              severity: 'success',
              summary: 'Thành công',
              detail: 'Tạo sản phẩm thành công',
              life: 3000,
            });
          },
          error: (err) => {
            console.error('Create product failed', err);
            this.messageService.add({
              severity: 'error',
              summary: 'Lỗi',
              detail: 'Tạo sản phẩm thất bại',
              life: 3000,
            });
          },
        });
      }
    }
  }

  downloadTemplate() {
    const templateData = [
      {
        'Code': 'SP001',
        'Product Name': 'Example Product',
        'Price': 100000,
        'Brand': 'Brand Name',
        'Category': 'Category Name',
        'Stock': 100,
        'Description': 'Product Description'
      }
    ];

    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(templateData);
    const wb: XLSX.WorkBook = { Sheets: { 'Template': ws }, SheetNames: ['Template'] };
    const excelBuffer: any = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer, 'product_template');
  }

  saveAsExcelFile(buffer: any, fileName: string): void {
    const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const EXCEL_EXTENSION = '.xlsx';
    const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
    saveAs(data, fileName + EXCEL_EXTENSION);
  }

  onImportExcel(event: any) {
    const file = event.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const bstr: string = e.target.result;
        const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });
        const wsname: string = wb.SheetNames[0];
        const ws: XLSX.WorkSheet = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws);

        console.log('Imported Data:', data);

        // TODO: Call API to save products
        // this.productService.bulkCreateProducts(data).subscribe(...)

        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Data read successfully (Check Console)',
          life: 3000,
        });
      };
      reader.readAsBinaryString(file);
      // Clear file upload
      event.originalEvent.target.value = '';
    }
  }
}
