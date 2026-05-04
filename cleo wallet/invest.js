const supabaseClient = window.supabase.createClient(
 "https://uzzqibmydlcpqfyceuup.supabase.co",
 "sb_publishable_WXxeH7xCf4aISY6rRr1RBQ_KEcM5lRe"
);

let currentUser;

async function loadInvestUser(){
 const { data:{ user } } = await supabaseClient.auth.getUser();
 currentUser = user;
 renderInvest();
}

function renderInvest(){
 document.getElementById("investArea").innerHTML = `

   <div class="mainCard">
      <div class="mainMini">TOTAL PORTFOLIO VALUE</div>
      <div class="balance">$12,840.55</div>
      <div class="ref" style="color:#86efac;">+4.82% this month</div>
   </div>

   <div style="margin-top:22px;font-size:16px;font-weight:700;color:#111827;">
      Market Movers
   </div>

   <div class="tx"><b>AAPL</b> — Apple Inc.<br><span class="amtpos">+2.14%</span></div>
   <div class="tx"><b>TSLA</b> — Tesla Inc.<br><span class="amtpos">+1.27%</span></div>
   <div class="tx"><b>NVDA</b> — Nvidia Corp.<br><span class="amtneg">-0.84%</span></div>
   <div class="tx"><b>AMZN</b> — Amazon.com<br><span class="amtpos">+3.02%</span></div>

   <div class="actions" style="margin-top:24px;">
      <div class="cardbtn" onclick="buyStock()">Buy Stock</div>
      <div class="cardbtn" onclick="sellStock()">Sell Stock</div>
   </div>

   <div class="cardbtn" onclick="watchlist()" style="margin-top:12px;">
      Open Watchlist
   </div>
 `;
}

async function buyStock(){
 let stock = prompt("Enter stock symbol (AAPL/TSLA/NVDA/AMZN):");
 if(!stock) return;

 let amount = prompt("Enter investment amount:");
 if(!amount) return;
 amount = Number(amount);

 let { data:bal } = await supabaseClient
   .from('balances')
   .select('*')
   .eq('user_id', currentUser.id)
   .single();

 if(Number(bal.balance) < amount){
   document.getElementById("msg").innerText = "Insufficient wallet balance.";
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

 document.getElementById("msg").innerText = stock.toUpperCase()+" purchase completed.";
}

async function sellStock(){
 let stock = prompt("Enter stock symbol to sell:");
 if(!stock) return;

 let amount = prompt("Enter sell amount:");
 if(!amount) return;
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

 document.getElementById("msg").innerText = stock.toUpperCase()+" sale completed.";
}

function watchlist(){
 document.getElementById("msg").innerText = "Watchlist opened.";
}

loadInvestUser();