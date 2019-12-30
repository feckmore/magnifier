import {
  Component,
  ViewChild,
  OnInit,
  ElementRef,
  AfterViewInit
} from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { SettingsDialogComponent } from './settings-dialog/settings-dialog.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {
  zoomedIn = true;
  zoomLevel = 1.0;

  constraints = {
    audio: false,
    video: true
  };

  @ViewChild('video', { static: false })
  public video: ElementRef;

  constructor(private dialog: MatDialog) {}

  public ngAfterViewInit() {
    if (
      navigator.mediaDevices &&
      navigator.mediaDevices.getUserMedia(this.constraints)
    ) {
      navigator.mediaDevices.getUserMedia({ video: true }).then(stream => {
        this.video.nativeElement.srcObject = stream;
        this.video.nativeElement.onloadedmetadata = e => {
          this.video.nativeElement.play();
        };
      });
    }
  }

  openSettingsDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'settings-dialog-panel';
    dialogConfig.minWidth = '30vw';
    dialogConfig.data = { zoomedIn: this.zoomedIn, zoomLevel: this.zoomLevel };
    const dialogRef = this.dialog.open(SettingsDialogComponent, dialogConfig);
    dialogRef.componentInstance.zoom.subscribe(zoomedIn => {
      console.log('zoom: ' + zoomedIn);
      this.zoomedIn = zoomedIn;
    });
    dialogRef.componentInstance.zoomLevelChange.subscribe(zoomLevel => {
      console.log('zoom level: ' + zoomLevel);
      this.zoomLevel = zoomLevel;
    });
  }
}
