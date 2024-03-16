
async function submitForm() {
    //window.location.href='shop'
    let data={}

    data.sort=document.getElementById('sort').value
    const keyword=document.getElementById('keyword')
    if(keyword)
    {
        data.search=keyword.innerText
    }
    data.category = document.querySelector('input[name="category"]:checked').id;
    const price = document.querySelector('.noUi-handle-upper');
    const brandsCheckbox = document.querySelectorAll('input[type="checkbox"][name="brand"]:checked');
    const ratingsCheckbox = document.querySelectorAll('input[type="checkbox"][name="ratings"]:checked');

    const brand = [],rating=[];

    brandsCheckbox.forEach(function(checkbox) {
            brand.push(checkbox.id);
    });
    ratingsCheckbox.forEach(function(checkbox) {
        rating.push(parseInt(checkbox.id));
    });


    data.pricemin = parseInt(price.getAttribute('aria-valuemin'));
    data.pricemax = parseInt(price.getAttribute('aria-valuenow'));
    data.brand=brand
    data.rating=rating
    
    console.log(data)
    const res=await fetch('/filter',{
        method:"POST",
        headers: {
            'Content-Type': 'application/json' // Specify that you're sending JSON data
          },
        body: JSON.stringify(data)
    })
    if(!res){
        throw new Error
    }
    const result=await res.json()
    console.log(result)

    
}