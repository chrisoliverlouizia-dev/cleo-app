const supabaseClient = window.supabase.createClient(
 "https://uzzqibmydlcpqfyceuup.supabase.co",
 "sb_publishable_WXxeH7xCf4aISY6rRr1RBQ_KEcM5lRe"
);

async function autoCheck(){
 const { data:{ session } } = await supabaseClient.auth.getSession();
 if(session){
   window.location.href = "index.html";
 }
}

function showLogin(){
 document.getElementById("authBox").innerHTML = `
   <input id="email" placeholder="Email Address">
   <input id="pass" type="password" placeholder="Password">
   <button onclick="loginUser()">Secure Login</button>
   <div class="switch" onclick="showRegister()">Create new Cleo account</div>
 `;
}

function showRegister(){
 document.getElementById("authBox").innerHTML = `
   <input id="fullname" placeholder="Full Name">
   <input id="email" placeholder="Email Address">
   <input id="pass" type="password" placeholder="Password">
   <button onclick="registerUser()">Open Account</button>
   <div class="switch" onclick="showLogin()">Already registered? Sign in</div>
 `;
}

async function loginUser(){
 let email = document.getElementById("email").value;
 let pass = document.getElementById("pass").value;

 const { error } = await supabaseClient.auth.signInWithPassword({
   email:email,
   password:pass
 });

 if(error){
   document.getElementById("msg").innerText = error.message;
   return;
 }

 window.location.href = "index.html";
}

async function registerUser(){
 let fullname = document.getElementById("fullname").value;
 let email = document.getElementById("email").value;
 let pass = document.getElementById("pass").value;

 const { data, error } = await supabaseClient.auth.signUp({
   email:email,
   password:pass
 });

 if(error){
   document.getElementById("msg").innerText = error.message;
   return;
 }

 let uid = data.user.id;

 await supabaseClient.from('users').insert([{
   id:uid,
   full_name:fullname,
   cleo_account:'CLEO-'+Math.floor(Math.random()*99999999),
   reference_code:'LIV-'+Math.floor(Math.random()*9999)
 }]);

 document.getElementById("msg").innerText = "Account created successfully.";
 showLogin();
}

autoCheck();
showLogin();