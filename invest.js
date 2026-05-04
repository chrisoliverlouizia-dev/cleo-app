const supabaseClient = window.supabase.createClient(
 "https://uzzqibmydlcpqfyceuup.supabase.co",
 "sb_publishable_WXxeH7xCf4aISY6rRr1RBQ_KEcM5lRe"
);

async function checkAuth(){
 const { data:{ user } } = await supabaseClient.auth.getUser();

 if(!user){
   window.location.href = "login.html";
   return null;
 }

 return user;
}

function openModal(html){
 document.getElementById("modalBox").innerHTML = html;
 document.getElementById("modalWrap").style.display = "flex";
}

function closeModal(){
 document.getElementById("modalWrap").style.display = "none";
}

document.addEventListener("click", function(e){
 if(e.target.id === "modalWrap"){
   closeModal();
 }
});

let currentUser;

async function loadInvestUser(){
 const user = await checkAuth();
 if(!user) return;

 currentUser = user;
 renderInvest();
}

async function renderInvest(){
 const { data:positions } = await supabaseClient
   .from('investments')
   .select('*')
   .eq('user_id', currentUser.id);

 let totalPortfolio = 0;
 let htmlPositions = "";

 if(positions && positions.length){
   positions.forEach(p=>{
     totalPortfolio += Number(p.amount);

     htmlPositions += `
       <div class="tx">
          <b>${p.stock}</b><br>
          Invested: $${Number(p.amount).toFixed(2)}
       </div>
     `;
   });
 }else{
   htmlPositions = `<div class="tiny">No stock positions yet.</div>`;
 }

 document.getElementById("investArea").innerHTML = `
   <div class="mainCard">
      <div class="mainMini">TOTAL PORTFOLIO VALUE</div>
      <div class="balance">$${totalPortfolio.toFixed(2)}</div>
      <div class="ref">${positions ? positions.length : 0} Open Positions</div>
   </div>

   <div style="margin-top:20px;font-size:16px;font-weight:700;color:#111827;">
      Portfolio Holdings
   </div>

   ${htmlPositions}

   <div class="actions" style="margin-top:24px;">
      <div class="cardbtn" onclick="buyStock()">Buy Stock</div>
      <div class="cardbtn" onclick="sellStock()">Sell Stock</div>
   </div>

   <div class="cardbtn" onclick="watchlist()" style="margin-top:12px;">
      Open Watchlist
   </div>
 `;
}

function buyStock(){
 openModal(`
   <div class="modalTitle">Buy Stock Order</div>
   <input id="stockSymbol" class="modalInput" placeholder="Ticker Symbol (AAPL)">
   <input id="stockAmount" class="modalInput" placeholder="Investment Amount">
   <button class="modalBtn" onclick="confirmBuyStock()">Execute Purchase</button>
 `);
}

async function confirmBuyStock(){
 let stock = document.getElementById("stockSymbol").value;
 let amount = document.getElementById("stockAmount").value;

 if(!stock || !amount) return;
 amount = Number(amount);

 let { data:bal } = await supabaseClient
   .from('balances')
   .select('*')
   .eq('user_id', currentUser.id)
   .single();

 if(Number(bal.balance) < amount){
   document.getElementById("msg").innerText = "Insufficient wallet balance.";
   closeModal();
   return;
 }

 let newBal = Number(bal.balance) - amount;

 await supabaseClient
   .from('balances')
   .update({ balance:newBal })
   .eq('user_id', currentUser.id);

 await supabaseClient.from('investments').insert({
   user_id:currentUser.id,
   stock:stock.toUpperCase(),
   amount:amount
 });

 await supabaseClient.from('transactions').insert({
   user_id:currentUser.id,
   type:"Stock Buy "+stock.toUpperCase(),
   amount:-amount,
   note:"Investment order executed"
 });

 closeModal();
 document.getElementById("msg").innerText = stock.toUpperCase()+" purchase completed.";
 renderInvest();
}

function sellStock(){
 openModal(`
   <div class="modalTitle">Sell Stock Order</div>
   <input id="sellSymbol" class="modalInput" placeholder="Ticker Symbol">
   <input id="sellAmount" class="modalInput" placeholder="Sell Amount">
   <button class="modalBtn" onclick="confirmSellStock()">Execute Sale</button>
 `);
}

async function confirmSellStock(){
 let stock = document.getElementById("sellSymbol").value;
 let amount = document.getElementById("sellAmount").value;

 if(!stock || !amount) return;
 amount = Number(amount);

 let { data:bal } = await supabaseClient
   .from('balances')
   .select('*')
   .eq('user_id', currentUser.id)
   .single();

 let newBal = Number(bal.balance) + amount;

 await supabaseClient
   .from('balances')
   .update({ balance:newBal })
   .eq('user_id', currentUser.id);

 await supabaseClient.from('transactions').insert({
   user_id:currentUser.id,
   type:"Stock Sell "+stock.toUpperCase(),
   amount:amount,
   note:"Investment sell order executed"
 });

 closeModal();
 document.getElementById("msg").innerText = stock.toUpperCase()+" sale completed.";
 renderInvest();
}

function watchlist(){
 document.getElementById("msg").innerText = "Live watchlist opened.";
}

loadInvestUser();