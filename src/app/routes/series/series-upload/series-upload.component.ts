import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

import { NzMessageService } from 'ng-zorro-antd/message';
import { UploadFile, UploadXHRArgs } from 'ng-zorro-antd/upload';

import { FileSaverService } from 'ngx-filesaver';

import { untilDestroyed } from 'ngx-take-until-destroy';
import { Observable, Observer } from 'rxjs';

import { FavoritesService } from 'src/app/state/favorite/favorites.service';
import { SeriesQuery } from 'src/app/state/series/series.query';
import { SeriesService } from 'src/app/state/series/series.service';
import { SurveysService } from 'src/app/state/survey/surveys.service';
@Component({
  selector: 'app-series-upload',
  templateUrl: './series-upload.component.html'
})
export class SeriesUploadComponent implements OnInit, OnDestroy {
  constructor(private seriesService: SeriesService, private seriesQuery: SeriesQuery, private surveysService: SurveysService, private fileSaverService: FileSaverService, private msg: NzMessageService, private favoritesService: FavoritesService) { }
  uploadedSeriesControl = new FormControl();

  uploading = false;

  confirmAddToFavorites = false;
  listName = '';

  ngOnInit() {
    this.uploadedSeriesControl.setValue(this.seriesQuery.uploadedNames);

    this.surveysService.surveyChanged.pipe(untilDestroyed(this)).subscribe(() => {
      this.uploadedSeriesControl.setValue(this.seriesQuery.uploadedNames);
    });
  }

  ngOnDestroy() { }

  download() {
    const fileName = 'series.txt';
    const fileType = this.fileSaverService.genType(fileName);
    const txtBlog = new Blob([this.uploadedSeriesControl.value], { type: fileType });
    this.fileSaverService.save(txtBlog, fileName);
  }

  search() {
    this.seriesService.updateUploadedNames(this.uploadedSeriesControl.value);
  }

  hanldeUploadChange(info: { file: UploadFile }): void {
    switch (info.file.status) {
      case 'uploading':
        this.uploading = true;
        break;
      case 'done':
        this.uploading = false;
        if (info.file.thumbUrl) {
          this.uploadedSeriesControl.patchValue(atob(info.file.thumbUrl.split(',')[1]));
        }
        break;
      case 'error':
        this.msg.error('Network error, upload unsuccessful!');
        this.uploading = false;
        break;
    }

  }
  beforeUpload = (file: UploadFile) => {
    const fileReader = new FileReader();
    fileReader.onload = (e) => { };

    return new Observable((observer: Observer<boolean>) => {
      const isTXT = file.type === 'text/plain';
      if (!isTXT) {
        this.msg.error('You can only upload text file!');
        observer.complete();
        return;
      }
    });
  }

  customReq = (item: UploadXHRArgs) => {
    // Create a FormData here to store files and other parameters.
    const formData = new FormData();
    formData.append('file', item.file as any);
    formData.append('id', '1000');

    const fileReader = new FileReader();
    fileReader.onload = (e) => {
      this.uploadedSeriesControl.patchValue(fileReader.result);
    };
    fileReader.readAsText(item.file as any);
  }
  addToFavorites() {
    this.confirmAddToFavorites = true;
  }
  addToFavoritesOK() {
    if (this.seriesQuery.uploadedNames) {
      this.confirmAddToFavorites = false;
      this.favoritesService.add({ name: this.listName, seriesNames: this.seriesQuery.uploadedNames });
      this.msg.create('success', 'Your list of series has been saved successfully.');
    } else {
      this.confirmAddToFavorites = false;
      this.msg.create('error', 'Please search for some series first.');
    }
  }
  addToFavoritesCancel() {
    this.confirmAddToFavorites = false;
  }

}
