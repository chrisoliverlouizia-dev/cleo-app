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

let currentUser, fullName, cleoAcc, refCode;

async function goProfile(){ window.location.href="profile.html"; }
async function goNotif(){ window.location.href="notifications.html"; }
async function goCards(){ window.location.href="cards.html"; }
async function goExchange(){ window.location.href="exchange.html"; }
async function goInvest(){ window.location.href="invest.html"; }
async function goSaving(){ window.location.href="saving.html"; }

async function loadUser(){
 const user = await checkAuth();
 if(!user) return;

 currentUser = user;

 const { data:userData } = await supabaseClient
   .from('users')
   .select('*')
   .eq('id', user.id)
   .single();

 fullName = userData?.full_name || "Client";
 cleoAcc = userData?.cleo_account || "CLEO-00000000";
 refCode = userData?.reference_code || "LIV-0000-XXXX";

 document.getElementById("welcomeName").innerText = fullName;
 document.getElementById("topRef").innerText = refCode;

 let { data:bal } = await supabaseClient
   .from('balances')
   .select('*')
   .eq('user_id', user.id)
   .single();

 if(!bal){
   await supabaseClient.from('balances').insert({
     user_id:user.id,
     balance:0
   });

   bal = { balance:0 };
 }

 document.getElementById("bal").innerText = "$" + Number(bal.balance).toFixed(2);

 loadHistory();
}

async function loadHistory(){
 const { data:tx } = await supabaseClient
   .from('transactions')
   .select('*')
   .eq('user_id', currentUser.id)
   .order('created_at',{ascending:false});

 let html = "";

 if(tx && tx.length){
   tx.forEach(t=>{
     html += `
      <div class="tx">
        <div class="${t.amount<0?'amtneg':'amtpos'}">
          ${t.amount>0?'+':''}$${Math.abs(t.amount)}
        </div>
        <div>${t.type}</div>
        <div class="tiny">${t.note || ''}</div>
      </div>
     `;
   });
 }else{
   html = `<div class="tiny">No activity yet.</div>`;
 }

 document.getElementById("history").innerHTML = html;
}

loadUser();