// ========================================
// NSTAR DASHBOARD
// ========================================

const API_URL = "http://127.0.0.1:8000";


// ========================================
// INVENTORY DISPLAY
// ========================================

const inventoryTable =
    document.getElementById("inventory-table");


function displayInventory(items) {

    // Clear the existing table
    inventoryTable.innerHTML = "";

    items.forEach(item => {

        const isLowStock =
            item.quantity <= item.minimum_stock;


        const status = isLowStock
            ? '<span class="status-badge low-stock">LOW STOCK</span>'
            : '<span class="status-badge in-stock">IN STOCK</span>';


        const row = document.createElement("tr");


        row.innerHTML = `
            <td>${item.sku}</td>
            <td>${item.product_name}</td>
            <td>${item.category}</td>
            <td>${item.quantity}</td>
            <td>${item.minimum_stock}</td>
            <td>${status}</td>
        `;


        inventoryTable.appendChild(row);
    });
}


// ========================================
// SUMMARY
// ========================================

function updateSummary(items) {

    // Total number of different products
    const totalProducts = items.length;


    // Total number of physical units
    const totalUnits = items.reduce(
        (total, item) => total + item.quantity,
        0
    );


    // Number of products at or below minimum stock
    const lowStockItems = items.filter(
        item => item.quantity <= item.minimum_stock
    ).length;


    document.getElementById("total-products").textContent =
        totalProducts;


    document.getElementById("total-units").textContent =
        totalUnits;


    document.getElementById("low-stock").textContent =
        lowStockItems;
}


// ========================================
// SEARCH & FILTER
// ========================================

let inventory = [];


const searchInput =
    document.getElementById("inventory-search");


const stockFilter =
    document.getElementById("stock-filter");


function filterInventory() {

    const searchText =
        searchInput.value.toLowerCase();


    const selectedFilter =
        stockFilter.value;


    const filteredInventory =
        inventory.filter(item => {

            const matchesSearch =
                item.sku.toLowerCase().includes(searchText) ||
                item.product_name.toLowerCase().includes(searchText);


            const isLowStock =
                item.quantity <= item.minimum_stock;


            let matchesFilter = true;


            if (selectedFilter === "low-stock") {
                matchesFilter = isLowStock;
            }


            if (selectedFilter === "in-stock") {
                matchesFilter = !isLowStock;
            }


            return matchesSearch && matchesFilter;
        });


    displayInventory(filteredInventory);
}


searchInput.addEventListener(
    "input",
    filterInventory
);


stockFilter.addEventListener(
    "change",
    filterInventory
);


// ========================================
// LOAD INVENTORY FROM BACKEND
// ========================================

async function loadInventory() {

    try {

        const response =
            await fetch(`${API_URL}/api/inventory`);


        if (!response.ok) {

            throw new Error(
                `Server returned ${response.status}`
            );
        }


        inventory =
            await response.json();


        updateSummary(inventory);


        displayInventory(inventory);


        console.log(
            "Inventory loaded from backend."
        );

    } catch (error) {

        console.error(
            "Failed to load inventory:",
            error
        );


        inventoryTable.innerHTML = `
            <tr>
                <td colspan="6">
                    Unable to load inventory.
                </td>
            </tr>
        `;
    }
}


// ========================================
// START DASHBOARD
// ========================================

loadInventory();