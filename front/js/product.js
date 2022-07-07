import { getCart, saveCart } from './reusableFunction.js';
const url = new URL(window.location.href);
const productId =  new URLSearchParams(url.search).get('id');
let productData;

//*** recupération des produits avec l'API ***/
const getOneProduct = async () => {
    await fetch(`http://localhost:3000/api/products/${productId}`)
    .then(res=> res.json())
    .then(data => {
        //redirection si l'id de l'article est incorrect
        if(data._id === undefined){
            alert("L'article est inconnu ! Vous allez être redirigé.")
            return window.location = '/front/html/index.html'
        }
        productData = data
    })
    .catch(err => console.log(err));

    displayOneProduct();
};

//*** Fonction d'affichage des données de l'article ***/
const displayOneProduct = () => {
    const image = document.querySelector('.item__img');
    const productName = document.getElementById('title');
    const price = document.getElementById('price');
    const description = document.getElementById('description');
    const colors = document.getElementById('colors');
    const title = document.querySelector('title');

    //affichage des données de l'article
    image.innerHTML = `<img src="${productData.imageUrl}" alt="${productData.altTxt}">`;
    description.textContent = productData.description;
    price.textContent = productData.price;
    productName.textContent = productData.name;
    title.textContent = productData.name;
    productData.colors.map(color => 
        colors.innerHTML += `<option value="${color}">${color}</option>`    
    );
}

//*** ajouter un article au panier en gerant la quantité ***/
const addProduct = (article) => {
    // insertion du panier vide ou non dans la variable products
    let products = getCart();
    //recherche si il y a un article  avec le même id/color dans le panier
    let foundProduct = products.find(art => art.productId === article.productId && art.color === article.color);
    //si il y a un produit trouvé
    if(foundProduct !== undefined){
        //changement de la quantité du produit
        foundProduct.quantity = parseInt(foundProduct.quantity) + parseInt(article.quantity);
        if(foundProduct.quantity > 100){
            return alert("Vous ne pouvez pas avoir plus de 100 articles identiques dans votre panier !")
        }
        //si il n'y a pas de produit trouvé    
    }else{
        //ajout du prodruit dans la variable products grace a push()
        if(article.quantity > 100){
            return alert("Vous ne pouvez pas avoir plus de 100 articles identiques dans votre panier !");
        };
        products.push(article);
    };
    //sauvegarde du tableau contenant les objets produits dans le localeStorage
    saveCart(products);
    alert('Produit ajouté !');
};

//EventListerner au clic sur le bouton commandé
//cette fonction permet de verifier si l'article commandé est conforme et de l'ajouter au panier
const cartBtn = document.getElementById('addToCart');
cartBtn.addEventListener('click', (e) => {
        const color = document.getElementById('colors').value;
        const quantity = document.getElementById('quantity').value;
        const productImg = productData.imageUrl;
        const altTxt = productData.altTxt
        const name = productData.name;
        //conditions pour empecher une commande sans quantity/color
        if(color === ""){
            return alert('Choisissez une couleur avant de valider la commande'); 
        }else if(quantity < 1){
            return alert('Veuillez choisir une quantité');
        }; 

        addProduct({productId, quantity, color, productImg, name, altTxt});
});

getOneProduct();


