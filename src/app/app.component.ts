import { Component, OnInit } from '@angular/core';
import { EmojiService } from './emoji.service';
import {Observable} from 'rxjs';
import Emoji from './emoji';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  emojies: Observable<Array<Emoji>> = null;

  constructor (private emojiService: EmojiService) {

  }

  ngOnInit() {
    this.emojiService.getEmoji().subscribe(
      data => {
        console.log('data: ', data);
      },
      err => {
        console.log('error: ', err);
      },
      () => {
        console.log('done');
      }
    );
  }

}
