import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { MdDialog } from '@angular/material';

import { TranslatePipe } from '@ngx-translate/core';

import { User, Label, RecordType, Metadata } from 'app/_models';

import { ContentService, UploadService,  } from 'app/_services';
import { StringUtils, LocaleService } from 'app/shared';
import { StandardComponent } from 'app/home';

import { environment } from 'environments/environment';
import { DeleteDialogComponent } from './deletedialog.component';
import { RecordHelpDialogComponent } from './recordhelpdialog.component';

@Component({
  moduleId: module.id,
  templateUrl: 'record.component.html',
  styleUrls: ['record.component.css']
})

export class RecordComponent extends StandardComponent implements OnInit {

  i18n = {};

  /**
   * current type : news, calendar, ...
   */
  type = '';

  /**
   * object id
   */
  id = '';

  /**
   * object data
   */
  current: any = null;


  files: any[] = null;


  /**
   * object metadata
   */
  properties: Metadata[];


  /**
   * response on save
   */
  response: any = null;

  /**
  * if new record, not saved on backend
  */
  newrecord = false;



  /**
  * properties :
  * error
  * savedate
  * since
  */
  responsemessage: any;


  constructor(protected contentService: ContentService,

      locale: LocaleService,
      private route: ActivatedRoute, private router: Router, public dialog: MdDialog,
    private uploadService: UploadService, private stringUtils: StringUtils) {
    super();
   }

  ngOnInit() {
    super.ngOnInit();
    console.log('record.component');

    this.route.params.forEach((params: Params) => {

      this.type = params['type'];

      this.id = params['id'];

      console.log('edit:' + this.type + ' id:' + this.id);

      if (this.type) {
        // read metadata of record

        this.contentService.getMetadata(this.type + '/index/metadata.json')
          .subscribe((data: any[]) => { this.properties = data; },
          error => console.log('loadMetadata ' + error),
          () => console.log('loadMetadata OK'));
      }

      if (this.id && this.id !== 'new') {



        // read record content
        this.contentService.getRecord(this.type, this.id)
          .subscribe((data: any) => {
            this.current = data;

            if (this.current) {
              if (!this.current.images) {
                this.current.images = [];
              }

              if (!this.current.attachments) {
                this.current.attachments = [];
              }


              if (!this.current.media) {
                console.log('init media ');
                this.current.media = [];
              }

              // old date format converter. yyyyMMdd -> yyyy-MM-dd
              if (this.current.date) {
                const oldDate = this.stringUtils.parseOldDate(this.current.date);
                if (oldDate) {
                  this.current.date = oldDate;
                }
              }

            }
          },
          error => console.error('get' + JSON.stringify(error)),
          () => {
            console.log('get complete' + JSON.stringify(this.current));
          });
      } else {
        console.log('editcalendar-form empty id');

        this.newrecord = true;

        this.contentService.getNewRecord(this.type + '/index/new.json')
          .subscribe((data: any) => {
            this.current = data;

            if (this.current) {
              if (!this.current.images) {
                this.current.images = [];
              }

              if (!this.current.attachments) {
                this.current.attachments = [];
              }

              if (!this.current.media) {
                this.current.media = [];
              }
            }
          },
          error => console.log('getNewRecord ' + error),
          () => console.log('getNewRecord OK'));
      }



    });

  }



    save() {

      this.responsemessage = {};
      this.generateId();
      this.contentService.post(this.type, this.current)
        .subscribe((data: any) => {
          this.response = data;

        },
        error => {
          this.responsemessage.error = JSON.stringify(error);

      },
        () => {
          // calculate diff from PHP time https://stackoverflow.com/questions/13022524/javascript-time-to-php-time
          const timestamp = Number.parseInt(this.response.timestamp) * 1000;

          // savedate
          const savedate = new Date();
          savedate.setTime(timestamp);
          this.responsemessage.savedate = savedate.toLocaleDateString() + ' ' + savedate.toLocaleTimeString();

          // time since save
          const diffMilli = new Date().getTime() - timestamp;
          if (diffMilli < 1000) {
            this.responsemessage.since = '< 1s';
          } else {
            this.responsemessage.since = (diffMilli / 1000).toString();
          }

          // forward to record modification page
          if (this.newrecord) {
            this.router.navigate(['/record', this.type, this.current.id]);
          }


          console.log('post complete');
        });

    }

  /**
  * Generate id from title.
  * Use case : each event is unique. Such as : 28 oct 2017 - tournament at Some City
  */
  generateId() {
    if (this.newrecord) {
      // replace accents by US ASCII
      let newId = this.stringUtils.removeDiacritics(this.current.title);

      // remove all remaining special characters
      newId = newId.replace(/[^\w\s]/gi, '');

      // replace space by '-'
      newId = newId.replace(/\s/g, '-');

      this.current.id = newId;
    }

  }



  preview() {
    this.generateId();
    const url = environment.website + '/' + this.type + '/' + this.id;
    window.open(url, '_blank');
  }

  /**
  * delete
  */
  openConfirmDialog() {

    const dialogRef = this.dialog.open(DeleteDialogComponent, {
       data: this.current.title,
    });

    dialogRef.afterClosed().subscribe(result => {
  console.log(`Dialog result: ${result}`);

  if (result) {
    this.delete();
  }
});

  }


  /**
  * must click on dialog first
  */
    private delete() {

      this.contentService.delete(this.type, this.current.id)
        .subscribe((data: any) => this.response = JSON.stringify(data),
        error => console.error('delete ' + error),
        () => {

          // forward to record modification page
          this.router.navigate(['/recordlist', this.type]);


          console.log('delete complete');
        });

    }

    /**
    * help
    */
    openHelpDialog() {
      const dialogRef = this.dialog.open(RecordHelpDialogComponent, {
         data: '',
      });
      dialogRef.afterClosed().subscribe(result => { console.log('Dialog result'); });
    }

    isAdminRole() {
      return this.hasAdminRole;
    }
}
