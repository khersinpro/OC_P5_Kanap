let products;

const getproducts = async () => {
    await fetch("http://localhost:3000/api/products")
    .then(res=> res.json())
    .then(data =>  products = data)
    .catch(err => console.log(err));

    displayCart()
};

const getCart = () => {
    let cart = localStorage.getItem('cart');
    if(cart == null){
        return [];
    }else{
        return JSON.parse(cart);
    }
}

// sauvegarde du cart
const saveCart = (articles) => {
    localStorage.setItem("cart", JSON.stringify(articles));
}

//modifier la quantité d'un produit
const modifyQuantity = () => {
    let buttonQuantity = document.querySelectorAll('.cart__item');
    let data = getCart();

    buttonQuantity.forEach(button => {
        button.addEventListener("change", e => {
            let product = data.find( data => data.productId === button.dataset.id  && data.color === button.dataset.color );
            if(product !== undefined){
                product.quantity = e.target.value; 
                e.path[3].childNodes[1].childNodes[5].textContent = price(product);
                saveCart(data)
                test()
            }

        })
    })
}

//supprimer un produit
const deleteItem = () => {
    let deleteBtn = document.querySelectorAll(".deleteItem");
    let data = getCart();
    
    deleteBtn.forEach(button => {
        button.addEventListener("click", e => {
            let newData = data.filter( article => !(article.productId === button.dataset.id && article.color === button.dataset.color));
            saveCart(newData)
            location.reload()
        })
    })
}

//affichage du cart du localstorage
const displayCart = () => {
    const cartContainer =  document.getElementById('cart__items');
    let cartData = getCart();
    cartData.map( data => {
        cartContainer.innerHTML +=
        `
        <article class="cart__item" data-id="${data.productId}" data-color="${data.color}">
            <div class="cart__item__img">
                <img src="${data.productImg}" alt="Photographie d'un canapé">
            </div>
            <div class="cart__item__content">
                <div class="cart__item__content__description">
                    <h2>${data.name}</h2>
                    <p>${data.color}</p>
                    <p>${price(data)}</p>
                </div>
                <div class="cart__item__content__settings">
                    <div class="cart__item__content__settings__quantity">
                        <p>Qté :</p>
                        <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${data.quantity}">
                    </div>
                    <div class="cart__item__content__settings__delete">
                        <p class="deleteItem" data-id="${data.productId}" data-color="${data.color}">Supprimer</p>
                    </div>
                </div>
            </div>
        </article>
        `
    })
}
const totalPrice = () => {
    const cart = getCart()
    let totalPrice = 0;
    for(let article of cart){
        let prod = products.find(prod => prod._id === article.productId);
        totalPrice += parseInt(prod.price) * parseInt(article.quantity); 
    }
    return totalPrice
}

const totalQuantity = () => {
    const cart = getCart();
    let totalProducts = 0;

    for(let article of cart){
        totalProducts += parseInt(article.quantity)
    };

    return totalProducts;
}

const price = (data) => {
    let prod = products.find(prod => prod._id === data.productId);
    return prod.price * data.quantity + " €"
}


const test = () => {
    const quantity = document.getElementById('totalQuantity');
    const price = document.getElementById('totalPrice');
    price.textContent = totalPrice()
    quantity.textContent = totalQuantity()
}

const page = async () => {
    await getproducts()
    modifyQuantity()
    deleteItem()
    test()
}

page()

//REGEX AND FORM INPUTS CONTROL