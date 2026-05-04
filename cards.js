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
let cardFrozen = false;

async function loadCardsUser(){
 const user = await checkAuth();
 if(!user) return;

 currentUser = user;
 renderCards();
}

function renderCards(){
 document.getElementById("cardsArea").innerHTML = `
   <div class="mainCard">
      <div class="mainMini">CLEO PREMIUM CARD</div>
      <div class="balance" style="font-size:24px;">•••• 4582</div>
      <div class="ref">${cardFrozen ? 'Temporarily Frozen' : 'Virtual & Physical Linked'}</div>
   </div>

   <div class="tx">
      <b>Virtual Card</b><br>
      Online secure payments enabled
   </div>

   <div class="tx">
      <b>Physical Card</b><br>
      Contactless premium spending active
   </div>

   <div class="actions" style="margin-top:22px;">
      <div class="cardbtn" onclick="simulatePurchase()">Card Purchase</div>
      <div class="cardbtn" onclick="freezeCard()">${cardFrozen ? 'Unfreeze Card' : 'Freeze Card'}</div>
   </div>

   <div class="cardbtn" onclick="showDetails()" style="margin-top:12px;">
      Card Details
   </div>
 `;
}

function simulatePurchase(){
 if(cardFrozen){
   document.getElementById("msg").innerText = "Card is frozen.";
   return;
 }

 openModal(`
   <div class="modalTitle">Premium Card Purchase</div>
   <input id="merchantName" class="modalInput" placeholder="Merchant Name">
   <input id="purchaseAmount" class="modalInput" placeholder="Purchase Amount">
   <button class="modalBtn" onclick="confirmPurchase()">Approve Payment</button>
 `);
}

async function confirmPurchase(){
 let merchant = document.getElementById("merchantName").value;
 let amount = document.getElementById("purchaseAmount").value;

 if(!merchant || !amount) return;
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

 await supabaseClient.from('transactions').insert({
   user_id:currentUser.id,
   type:"Card Payment",
   amount:-amount,
   note:"Purchase at "+merchant
 });

 closeModal();
 document.getElementById("msg").innerText = "Card purchase approved.";
}

function freezeCard(){
 cardFrozen = !cardFrozen;
 document.getElementById("msg").innerText = cardFrozen ? "Card temporarily frozen." : "Card active again.";
 renderCards();
}

function showDetails(){
 openModal(`
   <div class="modalTitle">Card Details</div>
   <div class="tx">
      Card Holder: CLEO CLIENT<br>
      Number: •••• •••• •••• 4582<br>
      Exp: 09/30<br>
      CVV: •••
   </div>
   <button class="modalBtn" onclick="closeModal()">Close</button>
 `);
}

loadCardsUser();