import {
  Component,
  OnInit,
  ViewChild,
  Input,
  EventEmitter,
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { CreditService } from '@services/credit.service';

@Component({
  selector: 'app-list-request',
  templateUrl: './list-request.component.html',
  styleUrls: ['./list-request.component.scss'],
})
export class ListRequestComponent implements OnInit {
  @ViewChild('paginator', { static: false }) paginator: MatPaginator;
  @Input() statusRequest: number; // 0 -> Refused; 1 -> Approved
  @Input() evtEmitter: EventEmitter<any>;
  public dataSource: MatTableDataSource<any>;
  public isDataAvaible: boolean = false;
  public isLoading: boolean = true;

  displayedColumns = ['DNI', 'FULL_NAME', 'VALUE'];
  nameDisplayedColumns = [
    'Cédula de Identidad',
    'Nombre',
    'Crédito solicitado ',
  ];

  constructor(private _creditService: CreditService) {}

  ngOnInit(): void {
    this.evtEmitter.subscribe((res) => this.loadCredits());
    if (this.statusRequest) {
      this.displayedColumns.push('PAY');
      this.nameDisplayedColumns.push('Pagar');
    }
  }

  ngAfterViewInit(): void {
    this.loadCredits();
  }

  private loadCredits() {
    this._creditService.getCredits(this.statusRequest).subscribe((res) => {
      if (res.length > 0) {
        this.isDataAvaible = true;
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.paginator = this.paginator;
      }
      this.isLoading = false;
    });
  }
}
