import AppModel from '../models/AppModel';
import AppView from '../views/AppView';
import HeadModel from '../models/HeadModel';

export default class App {
  constructor() {
    this.query = '';
    this.state = {
      url: '',
    };
  }

  start() {
    console.log(this.query);
    HeadModel.addLinks();
    AppView.render();

    document.querySelector('.search').addEventListener('focus', App.searchElems);
    document.addEventListener('loadingItems', App.loadingElements);
    document.addEventListener('click', App.searchWithCkick);
  }

  static async search() {
    const searchArea = document.querySelector('.search');
    searchArea.blur();

    App.query = searchArea.value;

    if (App.query === '') return;

    App.state = {
      url: `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=15&q=${App.query}&key=AIzaSyCfe4edG3OrzN31ajT43oglC6OqLuyo7K8`,
    };

    try {
      const model = new AppModel(App.state);
      const data = await model.getClips();
      // console.log(data);

      const view = new AppView(data);
      view.renderItems();
    } catch (err) {
      console.log(err);
    }
    searchArea.value = '';
  }

  static searchWithCkick(event) {
    event.preventDefault();
    if (event.target.classList.contains('button-search')) {
      event.target.blur();
      App.search();
    }
  }

  static searchElems() {
    document.onkeydown = /* async */ function (event) {
      if (event.key === 'Enter') {
        App.search();
        /* event.target.blur();
        App.query = event.target.value;

        App.state = {
          url: `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=15&q=${App.query}&key=AIzaSyCfe4edG3OrzN31ajT43oglC6OqLuyo7K8`,
        };

        try {
          const model = new AppModel(App.state);
          const data = await model.getClips();
          // console.log(data);

          const view = new AppView(data);
          view.renderItems();
        } catch (err) {
          console.log(err);
        }

        // const model = new AppModel(App.state);
        // const data = await model.getClips();
        // console.log(data);

        // const view = new AppView(data);
        // view.renderItems();

        document.querySelector('.search').value = ''; */
      }
    };
  }

  static async loadingElements(event) {
    const { nextPageToken } = event.detail;

    App.state = {
      url: `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=15&key=AIzaSyCfe4edG3OrzN31ajT43oglC6OqLuyo7K8&pageToken=${nextPageToken}`,
    };

    const model = new AppModel(App.state);
    const data = await model.getClips();

    AppView.appendNewItems(data);
  }
}
