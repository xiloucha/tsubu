import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  imports: [RouterOutlet],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {

  protected readonly title = signal('tsubu');

  beans = Array(10).fill(false);
  saveMessage = signal(false);

  constructor() {
    const today = this.getToday();

    const savedHistory = localStorage.getItem('tsubu-history');

    if (savedHistory) {
      const history = JSON.parse(savedHistory);

      const todayData = history.find(
        (item: any) => item.date === today
      );

      if (todayData) {
        this.beans = todayData.beans;
      }
    }
  }

  getToday() {
    const now = new Date();

    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  }

  currentDate = new Date();

  changeDate(days: number) {
    const newDate = new Date(this.currentDate);

    newDate.setDate(newDate.getDate() + days);

    this.currentDate = newDate;

    this.loadDateData();
  }

  loadDateData() {
    const date = this.getDateKey(this.currentDate);

    const savedHistory = localStorage.getItem('tsubu-history');

    if (savedHistory) {
      const history = JSON.parse(savedHistory);

      const data = history.find(
        (item: any) => item.date === date
      );

      if (data) {
        this.beans = [...data.beans];
      } else {
        this.beans = Array(10).fill(false);
      }
    } else {
      this.beans = Array(10).fill(false);
    }
  }

  getDateKey(date: Date) {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  }

  calendarDate = new Date();

  calendarDays: (Date | null)[] = [];

  showCalendar = false;

  toggleCalendar() {
    this.showCalendar = !this.showCalendar;

    if (this.showCalendar) {
      this.createCalendar();
    }
  }

  createCalendar() {
    const year = this.calendarDate.getFullYear();
    const month = this.calendarDate.getMonth();

    const firstDay = new Date(year, month, 1).getDay();
    const lastDate = new Date(year, month + 1, 0).getDate();

    this.calendarDays = [];

    for (let i = 0; i < firstDay; i++) {
      this.calendarDays.push(null);
    }

    for (let day = 1; day <= lastDate; day++) {
      this.calendarDays.push(
        new Date(year, month, day)
      );
    }
  }

  changeCalendarMonth(month: number) {
    this.calendarDate.setMonth(
      this.calendarDate.getMonth() + month
    );

    this.createCalendar();
  }

  selectCalendarDate(date: Date) {
    this.currentDate = new Date(date);

    this.loadDateData();

    this.showCalendar = false;
  }

  getTodayLabel() {
    return `${this.currentDate.getFullYear()}.${this.currentDate.getMonth() + 1}.${this.currentDate.getDate()}`;
  }

  saveToday() {
    const date = this.getDateKey(this.currentDate);

    const savedHistory = localStorage.getItem('tsubu-history');

    let history: any[] = [];

    if (savedHistory) {
      history = JSON.parse(savedHistory);
    }

    const index = history.findIndex(
      (item: any) => item.date === date
    );

    if (index !== -1) {
      history[index].beans = [...this.beans];
    } else {
      history.push({
        date: date,
        beans: [...this.beans]
      });
    }

    localStorage.setItem(
      'tsubu-history',
      JSON.stringify(history)
    );
    this.saveMessage.set(true);

  setTimeout(() => {
  this.saveMessage.set(false);
}, 1500);
  }

  beanImage = 'bean1.png';

  changeBean(image: string) {
    this.beanImage = image;
  }

  useBean(index: number) {
    this.beans[index] = true;
  }

  returnBean(index: number) {
    this.beans[index] = false;
  }

  draggedBean = -1;

  startDrag(index: number) {
    this.draggedBean = index;
  }

  allowDrop(event: DragEvent) {
    event.preventDefault();
  }

  dropBean(event: DragEvent) {
    event.preventDefault();

    if (this.draggedBean !== -1) {
      this.beans[this.draggedBean] = true;
      this.draggedBean = -1;
    }
  }

  returnDrop(event: DragEvent) {
    event.preventDefault();

    if (this.draggedBean !== -1) {
      this.beans[this.draggedBean] = false;
      this.draggedBean = -1;
    }
  }

  addBean() {
    this.beans.push(false);
  }

  removeBean() {
    if (this.beans.length > 1) {
      this.beans.pop();
    }
  }
}