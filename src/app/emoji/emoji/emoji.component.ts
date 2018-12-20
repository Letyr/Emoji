import { Component, Input, OnInit } from '@angular/core';
import Emoji from '../emoji';
import { Lightbox } from 'ngx-lightbox';

@Component({
  selector: 'app-emoji',
  templateUrl: './emoji.component.html',
  styleUrls: ['./emoji.component.css']
})
export class EmojiComponent implements OnInit {

  @Input() emoji: Emoji;

  constructor(private _lightbox: Lightbox) { }

  ngOnInit() {
  }

  open () {
    this._lightbox.open([{
      src: this.emoji.link,
      caption: `Emoji ${this.emoji.name}`,
      thumb: this.emoji.link
    }], 0);
  }

}
