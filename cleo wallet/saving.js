const supabaseClient = window.supabase.createClient(
 "https://uzzqibmydlcpqfyceuup.supabase.co",
 "sb_publishable_WXxeH7xCf4aISY6rRr1RBQ_KEcM5lRe"
);

function renderSaving(){
 document.getElementById("savingArea").innerHTML = `

   <div class="mainCard">
      <div class="mainMini">TOTAL SAVED</div>
      <div class="balance">$8,420.00</div>
      <div class="ref">4 Active Goal Vaults</div>
   </div>

   <div class="tx">
      <b>Emergency Fund</b><br>
      $2,000 / $5,000
      <div style="margin-top:8px;height:8px;background:#e5e7eb;border-radius:20px;">
        <div style="width:40%;height:8px;background:#111827;border-radius:20px;"></div>
      </div>
   </div>

   <div class="tx">
      <b>House Goal</b><br>
      $3,500 / $10,000
      <div style="margin-top:8px;height:8px;background:#e5e7eb;border-radius:20px;">
        <div style="width:35%;height:8px;background:#111827;border-radius:20px;"></div>
      </div>
   </div>

   <div class="tx">
      <b>Vacation Goal</b><br>
      $1,420 / $3,000
      <div style="margin-top:8px;height:8px;background:#e5e7eb;border-radius:20px;">
        <div style="width:47%;height:8px;background:#111827;border-radius:20px;"></div>
      </div>
   </div>

   <div class="tx">
      <b>Retirement Vault</b><br>
      $1,500 / $20,000
      <div style="margin-top:8px;height:8px;background:#e5e7eb;border-radius:20px;">
        <div style="width:8%;height:8px;background:#111827;border-radius:20px;"></div>
      </div>
   </div>

   <div class="actions" style="margin-top:22px;">
      <div class="cardbtn" onclick="addSaving()">Add Funds</div>
      <div class="cardbtn" onclick="newGoal()">New Goal</div>
   </div>
 `;
}

function addSaving(){
 document.getElementById("msg").innerText = "Funds added to selected vault.";
}

function newGoal(){
 document.getElementById("msg").innerText = "New saving goal created.";
}

renderSaving();