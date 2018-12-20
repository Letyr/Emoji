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

  lists: { tag: string, emojies: Emoji[] }[] = [{
    tag: 'Все',
    emojies: []
  }, {
    tag: 'Любимые',
    emojies: []
  }, {
    tag: 'Удаленные',
    emojies: []
  }];

  currentState = 0;

  loading = false;

  error = false;

  constructor (private emojiService: EmojiService) {

  }

  changeState (state) {
    this.currentState = state;
  }

  updateEmojies (jsondata: Object) {
    const allList = this.lists.find(list => list.tag === 'Все');

    if (allList) {
      allList.emojies = Object.keys(jsondata).map(key => new Emoji(key, jsondata[key]));

      console.log(allList);
    }
  }

  ngOnInit() {
    this.loading = true;
    this.emojiService.getEmoji().subscribe((jsondata: Object) => {
        if (jsondata) {
          this.updateEmojies(jsondata);
          this.changeState(0);
        } else {
          // TODO error of received data
        }
      },
      err => {
        // TODO something goes wrong
        console.error('Something goes wrong!');
        console.error(err);
        this.error = true;
      },
      () => {
        console.log('Load emoji data complete!');
        this.loading = false;
      }
    );
    // TODO data loading
  }

}
