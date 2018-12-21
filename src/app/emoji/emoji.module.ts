import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainComponent } from './main/main.component';
import { EmojiComponent } from './emoji/emoji.component';
import {LightboxModule} from 'ngx-lightbox';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {MatRadioModule} from '@angular/material/radio';
import {MatButtonModule} from '@angular/material';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material';
import {MatDividerModule} from '@angular/material/divider';
import {MatCardModule} from '@angular/material/card';

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
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatDividerModule,
    MatCardModule
  ],
  exports: [
    MainComponent,
    EmojiComponent
  ]
})
export class EmojiModule { }
