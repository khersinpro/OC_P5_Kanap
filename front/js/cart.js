import { getCart, saveCart } from './reusableFunction.js';
let products;

//***********************************************************/
//*************** PARTIS GESTION DU PANNIER *****************/
//***********************************************************/

//*** Récuperation des produits  ***/
const getproducts = async () => {
    await fetch("http://localhost:3000/api/products")
    .then(res=> res.json())
    .then(data =>  products = data)
    .catch(err => console.log(err));

    displayCart()
};

//*** modifier la quantité d'un produit ***//
const modifyQuantity = () => {
    const buttonQuantity = document.querySelectorAll('.cart__item');
    let data = getCart();

    buttonQuantity.forEach(button => {
        button.addEventListener("change", e => {
            let product = data.find( data => data.productId === button.dataset.id  && data.color === button.dataset.color );
            if(product !== undefined){
                if(e.target.value > 100){
                    e.target.value = 100;
                    return alert("Pas plus de 100 articles")
                }
                product.quantity = e.target.value; 
                e.path[3].childNodes[1].childNodes[5].textContent = price(product);
                saveCart(data)
                allPriceItem()
            }

        })
    })
}

//*** supprimer un produit ***//
const deleteItem = () => {
    const deleteBtn = document.querySelectorAll(".deleteItem");
    const data = getCart();
    
    deleteBtn.forEach(button => {
        button.addEventListener("click", e => {
            let newData = data.filter( article => !(article.productId === button.dataset.id && article.color === button.dataset.color));
            saveCart(newData)
            location.reload()
        })
    })
}

//*** affichage du pannier en recuperant le localestorage ***//
const displayCart = () => {
    const cartContainer =  document.getElementById('cart__items');
    const cartData = getCart();

    //methode sort pour tier la tableau d'objet par l'id grace a localecompare
    let sortCart = cartData.sort(function(a, b) { 
        //locale compare renvoie un nb negatif 0 positif si la chaine est inferieur egale ou supérieur
        return a.productId.localeCompare(b.productId);
    });

    //injection de l'html avec la methode map
    sortCart.map( data => {
        cartContainer.innerHTML +=
        `
        <article class="cart__item" data-id="${data.productId}" data-color="${data.color}">
            <div class="cart__item__img">
                <img src="${data.productImg}" alt="${data.altTxt}">
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
    });
};

//*** calcule du prix d'un article ***//
const price = (data) => {
    let prod = products.find(prod => prod._id === data.productId);
    return prod.price * data.quantity + " €";
};

//*** Prix total du pannier  ***/
const totalPrice = () => {
    const cart = getCart();
    let totalPrice = 0;
    for(let article of cart){
        let prod = products.find(prod => prod._id === article.productId);
        totalPrice += parseInt(prod.price) * parseInt(article.quantity); 
    };
    return totalPrice;
};

//*** calcule de la quantité total d'article ***/
const totalQuantity = () => {
    const cart = getCart();
    let totalProducts = 0;

    for(let article of cart){
        totalProducts += parseInt(article.quantity);
    };
    return totalProducts;
};

//*** affichage du prix total et du nombre d'article ***/
const allPriceItem = () => {
    const quantity = document.getElementById('totalQuantity');
    const price = document.getElementById('totalPrice');
    price.textContent = totalPrice();
    quantity.textContent = totalQuantity();
};

//*** regroupe les fonctions ***/
const page = async () => {
    await getproducts();
    modifyQuantity();
    deleteItem();
    allPriceItem();
    inputsChange();
};

page();

//***********************************************************/
//*************** PARTIS FORMULAIRE + FETCH *****************/
//***********************************************************/

//REGEX AND FORM INPUTS CONTROL
//***Doit contenir 1 lettre mini, peut contenir -/ /' ***/
const nameReg = /^[a-zA-Zéèàîïùâ]+(([' -][a-zA-Z ])?[a-zA-Zéèàîïùâ]*)*$/;
//*** numeric and letter _ . - + numeric and letters min 2 max 10 + letters min 2 max 5 ***/
const emailReg = "^[a-zA-Z0-9._-]+@[a-zA-Z0-9]{2,10}\.[a-zA-Z]{2,5}$";
//*** regex for adress ***/
const addressReg = /^[a-zA-Z0-9\s,'-]*$/;

//variable pour recuperer les données du formulaire
let firstName, lastName, address, city, email;

//control des entrées dans les inputs
const inputControl = (data, regex) => {
    return data.match(regex);
};

//fonction d'affichage d'erreur d'entré et implémentation des données utilisateurs
const handleUserData = (event, regex, targetId, errorMsg) => {
    if(!inputControl(event.target.value, regex)){
        if(event.target.value.length < 1){
            document.getElementById(targetId).textContent = '';
        }else{
            document.getElementById(targetId).textContent = errorMsg;
        };
        return null;
    }else{
        document.getElementById(targetId).textContent = '';
        return event.target.value;
    };
};

// fonction switch qui permet de cibler tous les inputs séparement et de controler les entrées avec les fonctions ci dessus
const inputsChange = () => {
    const inputs = document.querySelectorAll('form input');
    let errorMsg;

    inputs.forEach(input => {
        input.addEventListener("input", e => {
            switch(e.target.id){
                case 'firstName':
                    errorMsg = 'Veuillez rentrer un prénom valide';
                    firstName = handleUserData(e, nameReg, "firstNameErrorMsg", errorMsg);
                    break
                case 'lastName':
                    errorMsg = 'Veuillez rentrer un nom valide';
                    lastName = handleUserData(e, nameReg, "lastNameErrorMsg", errorMsg);
                    break
                case 'address':
                    errorMsg = 'Veuillez rentrer une adresse valide';
                    address = handleUserData(e, addressReg, "addressErrorMsg", errorMsg);
                    break
                case 'city':
                    errorMsg = 'Veuillez rentrer une ville valide';
                    city = handleUserData(e, nameReg, "cityErrorMsg", errorMsg);
                    break
                case 'email':
                    errorMsg = 'Veuillez rentrer une adresse mail valide';
                    email = handleUserData(e, emailReg, "emailErrorMsg", errorMsg);
                    break
                default:
                break
            }
        })
    });
};

// validation de la commande et envoi
document.querySelector('form').addEventListener('submit', e => {
    e.preventDefault();
    const cart = JSON.parse(localStorage.getItem('cart'));

    if(firstName && lastName && address && city && email && cart !== null){
        let contact = {firstName, lastName, address, city, email};
        let products = [];
        for(let item of cart){
            products.push(item.productId);
        };

        fetch("http://localhost:3000/api/products/order", {
            method: "POST",
            headers: { 
                'Accept': 'application/json', 
                'Content-Type': 'application/json' 
            },
            body: JSON.stringify({contact , products})
        })
        .then(res => res.json())
        .then(data =>{ 
            localStorage.clear()
            window.location = `/front/html/confirmation.html?id=${data.orderId}`
        })
        .catch(err => {
            alert('Une erreur est survenue !');
            console.log(err);
        });  
    }else{
        alert("le formulaire est mal remplis ou le pannier est vide !");
    };
});



