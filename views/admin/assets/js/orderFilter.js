$(document).ready(function () {
    $('.datepicker').datepicker({
        format: 'yyyy-mm-dd',   
        autoclose: true,
        todayHighlight: true,
        endDate: new Date()
    });

    // Call updateEndDate function whenever the start date changes
    $('#startDate').change(function() {
        updateEndDate();
    });
});

function updateEndDate() {
    var startDate = new Date($('#startDate').val());
    var today = new Date();
    $('#endDate').datepicker('setStartDate', startDate);
    $('#endDate').datepicker('setEndDate', today);
}

window.addEventListener('load', function() {
    filter();
});
async function exportpdf(){
    let data={}
    data.page=page
    data.search=document.getElementById('search').value
    data.startDate=document.getElementById('startDate').value
    endDate=document.getElementById('endDate').value
    if(!endDate){
        endDate=Date.now()
    }
    endDate = new Date(endDate);

// Increment the day by one
endDate.setDate(endDate.getDate() + 1);

// Format the date back to yyyy-mm-dd
var formattedEndDate = endDate.toISOString().split('T')[0];

// Push the formatted date into data.endDate
data.endDate = formattedEndDate;

    



    data.limit=document.getElementById('limit').value

    console.log(data)
    
    const res=await fetch('/admin/generatepdf',{
        method:'POST',
        headers:{
            'Content-Type':'application/json'
        },
        body: JSON.stringify(data)
    })
    if (res.ok) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        window.open(url, '_blank'); 

        // const a = document.createElement('a');
        // a.href = url;
        // a.download = 'Sale Report.pdf';
        // document.body.appendChild(a);
        // a.click();
        // window.URL.revokeObjectURL(url);
        // a.remove();

        

    } else {
        console.error('Failed to generate PDF');
    }
}
async function exportcsv(){
    let data={}
    data.page=page
    data.search=document.getElementById('search').value
    data.startDate=document.getElementById('startDate').value
    endDate=document.getElementById('endDate').value
    if(!endDate){
        endDate=Date.now()
    }
    endDate = new Date(endDate);

    // Increment the day by one
    endDate.setDate(endDate.getDate() + 1);

    // Format the date back to yyyy-mm-dd
    var formattedEndDate = endDate.toISOString().split('T')[0];

    // Push the formatted date into data.endDate
    data.endDate = formattedEndDate;

    



    data.limit=document.getElementById('limit').value

    console.log(data)
    
    fetch('/admin/generatecsv')
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.blob();
    })
    .then(blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'sales-report.csv';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    })
    .catch(error => console.error('Error:', error));

}
async function filter(page){
    let data={}
    data.page=page
    data.search=document.getElementById('search').value

    data.startDate=document.getElementById('startDate').value
    endDate=document.getElementById('endDate').value
    if(!endDate){
        endDate=Date.now()
    }
    endDate = new Date(endDate);

// Increment the day by one
endDate.setDate(endDate.getDate() + 1);

// Format the date back to yyyy-mm-dd
var formattedEndDate = endDate.toISOString().split('T')[0];

// Push the formatted date into data.endDate
data.endDate = formattedEndDate;

    



    data.limit=document.getElementById('limit').value

    console.log(data)
    
    const res=await fetch('/admin/order-filter',{
        method:'POST',
        headers:{
            'Content-Type':'application/json'
        },
        body: JSON.stringify(data)
    })
    if(res.status==200){

        let {orders,count,page,pages,total,subtotal,discount} = await res.json();
        if(!page){
            page=1
        }
        updateOrderTiles(orders,count,page,pages);
        document.getElementById('count').innerText = `Total orders: ${count}`;
        document.getElementById('subtotal').innerText = `Total amount before discount: ${subtotal}`;
        document.getElementById('discount').innerText = `Total discount offered: ${discount}`;
        document.getElementById('total').innerText = `Total amount received: ${total}`;
        
    }
    else{
        throw new Error
    }



}


function generateOrder(order){
    const createdAtDate = new Date(order.createdAt);
    const day = String(createdAtDate.getDate()).padStart(2, '0');
    const month = String(createdAtDate.getMonth() + 1).padStart(2, '0'); // January is 0!
    const year = createdAtDate.getFullYear();
    const formattedDate = `${day}-${month}-${year}`;
    return `                <tr onclick="window.location.href = 'order-edit?_id=${order._id}';">
                                <td>${order.order_id}</td>
                                <td><b>${order.u_id.first_name} ${order.u_id.last_name}</b></td>
                                <td>Rs. ${order.subtotal}</td>
                                <td>Rs. ${order.coupondiscount}</td>
                                <td>Rs. ${order.total}</td>
                                <td>${order.status}<span class="badge rounded-pill alert-success"></span></td>
                                <td>${formattedDate}</td>
                                <td class="text-end">
                                    <a href="#" class="btn btn-md rounded font-sm">Detail</a>
                                    <div class="dropdown">
                                        <a href="#" data-bs-toggle="dropdown" class="btn btn-light rounded btn-sm font-sm"> <i class="material-icons md-more_horiz"></i> </a>
                                        <div class="dropdown-menu">
                                            <a class="dropdown-item" href="#">View detail</a>
                                            <a class="dropdown-item" href="#">Edit info</a>
                                            <a class="dropdown-item text-danger" href="#">Delete</a>
                                        </div>
                                    </div> <!-- dropdown //end -->
                                </td>
                            </tr>`
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

function updateOrderTiles(orders,count,page,pages) {
    const orderContainer = document.getElementById('tableBody');
    const paginationContainer = document.getElementById('page');

    //document.getElementById('founded').innerText=count
    // Clear previous content
    orderContainer.innerHTML = '';
    // Generate and append HTML markup for each product
    orders.forEach(order => {
        const orderTileHTML = generateOrder(order);
        orderContainer.insertAdjacentHTML('beforeend', orderTileHTML);
    });
    paginationContainer.innerHTML=''
    if(pages!=0){
        paginationContainer.insertAdjacentHTML('beforeend', orderPagination(page,pages));
    }

}












/*

 
        <section class="content-main">
            <div class="content-header">
                <div>
                    <h2 class="content-title card-title">Orders</h2>
                </div>
            </div>
            <div class="row">
                <div class="col-md-9">
                    <div class="card mb-4">
                        <header class="card-header">
                            <div class="row gx-3">
                                <div class="col-lg-4 col-md-6 me-auto">
                                    <input type="text" placeholder="Search..." class="form-control">
                                </div>
                                <div class="col-lg-2 col-md-3 col-6">
                                    <select onchange="filter()" class="form-select">
                                        <option>Status</option>
                                        <option>Active</option>
                                        <option>Disabled</option>
                                        <option>Show all</option>
                                    </select>
                                </div>
                                <div class="col-lg-2 col-md-3 col-6">
                                    <select onchange="filter()" class="form-select">
                                        <option>Show 20</option>
                                        <option>Show 30</option>
                                        <option>Show 40</option>
                                    </select>
                                </div>
                            </div>
                        </header> <!-- card-header end// -->
                        <div class="card-body">
                            <div class="table-responsive">
                                <table class="table table-hover">
                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>Customer name</th>
                                            <th>Subtotal</th>
                                            <th>Discount</th>
                                            <th>Total</th>
                                            <th>Status</th>
                                            <th>Date</th>
                                            <th class="text-end"> Action </th>
                                        </tr>
                                    </thead>
                                    <tbody id="tableBody">
                                        
                                    </tbody>
                                </table>
                            </div> <!-- table-responsive //end -->
                        </div> <!-- card-body end// -->
                    </div> <!-- card end// -->
                </div>
                <div class="col-md-3">
                    <div class="card mb-4">
                        <div class="card-body">
                            <h5 class="mb-3">Filter by</h5>
                            <form>
                                <div class="mb-4">
                                    <label for="order_id" class="form-label">Order ID</label>
                                    <input type="text"  onchange="filter()" placeholder="Type here" class="form-control" id="order_id">
                                </div>
                                <div class="mb-4">
                                    <label for="order_customer" class="form-label">Customer</label>
                                    <input type="text"  onchange="filter()" placeholder="Type here" class="form-control" id="order_customer">
                                </div>
                                <div class="mb-4">
                                    <label class="form-label">Order Status</label>
                                    <select onchange="filter()" class="form-select">
                                        <option>Published</option>
                                        <option>Draft</option>
                                    </select>
                                </div>
                                <div class="mb-4">
                                    <label for="order_total" class="form-label">Total</label>
                                    <input type="text" onchange="filter()" placeholder="Type here" class="form-control" id="order_total">
                                </div>
                                <div class="mb-4">
                                    <label for="order_created_date" class="form-label">Date Added</label>
                                    <input type="text" onchange="filter()" placeholder="Type here" class="form-control" id="order_created_date">
                                </div>
                                <div class="mb-4">
                                    <label for="order_modified_date" class="form-label">Date Modified</label>
                                    <input type="text" onchange="filter()" placeholder="Type here" class="form-control" id="order_modified_date">
                                </div>
                                <div class="mb-4">
                                    <label for="order_customer_1" class="form-label">Customer</label>
                                    <input type="text" onchange="filter()" placeholder="Type here" class="form-control" id="order_customer_1">
                                </div>
                            </form>
                        </div>
                    </div> <!-- card end// -->
                </div>
            </div>
            <div class="pagination-area mt-15 mb-50">
                <nav aria-label="Page navigation example">
                    <ul class="pagination justify-content-start" id="page">
                        
                    </ul>
                </nav>
            </div>
        </section> <!-- content-main end// -->


        <script src="../admin/assets/js/orderFilter.js"></script>
        
*/