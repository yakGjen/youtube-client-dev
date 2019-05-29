import './app-view.css';
import ElemModel from '../../models/ElemModel';
import ElemItemView from '../ElemItemView';

// const wrapper = document.querySelector('.content-wrap');
const elems = {
  input: null,
  wrapper: null,
  navWrap: null,
};
const items = [];

/* eslint-disable */
/* const metrics = {
  widthItem: 0,
  marginLeft: 0,
  leftSpace: 0,
  step: 0,
  constBorder: 0,
  stepBorder: 1,
  updateLarge() {
    this.widthItem = document.querySelector('.item').offsetWidth;
    this.marginLeft = (document.querySelector('.content-wrap').offsetWidth - (this.widthItem * 4)) / 5;
    this.leftSpace = this.marginLeft;
    this.step = (this.widthItem * 4) + (this.marginLeft * 4) + 3;
    this.constBorder = items.length / 4;
    this.stepBorder = 1;
  },
  updateMiddle() {
    this.widthItem = document.querySelector('.item').offsetWidth;
    this.marginLeft = (document.querySelector('.content-wrap').offsetWidth - (this.widthItem * 2)) / 3;
    this.leftSpace = this.marginLeft;
    this.step = (this.widthItem * 2) + (this.marginLeft * 2) + 3;
    this.constBorder = items.length / 2;
    this.stepBorder = 1;
  },
  updateSmall() {
    this.widthItem = document.querySelector('.item').offsetWidth;
    this.marginLeft = (document.querySelector('.content-wrap').offsetWidth - this.widthItem) / 2;
    this.leftSpace = this.marginLeft;
    this.step = this.widthItem + this.marginLeft;
    this.constBorder = items.length;
    this.stepBorder = 1;
  },
}; */
/* eslint-enable */

const metrics = {
  widthItem: 0,
  marginLeft: 0,
  step: 0,
  shift: 0,
  currentPage: 1,
  allPages: 0,
  countElemsOnPage: 0,
  updateLarge() {
    this.widthItem = document.querySelector('.item').offsetWidth;
    this.marginLeft = (document.body.offsetWidth - this.widthItem * 4) / 5;
    this.step = document.body.offsetWidth - this.marginLeft;
    this.currentPage = 1;
    this.countElemsOnPage = 4;
    this.allPages = items.length / this.countElemsOnPage;
  },
  updateMiddle() {
    this.widthItem = document.querySelector('.item').offsetWidth;
    this.marginLeft = (document.body.offsetWidth - this.widthItem * 2) / 3;
    this.step = document.body.offsetWidth - this.marginLeft;
    this.currentPage = 1;
    this.countElemsOnPage = 2;
    this.allPages = items.length / this.countElemsOnPage;
  },
  updateSmall() {
    this.widthItem = document.querySelector('.item').offsetWidth;
    this.marginLeft = (document.body.offsetWidth - this.widthItem) / 2;
    this.step = document.body.offsetWidth - this.marginLeft;
    this.currentPage = 1;
    this.countElemsOnPage = 1;
    this.allPages = items.length / this.countElemsOnPage;
  },
};

const keyNext = {
  next: '',
};

export default class AppView {
  constructor(data) {
    this.data = data;
  }

  static render() {
    const container = new ElemModel({
      elem: 'div',
      cls: 'container',
    }).elem;

    const searchWrapper = new ElemModel({
      elem: 'div',
      cls: 'search-wrapper',
    }).elem;

    const search = new ElemModel({
      elem: 'input',
      cls: 'search',
      attr: ['placeholder', 'enter youtube request'],
    }).elem;

    const buttonSearch = new ElemModel({
      elem: 'button',
      cls: 'button-search',
    }).elem;

    buttonSearch.innerHTML = 'Search';

    const contentWrap = new ElemModel({
      elem: 'div',
      cls: 'content-wrap',
    }).elem;

    const navWrap = new ElemModel({
      elem: 'div',
      cls: 'nav-wrap',
    }).elem;

    elems.input = search;
    elems.wrapper = contentWrap;
    elems.navWrap = navWrap;

    document.body.appendChild(container);
    // container.appendChild(search);
    container.appendChild(searchWrapper);
    searchWrapper.appendChild(search);
    searchWrapper.appendChild(buttonSearch);
    container.appendChild(contentWrap);
    container.appendChild(navWrap);
  }

  renderItems() {
    const dataItemsArr = this.data.items;

    keyNext.next = this.data.nextPageToken;

    dataItemsArr.forEach((item) => {
      const div = new ElemItemView(item.snippet).elem;

      // wrapper.appendChild(div);
      items.push(div);
    });

    AppView.appendItems();
    AppView.drawSlider();
    AppView.drawNav();

    window.onresize = function () {
      const anim = getComputedStyle(items[0]).transition;

      /* eslint-disable */
      items.forEach((item) => item.style.transition = 'none');
      /* eslint-enable */

      AppView.drawSlider();
      AppView.drawNav();

      /* eslint-disable */
      items.forEach((item) => item.style.transition = anim);
      /* eslint-enable */
    };

    document.onmousedown = function (event) {
      event.preventDefault();
      const downPoint = event.clientX;

      document.body.onmouseup = function (e) {
        const upPoint = e.clientX;

        if (upPoint < downPoint) AppView.moveLeft();
        if (upPoint > downPoint) AppView.moveRight();
      };
    };

    document.ontouchstart = function (event) {
      const startTouch = event.touches[0].clientX;

      document.ontouchend = function (e) {
        const endTouch = e.changedTouches[0].clientX;

        if (endTouch > startTouch) AppView.moveRight();
        if (endTouch < startTouch) AppView.moveLeft();
      };
    };

    document.onclick = function (event) {
      if (event.target.classList.contains('nav-item')) {
        if (event.target.classList.contains('pre-prev')) AppView.moveDoubleRight();
        if (event.target.classList.contains('prev')) AppView.moveRight();
        if (event.target.classList.contains('next')) AppView.moveLeft();
      }
    };

    document.onmouseover = function (event) {
      /* eslint-disable */
      if (event.target.classList.contains('pre-prev')) {
        event.target.textContent = metrics.currentPage - 2;
      }
      if (event.target.classList.contains('prev')) {
        event.target.textContent = metrics.currentPage - 1;
      }
      if (event.target.classList.contains('next')) {
        event.target.textContent = metrics.currentPage + 1;
      }
      /* eslint-enable */
    };
  }

  static appendItems() {
    items.forEach((item) => {
      elems.wrapper.appendChild(item);
    });
  }

  static drawSlider() {
    elems.wrapper.style.transform = 'translate(0px)';
    metrics.shift = 0;

    if (elems.wrapper.offsetWidth > 900) {
      metrics.updateLarge();
    } else if (elems.wrapper.offsetWidth < 900 && elems.wrapper.offsetWidth > 570) {
      metrics.updateMiddle();
    } else if (elems.wrapper.offsetWidth < 570) {
      metrics.updateSmall();
    }

    items.forEach((item) => {
      /* eslint-disable */
      item.style.marginLeft = `${metrics.marginLeft}px`;
      /* eslint-enable */
    });
  }

  /* eslint-disable */
  static moveLeft() {
    metrics.shift -= metrics.step;
    elems.wrapper.style.transform = `translate(${metrics.shift}px)`;

    metrics.currentPage++;
    AppView.drawNav();
    AppView.checkUploadingItems();
  }

  static moveRight() {
    if (metrics.currentPage === 1) return;

    metrics.shift += metrics.step;
    elems.wrapper.style.transform = `translate(${metrics.shift}px)`;

    metrics.currentPage--;
    AppView.drawNav();
  }

  static moveDoubleRight() {
    metrics.shift = metrics.shift + (metrics.step * 2);
    elems.wrapper.style.transform = `translate(${metrics.shift}px)`;

    metrics.currentPage -= 2;
    AppView.drawNav();
  }
  /* eslint-enable */

  static drawNav() {
    const navItems = [];
    const navItemsLen = metrics.currentPage + 1;

    elems.navWrap.innerHTML = '';

    /* eslint-disable */
    for (let i = 0; i < navItemsLen; i++) {
      navItems.push(new ElemModel({
        elem: 'div',
        cls: 'nav-item',
      }).elem);
    }
    /* eslint-enable */

    if (navItemsLen === 2) {
      navItems[0].textContent = metrics.currentPage;
      navItems[0].classList.toggle('active-nav-item');

      navItems[0].classList.add('current');
      navItems[1].classList.add('next');
    } else if (navItemsLen === 3) {
      navItems[1].textContent = metrics.currentPage;
      navItems[1].classList.toggle('active-nav-item');

      navItems[0].classList.add('prev');
      navItems[1].classList.add('current');
      navItems[2].classList.add('next');
    } else if (navItemsLen >= 4) {
      navItems[2].textContent = metrics.currentPage;
      navItems[2].classList.toggle('active-nav-item');

      navItems[0].classList.add('pre-prev');
      navItems[1].classList.add('prev');
      navItems[2].classList.add('current');
      navItems[3].classList.add('next');
    }

    if (navItems.length <= 3) {
      navItems.forEach((item) => {
        elems.navWrap.appendChild(item);
      });
    } else if (navItems.length >= 4) {
      /* eslint-disable */
      for (let i = 0; i < 4; i++) {
        elems.navWrap.appendChild(navItems[i]);
      }
      /* eslint-enable */
    }
  }

  static checkUploadingItems() {
    let token = '';

    token = keyNext.next;

    if (metrics.currentPage === Math.floor(metrics.allPages)) {
      const event = new CustomEvent('loadingItems', {
        bubbles: true,
        detail: {
          nextPageToken: token,
        },
      });
      document.dispatchEvent(event);
    }
  }

  static appendNewItems(data) {
    console.log('append new items');
    keyNext.next = data.nextPageToken;

    data.items.forEach((item) => {
      const div = new ElemItemView(item.snippet).elem;

      elems.wrapper.appendChild(div);

      div.style.marginLeft = `${metrics.marginLeft}px`;

      items.push(div);
    });
    metrics.allPages = items.length / metrics.countElemsOnPage;
  }
}
