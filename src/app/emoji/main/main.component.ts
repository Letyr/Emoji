import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EmojiService } from '../emoji.service';

@Component({
  selector: 'app-emojimain',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  // searchValue - искомое имя эмодзи. Связано с input-ом во вьюшке и используется в методе seek для поиска эмодзи
  private searchValue = '';

  // currentList - результат поиска эмодзи с именами. Отображается в цикле на вьюшке
  private currentList = [];

  // Индекс текущего списка
  private currentListIndex = this.emojiService.NONE;

  // Флаг загрузки данных
  private loading = false;

  // Флаг ошибки... какой-нибудь
  private error = false;

  // Размер страницы пагинации
  private paginationCount = 10;

  // Текущая страница пагинации
  private paginationPage = 0;

  // emojiService исползуется для манипуляций с данными о эмодзи
  constructor(private activatedRoute: ActivatedRoute, private router: Router, private emojiService: EmojiService) {}

  // Этот метод используется для сортировки пайпом keyvalue на вьюшке
  nameOrdering(l1, l2) {
    return l1.value.name > l2.value.name;
  }

  // Метод пагинации, возвращает часть currentList, соответствующую paginationPage и paginationCount
  pagination () {
    const s = this.paginationPage * this.paginationCount;
    const e = s + this.paginationCount;
    const pagination = this.currentList.slice(s, e);
    // Этот элемент автоматически сменит страницу, при отсутствии элементов в pagination
    if (pagination.length === 0 && this.paginationPage > 0) {
      this.paginationChangePage(this.paginationPage - 1);
      return this.pagination();
    }
    return pagination;
  }

  // Метод смены страницы пагинации
  paginationChangePage (page) {
    if (page >= 0 && page * this.paginationCount < this.currentList.length) {
      this.paginationPage = page;
    }
  }

  // Сортировка текущего списка по имени. По идее должно происходить при каждом изменении currentList
  sort() {
    this.currentList = this.currentList.sort((e1, e2) => e1.name > e2.name ? 1 : -1);
  }

  // Метод смены списка
  changeList(state) {
    this.currentListIndex = state;

    this.seek();

    this.paginationChangePage(0);
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
    if (prevStatus === this.emojiService.NONE) {
      if (status !== this.emojiService.FAVORITE) {
        i = this.emojiService.lists[prevStatus].emojies.indexOf(emoji);
        if (i >= 0) {
          this.emojiService.lists[prevStatus].emojies.splice(i, 1);
        }
      }
      this.emojiService.lists[status].emojies.push(emoji);
    } else {
      if (prevStatus !== this.emojiService.NONE) {
        i = this.emojiService.lists[prevStatus].emojies.indexOf(emoji);
        if (i >= 0) {
          this.emojiService.lists[prevStatus].emojies.splice(i, 1);
        }
      }
      if (prevStatus !== this.emojiService.FAVORITE) {
        this.emojiService.lists[status].emojies.push(emoji);
      }
    }
    if (this.currentListIndex !== this.emojiService.NONE || status === this.emojiService.DELETED) {
      // Удаление из отображаемого списка. Это быстрее, чем обновить при помощи seek
      i = this.currentList.indexOf(emoji);
      if (i >= 0) {
        this.currentList.splice(i, 1);
      }
      this.sort();
    }
  }

  setSearchQueryParams () {
    this.router.navigate([], {
      queryParams: { search: this.searchValue ? this.searchValue : null }
    });
  }

  // Метод поиска эмодзи с именем начинающемся на searchValue. Результат записывается в currentList
  // TODO может стоит проиндексировать данные? Но вроде и так быстро ищет...
  seek() {
    if (this.searchValue) {
      this.currentList = this.emojiService.lists[this.currentListIndex].emojies.filter(emoji => emoji.name.startsWith(this.searchValue));
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
      this.emojiService.lists[this.emojiService.DELETED].emojies = [];
      this.emojiService.lists[this.emojiService.FAVORITE].emojies = [];
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

      this.activatedRoute.queryParams.subscribe(data => {
        this.searchValue = data.search;
        this.seek();
      });

      this.activatedRoute.params.subscribe(data => {
        if (this.emojiService.lists[data.list]) {
          this.changeList(data.list);
        } else {
          this.changeList(this.emojiService.NONE);
        }
      });

      this.loading = false;
    }, error => {
      console.log(error);

      this.error = true;
    });
  }

}
