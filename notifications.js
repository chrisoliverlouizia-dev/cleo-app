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

let currentUser;

async function loadNotifications(){
 const user = await checkAuth();
 if(!user) return;

 currentUser = user;

 const { data:tx } = await supabaseClient
   .from('transactions')
   .select('*')
   .eq('user_id', currentUser.id)
   .order('created_at',{ascending:false});

 renderNotifications(tx);
}

function renderNotifications(tx){
 let html = "";

 if(tx && tx.length){
   tx.forEach(t=>{
     let icon = "🔔";

     if(t.type.includes("Deposit")) icon = "💸";
     if(t.type.includes("Exchange")) icon = "💱";
     if(t.type.includes("Stock")) icon = "📈";
     if(t.type.includes("Saving")) icon = "🏦";
     if(t.type.includes("Card")) icon = "💳";

     html += `
       <div class="tx">
          <b>${icon} ${t.type}</b><br>
          ${t.note || ''}<br>
          <span class="${t.amount < 0 ? 'amtneg':'amtpos'}">
            ${t.amount > 0 ? '+' : ''}$${Math.abs(t.amount)}
          </span>
       </div>
     `;
   });
 }else{
   html = `<div class="tiny">No notifications yet.</div>`;
 }

 document.getElementById("notifArea").innerHTML = `
   <div class="mainCard">
      <div class="mainMini">LIVE ACTIVITY CENTER</div>
      <div class="balance" style="font-size:24px;">${tx ? tx.length : 0}</div>
      <div class="ref">Recent Alerts</div>
   </div>

   ${html}
 `;
}

loadNotifications();