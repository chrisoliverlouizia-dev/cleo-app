const supabaseClient = window.supabase.createClient(
 "https://uzzqibmydlcpqfyceuup.supabase.co",
 "sb_publishable_WXxeH7xCf4aISY6rRr1RBQ_KEcM5lRe"
);

let fullName = "Client";

async function loadCardsUser(){
 const { data:{ user } } = await supabaseClient.auth.getUser();

 const { data:userData } = await supabaseClient
   .from('users')
   .select('*')
   .eq('id', user.id)
   .single();

 fullName = userData.full_name || "Client";

 renderCards();
}

function renderCards(){
 document.getElementById("cardsArea").innerHTML = `

   <div style="
   background:linear-gradient(135deg,#0f172a,#1e293b);
   color:white;
   border-radius:28px;
   padding:24px;
   box-shadow:0 14px 30px rgba(0,0,0,.18);
   margin-bottom:18px;">
      <div style="font-size:12px;opacity:.7;">CLEO VIRTUAL CARD</div>
      <div style="margin-top:28px;font-size:20px;letter-spacing:3px;">4582 •••• •••• 1904</div>
      <div style="margin-top:18px;font-size:13px;">${fullName.toUpperCase()}</div>
      <div style="margin-top:8px;font-size:12px;opacity:.7;">Exp 12/30</div>
   </div>

   <div style="
   background:linear-gradient(135deg,#d6d3d1,#78716c);
   color:white;
   border-radius:28px;
   padding:24px;
   box-shadow:0 14px 30px rgba(0,0,0,.14);
   margin-bottom:22px;">
      <div style="font-size:12px;opacity:.8;">CLEO METAL CARD</div>
      <div style="margin-top:28px;font-size:20px;letter-spacing:3px;">5318 •••• •••• 8821</div>
      <div style="margin-top:18px;font-size:13px;">${fullName.toUpperCase()}</div>
      <div style="margin-top:8px;font-size:12px;opacity:.8;">Exp 10/31</div>
   </div>

   <div class="cardbtn" onclick="showCardNumber()">Reveal Card Details</div>
   <div class="cardbtn" onclick="freezeCard()" style="margin-top:12px;">Freeze / Unfreeze Card</div>
   <div class="cardbtn" onclick="cardSettings()" style="margin-top:12px;">Card Settings</div>
 `;
}

function showCardNumber(){
 document.getElementById("msg").innerText = "Virtual Card: 4582 7744 9911 1904 | CVV 482";
}

function freezeCard(){
 document.getElementById("msg").innerText = "Card status updated successfully.";
}

function cardSettings(){
 document.getElementById("msg").innerText = "Card controls opened.";
}

loadCardsUser();