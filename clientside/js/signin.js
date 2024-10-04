document.getElementById("signin").addEventListener("submit",async(e)=>{
    console.log("HAAI");
    console.log("HAAAIAII");
    
    const email=document.getElementById("email").value;
    const password=document.getElementById("password").value;
    fetch("http://localhost:3000/api/signin",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({email,password})
    }).then(async(res)=>{
        console.log(res);
        const result=await res.json();
        if(res.status==200){
            localStorage.setItem("Auth",result.token)
            console.log(result);
            
            window.location.href="../index.html"
        }else if(res.status==404){
            // console.log(res);
            alert(result.msg)
        }else{
            alert(result.msg)
        }
    }).catch((error)=>{
        console.log(error);
        
    })
    
})