// ✅ Get order ID from URL
function getOrderId() {
  const params = new URLSearchParams(window.location.search);
  return params.get("id");
}

// ✅ Load Order Details
async function loadOrderDetails() {

  const orderId = getOrderId();
  console.log("Order ID:", orderId);

  // ❌ If no ID
  if (!orderId) {
    alert("Order ID missing in URL ❌");
    return;
  }

  const token = localStorage.getItem("token");

  // ❌ If no token
  if (!token) {
    alert("Please login again ❌");
    window.location.href = "/login.html";
    return;
  }

  try {
    const res = await fetch(`/customer/orders/${orderId}`, {
      headers: {
        "Authorization": "Bearer " + token
      }
    });

    console.log("Status:", res.status);

    // ❌ API error
    if (!res.ok) {
      alert("API Failed ❌ Status: " + res.status);
      return;
    }

    const order = await res.json();
    console.log("DATA:", order);

    // ✅ Set Order Summary
    document.getElementById("orderId").innerText = order.id;
    document.getElementById("orderStatus").innerText = order.status;
    document.getElementById("orderTotal").innerText = "₹" + order.totalAmount;

    // ✅ Items Container
    const container = document.getElementById("itemsContainer");
    container.innerHTML = "";

    // ❌ If no items
    if (!order.items || order.items.length === 0) {
      container.innerHTML = "<p>No items found</p>";
      return;
    }

    // ✅ Loop items (CORRECT FIX)
    order.items.forEach(item => {

      const div = document.createElement("div");
      div.className = "item-card";

      div.innerHTML = `
        <img src="${item.product.imageUrl}" class="item-img"/>
        <div class="item-info">
          <h4>${item.product.name}</h4>
          <p>Qty: ${item.quantity}</p>
          <p>Price: ₹${item.priceAtPurchase}</p>
        </div>
      `;

      container.appendChild(div);
    });

  } catch (error) {
    console.error("ERROR:", error);
    alert("Something went wrong ❌");
  }
}

// ✅ Back Button
function goBack() {
  window.location.href = "/orders.html";
}

// ✅ AUTO LOAD
loadOrderDetails();