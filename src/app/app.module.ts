import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmojiModule } from './emoji/emoji.module';
import { AppComponent } from './app.component';
import { NotFoundComponent } from './not-found/not-found.component';

const routes: Routes = [
  {
    path: 'emoji',
    component:  EmojiModule
  }, {
    path: 'emoji/:list',
    component: EmojiModule
  }, {
    path: '**',
    component: NotFoundComponent
  }
];

// Идея использовать роутер пришла только 25.12.18 в 2:46 ночи. Замечательно...
@NgModule({
  declarations: [
    AppComponent,
    NotFoundComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes),
    EmojiModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
