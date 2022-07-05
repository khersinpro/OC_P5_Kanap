let products;
const productsContainer = document.getElementById('items');

//*** Fonction de recupération des articles grave a une requette API  ***//
//*** Une fois les articles recuperé, on utilise la fonction .json() afin de rendre les données utilisables ***/
//*** On passe ces donnée dans une variable, puis dans la fonction d'affichage des articles ***/
//*** Faire une fonction asynchrone permet d'eviter de laissé le temps a la fonction de recuperer les données ***/
const getproducts = async () => {
    await fetch("http://localhost:3000/api/products")
    .then(res=> res.json())
    .then(data =>  products = data)
    .catch(err => console.log(err));

    displayProducts(products);
};

//*** Fonction pour afficher les produits grâce a la fonction map ***/
//*** Cette fonction permet de passer sur chaque ligne d'un tableau ***/
//*** Ce qui permet d'afficher chaque article avec trés peu de ligne de code ***/
const displayProducts = (products) => {
    products.map( product => {
        productsContainer.innerHTML += `
        <a href="./product.html?${"id=" + product._id}">
            <article>
                <img src="${product.imageUrl}" alt="Lorem ipsum dolor sit amet, Kanap name1">
                <h3 class="productName">${product.name}</h3>
                <p class="productDescription">${product.description}</p>
            </article>
        </a>
        `
    });
};

getproducts();