let cart = [];
let modalQt = 1;
let modalKey = 0;
const s = function(element){
    return document.querySelector(element);
};
const sAll= function(element){
    return document.querySelectorAll(element);
};
pizzaJson.forEach(function(item,index){
    const pizzaItem = s(".models .pizza-item").cloneNode(true);
    pizzaItem.setAttribute('data-key', index);
    pizzaItem.querySelector('.pizza-item--img img').src = item.img;
    pizzaItem.querySelector('.pizza-item--price').textContent = `R$ ${item.price.toFixed(2)}`;
    pizzaItem.querySelector('.pizza-item--name').textContent = item.name;
    pizzaItem.querySelector('.pizza-item--desc').textContent = item.description;
    pizzaItem.querySelector("a").addEventListener("click",function(e){
        e.preventDefault();
        let key = e.target.closest(".pizza-item").getAttribute("data-key");
        modalQt = 1;
        modalKey = key;
        s('.pizzaBig img').src = pizzaJson[key].img;
        s('.pizzaInfo h1').textContent = pizzaJson[key].name;
        s('.pizzaInfo--desc').textContent = pizzaJson[key].description;
        s('.pizzaInfo--actualPrice').textContent = `R$ ${pizzaJson[key].price.toFixed(2)}`;
        s('.pizzaInfo--size.selected').classList.remove('selected');
        sAll('.pizzaInfo--size').forEach(function(size,sizeIndex){
            if(sizeIndex == 2){
                size.classList.add('selected');
            }
            size.querySelector('span').textContent = pizzaJson[key].sizes[sizeIndex];
        })
        s('.pizzaInfo--qt').textContent = modalQt;


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
    s('.pizzaInfo--qt').textContent = modalQt;
    }
});
s('.pizzaInfo--qtmais').addEventListener('click',function(){
    modalQt++
    s('.pizzaInfo--qt').textContent = modalQt;
});
sAll('.pizzaInfo--size').forEach(function(size){
    size.addEventListener('click',function(){
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
    s('.menu-openner span').textContent = cart.length;
    if(cart.length > 0) {
        s('aside').classList.add('show');
        s('.cart').innerHTML = '';
        let subtotal = 0;
        for(let i in cart) {
            let pizzaItem = pizzaJson.find((item)=>item.id == cart[i].id);
            let cartItem = s('.models .cart--item').cloneNode(true);
            subtotal += pizzaItem.price * cart[i].qt;
            cartItem.querySelector('img').src = pizzaItem.img;
            cartItem.querySelector('.cart--item-nome').textContent = pizzaItem.name;
            cartItem.querySelector('.cart--item--qt').textContent = cart[i].qt;
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
        const desconto = subtotal * 0.1;
        const total = subtotal - desconto;
        s('.subtotal span:last-child').textContent = `R$ ${subtotal.toFixed(2)}`;
        s('.desconto span:last-child').textContent = `R$ ${desconto.toFixed(2)}`;
        s('.total span:last-child').textContent = `R$ ${total.toFixed(2)}`;
    }else{
        s('aside').classList.remove('show');
        s('aside').style.left = '100vw';
    }
}