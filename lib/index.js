class Weather {
  searchFeild = document.querySelector('input');
  searchControl = document.querySelector('.search-control');
  searchBtn = this.searchControl.querySelector('.bi-search');
  refreshBtn = this.searchControl.querySelector('.bi-arrow-clockwise');
  searchValue = this.searchFeild.value;
  typing = false;
  search() {
    if (this.searchBtn.classList.contains('active')) {
      console.log('searching...');
    }
  }
  refresh() {
    console.log(this.typing);
    if (this.refreshBtn.classList.contains('active')) {
      console.log('refreshing...');
    }
  }
}
class EventHandler extends Weather {
  typeInFeid() {
    this.searchFeild.addEventListener('input', event => {
      this.typing = true;
      if (this.typing) {
        this.refreshBtn.classList.remove('active');
        this.searchBtn.classList.add('active');
      } else {
        this.refreshBtn.classList.add('active');
        this.searchBtn.classList.remove('active');
      }
    });
  }
  click(element, functionToRun) {
    element.addEventListener('click', () => {
      functionToRun();
    });
  }
  run() {
    this.typeInFeid();
    this.click(this.refreshBtn, this.refresh);
  }
}
class App {
  static init() {
    const weatherApp = new EventHandler();
    weatherApp.run();
  }
}
App.init();

// export default App;