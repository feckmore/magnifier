import {
  Component,
  ViewChild,
  OnInit,
  ElementRef,
  AfterViewInit
} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {
  constraints = {
    audio: false,
    video: true
  };

  @ViewChild('video', { static: false })
  public video: ElementRef;

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
}
