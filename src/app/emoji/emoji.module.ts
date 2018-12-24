import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MainComponent } from './main/main.component';
import { EmojiComponent } from './emoji/emoji.component';
import { LightboxModule } from 'ngx-lightbox';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { routes } from './emoji.routes';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  MatIconModule,
  MatCardModule,
  MatDividerModule,
  MatInputModule,
  MatFormFieldModule,
  MatButtonModule,
  MatRadioModule,
  MatButtonToggleModule,
  MatGridListModule,
  MatProgressSpinnerModule
} from '@angular/material';


@NgModule({
  declarations: [
    MainComponent,
    EmojiComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forRoot(routes),
    FormsModule,
    LightboxModule,
    BrowserAnimationsModule,
    MatIconModule,
    MatCardModule,
    MatDividerModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatRadioModule,
    MatButtonToggleModule,
    MatGridListModule,
    MatProgressSpinnerModule,
    HttpClientModule
  ],
  exports: [
    RouterModule,
    MainComponent,
    EmojiComponent
  ]
})
export class EmojiModule { }
