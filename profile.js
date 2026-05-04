const supabaseClient = window.supabase.createClient(
 "https://uzzqibmydlcpqfyceuup.supabase.co",
 "sb_publishable_WXxeH7xCf4aISY6rRr1RBQ_KEcM5lRe"
);

let fullName="", cleoAcc="", userEmail="", refCode="";

async function loadProfileUser(){
 const { data:{ user } } = await supabaseClient.auth.getUser();

 userEmail = user.email || "";

 const { data:userData } = await supabaseClient
   .from('users')
   .select('*')
   .eq('id', user.id)
   .single();

 fullName = userData.full_name || "Client";
 cleoAcc = userData.cleo_account || "CLEO-00000000";
 refCode = userData.reference_code || "LIV-0000-XXXX";

 renderProfile();
}

function renderProfile(){
 document.getElementById("profileArea").innerHTML = `

   <div class="mainCard">
      <div class="mainMini">CLIENT IDENTITY</div>
      <div class="balance" style="font-size:22px;">${fullName}</div>
      <div class="ref">${userEmail}</div>
   </div>

   <div class="tx">
      <b>Cleo Account</b><br>
      ${cleoAcc}
   </div>

   <div class="tx">
      <b>LIV Reference</b><br>
      ${refCode}
   </div>

   <div class="tx">
      <b>Personal Information</b><br>
      KYC verified • Address on file • Identity confirmed
   </div>

   <div class="tx">
      <b>Security Settings</b><br>
      Password enabled • Device protected • 2FA optional
   </div>

   <div class="cardbtn" onclick="changePassword()">Change Password</div>
   <div class="cardbtn" onclick="openPersonal()" style="margin-top:12px;">Manage Personal Info</div>
   <div class="cardbtn" onclick="logoutUser()" style="margin-top:12px;">Logout</div>
 `;
}

function changePassword(){
 document.getElementById("msg").innerText = "Password center opened.";
}

function openPersonal(){
 document.getElementById("msg").innerText = "Personal information opened.";
}

async function logoutUser(){
 await supabaseClient.auth.signOut();
 window.location.href="/";
}

loadProfileUser();