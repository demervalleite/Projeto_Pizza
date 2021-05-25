

/* CRIANDO A VARIAVEL C e CS PARA FACILITAR A ESCRITA DO CODIGO*/
const c = (el)=>document.querySelector(el);
const cs = (el) => document.querySelectorAll(el);
let modalQT = 1;
let cart = [];
let modalkey = 0;

                 /*LISTAGEM DAS PIZZAS*/

pizzaJson.map((item, index) => {/* CRIANDO A FUNÇÃO pizzaJSON.map */
    let pizzaItem  = c(".models .pizza-item").cloneNode(true);
    
    pizzaItem.setAttribute('data-key', index);/*COLOCANDO ESSE COMANDO OS ITENS SÃO INUMERADOS*/
    pizzaItem.querySelector('.pizza-item--img img').src= item.img;
    pizzaItem.querySelector('.pizza-item--price').innerHTML = `R$ ${item.price.toFixed(2)}`;
    pizzaItem.querySelector('.pizza-item--name').innerHTML = item.name;
    pizzaItem.querySelector('.pizza-item--desc').innerHTML = item.description;
    pizzaItem.querySelector('a').addEventListener('click', (e)=>{
        e.preventDefault();
        let key = e.target.closest('.pizza-item').getAttribute('data-key');/*CRIANDO UMA VARIAVEL PARA PEGAR A NUMERAÇÃO DA PIZZA AO SER CLICADA*/
        modalQT = 1;
        modalkey = key;

        c ('.pizzaBig img').src= pizzaJson[key].img;
        c ('.pizzaInfo h1').innerHTML = pizzaJson[key].name;/*IMPORTANDO OS NOMES DAS PIZZAS PARA O MODAL DO ARRAY pizzaJSON*/
        c ('.pizzaInfo--desc').innerHTML = pizzaJson[key].description; /*IMPORTANDO AS DESCRIÇOES DAS PIZZAS PARA O MODAL DO ARRAY pizzaJSON*/
        c ('.pizzaInfo--actualPrice').innerHTML = `R$ ${pizzaJson[key].price.toFixed(2)}`; /*IMPORTANDO PREÇO DAS PIZZAS DO ARRAY pizzaJSON PARA O  MODAL  */
        c ('.pizzaInfo--size.selected').classList.remove('selected');
        cs('.pizzaInfo--size').forEach((size, sizeIndex)=>{/*para cada um deles*/
            /* marcar sizeIndex 2 como selecionado ao abrir modal*/
            if(sizeIndex == 2) {
                size.classList.add('selected');
            }
            /***************************************************/

            size.querySelector('span').innerHTML = pizzaJson[key].sizes[sizeIndex] ;/*O PARAMETRO size.querySelector RECEBE os sizes do pizzaJson*/ 
        });

        c('.pizzaInfo--qt').innerHTML = modalQT;


               /* EFEITO DA PRESENÇA DO MODAL*/
        c ('.pizzaWindowArea').style.display = 0;
        c ('.pizzaWindowArea').style.display = 'flex';
        setTimeout(()=>{
            c('.pizzaWindowArea').style.opacity = 1;
        }, 200);/****************************/
       
    });

    c('.pizza-area').append(pizzaItem);
 
});

               /*EVENTOS DO MODAL*/
 
function closeModal() {
    c('.pizzaWindowArea').style.opacity = 0;
    setTimeout(()=>{
        c('.pizzaWindowArea').style.display = 'none';
    },500);
}            
cs('.pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton').forEach((item)=>{
    item.addEventListener('click', closeModal);   
});
c('.pizzaInfo--qtmenos').addEventListener('click', ()=>{
    if(modalQT >1){/*comando para não deixar ir para -1*/
    modalQT --;/*AO CLICAR NO BOTÃO MAIS SERÁ DIMINUIDO MAIS UM */
    c('.pizzaInfo--qt').innerHTML = modalQT;
    }
});   

c('.pizzaInfo--qtmais').addEventListener('click', ()=>{
    modalQT ++;/*AO CLICAR NO BOTÃO MAIS SERÁ ADICIONADO MAIS UM */
    c('.pizzaInfo--qt').innerHTML = modalQT;

}); 

cs('.pizzaInfo--size').forEach((size, sizeIndex)=>{
    size.addEventListener('click', (e)=>{
        c ('.pizzaInfo--size.selected').classList.remove('selected');/*desmarcar os outros itens*/
        size.classList.add('selected');/*selecionar proprio item clicado*/
     
    });

});

          /*ADICIONAR AO CARRINHO*/
c('.pizzaInfo--addButton').addEventListener('click',()=>{
    let size = parseInt(c('.pizzaInfo--size.selected').getAttribute('data-key'));

    let identifier = pizzaJson[modalkey].id +'@'+ size;

    let key = cart.findIndex((item)=>item.identifier == identifier);

    if (key >-1){
        cart[key].qt += modalQT;
    } else {  
    cart.push({
        identifier,
        id:pizzaJson[modalkey].id,
        size,
        qt:modalQT

    });


}    
    updateCart();
    closeModal();
});
c('.menu-openner').addEventListener('click', ()=>{
    if(cart.length>'0'){
        c('aside').style.left = '0';
    }
    
});
c('.menu-closer').addEventListener('click', ()=>{
    c('aside').style.left = '100vw';
});

function updateCart() {
    c('.menu-openner span').innerHTML = cart.length/*numero de itens no mobile ativado*/
    if (cart.length > 0) {
        c('aside').classList.add('show'); /*caso houver item no carrinho ele abre */
        c('.cart').innerHTML = ''; /*comando para não repetir item anterior e permitir adicionar*/
        
        let subtotal = 0;
        let desconto = 0;
        let total = 0;
        
        
        
        for(let i in cart) {
            let pizzaItem = pizzaJson.find((item)=>item.id == cart[i].id);
            subtotal += pizzaItem.price * cart[i].qt;/*variavel subtotal recebe o item do carrinho(cart) com seu preço vezes quantidade(qt)*/ 

            let cartItem = c('.models .cart--item').cloneNode(true);

            let pizzaSizeName;
            switch(cart[i].size){
                case 0:
                    pizzaSizeName = 'Pequena';
                    break;
                case 1:
                    pizzaSizeName = 'Média';
                    break;
                case 2:
                    pizzaSizeName = 'Grande';
                    break;

            }
            let pizzaName = `${pizzaItem.name}(${pizzaSizeName})`;

            cartItem.querySelector('img').src = pizzaItem.img;
            cartItem.querySelector('.cart--item-nome').innerHTML = pizzaName;
            cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qt;
            cartItem.querySelector('.cart--item-qtmenos').addEventListener('click', ()=>{
                if(cart[i].qt >1){
                    cart[i].qt--;
                } else{
                    cart.splice(i, 1);
                }
                updateCart();
            
            });
            cartItem.querySelector('.cart--item-qtmais').addEventListener('click', ()=>{
                cart[i].qt++;
                updateCart();
            });


            c('.cart').append(cartItem);
             
        }
        desconto = subtotal * 0.1;
        total = subtotal - desconto;

        c('.subtotal span:last-child').innerHTML = `R$ ${subtotal.toFixed(2)}`;
        c('.desconto span:last-child').innerHTML = `R$ ${desconto.toFixed(2)}`;
        c('.total span:last-child').innerHTML = `R$ ${total.toFixed(2)}`;
        

    } else{
        c('aside').classList.remove('show');/*caso contrario ele fecha*/
        c('aside').style.left = '100vw'; /*fechando o carrinho com zero item*/ 
    }

    
}
    



 









