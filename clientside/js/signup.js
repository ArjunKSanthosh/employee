document.getElementById("signup").addEventListener("submit",async(e)=>{
    const username=document.getElementById("username").value;
    const email=document.getElementById("email").value;
    const password=document.getElementById("password").value;
    const cpassword=document.getElementById("cpassword").value;
    console.log(username,email,password,cpassword);
    fetch("http://localhost:3000/api/signup",{
        method:"POST",
        heaers:{"Content-Type":"application/json"},
        body:JSON.stringify({username,email,password,cpassword})
    }).then((res)=>{
        console.log(res);
        if(res.status==201){
            console.log(res);
            window.location.href="./index.html"
        }else if(res.status==400){
            console.log(res);
            alert("Empid Already Exists")
        }else{
            alert("Error")
        }
    }).catch((error)=>{
        console.log(error);
        
    })
    
})