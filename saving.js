<<<<<<< HEAD
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

async function loadSavingUser(){
 const user = await checkAuth();
 if(!user) return;

 currentUser = user;
 renderSaving();
}

async function renderSaving(){
 const { data:saves } = await supabaseClient
   .from('savings')
   .select('*')
   .eq('user_id', currentUser.id);

 let totalSaved = 0;
 let htmlVaults = "";

 if(saves && saves.length){
   saves.forEach(v=>{
     totalSaved += Number(v.amount);

     let goal = 5000;
     if(v.vault === "House Goal") goal = 10000;
     if(v.vault === "Vacation Goal") goal = 3000;
     if(v.vault === "Retirement Vault") goal = 20000;
     if(v.vault === "Emergency Fund") goal = 2000;

     let pct = Math.min((Number(v.amount)/goal)*100,100);

     htmlVaults += `
       <div class="tx">
         <b>${v.vault}</b><br>
         $${Number(v.amount).toFixed(2)} / $${goal}
         <div style="margin-top:8px;height:8px;background:#e5e7eb;border-radius:20px;">
           <div style="width:${pct}%;height:8px;background:#111827;border-radius:20px;"></div>
         </div>
       </div>
     `;
   });
 }else{
   htmlVaults = `<div class="tiny">No saving vaults yet.</div>`;
 }

 document.getElementById("savingArea").innerHTML = `
   <div class="mainCard">
      <div class="mainMini">TOTAL SAVED</div>
      <div class="balance">$${totalSaved.toFixed(2)}</div>
      <div class="ref">${saves ? saves.length : 0} Active Goal Vaults</div>
   </div>

   ${htmlVaults}

   <div class="actions" style="margin-top:22px;">
      <div class="cardbtn" onclick="newGoal()">New Goal</div>
      <div class="cardbtn" onclick="addSaving()">Add Funds</div>
   </div>
 `;
}

function newGoal(){
 openModal(`
   <div class="modalTitle">Create Saving Vault</div>
   <input id="vaultName" class="modalInput" placeholder="Vault Name">
   <button class="modalBtn" onclick="confirmNewGoal()">Create Vault</button>
 `);
}

async function confirmNewGoal(){
 let vault = document.getElementById("vaultName").value;
 if(!vault) return;

 await supabaseClient.from('savings').insert({
   user_id:currentUser.id,
   vault:vault,
   amount:0
 });

 closeModal();
 document.getElementById("msg").innerText = "New saving vault created.";
 renderSaving();
}

function addSaving(){
 openModal(`
   <div class="modalTitle">Transfer To Savings</div>
   <input id="vaultTransfer" class="modalInput" placeholder="Exact Vault Name">
   <input id="saveAmount" class="modalInput" placeholder="Amount">
   <button class="modalBtn" onclick="confirmAddSaving()">Transfer Funds</button>
 `);
}

async function confirmAddSaving(){
 let vault = document.getElementById("vaultTransfer").value;
 let amount = document.getElementById("saveAmount").value;

 if(!vault || !amount) return;
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

 let { data:saveRow } = await supabaseClient
   .from('savings')
   .select('*')
   .eq('user_id', currentUser.id)
   .eq('vault', vault)
   .single();

 if(saveRow){
   await supabaseClient
     .from('savings')
     .update({ amount:Number(saveRow.amount)+amount })
     .eq('id', saveRow.id);
 }

 await supabaseClient.from('transactions').insert({
   user_id:currentUser.id,
   type:"Saving Transfer",
   amount:-amount,
   note:"Funds moved to "+vault
 });

 closeModal();
 document.getElementById("msg").innerText = "Funds transferred to saving vault.";
 renderSaving();
}

=======
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

async function loadSavingUser(){
 const user = await checkAuth();
 if(!user) return;

 currentUser = user;
 renderSaving();
}

async function renderSaving(){
 const { data:saves } = await supabaseClient
   .from('savings')
   .select('*')
   .eq('user_id', currentUser.id);

 let totalSaved = 0;
 let htmlVaults = "";

 if(saves && saves.length){
   saves.forEach(v=>{
     totalSaved += Number(v.amount);

     let goal = 5000;
     if(v.vault === "House Goal") goal = 10000;
     if(v.vault === "Vacation Goal") goal = 3000;
     if(v.vault === "Retirement Vault") goal = 20000;
     if(v.vault === "Emergency Fund") goal = 2000;

     let pct = Math.min((Number(v.amount)/goal)*100,100);

     htmlVaults += `
       <div class="tx">
         <b>${v.vault}</b><br>
         $${Number(v.amount).toFixed(2)} / $${goal}
         <div style="margin-top:8px;height:8px;background:#e5e7eb;border-radius:20px;">
           <div style="width:${pct}%;height:8px;background:#111827;border-radius:20px;"></div>
         </div>
       </div>
     `;
   });
 }else{
   htmlVaults = `<div class="tiny">No saving vaults yet.</div>`;
 }

 document.getElementById("savingArea").innerHTML = `
   <div class="mainCard">
      <div class="mainMini">TOTAL SAVED</div>
      <div class="balance">$${totalSaved.toFixed(2)}</div>
      <div class="ref">${saves ? saves.length : 0} Active Goal Vaults</div>
   </div>

   ${htmlVaults}

   <div class="actions" style="margin-top:22px;">
      <div class="cardbtn" onclick="newGoal()">New Goal</div>
      <div class="cardbtn" onclick="addSaving()">Add Funds</div>
   </div>
 `;
}

function newGoal(){
 openModal(`
   <div class="modalTitle">Create Saving Vault</div>
   <input id="vaultName" class="modalInput" placeholder="Vault Name">
   <button class="modalBtn" onclick="confirmNewGoal()">Create Vault</button>
 `);
}

async function confirmNewGoal(){
 let vault = document.getElementById("vaultName").value;
 if(!vault) return;

 await supabaseClient.from('savings').insert({
   user_id:currentUser.id,
   vault:vault,
   amount:0
 });

 closeModal();
 document.getElementById("msg").innerText = "New saving vault created.";
 renderSaving();
}

function addSaving(){
 openModal(`
   <div class="modalTitle">Transfer To Savings</div>
   <input id="vaultTransfer" class="modalInput" placeholder="Exact Vault Name">
   <input id="saveAmount" class="modalInput" placeholder="Amount">
   <button class="modalBtn" onclick="confirmAddSaving()">Transfer Funds</button>
 `);
}

async function confirmAddSaving(){
 let vault = document.getElementById("vaultTransfer").value;
 let amount = document.getElementById("saveAmount").value;

 if(!vault || !amount) return;
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

 let { data:saveRow } = await supabaseClient
   .from('savings')
   .select('*')
   .eq('user_id', currentUser.id)
   .eq('vault', vault)
   .single();

 if(saveRow){
   await supabaseClient
     .from('savings')
     .update({ amount:Number(saveRow.amount)+amount })
     .eq('id', saveRow.id);
 }

 await supabaseClient.from('transactions').insert({
   user_id:currentUser.id,
   type:"Saving Transfer",
   amount:-amount,
   note:"Funds moved to "+vault
 });

 closeModal();
 document.getElementById("msg").innerText = "Funds transferred to saving vault.";
 renderSaving();
}

>>>>>>> a4fb65ddd8ae5ad793ee0695b71991371a438e91
loadSavingUser();