import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainComponent } from './main/main.component';
import { EmojiComponent } from './emoji/emoji.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {MatRadioModule} from '@angular/material/radio';
import {MatButtonModule} from '@angular/material';
import { LightboxModule } from 'ngx-lightbox';

@NgModule({
  declarations: [
    MainComponent,
    EmojiComponent
  ],
  imports: [
    CommonModule,
    LightboxModule,
    BrowserAnimationsModule,
    MatButtonToggleModule,
    MatRadioModule,
    MatButtonModule
  ],
  exports: [
    MainComponent,
    EmojiComponent
  ]
})
export class EmojiModule { }
