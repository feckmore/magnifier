import { Component, OnInit, EventEmitter, Output, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatSlideToggleChange } from '@angular/material';

@Component({
  selector: 'app-settings-dialog',
  templateUrl: './settings-dialog.component.html',
  styleUrls: ['./settings-dialog.component.scss']
})
export class SettingsDialogComponent implements OnInit {
  @Output() zoom = new EventEmitter();
  zoomed: boolean;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit() {
    this.zoomed = this.data.zoomedIn;
  }

  toggleZoom(event: MatSlideToggleChange) {
    this.zoomed = event.checked;
    this.zoom.emit(event.checked);
  }
}
