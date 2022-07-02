const url = new URL(window.location.href);
const searchParams =  new URLSearchParams(url.search).get('id');
let productData;

const getProduct = async () => {
    await fetch(`http://localhost:3000/api/products/${searchParams}`)
    .then(res=> res.json())
    .then(data => productData = data)
    .catch(err => console.log(err));

    displayProduct();
}

const displayProduct = () => {
    let image = document.querySelector('.item__img');
    let productName = document.getElementById('title');
    let price = document.getElementById('price');
    let description = document.getElementById('description')
    let colors = document.getElementById('colors');
    let title = document.querySelector('title');

    image.innerHTML = `<img src="${productData.imageUrl}" alt="${productData.altTxt}">`;
    description.textContent = productData.description;
    price.textContent = productData.price;
    productName.textContent = productData.name;
    title.textContent = productData.name;
    productData.colors.map(color => 
        colors.innerHTML += `<option value="vert">${color}</option>`    
    );
}

getProduct();

