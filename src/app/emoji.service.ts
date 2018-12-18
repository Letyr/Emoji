import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import Emoji from './emoji';

@Injectable({
  providedIn: 'root'
})
export class EmojiService {

  constructor(private http: HttpClient) { }

  getAll(): Observable<Array<Emoji>> {
    return new Observable<Array<Emoji>>();
  }

  getEmoji() {
    return this.http.get('https://api.github.com/emojis');
  }

}
