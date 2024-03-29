window.addEventListener('load', function() {
    filter();
});
async function filter(page){
    let data={}
    data.category=document.getElementById('category').value
    data.brand=document.getElementById('brand').value
    data.page=page
    data.search=document.getElementById('search').value
    data.limit=document.getElementById('limit').value
    console.log(data)
    const res=await fetch('/admin/product-filter',{
        method:'POST',
        headers:{
            'Content-Type':'application/json'
        },
        body: JSON.stringify(data)
    })
    if(res.status==200){

        let {products,count,page,pages} = await res.json();
        if(!page){
            page=1
        }
        updateProductTiles(products,count,page,pages);
        
        
    }
    else{
        throw new Error
    }



}


function generateProduct(product){
    let data = `            
                            <tr onclick="window.location.href = 'product-edit?id=${product._id}';">
                            <td><b>${product.sku}</b></td>
                            <td><img style="max-width: 60px;max-height: 80px;" src="/images/${product.images[0]}" alt="product image"></td>
                            <td>${product.name}</td>
                            <td>Rs. ${product.sp}</td>
                            <td>${product.stock}</td>`
    if(product.delete){
        data+=`<td><span id="${product._id}"  class="badge rounded-pill alert-danger">Deleted</span></td>
                <td>
                    <a  id="btn${product._id}" href="product-unblock/${product._id}" class="btn btn-md rounded font-sm">Activate</a>
                </td>`
    }
    else{
        data+=`<td><span id="${product._id}" class="badge rounded-pill alert-success">Active</span></td>
                <td>
                    <a  id="btn${product._id}" href="product-block/${product._id}" class="btn btn-md rounded font-sm">Delete</a>
                </td>`
    }
    data+=`</tr>`
    return data
                                
}

function orderPagination(page,pages){
    let data=`<li class="page-item"><a class="page-link"  onclick="filter(1)"><i class="material-icons md-chevron_left"></i></a></li>`
    for(i=1;i<=pages;i++){
        if(i==page){
            data+=`<li class="page-item active"><a class="page-link" onclick="filter(${i})">${i}</a></li>`
        }
        else{
            data+= `<li class="page-item"><a class="page-link"  onclick="filter(${i})">${i}</a></li>`
        }
    }
    data+=`<li class="page-item"><a class="page-link"  onclick="filter(${pages})"><i class="material-icons md-chevron_right"></i></a></li>`
            // <li class="page-item"><a class="page-link"  onchange="filter()">03</a></li>
            // <li class="page-item"><a class="page-link dot"  onchange="filter()">...</a></li>
            // <li class="page-item"><a class="page-link"  onchange="filter()">16</a></li>
            // <li class="page-item"><a class="page-link"  onchange="filter()"><i class="material-icons md-chevron_right"></i></a></li>`
    return data
}

function updateProductTiles(products,count,page,pages) {
    const productContainer = document.getElementById('tableBody');
    const paginationContainer = document.getElementById('page');

    //document.getElementById('founded').innerText=count
    // Clear previous content
    productContainer.innerHTML = '';
    // Generate and append HTML markup for each product
    products.forEach(product => {
        const productTileHTML = generateProduct(product);
        productContainer.insertAdjacentHTML('beforeend', productTileHTML);
    });
    paginationContainer.innerHTML=''
    if(pages!=0){
        paginationContainer.insertAdjacentHTML('beforeend', orderPagination(page,pages));
    }

}
