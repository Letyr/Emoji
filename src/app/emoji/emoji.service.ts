import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Emoji } from './emoji';

@Injectable({
  providedIn: 'root'
})
export class EmojiService {

  // Ключ для хранилища. Вынес в переменную для удобства
  private STORAGEKEY = 'emoji_statuses';

  // Переменная, содержащая в себе созраненный в хранилище статусы эмодзи. Lazy initialization
  private _statuses = null;

  // Список всех эмодзи, загруженных с гита
  public emojies: Emoji[] = [];

  // Статусы эмодзи. Можно было сделать просто числа это производительнее, но так читабельней
  public DELETED = 'deleted';
  public FAVORITE = 'favorite';
  public ALL = 'all';

  // lists - списки с индексами эмодзи. Каждому списку соответствует свое имя, тэг статуса и массив с индексами, указывающими на модели,
  // входящие в список. Связан со вьюшкой.
  public lists = {
    [this.ALL]: {
      name: 'Все', // name используется во вью
      indices: [] // содержит индексы эмодзи, входящих в этот список (в список 'Все'). Индексы указывают на this.emojies
    },
    [this.FAVORITE]: {
      name: 'Любимые',
      indices: []
    },
    [this.DELETED]: {
      name: 'Удаленные',
      indices: []
    }
  };

  // http используется для получения данных о эмодзи. Невероятно мощный инструмент... который я использовал единожды
  constructor(private http: HttpClient) { }

  // геттер для _statuses с lazy initialization
  private get statuses () {
    return this._statuses || (() => {
      return this._statuses = ( JSON.parse(localStorage.getItem(this.STORAGEKEY)) || {} );
    })();
  }

  // Метод возвращающий статусы, сохраненный в хранилище
  public getStatusesFromStorage () {
    return this.statuses;
  }

  // Метод добавления статуса в хранилище (или удаления)
  public saveEmojiToStorage (emoji) {
    if (emoji.status === this.ALL) {
      delete this.statuses[emoji.name];
    } else {
      this.statuses[emoji.name] = emoji.status;
    }
    localStorage.setItem(this.STORAGEKEY, JSON.stringify(this.statuses));
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
            this.emojies = this.parseJson(jsondata);

            console.log('Load emoji data complete!');

            resolve();
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
