const supabaseClient = window.supabase.createClient(
 "https://uzzqibmydlcpqfyceuup.supabase.co",
 "sb_publishable_WXxeH7xCf4aISY6rRr1RBQ_KEcM5lRe"
);

async function loadNotifications(){
 const { data:{ user } } = await supabaseClient.auth.getUser();

 const { data:tx } = await supabaseClient
   .from('transactions')
   .select('*')
   .eq('user_id', user.id)
   .order('created_at',{ascending:false});

 renderNotifications(tx || []);
}

function renderNotifications(tx){
 let html = "";

 if(tx.length){
   tx.forEach(t=>{
     html += `
       <div class="tx">
         <b>${t.type}</b><br>
         ${t.note || 'Account movement registered'}<br>
         <span class="${t.amount<0?'amtneg':'amtpos'}">
           ${t.amount>0?'+':''}$${Math.abs(t.amount)}
         </span>
       </div>
     `;
   });
 }else{
   html = `
    <div class="tx"><b>Deposit Received</b><br>$2,500 credited successfully.</div>
    <div class="tx"><b>Exchange Completed</b><br>USD converted to MXN.</div>
    <div class="tx"><b>Card Payment</b><br>Purchase authorized online.</div>
    <div class="tx"><b>Security Alert</b><br>New login from trusted device.</div>
    <div class="tx"><b>Investment Order</b><br>Stock order executed.</div>
   `;
 }

 document.getElementById("notifArea").innerHTML = html;
}

loadNotifications();