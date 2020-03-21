import { Component, EventEmitter, Output, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatRadioChange } from '@angular/material/radio';

@Component({
  selector: 'app-settings-dialog',
  templateUrl: './settings-dialog.component.html',
  styleUrls: ['./settings-dialog.component.scss']
})
export class SettingsDialogComponent implements OnInit {
  @Output() deviceChange = new EventEmitter();

  deviceId: string;
  devices: MediaDeviceInfo[];

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit() {
    console.log(this.data);
    this.deviceId = this.data.deviceId;
    this.devices = this.data.devices;
  }

  changeDevice(event: MatRadioChange) {
    this.deviceChange.emit(event.value);
  }

  parseLabel(label: string): string {
    if (label.indexOf('(') >= 0) {
      return label.substr(0, label.indexOf('('));
    }
    return label;
  }
}
