import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Emoji } from './emoji';

@Injectable({
  providedIn: 'root'
})
export class EmojiService {

  // Ключ для хранилища. Вынес в переменную для удобства
  private storageKey = 'emoji_statuses';

  // Статусы эмодзи. Можно было сделать просто числа это производительнее, но так читабельней
  public deletedStatus = 'deleted';
  public favoriteStatus = 'favorite';
  public noneStatus = 'none';

  // Переменная, содержащая в себе созраненный в хранилище статусы эмодзи. Lazy initialization
  private _statuses = null;

  // lists - списки с эмодзи. Каждому списку соответствует свое имя, тэг статуса и массив с моделями, связан со вьюшкой.
    public lists = {
    [this.noneStatus]: {
      name: 'Все',
      emojies: []
    },
    [this.favoriteStatus]: {
      name: 'Любимые',
      emojies: []
    },
    [this.deletedStatus]: {
      name: 'Удаленные',
      emojies: []
    }
  };

  // http используется для получения данных о эмодзи. Невероятно мощный инструмент... который я использовал единожды
  constructor(private http: HttpClient) { }

  // геттер для _statuses с lazy initialization
  private get statuses () {
    return this._statuses || (() => {
      return this._statuses = ( JSON.parse(localStorage.getItem(this.storageKey)) || {} );
    })();
  }

  // Метод возвращающий статусы, сохраненный в хранилище
  public getStatusesFromStorage () {
    return this.statuses;
  }

  // Метод добавления статуса в хранилище (или удаления)
  public saveEmojiToStorage (emoji) {
    if (emoji.status === this.noneStatus) {
      delete this.statuses[emoji.name];
    } else {
      this.statuses[emoji.name] = emoji.status;
    }
    localStorage.setItem(this.storageKey, JSON.stringify(this.statuses));
  }

  // Метод смены статуса эмодзи и сохранение статуса (если необходимо) в storage
  // В идеале должен вызываться из модели эмодзи... или быть в модели... ну уж как вышло
  public changeStatus (emoji, status) {
    emoji.status = status;
    this.saveEmojiToStorage(emoji);
  }

  // Метод, который конвертирует обьект в массив эмодзи
  parseJson (object: Object) {
    return Object.keys(object).map(key => new Emoji(key, object[key])); // Не совсем ts стиль
  }

  public getEmoji () {
    return new Promise((resolve, reject) => {
      this.http.get('https://api.github.com/emojis').subscribe(jsondata => {
          if (jsondata) {
            const emojies = this.parseJson(jsondata);

            this.lists[this.noneStatus].emojies = emojies;

            console.log('Load emoji data complete!');

            resolve(emojies);
          } else {
            console.error('No data comes from google?..');

            reject();
          }
        },
        err => {
          console.error('Something goes wrong!', err);

          reject();
        });
    });
  }

}
