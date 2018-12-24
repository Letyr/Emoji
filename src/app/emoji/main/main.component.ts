import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {EmojiService} from '../emoji.service';

@Component({
  selector: 'app-emojimain',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  // seekValue - искомое имя эмодзи. Связано с input-ом во вьюшке и используется в методе seek для поиска эмодзи
  private seekValue = '';

  // currentList - результат поиска эмодзи с именами. Отображается в цикле на вьюшке
  private currentList = [];

  // Индекс текущего списка
  private currentListIndex = this.emojiService.noneStatus;

  // Флаг загрузки данных
  private loading = false;

  // Флаг ошибки... какой-нибудь
  private error = false;

  private paginationCount = 10;

  private paginationPage = 0;

  // emojiService исползуется для манипуляций с данными о эмодзи
  constructor(private route: ActivatedRoute, private emojiService: EmojiService) {
  }

  nameOrdering(l1, l2) {
    return l1.value.name > l2.value.name;
  }

  pagination () {
    const s = this.paginationPage * this.paginationCount;
    const e = s + this.paginationCount;
    const pagination = this.currentList.slice(s, e);
    if (pagination.length === 0 && this.paginationPage > 0) {
      this.paginationChange(this.paginationPage - 1);
      return this.pagination();
    }
    return pagination;
  }

  paginationChange (page) {
    if (page >= 0 && page * this.paginationCount < this.currentList.length) {
      this.paginationPage = page;
    }
  }

  // Метод смены списка
  changeList(state) {
    if (this.emojiService.lists[state]) {
      this.currentListIndex = state;
    } else {
      // Попытка доступа к несуществующему списку. Типа обработка ошибок, не знаю зачем добавил
    }

    this.paginationChange(0);

    // Сбрасывает текущий currentList для отображения актуального списка
    this.seek(this.seekValue);
  }

  // Метод смены состояния эмодзи
  changeEmojiStatus(emoji, status) {
    let i;
    // Предыдущий статус эмодзи
    const prevStatus = emoji.status;

    // Смена на новый статус
    this.emojiService.changeStatus(emoji, status);

    // Сложнейшая логика статусов эмодзи, отвечающая за добавление/удаление
    // Без сарказма. Я убил на эту кучку if-ов просто непозволительно много времени, наверное потому что было 6 утра или я гупый
    if (prevStatus === this.emojiService.noneStatus) {
      if (status !== this.emojiService.favoriteStatus) {
        i = this.emojiService.lists[prevStatus].emojies.indexOf(emoji);
        if (i >= 0) {
          this.emojiService.lists[prevStatus].emojies.splice(i, 1);
        }
      }
      this.emojiService.lists[status].emojies.push(emoji);
    } else {
      if (prevStatus !== this.emojiService.noneStatus) {
        i = this.emojiService.lists[prevStatus].emojies.indexOf(emoji);
        if (i >= 0) {
          this.emojiService.lists[prevStatus].emojies.splice(i, 1);
        }
      }
      if (prevStatus !== this.emojiService.favoriteStatus) {
        this.emojiService.lists[status].emojies.push(emoji);
      }
    }
    if (this.currentListIndex !== this.emojiService.noneStatus || status === this.emojiService.deletedStatus) {
      // Удаление из отображаемого списка. Это быстрее, чем обновить при помощи seek()
      i = this.currentList.indexOf(emoji);
      if (i >= 0) {
        this.currentList.splice(i, 1);
      }
      this.sort();
    }
  }

  // Сортировка текущего списка по имени. По идее должно происходить при каждом изменении currentList
  sort() {
    this.currentList = this.currentList.sort((e1, e2) => e1.name > e2.name ? 1 : -1);
  }

  // Метод поиска эмодзи с именем начинающемся на seekValue. Результат записывается в currentList
  // TODO может стоит проиндексировать данные? Но вроде и так быстро ищет...
  seek(value = '') {
    if (value) {
      this.currentList = this.emojiService.lists[this.currentListIndex].emojies.filter(emoji => emoji.name.startsWith(value));
    } else {
      // Может при отсутсвии запроса отображать весь список? Но тогда не вывозит Material, нужна пагинация
      // Для быстроты и удобства лучше использовать ту, что идет с Material, а она вроде как требует родные таблицы Material,
      // а они вроде как ипользуют для отображения dataSource атрибут, то бишь только то, что в js-ке записано.
      // Как тогда в таблицу добавить кнопки, картинки, другие компоненты?...
      // Сложно. Лучше уж пока bootstrap в руках, чем MatTables в небе
      // TODO Спросить у куратора про пагинацию. Делать свою с блэкджеком?

       this.currentList = this.emojiService.lists[this.currentListIndex].emojies;
    }
    this.sort();
  }

  // Метод синхронизации статусов эмодзи поданых в качестве аргумента с записанными в storage
  syncStatus(emojiList) {
    const statusesObject = this.emojiService.getStatusesFromStorage();

    if (statusesObject) {
      // TODO Если в списке всего один элемент все равно будет пробежка по всему массиву emojiList. Fix it
      emojiList.forEach(emoji => {
        if (statusesObject[emoji.name]) {
          this.changeEmojiStatus(emoji, statusesObject[emoji.name]);
        }
      });
    }
  }

  // При инициализации происходит загрузка данных о эмодзи, инициализация списков, синхронизация с хранилищем
  ngOnInit() {
    this.loading = true;

    this.emojiService.getEmoji().then(emojies => {

      this.syncStatus(emojies);

      console.log('Emoji statuses synchronized with storage!');

      this.route.queryParams.subscribe(data => {
        if (data.search) {
          this.seek(this.seekValue = data.search);
        }
      });

      this.route.params.subscribe(data => {
        if (data.list) {
          this.changeList(data.list);
        } else {
          this.changeList(this.emojiService.noneStatus);
        }
      });

      this.loading = false;
    }, error => {
      console.log(error);

      this.error = true;
    });
  }

}
