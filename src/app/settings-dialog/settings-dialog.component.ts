import { Component, EventEmitter, Output, Inject, OnInit } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatSlideToggleChange,
  MatSliderChange,
  MatRadioChange
} from '@angular/material';

@Component({
  selector: 'app-settings-dialog',
  templateUrl: './settings-dialog.component.html',
  styleUrls: ['./settings-dialog.component.scss']
})
export class SettingsDialogComponent implements OnInit {
  @Output() deviceChange = new EventEmitter();
  @Output() zoom = new EventEmitter();
  @Output() zoomLevelChange = new EventEmitter();

  deviceId: string;
  devices: MediaDeviceInfo[];
  zoomedIn: boolean;
  zoomLevel: number;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit() {
    console.log(this.data);
    this.deviceId = this.data.deviceId;
    this.devices = this.data.devices;
    this.zoomedIn = this.data.zoomedIn;
    this.zoomLevel = this.data.zoomLevel;
  }

  changeDevice(event: MatRadioChange) {
    this.deviceChange.emit(event.value);
  }

  parseLabel(label: string): string {
    return label.substr(0, label.indexOf('('));
  }

  toggleZoom(event: MatSlideToggleChange) {
    this.zoomedIn = event.checked;
    this.zoom.emit(event.checked);
    if (!event.checked) {
      this.zoomLevel = 1.0;
    }
  }

  setZoomLevel(event: MatSliderChange) {
    this.zoomLevel = event.value;
    this.zoomLevelChange.emit(event.value);
  }
}
