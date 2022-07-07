// recupération de localestorage, si pas de localeStorage la fonction retourne un array vide
export const getCart = () => {
    let cart = localStorage.getItem('cart');
    if(cart == null){
        return [];
    }else{
        return JSON.parse(cart);
    }
};

// sauvegarde du cart
export const saveCart = (articles) => {
    localStorage.setItem("cart", JSON.stringify(articles));
};