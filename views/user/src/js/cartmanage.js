async function addToCart(p_id) {    
    try {
        const response = await fetch(`/addtocart?p_id=${p_id}`, {
            method: "POST"
        });
        
        if (!response.ok) {
            throw new Error(await response.text());
        }
        if(response.status==500){
            console.log('sss')
            window.location.href='/cart'
          }
        const data = await response.json();
        const quantity = data.quantity;
        const subtotal=data.subtotal
        const total=data.total
        const cartnum=data.cartnum
        console.log(quantity,subtotal,total,cartnum)

        
        try{
            const counterElement = document.getElementById(`counter-btn-counter-${p_id}`);
        if (counterElement) counterElement.textContent = quantity;
        document.getElementById(`subtotal-${p_id}`).textContent = `Rs. ${subtotal}`;
        document.getElementById(`total`).textContent = `Rs. ${total}`;
        document.getElementById(`incltotal`).textContent = `Rs. ${total}`;
        document.getElementById(`navtotal`).innerHTML = `Rs. ${total}`;
        document.getElementById(`errmsg-${p_id}`).textContent = ``;
        
        console.log('Item added to cart successfully');
        window.location.href="/cart"

        }
        catch{
            window.location.href="/cart"

        }
        
    } catch (error) {
        console.error('Error:', error.message);
        document.getElementById(`errmsg-${p_id}`).textContent = error.message;
    }
}

async function removeFromCart(p_id) {    

    try {
        const response = await fetch(`/removeFromCart?p_id=${p_id}`, {
            method: "POST"
        });
        console.log(response)
        
        if (!response.ok) {
            throw new Error(await response.text());
        }
        if(response.status==500){
            console.log('sss')
            window.location.href='/cart'
          }
        const data = await response.json();
        const quantity = data.quantity;
        const subtotal=data.subtotal
        const total=data.total
        console.log(quantity,subtotal,total)
        if(quantity == 0){
            res.redirect('/cart')
        }

        
        const counterElement = document.getElementById(`counter-btn-counter-${p_id}`);
        if (counterElement) counterElement.textContent = quantity;
        document.getElementById(`subtotal-${p_id}`).textContent = `Rs. ${subtotal}`;
        document.getElementById(`total`).textContent = `Rs. ${total}`;
        document.getElementById(`incltotal`).textContent = `Rs. ${total}`;
        document.getElementById(`navtotal`).innerHTML = `Rs. ${total}`;
        document.getElementById(`errmsg-${p_id}`).textContent = ``;

        
        console.log('Item removed from cart successfully');
        
    } catch (error) {
        document.getElementById(`errmsg-${p_id}`).textContent = ``;
        console.error('Error:', error);

    }
}
async function placeOrder(event){
    event.preventDefault();
    const a_id = document.getElementsByName('a_id')[0].value; 
    const c_id = document.getElementsByName('c_id')[0].value; 
    const payment = document.querySelector('input[name="payment"]:checked').value; 
    const data={
      a_id:a_id,
      c_id:c_id,
      payment:payment

    }
    console.log(data)
        const res=await fetch('/checkout',{
            method:"POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        console.log(res)
        if(res){
            const {newOrderId}=await res.json()
            const _id=newOrderId
            try{
                if(res.status==201){
                    const resRz=await fetch('/razorpay',{
                        method:"post",
                        headers:{
                            'Content-Type':'application/json'
                        },
                        body:JSON.stringify({_id})
                    })
                    
                    if(resRz){
                        const {order,RAZORID,name,email,phone,url}=await resRz.json()
                        console.log(order)
    
                        var options = {
                            "key": RAZORID, // Enter the Key ID generated from the Dashboard
                            "amount": order.amount_due, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
                            "currency": "INR",
                            "name": "Greenergy",
                            "description": "Test Transaction",
                            "image": "https://github.com/BellerOphoN697/templates/blob/main/shopery/main/src/images/favicon/android-chrome-512x512.png?raw=true",
                            "order_id": order.id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
                            "handler": async function (response){
                                //alert(response.razorpay_payment_id);
                                console.log(response.razorpay_payment_id)
                                const res=await fetch(`/pay-id?id=${response.razorpay_payment_id}`,{
                                    method: "POST"
                                })
                                
                                    const url=await res.json()
                                    window.location.href=url
                                
                                //alert(response.razorpay_order_id);
                                //alert(response.razorpay_signature)
                            },
                            "prefill": {
                                "name": `${name}`,
                                "email": `${email}`,
                                "contact": `${phone}`
                            },
                            "notes": {
                                "address": "Razorpay Corporate Office"
                            },
                            "theme": {
                                "color": "#00b207"
                            },
                            "modal": {
                                "ondismiss": function () {
                                    // Handle modal close event here, redirects to order details page
                                    window.location.href=url
                                }
                            }
                        };
                        console.log(options)
                        var rzp1 = new Razorpay(options);
                        rzp1.open();
                    }
                    
                }
            }
            catch(err){
                console.log(err)
            }

            
            
        }
    
    
       

  }