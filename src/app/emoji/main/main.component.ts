import { Component, OnInit } from '@angular/core';
import {Observable} from 'rxjs';
import Emoji from '../emoji';
import {EmojiService} from '../emoji.service';

@Component({
  selector: 'app-emojimain',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  emojies: Emoji[] = null;

  constructor (private emojiService: EmojiService) {

  }

  updateEmojies () {
    this.emojiService.getEmoji().subscribe((data: Object) => {
        if (data) {
          // this.emojies = Observable.of(Object.keys(data).map(key => new Emoji(key, data[key])));
          this.emojies = Object.keys(data).map(key => new Emoji(key, data[key]));
        } else {
          // TODO error of received data
        }
      },
      err => {
        // TODO something goes wrong
        console.error('Something goes wrong!');
        console.error(err);
      },
      () => {
        console.log('Load emoji data complete!');
        console.log(this.emojies);
      }
    );
    // TODO data loading
  }

  ngOnInit() {
    this.updateEmojies();
  }

}
