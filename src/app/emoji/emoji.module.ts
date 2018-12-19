import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainComponent } from './main/main.component';
import { EmojiComponent } from './emoji/emoji.component';

@NgModule({
  declarations: [
    MainComponent,
    EmojiComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    MainComponent,
    EmojiComponent
  ]
})
export class EmojiModule { }
