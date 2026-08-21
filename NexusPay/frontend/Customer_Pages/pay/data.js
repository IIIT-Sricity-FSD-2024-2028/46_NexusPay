// Predefined users (fallback defaults)
const users = [
  { name: "Anjali Mehta", id: "anjali.m@nexuspay", initials: "AM" },
  { name: "Priya Sharma", id: "priya.s@nexuspay", initials: "PS" },
  { name: "Rahul Kumar", id: "rahul.k@nexuspay", initials: "RK" },
  { name: "Sneha Patel", id: "sneha.p@nexuspay", initials: "SP" },
  { name: "Vikram Singh", id: "vikram.s@nexuspay", initials: "VS" },
  { name: "Kavita Joshi", id: "kavita.j@nexuspay", initials: "KJ" },
  { name: "Arjun Nair", id: "arjun.n@nexuspay", initials: "AN" },
  { name: "Meera Reddy", id: "meera.r@nexuspay", initials: "MR" }
];

// Load beneficiaries from backend API and merge with defaults
(async function loadBeneficiaries() {
  try {
    const apiBeneficiaries = await api.get('/beneficiaries');
    if (apiBeneficiaries && apiBeneficiaries.length > 0) {
      apiBeneficiaries.forEach(b => {
        // Only add if not already in the list
        if (!users.some(u => u.id === b.vpa)) {
          users.push({
            name: b.name,
            id: b.vpa,
            initials: b.initials || b.name.split(' ').map(n => n[0]).join('').toUpperCase(),
          });
        }
      });
    }
  } catch (e) {
    console.warn('Using fallback beneficiary data:', e.message);
  }
})();
