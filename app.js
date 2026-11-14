const PRODUCTS=[["Oversized Tee","Street Store",450,"Men"],["Wide-Leg Jeans","Street Store",890,"Men"],["Linen Shirt","Classic Store",720,"Men"],["Zip Hoodie","Street Store",950,"Men"],["Cargo Pants","Street Store",780,"Men"],["Knit Polo","Classic Store",640,"Men"],["Denim Jacket","Classic Store",1200,"Men"],["Kids Graphic Tee","Kids Corner",280,"Kids"]].map(([name,store,price,cat])=>({name,store,price,cat}));
const $=s=>document.querySelector(s), SHIP=40;
const load=()=>{try{return JSON.parse(localStorage.getItem("oddfit_cart"))||[]}catch(e){return[]}};
const save=c=>{try{localStorage.setItem("oddfit_cart",JSON.stringify(c))}catch(e){}renderCart()};
function renderList(){
  const q=$("#q").value.toLowerCase(),cat=$("#cat").value,st=$("#fstore").value,min=+$("#min").value||0,max=+$("#max").value||Infinity,so=$("#sort").value;
  let r=PRODUCTS.filter(p=>p.name.toLowerCase().includes(q)&&(cat=="All"||p.cat==cat)&&(st=="All stores"||p.store==st)&&p.price>=min&&p.price<=max);
  if(so.includes("low"))r.sort((a,b)=>a.price-b.price);if(so.includes("high"))r.sort((a,b)=>b.price-a.price);
  $("#count").textContent=r.length+" products";
  $("#list").innerHTML=r.map(p=>`<div class="prod"><a href="#product" style="text-decoration:none"><div class="thumb">👕</div><b>${p.name}</b> <span class="muted small">${p.store}</span></a><br><b>EGP ${p.price}</b> <button class="chip" data-add="${p.name}|${p.store}|${p.price}|Default">Add to cart</button></div>`).join("")||'<p class="muted">No products match your search.</p>';
}
function renderCart(){
  const c=load(),sub=c.reduce((s,i)=>s+i.price*i.qty,0);
  $("#cart-items").innerHTML=c.map((i,n)=>`<div class="line-item"><div class="ph">👕</div><div><b>${i.name}</b><div class="muted small">${i.store} · ${i.variant}</div></div><span class="price">EGP ${i.price*i.qty}</span><button class="chip" data-qty="${n}|-1">−</button> ${i.qty} <button class="chip" data-qty="${n}|1">+</button></div>`).join("")||'<p class="muted">Your cart is empty.</p>';
  $("#sub").textContent="EGP "+sub;$("#ship").textContent=c.length?"EGP "+SHIP:"-";$("#tot").textContent="EGP "+(c.length?sub+SHIP:0);
}
document.addEventListener("click",e=>{
  const a=e.target.closest("[data-add]");
  if(a){const[name,store,price,variant]=a.dataset.add.split("|"),c=load(),f=c.find(i=>i.name==name&&i.variant==variant);f?f.qty++:c.push({name,store,price:+price,variant,qty:1});save(c);if(a.tagName=="BUTTON")a.textContent="Added ✓"}
  const q=e.target.closest("[data-qty]");
  if(q){const[n,d]=q.dataset.qty.split("|"),c=load();c[n].qty+=+d;if(c[n].qty<1)c.splice(n,1);save(c)}
  if(e.target.id=="find"){$("#q").value=$("#hq").value;renderList()}
});
["#q","#cat","#fstore","#min","#max","#sort"].forEach(s=>$(s).addEventListener("input",renderList));
renderList();renderCart();

/* Virtual try-on (UI only: replace the fake step with the AI API call) */
let photoURL="",tcolor="#1a1a1a";
const PR=Object.fromEntries(PRODUCTS.map(p=>[p.name,p]));
$("#photo").addEventListener("change",e=>{const f=e.target.files[0];if(!f)return;photoURL=URL.createObjectURL(f);$(".drop").innerHTML=`<img src="${photoURL}" style="width:100%;height:100%;object-fit:cover">`});
$("#tc").addEventListener("click",e=>{const s=e.target.closest(".sw");if(!s)return;document.querySelectorAll("#tc .sw").forEach(x=>x.classList.remove("on"));s.classList.add("on");tcolor=s.dataset.c});
$("#tgo").addEventListener("click",()=>{
  const out=$("#tout"),m=$("#tmsg");
  if(!photoURL){m.textContent="Please upload your photo first.";return}
  const p=PR[$("#tp").value];m.textContent="Generating your preview...";out.innerHTML='<span class="muted">Generating...</span>';
  setTimeout(()=>{out.innerHTML=`<img src="${photoURL}"><span class="tag">${p.name}</span>`;m.textContent="Demo preview. The AI result will appear here once the try-on API is connected.";
    $("#tadd").dataset.add=`${p.name}|${p.store}|${p.price}|Try-on`},1200);
});
