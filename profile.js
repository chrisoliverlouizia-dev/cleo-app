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

async function loadProfileUser(){
 const user = await checkAuth();
 if(!user) return;

 currentUser = user;

 const { data:u } = await supabaseClient
   .from('users')
   .select('*')
   .eq('id', user.id)
   .single();

 renderProfile(u);
}

function renderProfile(u){
 document.getElementById("profileArea").innerHTML = `
   <div class="mainCard">
      <div class="mainMini">CLIENT PROFILE</div>
      <div class="balance" style="font-size:22px;">${u?.full_name || 'Client'}</div>
      <div class="ref">${u?.cleo_account || 'CLEO-00000000'}</div>
   </div>

   <div class="tx"><b>Email</b><br>${currentUser.email}</div>
   <div class="tx"><b>Reference Code</b><br>${u?.reference_code || 'LIV-0000-XXXX'}</div>
   <div class="tx"><b>Membership</b><br>Cleo Premium Black</div>

   <div class="actions" style="margin-top:22px;">
      <div class="cardbtn" onclick="editName()">Edit Name</div>
      <div class="cardbtn" onclick="showLogout()">Disconnect</div>
   </div>
 `;
}

function editName(){
 openModal(`
   <div class="modalTitle">Edit Client Name</div>
   <input id="newClientName" class="modalInput" placeholder="New Full Name">
   <button class="modalBtn" onclick="confirmEditName()">Save Changes</button>
 `);
}

async function confirmEditName(){
 let newName = document.getElementById("newClientName").value;
 if(!newName) return;

 await supabaseClient
   .from('users')
   .update({ full_name:newName })
   .eq('id', currentUser.id);

 closeModal();
 document.getElementById("msg").innerText = "Profile updated.";
 loadProfileUser();
}

function showLogout(){
 openModal(`
   <div class="modalTitle">Secure Disconnect</div>
   <div class="tx" style="margin-bottom:15px;">
      Are you sure you want to sign out from this Cleo device?
   </div>
   <button class="modalBtn" onclick="logoutUser()">Yes, Disconnect</button>
 `);
}

async function logoutUser(){
 await supabaseClient.auth.signOut();
 window.location.href = "login.html";
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

async function loadProfileUser(){
 const user = await checkAuth();
 if(!user) return;

 currentUser = user;

 const { data:u } = await supabaseClient
   .from('users')
   .select('*')
   .eq('id', user.id)
   .single();

 renderProfile(u);
}

function renderProfile(u){
 document.getElementById("profileArea").innerHTML = `
   <div class="mainCard">
      <div class="mainMini">CLIENT PROFILE</div>
      <div class="balance" style="font-size:22px;">${u?.full_name || 'Client'}</div>
      <div class="ref">${u?.cleo_account || 'CLEO-00000000'}</div>
   </div>

   <div class="tx"><b>Email</b><br>${currentUser.email}</div>
   <div class="tx"><b>Reference Code</b><br>${u?.reference_code || 'LIV-0000-XXXX'}</div>
   <div class="tx"><b>Membership</b><br>Cleo Premium Black</div>

   <div class="actions" style="margin-top:22px;">
      <div class="cardbtn" onclick="editName()">Edit Name</div>
      <div class="cardbtn" onclick="showLogout()">Disconnect</div>
   </div>
 `;
}

function editName(){
 openModal(`
   <div class="modalTitle">Edit Client Name</div>
   <input id="newClientName" class="modalInput" placeholder="New Full Name">
   <button class="modalBtn" onclick="confirmEditName()">Save Changes</button>
 `);
}

async function confirmEditName(){
 let newName = document.getElementById("newClientName").value;
 if(!newName) return;

 await supabaseClient
   .from('users')
   .update({ full_name:newName })
   .eq('id', currentUser.id);

 closeModal();
 document.getElementById("msg").innerText = "Profile updated.";
 loadProfileUser();
}

function showLogout(){
 openModal(`
   <div class="modalTitle">Secure Disconnect</div>
   <div class="tx" style="margin-bottom:15px;">
      Are you sure you want to sign out from this Cleo device?
   </div>
   <button class="modalBtn" onclick="logoutUser()">Yes, Disconnect</button>
 `);
}

async function logoutUser(){
 await supabaseClient.auth.signOut();
 window.location.href = "login.html";
}

>>>>>>> a4fb65ddd8ae5ad793ee0695b71991371a438e91
loadProfileUser();