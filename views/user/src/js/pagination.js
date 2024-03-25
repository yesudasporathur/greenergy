    let data =``
    

    data+=`<li class="page-item pagination-item">
    <a class="page-link pagination-link" onclick="submitForm(1)" tabindex="-1">
                        <svg width="8" height="14" viewBox="0 0 8 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M6.91663 1.16634L1.08329 6.99967L6.91663 12.833" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                        </svg>
                    </a>
                </li>
                `;
    for(i=1;i<=pages+4;i++){
            if(i==page){
                data+=`<li class="page-item pagination-item"><a class="page-link pagination-link active" onclick="submitForm(${i})">${i}</a></li>
                `
            }
            else{
                data+=`<li class="page-item pagination-item"><a class="page-link pagination-link " onclick="submitForm(${i})">${i}</a></li>
                `

            }
            
    };        
    
    data+=`       <li class="page-item pagination-item"> <a class="page-link pagination-link" onclick="submitForm(${pages})">
                    <svg width="8" height="14" viewBox="0 0 8 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1.08337 1.16634L6.91671 6.99967L1.08337 12.833" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                    </svg>
                </a>
            </li>`;
    return data


