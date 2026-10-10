// PERSONALIZE ESTES DADOS ANTES DE PUBLICAR
const DISCORD_INVITE = "https://discord.gg/J89MEVNY"; // Convite do servidor VENIX
const PIX_KEY = ""; // Opcional: chave Pix da loja. Não é processada automaticamente.
const products = [
  {
    "id": "p1",
    "name": "Kit Gamer Digital",
    "category": "Games",
    "description": "Seleção gamer para completar sua coleção.",
    "price": 29.9,
    "symbol": "✦",
    "tag": "DESTAQUE"
  },
  {
    "id": "p2",
    "name": "Acessório Premium",
    "category": "Acessórios",
    "description": "Um toque a mais no seu setup ou coleção.",
    "price": 19.9,
    "symbol": "◇",
    "tag": "POPULAR"
  },
  {
    "id": "p3",
    "name": "Pack Digital",
    "category": "Digital",
    "description": "Conteúdo digital entregue após confirmação.",
    "price": 14.9,
    "symbol": "▧",
    "tag": "DIGITAL"
  },
  {
    "id": "p4",
    "name": "Surpresa VENIX",
    "category": "Games",
    "description": "Uma opção especial para quem curte novidades.",
    "price": 9.9,
    "symbol": "V",
    "tag": "OFERTA"
  }
];

const money = value => value.toLocaleString("pt-BR",{style:"currency",currency:"BRL"});
let cart = [];
let activeFilter = "Todos";
const grid = document.getElementById("productGrid");
const cartCount = document.getElementById("cartCount");
const cartItems = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");
const drawer = document.getElementById("cartDrawer");
const overlay = document.getElementById("overlay");
const toast = document.getElementById("toast");
document.getElementById("year").textContent = new Date().getFullYear();
document.getElementById("discordLink").href = DISCORD_INVITE;

function notify(message){
  toast.textContent = message; toast.classList.add("show");
  clearTimeout(notify.timer); notify.timer = setTimeout(()=>toast.classList.remove("show"),2200);
}
function renderProducts(){
  const visible = products.filter(p=>activeFilter==="Todos"||p.category===activeFilter);
  grid.innerHTML = visible.map(p=>`<article class="product-card">
    <div class="product-art"><span class="art-chip">${p.tag}</span><span class="art-symbol">${p.symbol}</span></div>
    <div class="product-info"><span class="product-category">${p.category}</span><h3>${p.name}</h3><p>${p.description}</p>
      <div class="product-buy"><span class="price">${money(p.price)}</span><button class="add-button" data-add="${p.id}">+ Adicionar</button></div>
    </div></article>`).join("");
  grid.querySelectorAll("[data-add]").forEach(btn=>btn.addEventListener("click",()=>addToCart(btn.dataset.add)));
}
function addToCart(id){
  const item=cart.find(x=>x.id===id);
  if(item)item.qty++;else cart.push({id,qty:1});
  renderCart(); notify("Produto adicionado ao carrinho!");
}
function renderCart(){
  const count=cart.reduce((n,x)=>n+x.qty,0);
  const total=cart.reduce((n,x)=>n+products.find(p=>p.id===x.id).price*x.qty,0);
  cartCount.textContent=count;cartTotal.textContent=money(total);
  if(!cart.length){cartItems.innerHTML='<div class="empty-cart">Seu carrinho está vazio.<br><span>Adicione algo que você curtiu.</span></div>';return;}
  cartItems.innerHTML=cart.map(x=>{const p=products.find(p=>p.id===x.id);return `<div class="cart-item"><div><b>${p.name}</b><small>${money(p.price)} cada</small><div class="cart-item-actions"><button class="qty-btn" data-dec="${p.id}" aria-label="Diminuir">−</button><span>${x.qty}</span><button class="qty-btn" data-inc="${p.id}" aria-label="Aumentar">+</button><button class="remove-btn" data-remove="${p.id}">Remover</button></div></div><span class="cart-item-price">${money(p.price*x.qty)}</span></div>`}).join("");
  cartItems.querySelectorAll("[data-inc]").forEach(b=>b.onclick=()=>changeQty(b.dataset.inc,1));
  cartItems.querySelectorAll("[data-dec]").forEach(b=>b.onclick=()=>changeQty(b.dataset.dec,-1));
  cartItems.querySelectorAll("[data-remove]").forEach(b=>b.onclick=()=>{cart=cart.filter(x=>x.id!==b.dataset.remove);renderCart()});
}
function changeQty(id,delta){const item=cart.find(x=>x.id===id);if(item)item.qty+=delta;cart=cart.filter(x=>x.qty>0);renderCart()}
function openCart(){drawer.classList.add("open");overlay.classList.add("open");drawer.setAttribute("aria-hidden","false")}
function closeCart(){drawer.classList.remove("open");overlay.classList.remove("open");drawer.setAttribute("aria-hidden","true")}
function orderSummary(){
  if(!cart.length)return "";
  const lines=cart.map(x=>{const p=products.find(p=>p.id===x.id);return `• ${p.name} x${x.qty} — ${money(p.price*x.qty)}`});
  const total=cart.reduce((n,x)=>n+products.find(p=>p.id===x.id).price*x.qty,0);
  return `Olá! Quero fazer este pedido na VENIX:\n\n${lines.join("\n")}\n\nTotal estimado: ${money(total)}\nPagamento pretendido: Pix\nPor favor, confirmem estoque, preço final e instruções de pagamento antes de eu pagar.`;
}
document.getElementById("openCart").onclick=openCart;
document.getElementById("closeCart").onclick=closeCart;
overlay.onclick=closeCart;
document.addEventListener("keydown",e=>{if(e.key==="Escape")closeCart()});
document.getElementById("filters").querySelectorAll("[data-filter]").forEach(b=>b.onclick=()=>{
  activeFilter=b.dataset.filter;
  document.querySelectorAll(".filter").forEach(x=>x.classList.toggle("active",x===b));
  renderProducts();
});
document.getElementById("checkout").onclick=()=>{
  if(!cart.length){notify("Adicione um produto primeiro.");return;}
  const summary=orderSummary();
  const url=DISCORD_INVITE;
  try{window.open(url,"_blank","noopener");}catch(e){}
  if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(summary).then(()=>notify("Resumo copiado! Cole no Discord para enviar." )).catch(()=>notify("Copie o resumo e envie no Discord."));}
  else notify("Copie o resumo do pedido e envie no Discord.");
};
document.getElementById("copyOrder").onclick=()=>{
  if(!cart.length){notify("Adicione um produto primeiro.");return;}
  const summary=orderSummary();
  if(navigator.clipboard&&navigator.clipboard.writeText)navigator.clipboard.writeText(summary).then(()=>notify("Resumo do pedido copiado!")).catch(()=>window.prompt("Copie seu pedido:",summary));
  else window.prompt("Copie seu pedido:",summary);
};
renderProducts();renderCart();
