import app from '../app.js';

class Home {

  constructor() {
    const thisHome = this;
    console.log('hoooooome');
    thisHome.initCarusel();
    thisHome.initActions();
  }


  initCarusel(){
    // eslint-disable-next-line
    var flkty = new Flickity( '.carousel', {
      prevNextButtons: false,
      autoPlay: true,
    });
  }

  initActions(){
    const thisHome = this;

    thisHome.dom = {};

    thisHome.dom.home = document.querySelector('.order-online');
    thisHome.dom.home.addEventListener('click', function(){
      app.activatePage('order');
    });

    thisHome.dom.booking = document.querySelector('.book-table');
    thisHome.dom.booking.addEventListener('click', function(){
      app.activatePage('booking');
    });
  }
}

export default Home;