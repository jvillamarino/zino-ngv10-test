import { Component, EventEmitter } from '@angular/core';
import { map } from 'rxjs/operators';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { MatDialog } from '@angular/material/dialog';
import { ApplicationFormComponent } from '@modules/dashboard/components/application-form/application-form.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent {
  public evtEmitter: EventEmitter<any> = new EventEmitter();

  cards = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
    map(({ matches }) => {
      if (matches) {
        return [
          { title: 'Usuarios registrados', cols: 1, rows: 1 },
          { title: 'Solicitudes Rechazadas', cols: 1, rows: 1 },
          { title: 'Solicitudes Aprobadas', cols: 1, rows: 1 },
        ];
      }

      return [
        { title: 'Usuarios registrados', cols: 2, rows: 1 },
        { title: 'Solicitudes Rechazadas', cols: 1, rows: 1 },
        { title: 'Solicitudes Aprobadas', cols: 1, rows: 1 },
      ];
    })
  );

  constructor(
    private breakpointObserver: BreakpointObserver,
    public dialog: MatDialog
  ) {}

  openDialog(): void {
    const dialogRef = this.dialog.open(ApplicationFormComponent, {
      width: '600px',
      height: '600px',
      disableClose: true,
    });

    this.dialog.afterAllClosed.subscribe((res) => this.evtEmitter.emit(true));
  }
}
