import { getCart, saveCart } from './reusableFunction.js';
const url = new URL(window.location.href);
const productId =  new URLSearchParams(url.search).get('id');
let productData;

//*** recupération des produits avec l'API ***/
const getProduct = async () => {
    await fetch(`http://localhost:3000/api/products/${productId}`)
    .then(res=> res.json())
    .then(data => productData = data)
    .catch(err => console.log(err));

    displayProduct();
};

//*** Fonction d'affichage des données de l'article ***/
const displayProduct = () => {
    let image = document.querySelector('.item__img');
    let productName = document.getElementById('title');
    let price = document.getElementById('price');
    let description = document.getElementById('description');
    let colors = document.getElementById('colors');
    let title = document.querySelector('title');

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
    let foundProduct = products.find(art => art.id === article.id && art.color === article.color);
    //si il y a un produit trouvé
    if(foundProduct !== undefined){
        //changement de la quantité du produit
        foundProduct.quantity = parseInt(foundProduct.quantity) + parseInt(article.quantity);
        //si il n'y a pas de produit trouvé    
    }else{
        //ajout du prodruit dans la variable products grace a push()
        products.push(article);
    };
    //sauvegarde du tableau contenant les objets produits dans le localeStorage
    saveCart(products);
};

//EventListerner au clic sur le bouton commandé
//cette fonction permet de verifier si l'article commandé est conforme et de l'ajouter au panier
const cartBtn = document.getElementById('addToCart');
cartBtn.addEventListener('click', (e) => {
        let color = document.getElementById('colors').value;
        let quantity = document.getElementById('quantity').value;
        let productImg = productData.imageUrl;
        let name = productData.name;
          
        //conditions pour empecher une commande sans quantity/color
        if(color === ""){
            return alert('Choisissez une couleur avant de valider la commande'); 
        }else if(quantity < 1){
            return alert('Veuillez choisir une quantité');
        }; 

        addProduct({productId, quantity, color, productImg, name});
        alert('Produit ajouté !');
});

getProduct();


