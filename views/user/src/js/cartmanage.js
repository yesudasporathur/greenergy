async function addToCart(p_id) {    
    try {
        const response = await fetch(`/addtocart?p_id=${p_id}`, {
            method: "POST"
        });
        
        if (!response.ok) {
            throw new Error('Failed to add item to cart');
        }
        
        const data = await response.json();
        const quantity = data.quantity;
        const subtotal=data.subtotal
        const total=data.total
        const cartnum=data.cartnum
        console.log(quantity,subtotal,total,cartnum)

        
        // Update the quantity displayed inside the <p> element
        const counterElement = document.getElementById(`counter-btn-counter-${p_id}`);
        if (counterElement) counterElement.textContent = quantity;
        document.getElementById(`subtotal-${p_id}`).textContent = `Rs. ${subtotal}`;
        document.getElementById(`total`).textContent = `Rs. ${total}`;
        document.getElementById(`incltotal`).textContent = `Rs. ${total}`;
        document.getElementById(`navtotal`).innerHTML = `Rs. ${total}`;


        
        console.log('Item added to cart successfully');
        
    } catch (error) {
        console.error('Error:', error.message);
    }
}

async function removeFromCart(p_id) {    

    try {
        const response = await fetch(`/removeFromCart?p_id=${p_id}`, {
            method: "POST"
        });
        
        if (!response.ok) {
            throw new Error('Failed to remove item from cart');
        }
        
        const data = await response.json();
        const quantity = data.quantity;
        const subtotal=data.subtotal
        const total=data.total
        console.log(quantity,subtotal,total)
        if(quantity == 0){
            res.redirect('/cart')
        }

        
        // Update the quantity displayed inside the <p> element
        document.getElementById(`subtotal-${p_id}`).textContent = `Rs. ${subtotal}`;
        document.getElementById(`total`).textContent = `Rs. ${total}`;
        document.getElementById(`incltotal`).textContent = `Rs. ${total}`;
        document.getElementById(`navtotal`).innerHTML = `Rs. ${total}`;

        
        console.log('Item removed from cart successfully');
        
    } catch (error) {
        console.error('Error:', error.message);
    }
}
