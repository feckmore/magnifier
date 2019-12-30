import { Component, OnInit, EventEmitter, Output, Inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatSlideToggleChange,
  MatSliderChange
} from '@angular/material';

@Component({
  selector: 'app-settings-dialog',
  templateUrl: './settings-dialog.component.html',
  styleUrls: ['./settings-dialog.component.scss']
})
export class SettingsDialogComponent implements OnInit {
  @Output() zoom = new EventEmitter();
  @Output() zoomLevelChange = new EventEmitter();
  zoomedIn: boolean;
  zoomLevel: number;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit() {
    this.zoomedIn = this.data.zoomedIn;
    this.zoomLevel = this.data.zoomLevel;
  }

  toggleZoom(event: MatSlideToggleChange) {
    this.zoomedIn = event.checked;
    this.zoom.emit(event.checked);
  }

  setZoomLevel(event: MatSliderChange) {
    this.zoomLevel = event.value;
    this.zoomLevelChange.emit(event.value);
  }
}
