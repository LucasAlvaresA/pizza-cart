let cart = [];
let modalQt = 1;
let modalKey = 0;
const s = function(element){
    return document.querySelector(element);
};
const sAll= function(element){
    return document.querySelectorAll(element);
};
//listagem das pizzas
pizzaJson.map(function(item,index){
    let pizzaItem = s(".models .pizza-item").cloneNode(true); 
    pizzaItem.setAttribute('data-key', index);
    pizzaItem.querySelector('.pizza-item--img img').src = item.img; 
    pizzaItem.querySelector('.pizza-item--price').innerHTML = `R$ ${item.price.toFixed(2)}`;
    pizzaItem.querySelector('.pizza-item--name').innerHTML = item.name;
    pizzaItem.querySelector('.pizza-item--desc').innerHTML = item.description;
    pizzaItem.querySelector("a").addEventListener("click",function(e){
        e.preventDefault();
        let key = e.target.closest(".pizza-item").getAttribute("data-key");
        modalQt = 1;
        modalKey = key;
        s('.pizzaBig img').src = pizzaJson[key].img;
        s('.pizzaInfo h1').innerHTML = pizzaJson[key].name;
        s('.pizzaInfo--desc').innerHTML = pizzaJson[key].description;
        s('.pizzaInfo--actualPrice').innerHTML = `R$ ${pizzaJson[key].price.toFixed(2)}`;
        s('.pizzaInfo--size.selected').classList.remove('selected');
        sAll('.pizzaInfo--size').forEach(function(size,sizeIndex){
            if(sizeIndex == 2){
                size.classList.add('selected');
            }
            size.querySelector('span').innerHTML = pizzaJson[key].sizes[sizeIndex];
        })
        s('.pizzaInfo--qt').innerHTML = modalQt;


        s('.pizzaWindowArea').style.opacity = 0;
        s('.pizzaWindowArea').style.display = 'flex';
        setTimeout(function(){
            s('.pizzaWindowArea').style.opacity = 1;
        },200);
    })

    s(".pizza-area").append(pizzaItem);
});
//Eventos do modal
function closeModal(){
    s('.pizzaWindowArea').style.opacity = 0;
    setTimeout(function(){
        s('.pizzaWindowArea').style.display = 'none';
    },500);
};
sAll('.pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton').forEach(function(item){
    item.addEventListener('click', closeModal);
});
s('.pizzaInfo--qtmenos').addEventListener('click',function(){
    if(modalQt > 1){
    modalQt--
    s('.pizzaInfo--qt').innerHTML = modalQt;
    }
});
s('.pizzaInfo--qtmais').addEventListener('click',function(){
    modalQt++
    s('.pizzaInfo--qt').innerHTML = modalQt;
});
sAll('.pizzaInfo--size').forEach(function(size,sizeIndex){
    size.addEventListener('click',function(e){
        s('.pizzaInfo--size.selected').classList.remove('selected');
        size.classList.add('selected');
    });
});
s('.pizzaInfo--addButton').addEventListener('click',function(){
    let size = parseInt(s('.pizzaInfo--size.selected').getAttribute('data-key'));
    let identifier = pizzaJson[modalKey].id+'@'+size;
    let key = cart.findIndex(function(item){
        return item.identifier == identifier;
    });
    if(key > -1){
        cart[key].qt += modalQt;
    }else{
        cart.push({
            identifier,
            id:pizzaJson[modalKey].id,
            size,
            qt:modalQt
        });
    }
    updateCart();
    closeModal();
});
s('.menu-openner span').addEventListener('click',function(){
    if(cart.length > 0) {
        s('aside').style.left = '0';
    }
});
s('.menu-closer').addEventListener('click',function(){
    s('aside').style.left = '100vw';
});
function updateCart() {
    s('.menu-openner span').innerHTML = cart.length;
    if(cart.length > 0) {
        s('aside').classList.add('show');
        s('.cart').innerHTML = '';
        let subtotal = 0;
        let desconto = 0;
        let total = 0;
        for(let i in cart) {
            let pizzaItem = pizzaJson.find((item)=>item.id == cart[i].id);
            let cartItem = s('.models .cart--item').cloneNode(true);
            subtotal += pizzaItem.price * cart[i].qt;
            let pizzaSizename;
            switch(cart[i].size){
                case 0:
                    pizzaSizeName = 'P';
                    break;
                case 1:
                    pizzaSizeName = 'M';
                    break;
                case 2:
                    pizzaSizename = 'G';
                    break;
            }
            //let pizzaName = `${pizzaItem.name} (${pizzaSizeName})`; 
            cartItem.querySelector('img').src = pizzaItem.img;
            cartItem.querySelector('.cart--item-nome').innerHTML = pizzaItem.name;
            cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qt;
            cartItem.querySelector('.cart--item-qtmenos').addEventListener('click',function(){
                if(cart[i].qt > 1) {
                    cart[i].qt--;
                } else {
                    cart.splice(i, 1);
                }
                updateCart();
            })
            cartItem.querySelector('.cart--item-qtmais').addEventListener('click',function(){
                cart[i].qt++;
                updateCart();
            })
            s('.cart').append(cartItem);
        }
        desconto = subtotal * 0.1;
        total = subtotal - desconto;
        s('.subtotal span:last-child').innerHTML = `R$ ${subtotal.toFixed(2)}`;
        s('.desconto span:last-child').innerHTML = `R$ ${desconto.toFixed(2)}`;
        s('.total span:last-child').innerHTML = `R$ ${total.toFixed(2)}`;
    }else{
        s('aside').classList.remove('show');
        s('aside').style.left = '100vw';
    }
}