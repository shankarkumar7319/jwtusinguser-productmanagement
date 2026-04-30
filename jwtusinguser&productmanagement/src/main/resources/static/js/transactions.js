async function loadTransactions() {

  const token = localStorage.getItem("token");

  // ❌ No token
  if (!token) {
    alert("Please login again ❌");
    window.location.href = "/login.html";
    return;
  }

  try {
    const res = await fetch("/customer/payment/transactions", {
      headers: {
        "Authorization": "Bearer " + token
      }
    });

    console.log("Status:", res.status);

    const table = document.getElementById("txnTable");
    table.innerHTML = "";

    // ❌ If unauthorized
    if (res.status === 401 || res.status === 403) {
      table.innerHTML = `
        <tr>
          <td colspan="3" style="color:red;">
            Session expired / Unauthorized ❌
          </td>
        </tr>
      `;
      return;
    }

    const transactions = await res.json();
    console.log("DATA:", transactions);

    // ❌ No data
    if (!transactions || transactions.length === 0) {
      table.innerHTML = `
        <tr>
          <td colspan="3">No Transactions Found</td>
        </tr>
      `;
      return;
    }

    // ✅ Populate table
    transactions.forEach(txn => {

      const row = document.createElement("tr");

      const statusClass =
        txn.status === "SUCCESS" ? "success" : "failed";

      row.innerHTML = `
        <td>${txn.paymentId || "-"}</td>
        <td>${txn.orderId || txn.order?.id || "-"}</td>
        <td class="${statusClass}">${txn.status}</td>
      `;

      table.appendChild(row);
    });

  } catch (err) {
    console.error("ERROR:", err);
  }
}

// ✅ Call function
loadTransactions();