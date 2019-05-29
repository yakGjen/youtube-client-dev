export default class AppModel {
  constructor(state) {
    this.state = state;
  }

  async getClips() {
    const { url } = this.state;

    const response = await fetch(url);
    const data = await response.json();

    return data;
  }
}
