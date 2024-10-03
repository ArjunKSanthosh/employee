document.getElementById("signin").addEventListener("submit",async(e)=>{
    const email=document.getElementById("email").value;
    const password=document.getElementById("password").value;
    console.log(username,email,password,cpassword);
    fetch("http://localhost:3000/api/signin",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({email,password})
    }).then(async(res)=>{
        console.log(res);
        if(res.status==200){
            const result=await res.json();
            localStorage.setItem("Auth",result.token)
            console.log(result);
            
            window.location.href="../index.html"
        }else if(res.status==404){
            console.log(res);
            alert("Empid Already Exists")
        }else{
            alert("Error")
        }
    }).catch((error)=>{
        console.log(error);
        
    })
    
})