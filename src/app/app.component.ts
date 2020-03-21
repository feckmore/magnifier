import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatSliderChange } from '@angular/material/slider';
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
  zoomLevel: number;

  @ViewChild('wrapper')
  public wrapper: ElementRef;

  @ViewChild('video')
  public video: ElementRef;

  constructor(private dialog: MatDialog) {}

  public ngAfterViewInit() {
    this.getSettings();
    // this.getDevices();
  }

  closeFullscreen() {
    if (document.exitFullscreen) {
      document.exitFullscreen().then(() => {
        console.log('exiting fullscreen');
      });
    } else {
      console.log('not in fullscreen');
    }
    // in either case, assume no longer in fullscreen
    // on mobile, if in fullscreen then, switch between apps,
    // it will think it's still in full screen
    this.fullscreen = false;
  }

  // getDevices looks for videoinput devices and adds them to the devices var.
  // if the setDefault param is set to true, it will define and set a default device
  getDevices(setDefault: boolean = false) {
    this.devices = new Array();

    if (navigator.mediaDevices.enumerateDevices) {
      navigator.mediaDevices.enumerateDevices().then(devices => {
        devices.forEach(device => {
          if (device.kind === 'videoinput') {
            this.devices.push(device);
          }
        });

        let index = this.devices.length - 1;
        this.devices.forEach((device, i) => {
          if (device.label.toLowerCase().indexOf('back') >= 0) {
            index = i;
          }
        });

        if (
          setDefault &&
          this.devices &&
          this.devices.length > 0 &&
          index >= 0
        ) {
          this.setDevice(this.devices[index].deviceId);
        }
      });
    }
  }

  getSettings() {
    const zoomLevel = parseInt(localStorage.getItem('zoomLevel'), 10);

    if (!isNaN(zoomLevel) && zoomLevel > -1 && zoomLevel < 6) {
      console.log(`localStorage zoomLevel: ${zoomLevel}`);
      this.zoomLevel = zoomLevel;
    } else {
      this.zoomLevel = 2;
      localStorage.setItem('zoomLevel', this.zoomLevel.toString());
    }

    const deviceId = localStorage.getItem('deviceId');
    if (deviceId) {
      console.log(`localStorage deviceId: ${deviceId}`);
      this.setDevice(deviceId);
    } else {
      this.getDevices(true);
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
      this.setDevice(deviceId);
    });
  }

  setDevice(deviceId: string) {
    const constraints = {
      audio: false,
      video: { deviceId: { exact: deviceId }, width: 1920, height: 1080 }
    };
    this.deviceId = deviceId;
    localStorage.setItem('deviceId', deviceId);
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
    localStorage.setItem('zoomLevel', event.value.toString());
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
