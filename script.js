document.addEventListener('DOMContentLoaded', function(){
    fetchAndShow();
})

var itemList = document.getElementById('listitem');
var totalPriceElement = document.getElementById('totalPrice');
var totalPrice = 0;

async function additem() {
    const price = document.getElementById('input1').value;
    const name = document.getElementById('input2').value;
    
    if (!price || !name) {
        alert('Please enter a Name.');
        return;
    }

    const li = document.createElement('li');

    await saveToServer(price, name, li);

    document.getElementById('input1').value = '';
    document.getElementById('input2').value = '';
}

async function saveToServer(price, name, li) {
    const user = {
        price: price,
        name: name
    };

    try {
        const response = await axios.post('https://crudcrud.com/api/a2f92bc8078a4beb9a74144e0c769df1/uniquelist', user);
        const itemId = response.data._id;
        const amount = parseFloat(response.data.price);
        totalPrice += amount
        
        li.id = itemId;
        updateTotalPrice();

        li.innerHTML = `<span>${price}</span> 
        <span>${name}</span> 
        <button class='btn btn-danger btn-sm float-right delete'>Delete</button>`;

        li.querySelector('.delete').addEventListener('click', function () {
            removeItem(itemId, amount);
        });

        itemList.appendChild(li);
    } catch (error) {
        console.error('Error occurs:', error);
    }
}

async function removeItem(itemId, amount) {
    try {
        await axios.delete(`https://crudcrud.com/api/a2f92bc8078a4beb9a74144e0c769df1/uniquelist/${itemId}`);
        console.log('Item removed from the server successfully.');

        totalPrice -= amount;
        updateTotalPrice();
        
        const li = document.getElementById(itemId);
        if (li) {
            li.parentNode.removeChild(li);
        }
    } catch (error) {
        console.log('Error removing item from the server:', error);
    }
}

async function fetchAndShow() {
    try {
        const response = await axios.get("https://crudcrud.com/api/a2f92bc8078a4beb9a74144e0c769df1/uniquelist");
        itemList.innerHTML = '';

        for (let i = 0; i < response.data.length; i++) {
            var item = response.data[i];
            var li = document.createElement('li');
            
            const amount = parseFloat(item.price);
            totalPrice += amount;
            updateTotalPrice();


            li.innerHTML = `<span>${item.price}</span>
            <span>${item.name}</span>  
            <button class='btn btn-danger btn-sm float-right delete'>Delete</button>`;

            li.querySelector('.delete').addEventListener('click', function () {
                removeItem(item._id, amount);
            });

            itemList.appendChild(li);
        }
    } catch (error) {
        console.error('Error fetching and showing data:', error);
    }
}


function updateTotalPrice() {
    totalPriceElement.textContent = totalPrice.toFixed(2);
}