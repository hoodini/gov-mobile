// Utility to fetch ERP and CRM data
export async function fetchERP() {
  const res = await fetch('/src/data/erp.json');
  return res.json();
}

export async function fetchCRM() {
  const res = await fetch('/src/data/crm.json');
  return res.json();
}

// Returns customer object if found, else null
export async function getCustomerByName(name) {
  const crm = await fetchCRM();
  return crm.customers.find(c => c.name === name) || null;
}

// Returns true if customer is a government employee
export async function isEmployee(name) {
  const customer = await getCustomerByName(name);
  return customer ? customer.isEmployee : false;
}
