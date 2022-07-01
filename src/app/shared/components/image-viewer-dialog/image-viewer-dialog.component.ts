import { Component, Inject, HostListener } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Constants } from '../../constants';
import { HttpClient } from '@angular/common/http';

export enum KEY_CODE {
  RIGHT_ARROW = 'ArrowRight',
  LEFT_ARROW = 'ArrowLeft'
}

@Component({
  selector: 'app-image-viewer-dialog',
  templateUrl: './image-viewer-dialog.component.html',
  styleUrls: ['./image-viewer-dialog.component.scss']
})
export class ImageViewerDialogComponent {

  currentIndex: number;
  images: Array<any>;

  imageUrl: string;
  imageThumbnailUrl: string;
  comment: string;

  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if (event.key === KEY_CODE.LEFT_ARROW) {
      this.onClickButtonLeft();
    }

    if (event.key === KEY_CODE.RIGHT_ARROW) {
      this.onClickButtonRight();
    }
  }

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any, private httpClient: HttpClient) {
    this.currentIndex = data.index;
    this.images = data.images;
    this.setImage(this.currentIndex);
   }​​​​​​

  onClickButtonLeft() {
    if (this.currentIndex > 0) {
      this.currentIndex -= 1;
    } else {
      this.currentIndex = this.images.length - 1;
    }
    this.setImage(this.currentIndex);
  }

  onClickButtonRight() {
    if (this.images.length - 1 > this.currentIndex) {
      this.currentIndex += 1;
    } else {
      this.currentIndex = 0;
    }
    this.setImage(this.currentIndex);
  }

  onClickButtonDownload() {
    const imgName = this.imageUrl.substr(this.imageUrl.lastIndexOf('/') + 1);
    this.httpClient.get(this.imageUrl, {responseType: 'blob' as 'json'})
      .subscribe((res: any) => {
        const file = new Blob([res], {type: res.type});
 
        const blob = window.URL.createObjectURL(file);
        const link = document.createElement('a');
        link.href = blob;
        link.download = imgName;
 
        // Version link.click() to work at firefox
        link.dispatchEvent(new MouseEvent('click', {
          bubbles: true,
          cancelable: true,
          view: window
        }));
 
        setTimeout(() => { // firefox
          window.URL.revokeObjectURL(blob);
          link.remove();
        }, 100);
      });
  }

  setImage(index: number) {
    this.imageUrl = this.images[index]['id'];
    this.imageThumbnailUrl = this.images[index]['id'];
    this.comment = this.images[index]['properties'][Constants.Metadata.Comment][0];
  }
}
