import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { SettingsDialogComponent } from './settings-dialog/settings-dialog.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {
  captures: Array<any>;
  devices: Array<MediaDeviceInfo>;
  fullscreen: boolean;
  deviceId: string;
  zoomedIn = true;
  zoomLevel = 1.0;
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
    this.captures = new Array();

    this.getDevices();
  }

  captureImage() {
    this.canvas.nativeElement
      .getContext('2d')
      .drawImage(this.video.nativeElement, 0, 0, 1920, 1280);
    this.captures.push(this.canvas.nativeElement.toDataURL('image/jpeg', 0.2));
    console.log(this.captures);
  }

  closeFullscreen() {
    if (document.exitFullscreen) {
      document.exitFullscreen().then(() => {
        this.fullscreen = false;
      });
    }
  }

  deleteSelectedImage() {
    this.captures.splice(this.selectedImage, 1);
    this.selectedImage = '';
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
      zoomedIn: this.zoomedIn,
      zoomLevel: this.zoomLevel,
      devices: this.devices,
      deviceId: this.deviceId
    };
    const dialogRef = this.dialog.open(SettingsDialogComponent, dialogConfig);
    dialogRef.componentInstance.zoom.subscribe(zoomedIn => {
      console.log('zoom: ' + zoomedIn);
      this.zoomedIn = zoomedIn;
      if (!zoomedIn) {
        this.zoomLevel = 1;
      }
    });
    dialogRef.componentInstance.zoomLevelChange.subscribe(zoomLevel => {
      console.log('zoom level: ' + zoomLevel);
      this.zoomLevel = zoomLevel;
    });
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
      video: { deviceId: { exact: deviceId } }
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

  toggleFullscreen(fullscreen: boolean) {
    if (fullscreen) {
      this.openFullscreen();
    } else {
      this.closeFullscreen();
    }
  }
}
