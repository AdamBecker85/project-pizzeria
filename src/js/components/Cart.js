import {select, classNames, templates, settings} from '../settings.js';
import CartProduct from './CartProduct.js';
import utils from '../utils.js';

class Cart{
  constructor(element){
    const thisCart = this;

    thisCart.products = [];

    thisCart.getElements(element);
    thisCart.initActions();

    //console.log('new Cart', thisCart);
  }

  getElements(element){
    const thisCart = this;

    thisCart.dom = {};

    thisCart.dom.wrapper = element;
    thisCart.dom.toggleTrigger = element.querySelector(select.cart.toggleTrigger);
    thisCart.dom.productList = element.querySelector(select.cart.productList);
    thisCart.dom.deliveryFee = element.querySelector(select.cart.deliveryFee);
    thisCart.dom.subTotalPrice = element.querySelector(select.cart.subtotalPrice);
    thisCart.dom.totalPrice = element.querySelectorAll(select.cart.totalPrice);
    thisCart.dom.totalNumber = element.querySelector(select.cart.totalNumber);
    thisCart.dom.form = element.querySelector(select.cart.form);
    thisCart.dom.phone = element.querySelector(select.cart.phone);
    thisCart.dom.address = element.querySelector(select.cart.address);
  }

  initActions(){
    const thisCart = this;

    thisCart.dom.toggleTrigger.addEventListener('click', function(){
      thisCart.dom.wrapper.classList.toggle(classNames.cart.wrapperActive);
    });

    thisCart.dom.productList.addEventListener('updated', function(){
      thisCart.update();
    });

    thisCart.dom.productList.addEventListener('remove', function(event){
      thisCart.remove(event.detail.cartProduct);
    });

    thisCart.dom.form.addEventListener('submit', function(event){
      event.preventDefault();
      thisCart.sendOrder();
    });
  }

  add(menuProduct){
    const thisCart = this;

    const generatedHTML = templates.cartProduct(menuProduct);
    const generatedDOM = utils.createDOMFromHTML(generatedHTML);
    thisCart.dom.productList.appendChild(generatedDOM);
    
    console.log('adding product', menuProduct);

    thisCart.products.push(new CartProduct(menuProduct, generatedDOM));
    //thisCart.products.push(menuProduct);
    console.log('thisCart.products', thisCart.products);
    thisCart.update();
  }

  update(){
      
    const thisCart = this;

    let deliveryFee = settings.cart.defaultDeliveryFee;
    let totalNumber = 0;
    let subTotalPrice = 0;

    for (let product of thisCart.products){
      totalNumber =  totalNumber + product.amount; 
      subTotalPrice = subTotalPrice + product.price;
    }      

    if(totalNumber == 0){
      deliveryFee = 0;
      thisCart.totalPrice = 0;
    } else {
      thisCart.totalPrice = subTotalPrice + deliveryFee;
    }

    thisCart.dom.deliveryFee.innerHTML = deliveryFee;
    thisCart.dom.subTotalPrice.innerHTML = subTotalPrice;
    thisCart.dom.totalNumber.innerHTML = totalNumber;

    for(let selector of thisCart.dom.totalPrice){
      selector.innerHTML = subTotalPrice + deliveryFee;
    
    }

    console.log('totalNumber', totalNumber);
    console.log('subTotalPrice', subTotalPrice);
    console.log('deliveryFee', deliveryFee);
        
  }

  remove(cartProduct) {
    const thisCart = this;

    console.log('removing', cartProduct);

    let indexOfRemoving = thisCart.products.indexOf(cartProduct);
    thisCart.products.splice(indexOfRemoving);
    cartProduct.dom.wrapper.remove();
    this.update();
  }

  sendOrder(){
    const thisCart = this;

    const url = settings.db.url + '/' + settings.db.orders;

    const payload = {
      address: thisCart.dom.address.value,
      phone: thisCart.dom.phone.value,
      totalPrice: thisCart.totalPrice,
      subTotalPrice: thisCart.totalPrice - settings.cart.defaultDeliveryFee,
      totalNumber: parseInt(thisCart.dom.totalNumber.innerHTML),
      deliveryFee: settings.cart.defaultDeliveryFee,
      products: [],
    };

    for(let prod of thisCart.products) {
      payload.products.push(prod.getData());
    }

    console.log('payload', payload);

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    };
    
    fetch(url, options);
  }

}

export default Cart;