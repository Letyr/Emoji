import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import Emoji from './emoji';

@Injectable({
  providedIn: 'root'
})
export class EmojiService {

  favorite: Array<string> = [];
  deleted: Array<string> = [];

  constructor(private http: HttpClient) { }

  // TODO
  synchTags () {

  }

  getEmoji() {
    return this.http.get('https://api.github.com/emojis');
  }

}
