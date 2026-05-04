const supabaseClient = window.supabase.createClient(
 "https://uzzqibmydlcpqfyceuup.supabase.co",
 "sb_publishable_WXxeH7xCf4aISY6rRr1RBQ_KEcM5lRe"
);

let fullName, cleoAcc, refCode;
let currentUser;
let selectedCurrency = "";
let fromCurrency = "";
let toCurrency = "";

async function loadExchangeUser(){
 const { data:{ user } } = await supabaseClient.auth.getUser();
 currentUser = user;

 const { data:userData } = await supabaseClient
   .from('users')
   .select('*')
   .eq('id', user.id)
   .single();

 fullName = userData.full_name || "Client";
 cleoAcc = userData.cleo_account || "CLEO-00000000";
 refCode = userData.reference_code || "LIV-0000-XXXX";

 showAddSection();
}

function showAddSection(){
 document.getElementById("dynamicArea").innerHTML = `
   <div style="font-size:13px;color:#6b7280;margin-bottom:14px;">
     Select receiving currency
   </div>

   <div id="curBtns" class="actions" style="flex-wrap:wrap;">
     <div class="cardbtn" onclick="showCurrency('USD',this)">🇺🇸 USD</div>
     <div class="cardbtn" onclick="showCurrency('EUR',this)">🇪🇺 EUR</div>
     <div class="cardbtn" onclick="showCurrency('GBP',this)">🇬🇧 GBP</div>
     <div class="cardbtn" onclick="showCurrency('MXN',this)">🇲🇽 MXN</div>
   </div>

   <div id="currencyInfo" class="tx" style="margin-top:18px;display:none;"></div>

   <div class="cardbtn" onclick="simulateDeposit()" style="margin-top:12px;display:none;" id="depositBtn">
      Confirm Deposit Received
   </div>

   <button id="copyBtn" class="btn" onclick="copyDetails()" style="display:none;">
     Copy Receiving Details
   </button>
 `;
}

function showCurrency(cur,el){
 selectedCurrency = cur;

 document.querySelectorAll("#curBtns .cardbtn").forEach(b=>{
   b.style.background="#fbfcfe";
   b.style.color="#111827";
   b.style.border="1px solid #edf0f3";
 });

 el.style.background="#111827";
 el.style.color="white";
 el.style.border="1px solid #111827";

 document.getElementById("currencyInfo").style.display="block";
 document.getElementById("copyBtn").style.display="block";
 document.getElementById("depositBtn").style.display="block";

 document.getElementById("currencyInfo").innerHTML = `
   <b>${cur} Receiving Details</b><br><br>
   Name: ${fullName}<br>
   Cleo ${cur} Account: ${cleoAcc}-${cur}<br>
   LIV Reference: ${refCode}
 `;
}

function copyDetails(){
 navigator.clipboard.writeText(
   selectedCurrency+" ACCOUNT\nName: "+fullName+"\nCleo Account: "+cleoAcc+"-"+selectedCurrency+"\nReference: "+refCode
 );
 document.getElementById("msg").innerText = "Receiving details copied.";
}

async function simulateDeposit(){
 let amount = prompt("Enter received amount:");
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
   type:"Deposit "+selectedCurrency,
   amount:amount,
   note:"Funds received into "+selectedCurrency+" account"
 });

 document.getElementById("msg").innerText = "Deposit credited successfully.";
}

function showExchangeSection(){
 document.getElementById("dynamicArea").innerHTML = `
   <div style="font-size:13px;color:#6b7280;margin-bottom:14px;">
     Convert balances between currencies
   </div>

   <div style="font-size:13px;margin-bottom:8px;">From</div>
   <div id="fromBtns" class="actions" style="flex-wrap:wrap;">
     <div class="cardbtn" onclick="pickFrom('USD',this)">USD</div>
     <div class="cardbtn" onclick="pickFrom('EUR',this)">EUR</div>
     <div class="cardbtn" onclick="pickFrom('GBP',this)">GBP</div>
     <div class="cardbtn" onclick="pickFrom('MXN',this)">MXN</div>
   </div>

   <div style="font-size:13px;margin:18px 0 8px;">To</div>
   <div id="toBtns" class="actions" style="flex-wrap:wrap;">
     <div class="cardbtn" onclick="pickTo('USD',this)">USD</div>
     <div class="cardbtn" onclick="pickTo('EUR',this)">EUR</div>
     <div class="cardbtn" onclick="pickTo('GBP',this)">GBP</div>
     <div class="cardbtn" onclick="pickTo('MXN',this)">MXN</div>
   </div>

   <input id="amount" placeholder="Amount to Exchange">

   <div id="rateBox" class="tx" style="margin-top:14px;display:none;"></div>

   <button class="btn sendBtn" onclick="submitExchange()">
     Confirm Exchange
   </button>
 `;
}

function pickFrom(cur,el){
 fromCurrency = cur;
 document.querySelectorAll("#fromBtns .cardbtn").forEach(b=>{
   b.style.background="#fbfcfe"; b.style.color="#111827"; b.style.border="1px solid #edf0f3";
 });
 el.style.background="#111827"; el.style.color="white"; el.style.border="1px solid #111827";
 updateRateBox();
}

function pickTo(cur,el){
 toCurrency = cur;
 document.querySelectorAll("#toBtns .cardbtn").forEach(b=>{
   b.style.background="#fbfcfe"; b.style.color="#111827"; b.style.border="1px solid #edf0f3";
 });
 el.style.background="#111827"; el.style.color="white"; el.style.border="1px solid #111827";
 updateRateBox();
}

function updateRateBox(){
 if(fromCurrency && toCurrency){
   document.getElementById("rateBox").style.display="block";
   document.getElementById("rateBox").innerHTML =
   `<b>Estimated Rate Preview</b><br><br>1 ${fromCurrency} = preview ${toCurrency}`;
 }
}

async function submitExchange(){
 const amount = Number(document.getElementById("amount").value.trim());

 if(!fromCurrency || !toCurrency || !amount){
   document.getElementById("msg").innerText = "Select currencies and amount.";
   return;
 }

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

 await supabaseClient.from('transactions').insert({
   user_id:currentUser.id,
   type:"Exchange "+fromCurrency+"-"+toCurrency,
   amount:-amount,
   note:"Currency exchange submitted"
 });

 document.getElementById("msg").innerText =
 amount+" "+fromCurrency+" exchanged to "+toCurrency+" successfully.";
}

loadExchangeUser();