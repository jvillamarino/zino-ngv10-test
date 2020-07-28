import {
  AfterViewInit,
  Component,
  OnInit,
  ViewChild,
  Input,
  EventEmitter,
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { UserService } from '@services/user.service';
import { User, Credit } from '@shared/models/common';
import {
  trigger,
  style,
  state,
  transition,
  animate,
} from '@angular/animations';
import { CreditService } from '@services/credit.service';

@Component({
  selector: 'app-list-user',
  templateUrl: './list-user.component.html',
  styleUrls: ['./list-user.component.scss'],
  animations: [
    trigger('expandCredit', [
      state('hide', style({ 'max-width': '0%' })),
      state('show', style({ 'max-width': '40%' })),
      transition('show <=> hide', animate('1000ms ease-in-out')),
    ]),
    trigger('tableReduce', [
      state('hide', style({ 'max-width': '100%' })),
      state('show', style({ 'max-width': '57%' })),
      transition('show <=> hide', animate('1000ms ease-in-out')),
    ]),
  ],
})
export class ListUserComponent implements AfterViewInit, OnInit {
  @Input() evtEmitter: EventEmitter<any>;
  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('paginatorCredit') paginatorCredit: MatPaginator;
  dataSource: MatTableDataSource<User>;
  dataSourceCredit: MatTableDataSource<Credit>;
  public expandCredit: boolean = false;
  private _selectedUser: User;

  constructor(
    private _userService: UserService,
    private _creditService: CreditService
  ) {}

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['DNI', 'FULL_NAME', 'EMAIL', 'VIEW'];
  nameDisplayedColumns = [
    'Cédula de Identidad',
    'Nombre',
    'E-mail',
    'Ver Historial ',
  ];
  displayedCreditColumns = ['DNI', 'VALUE', 'STATUS', 'PAYMENT_DATE'];
  nameCreditDisplayedColumns = [
    'Cédula de Identidad',
    'Crédito',
    'Estado',
    'Fecha Pago',
  ];

  public isDataAvaible: boolean = false;
  public isLoading: boolean = true;

  ngOnInit() {
    this.evtEmitter.subscribe((res) => this.loadUsers());
  }

  ngAfterViewInit() {
    this.loadUsers();
  }

  private loadUsers() {
    this.isLoading = true;
    this._userService.getUsers().subscribe((res) => {
      if (res.length > 0) {
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.paginator = this.paginator;
        this.isDataAvaible = true;
      }
      this.isLoading = false;
    });
  }

  expandView(user: User) {
    this.isLoading = true;
    this._creditService.getCreditByUser(user.DNI).subscribe((res) => {
      this.dataSourceCredit = new MatTableDataSource(res);
      this.dataSourceCredit.paginator = this.paginatorCredit;
      this.isLoading = false;
    });
    if (user === this._selectedUser) {
      this.expandCredit = !this.expandCredit;
    } else {
      this.expandCredit = true;
    }
    this._selectedUser = user;
  }
}
