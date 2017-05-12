﻿import { Component, OnInit } from '@angular/core';

import { User, Label, RecordType } from '../_models/index';
import { ContentService, LocaleService } from '../_services/index';

@Component({
    moduleId: module.id,
    selector: 'app-homeadmin',
    templateUrl: 'home.component.html',
    styleUrls: ['home.component.css']
})

export class HomeComponent implements OnInit {
    currentUser: User;

  items: RecordType[] = [];

    hasRole = false;


    constructor( private contentService: ContentService, private locale: LocaleService ) {
      //
      //
      //
      const currentUserLocalStorage = localStorage.getItem('currentUser') ;

      if (currentUserLocalStorage) {
        this.currentUser = JSON.parse(currentUserLocalStorage);
      }


    }

    ngOnInit() {
          const lang = this.locale.getLang();
        //
        // About roles : this just a frontend features. Roles must be tested in the API.
        //
        if (this.currentUser) {
        if ( this.currentUser.role === 'editor' || this.currentUser.role === 'admin') {
          this.hasRole = true;
          this.contentService.getTables()
              .subscribe((data: RecordType[]) => this.items = data,
              error => console.log('getItems ' + error),
              () => {
                 console.log('getItems complete :' + this.items.length);

                 // iterate each type
                 this.items.forEach((record: RecordType) => {
                   // detect label value
                   record.labels.map((label: Label ) => {
                    if (label.i18n === lang) {
                      record.label = label.label;
                      return label;
                    }
                 });



              });

               });

        }
      }

    }
}
