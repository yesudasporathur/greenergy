
      document.addEventListener('DOMContentLoaded', function () {
        const showCouponsBtn = document.getElementById('showCouponsBtn');
        const couponsPopup = document.getElementById('couponsPopup');
        const couponList = document.getElementById('couponList');
    
        async function fetchCoupons() {
            try {
    
                const response = await fetch('/coupons');
                
                const coupons = await response.json();
                return coupons;
            } catch (error) {
                console.error('Error fetching coupons:', error);
            }
        }
    
        async function displayCoupons() {
            const coupons = await fetchCoupons();
            couponList.innerHTML = '';
            
            if(coupons.length!=0){
                coupons.forEach(coupon => {
                    const div = document.createElement('div');
                    div.innerHTML = `
                        <p><strong>Code:</strong> ${coupon.code}</p>
                        <p><strong>Discount:</strong> Rs. ${coupon.discount}</p>
                        <p>${coupon.description}</p>
                        <a href="coupon-apply/${coupon.code}">Click here to apply<a>
                    `;
                    couponList.appendChild(div);
                });
        
            }
            else{
                
                    const div = document.createElement('div');
                    div.innerHTML = `
                        <p><strong style="color:red">No available coupons</strong> </p>
                        
                    `;
                    couponList.appendChild(div);
        
            }
            couponsPopup.style.display = 'block';
        }
    
        showCouponsBtn.addEventListener('click', displayCoupons);
        couponsPopup.addEventListener('click', function (event) {
            if (event.target === couponsPopup || event.target.classList.contains('close')) {
                couponsPopup.style.display = 'none';
            }
        });
    });
    