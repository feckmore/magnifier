import { Component, OnInit, EventEmitter, Output, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-settings-dialog',
  templateUrl: './settings-dialog.component.html',
  styleUrls: ['./settings-dialog.component.scss']
})
export class SettingsDialogComponent implements OnInit {
  @Output() zoom = new EventEmitter();

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit() {}

  clickFullFrame() {
    this.zoom.emit('false');
  }

  clickZoomIn() {
    this.zoom.emit('true');
  }
}
