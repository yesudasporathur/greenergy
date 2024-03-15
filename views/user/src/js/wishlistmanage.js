async function addToWishlist(p_id){
    const response = await fetch(`/wishlist-add`,{
        method:"POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({p_id})
    })
    if(response){
        const data=await response.text()
        console.log(data)
        setInterval(() => {
            document.getElementById('message').innerText=""
            
        }, 10000);
        document.getElementById('message').innerText=data
    }
    else{
        console.log("Unknown")
    }
}
