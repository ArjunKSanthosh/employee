document.getElementById("signup").addEventListener("submit",async(e)=>{
    e.preventDefault()
    console.log("fsfdfsdfsd");
    
    const username=document.getElementById("username").value;
    const email=document.getElementById("email").value;
    const password=document.getElementById("password").value;
    const cpassword=document.getElementById("cpassword").value;
    console.log(username,email,password,cpassword);
    await fetch("http://localhost:3000/api/signup",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({username,email,password,cpassword})
    }).then(async(res)=>{
        const data=await res.json();
        console.log(res);
        if(res.status==201){
            console.log(res);
            alert(data.msg);
            window.location.href="../pages/signin.html"
        }else if(res.status==404){
            alert(data.msg);
        }else{
            alert("Error")
        }
    }).catch((error)=>{
        console.log(error);
        
    })
    
})
