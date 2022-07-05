const orderIdContainer = document.getElementById('orderId');
const url = new URL(window.location.href);
const orderId =  new URLSearchParams(url.search).get('id');


orderIdContainer.textContent = orderId;