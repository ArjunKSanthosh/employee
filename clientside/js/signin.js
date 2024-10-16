
document.getElementById("frm").addEventListener("submit",async(e)=>{
    e.preventDefault();
    const email=document.getElementById("email").value;
    const password=document.getElementById("password").value;
    console.log(email,password);
    fetch("http://localhost:3000/api/signin",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({email,password})
    }).then(async (res)=>{
        console.log(res);
        const result=await res.json();
        if(res.status==200){
            localStorage.setItem("Auth",result.token);
            console.log(result);
            alert(result.msg);
            window.location.href="../index.html"
        }else if(res.status==404){
            alert(result.msg)
        }
        else{
            alert("error")
        }
        
    }).catch((error)=>{
        console.log(error);
        
    });
})
