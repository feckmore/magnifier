import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { MatDialog, MatDialogConfig, MatSliderChange } from '@angular/material';
import { SettingsDialogComponent } from './settings-dialog/settings-dialog.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {
  devices: Array<MediaDeviceInfo>;
  fullscreen: boolean;
  deviceId: string;
  zoomLevel = 2.0;
  selectedImage: any;
  selectedIndex: number;

  @ViewChild('canvas', { static: false })
  public canvas: ElementRef;

  @ViewChild('wrapper', { static: false })
  public wrapper: ElementRef;

  @ViewChild('video', { static: false })
  public video: ElementRef;

  constructor(private dialog: MatDialog) {}

  public ngAfterViewInit() {
    this.getDevices();
  }

  closeFullscreen() {
    if (document.exitFullscreen) {
      document.exitFullscreen().then(() => {
        this.fullscreen = false;
      });
    }
  }

  getDevices() {
    this.devices = new Array();

    if (navigator.mediaDevices.enumerateDevices) {
      navigator.mediaDevices.enumerateDevices().then(devices => {
        devices.forEach(device => {
          if (device.kind === 'videoinput') {
            this.devices.push(device);
          }
        });

        if (devices.length > 0 && (!this.deviceId || this.deviceId === '')) {
          this.setDefaultDevice();
        }
      });
    }
  }

  openFullscreen() {
    if (this.wrapper.nativeElement.requestFullscreen) {
      this.wrapper.nativeElement.requestFullscreen().then(() => {
        this.fullscreen = true;
      });
    } else if (this.wrapper.nativeElement.mozRequestFullScreen) {
      /* Firefox */
      this.wrapper.nativeElement.mozRequestFullScreen().then(() => {
        this.fullscreen = true;
      });
    } else if (this.wrapper.nativeElement.webkitRequestFullscreen) {
      /* Chrome, Safari and Opera */
      this.wrapper.nativeElement.webkitRequestFullscreen().then(() => {
        this.fullscreen = true;
      });
    } else if (this.wrapper.nativeElement.msRequestFullscreen) {
      /* IE/Edge */
      this.wrapper.nativeElement.msRequestFullscreen().then(() => {
        this.fullscreen = true;
      });
    }
  }

  openSettingsDialog() {
    this.getDevices();

    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'settings-dialog-panel';
    dialogConfig.minWidth = '30vw';
    dialogConfig.data = {
      devices: this.devices,
      deviceId: this.deviceId
    };
    const dialogRef = this.dialog.open(SettingsDialogComponent, dialogConfig);
    dialogRef.componentInstance.deviceChange.subscribe(deviceId => {
      console.log('new device: ' + deviceId);
      this.deviceId = deviceId;
      this.setDevice(deviceId);
    });
  }

  setDefaultDevice() {
    // just sets to the first one in the list...
    // TODO: instead save last selected camera
    if (this.devices && this.devices.length > 0) {
      this.deviceId = this.devices[0].deviceId;
      this.setDevice(this.deviceId);
    }
  }

  setDevice(deviceId: string) {
    const constraints = {
      audio: false,
      video: { deviceId: { exact: deviceId }, width: 1920, height: 1080 }
    };
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia(constraints).then(stream => {
        this.video.nativeElement.srcObject = stream;
        this.video.nativeElement.onloadedmetadata = () => {
          this.video.nativeElement.play();
        };
      });
    }
  }

  setZoomLevel(event: MatSliderChange) {
    this.zoomLevel = event.value;
  }

  toggleFullscreen(fullscreen: boolean) {
    if (fullscreen) {
      this.openFullscreen();
    } else {
      this.closeFullscreen();
    }
  }
}
