const state = {
  selectedId: null,
};

const customerList = document.getElementById("customer-list");
const form = document.getElementById("customer-data-form");
const formTitle = document.getElementById("customer-form-title");
const message = document.getElementById("form-message");
const saveButton = document.getElementById("save-button");
const deleteButton = document.getElementById("delete-button");
const clearButton = document.getElementById("clear-button");

function getFormValues() {
  return {
    first_name: document.getElementById("first-name").value.trim(),
    last_name: document.getElementById("last-name").value.trim(),
    email: document.getElementById("email").value.trim(),
    phone: document.getElementById("phone").value.trim(),
    birth_date: document.getElementById("birth-date").value.trim(),
  };
}

function formatDateForInput(value) {
  if (!value) {
    return "";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toISOString().slice(0, 10);
}

function setFormValues(customer) {
  document.getElementById("first-name").value = customer.first_name || "";
  document.getElementById("last-name").value = customer.last_name || "";
  document.getElementById("email").value = customer.email || "";
  document.getElementById("phone").value = customer.phone || "";
  document.getElementById("birth-date").value = formatDateForInput(customer.birth_date);
}

function resetForm() {
  state.selectedId = null;
  form.reset();
  formTitle.textContent = "Add New Customer";
  saveButton.textContent = "Save customer";
  deleteButton.style.display = "none";
  clearSelection();
  showMessage("", "");
}

function showMessage(text, type = "info") {
  message.textContent = text;
  message.className = type ? `form-message ${type}` : "form-message";
}

function clearSelection() {
  document.querySelectorAll(".customer-card.selected").forEach(card => card.classList.remove("selected"));
}

async function loadCustomers() {
  customerList.innerHTML = "";

  try {
    const res = await fetch("/api/persons");
    if (!res.ok) {
      throw new Error("Failed to fetch customer data.");
    }

    const customers = await res.json();

    if (customers.length === 0) {
      customerList.innerHTML = "<p>No customers found.</p>";
      return;
    }

    customers.forEach(customer => {
      const card = document.createElement("button");
      card.type = "button";
      card.className = "customer-card";
      const birthDate = customer.birth_date ? formatDateForInput(customer.birth_date) : "No birth date";
      card.innerHTML = `
        <span class="customer-name">${customer.first_name} ${customer.last_name}</span>
        <span class="customer-details">${customer.email}</span>
        <span class="customer-details">${customer.phone || "No phone"}</span>
        <span class="customer-details">${birthDate}</span>
      `;
      card.addEventListener("click", () => selectCustomer(customer, card));
      customerList.appendChild(card);
    });
  } catch (error) {
    console.error(error);
    customerList.innerHTML = "<p class='error-text'>Unable to load customer records.</p>";
  }
}

function selectCustomer(customer, cardElement) {
  state.selectedId = customer.id;
  clearSelection();
  cardElement.classList.add("selected");
  setFormValues(customer);
  formTitle.textContent = "Edit Customer";
  saveButton.textContent = "Update customer";
  deleteButton.style.display = "inline-flex";
  showMessage("Customer loaded. You may update or delete this record.", "success");
}

async function createCustomer(payload) {
  const response = await fetch("/api/persons", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new Error(errorBody.error || "Failed to add customer.");
  }

  return response.json();
}

async function updateCustomer(id, payload) {
  const response = await fetch(`/api/persons/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new Error(errorBody.error || "Failed to update customer.");
  }

  return response.json();
}

async function deleteCustomer(id) {
  const response = await fetch(`/api/persons/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new Error(errorBody.error || "Failed to delete customer.");
  }

  return response.json();
}

form.addEventListener("submit", async event => {
  event.preventDefault();
  const values = getFormValues();

  if (!values.first_name || !values.last_name || !values.email) {
    showMessage("First name, last name, and email are required.", "error");
    return;
  }

  saveButton.disabled = true;
  clearButton.disabled = true;
  showMessage(state.selectedId ? "Updating customer..." : "Adding customer...", "info");

  try {
    if (state.selectedId) {
      await updateCustomer(state.selectedId, values);
      showMessage("Customer updated successfully.", "success");
    } else {
      await createCustomer(values);
      showMessage("Customer added successfully.", "success");
      form.reset();
    }

    await loadCustomers();
  } catch (error) {
    showMessage(error.message, "error");
  } finally {
    saveButton.disabled = false;
    clearButton.disabled = false;
  }
});

deleteButton.addEventListener("click", async () => {
  if (!state.selectedId) {
    return;
  }

  const confirmed = window.confirm("Delete this customer? This action cannot be undone.");
  if (!confirmed) {
    return;
  }

  deleteButton.disabled = true;
  saveButton.disabled = true;
  showMessage("Deleting customer...", "info");

  try {
    await deleteCustomer(state.selectedId);
    showMessage("Customer deleted successfully.", "success");
    resetForm();
    await loadCustomers();
  } catch (error) {
    showMessage(error.message, "error");
  } finally {
    deleteButton.disabled = false;
    saveButton.disabled = false;
  }
});

clearButton.addEventListener("click", resetForm);

window.addEventListener("load", () => {
  deleteButton.style.display = "none";
  loadCustomers();
});
