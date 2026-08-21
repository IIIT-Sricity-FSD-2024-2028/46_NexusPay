// ===================== DATA (API-backed) =====================
let TXN_DATA = [
    {id:'TXN001',customer:'Rahul Sharma',nid:'rahul.k@nexuspay',amount:500,category:'Food',date:'Mar 9, 2026',time:'2:30 PM',status:'Success'},
    {id:'TXN002',customer:'Priya Singh',nid:'priya.s@nexuspay',amount:1200,category:'Retail',date:'Mar 9, 2026',time:'1:15 PM',status:'Success'},
    {id:'TXN003',customer:'Aman Verma',nid:'aman.v@nexuspay',amount:350,category:'Services',date:'Mar 8, 2026',time:'4:45 PM',status:'Failed'},
    {id:'TXN004',customer:'Sneha Gupta',nid:'sneha.g@nexuspay',amount:2500,category:'Food',date:'Mar 8, 2026',time:'11:30 AM',status:'Success'},
    {id:'TXN005',customer:'Karan Mehta',nid:'karan.m@nexuspay',amount:750,category:'Retail',date:'Mar 7, 2026',time:'3:20 PM',status:'Success'},
    {id:'TXN006',customer:'Anjali Rao',nid:'anjali.r@nexuspay',amount:3200,category:'Services',date:'Mar 7, 2026',time:'12:45 PM',status:'Success'},
    {id:'TXN007',customer:'Vikram Joshi',nid:'vikram.j@nexuspay',amount:890,category:'Food',date:'Mar 6, 2026',time:'5:10 PM',status:'Failed'},
    {id:'TXN008',customer:'Neha Patel',nid:'neha.p@nexuspay',amount:1500,category:'Retail',date:'Mar 6, 2026',time:'2:30 PM',status:'Success'},
    {id:'TXN009',customer:'Arjun Patel',nid:'arjun.p@nexuspay',amount:2100,category:'Services',date:'Mar 5, 2026',time:'10:15 AM',status:'Success'},
    {id:'TXN010',customer:'Shreya Kumar',nid:'shreya.k@nexuspay',amount:4200,category:'Food',date:'Mar 5, 2026',time:'9:00 AM',status:'Success'},
    {id:'TXN011',customer:'Rohit Gupta',nid:'rohit.g@nexuspay',amount:680,category:'Retail',date:'Mar 4, 2026',time:'4:50 PM',status:'Success'},
    {id:'TXN012',customer:'Divya Nair',nid:'divya.n@nexuspay',amount:950,category:'Services',date:'Mar 4, 2026',time:'2:00 PM',status:'Failed'},
    {id:'TXN013',customer:'Sanjay Iyer',nid:'sanjay.i@nexuspay',amount:1800,category:'Food',date:'Mar 3, 2026',time:'7:30 PM',status:'Success'},
    {id:'TXN014',customer:'Pooja Mishra',nid:'pooja.m@nexuspay',amount:3400,category:'Retail',date:'Mar 3, 2026',time:'11:20 AM',status:'Success'},
    {id:'TXN015',customer:'Rahul Sharma',nid:'rahul.k@nexuspay',amount:1100,category:'Services',date:'Mar 2, 2026',time:'3:45 PM',status:'Success'},
    {id:'TXN016',customer:'Anjali Rao',nid:'anjali.r@nexuspay',amount:2800,category:'Food',date:'Mar 2, 2026',time:'1:10 PM',status:'Success'},
    {id:'TXN017',customer:'Priya Singh',nid:'priya.s@nexuspay',amount:640,category:'Retail',date:'Mar 1, 2026',time:'6:20 PM',status:'Failed'},
    {id:'TXN018',customer:'Shreya Kumar',nid:'shreya.k@nexuspay',amount:5100,category:'Services',date:'Mar 1, 2026',time:'10:00 AM',status:'Success'},
    {id:'TXN019',customer:'Karan Mehta',nid:'karan.m@nexuspay',amount:920,category:'Food',date:'Feb 28, 2026',time:'4:00 PM',status:'Success'},
    {id:'TXN020',customer:'Neha Patel',nid:'neha.p@nexuspay',amount:1650,category:'Retail',date:'Feb 28, 2026',time:'2:15 PM',status:'Success'},
    {id:'TXN021',customer:'Arjun Patel',nid:'arjun.p@nexuspay',amount:3300,category:'Services',date:'Feb 27, 2026',time:'11:45 AM',status:'Success'},
    {id:'TXN022',customer:'Sanjay Iyer',nid:'sanjay.i@nexuspay',amount:780,category:'Food',date:'Feb 27, 2026',time:'9:30 AM',status:'Failed'},
    {id:'TXN023',customer:'Sneha Gupta',nid:'sneha.g@nexuspay',amount:4600,category:'Retail',date:'Feb 26, 2026',time:'5:00 PM',status:'Success'},
    {id:'TXN024',customer:'Rohit Gupta',nid:'rohit.g@nexuspay',amount:1200,category:'Services',date:'Feb 26, 2026',time:'3:30 PM',status:'Success'},
    {id:'TXN025',customer:'Pooja Mishra',nid:'pooja.m@nexuspay',amount:2200,category:'Food',date:'Feb 25, 2026',time:'12:00 PM',status:'Success'},
  ];
  
  let CUST_DATA = [
    {name:'Anjali Rao',nid:'anjali.r@nexuspay',payments:20,last:'Mar 7, 2026',spent:42000},
    {name:'Shreya Kumar',nid:'shreya.k@nexuspay',payments:14,last:'Mar 5, 2026',spent:35800},
    {name:'Sneha Gupta',nid:'sneha.g@nexuspay',payments:15,last:'Mar 8, 2026',spent:28500},
    {name:'Arjun Patel',nid:'arjun.p@nexuspay',payments:11,last:'Mar 5, 2026',spent:22400},
    {name:'Rahul Sharma',nid:'rahul.k@nexuspay',payments:12,last:'Mar 9, 2026',spent:15600},
    {name:'Neha Patel',nid:'neha.p@nexuspay',payments:9,last:'Mar 6, 2026',spent:13200},
    {name:'Priya Singh',nid:'priya.s@nexuspay',payments:8,last:'Mar 9, 2026',spent:9800},
    {name:'Karan Mehta',nid:'karan.m@nexuspay',payments:6,last:'Mar 7, 2026',spent:7800},
    {name:'Kavya Reddy',nid:'kavya.r@nexuspay',payments:6,last:'Feb 18, 2026',spent:7400},
    {name:'Pooja Mishra',nid:'pooja.m@nexuspay',payments:5,last:'Mar 3, 2026',spent:5600},
    {name:'Deepak Roy',nid:'deepak.r@nexuspay',payments:4,last:'Feb 20, 2026',spent:4100},
    {name:'Aman Verma',nid:'aman.v@nexuspay',payments:5,last:'Mar 8, 2026',spent:4200},
    {name:'Sanjay Iyer',nid:'sanjay.i@nexuspay',payments:7,last:'Mar 3, 2026',spent:3600},
    {name:'Mita Soni',nid:'mita.s@nexuspay',payments:3,last:'Feb 22, 2026',spent:3200},
    {name:'Rohit Gupta',nid:'rohit.g@nexuspay',payments:4,last:'Mar 4, 2026',spent:2760},
    {name:'Vikram Joshi',nid:'vikram.j@nexuspay',payments:3,last:'Mar 6, 2026',spent:2500},
    {name:'Divya Nair',nid:'divya.n@nexuspay',payments:2,last:'Mar 4, 2026',spent:1900},
    {name:'Manish Dubey',nid:'manish.d@nexuspay',payments:2,last:'Feb 15, 2026',spent:1800},
  ];
  
  let banks = window.__merchantBanks || [
    {name:'HDFC Bank',last4:'1234',type:'Business Current',color:'#004B87',isPrimary:true,balance:'₹1,24,500'},
    {name:'ICICI Bank',last4:'5678',type:'Business Savings',color:'#FF6600',isPrimary:false,balance:'₹68,200'},
    {name:'State Bank of India',last4:'9012',type:'Business Savings',color:'#1B4BA6',isPrimary:false,balance:'₹45,800'},
  ];
  let balVis = false;
  
  let disputes = [];
  async function loadDisputes() {
    try {
      const dsp = await api.get('/disputes');
      disputes = dsp.map(d => ({
        id: d.id, customer: d.customer, nid: d.customer.toLowerCase().replace(/\s+/g, '.') + '@nexuspay',
        amount: d.amount, txnId: d.txnId, issue: d.reason, desc: d.description || d.reason,
        date: d.date, status: d.status === 'Solved' ? 'Resolved' : d.status === 'In Review' ? 'Under Review' : d.status,
        resolution: d.resolution || '',
      }));
    } catch (e) {
      disputes = [
        {id:'D001',customer:'Arjun Patel',nid:'arjun.p@nexuspay',amount:1500,txnId:'TXN009',issue:'Settlement amount delayed',desc:'Payment delayed',date:'Feb 26, 2026',status:'Resolved',resolution:'Settled.'},
      ];
    }
  }
  function saveDisputes() { console.log('Disputes managed via API'); }
  
  let notifs = [
    {id:'n1',type:'success',icon:'💰',title:'Payment Received',sub:'₹500 from Rahul Sharma · rahul.k@nexuspay',time:'2 mins ago',txnIdx:0,read:false},
    {id:'n2',type:'success',icon:'💰',title:'Payment Received',sub:'₹1,200 from Priya Singh · priya.s@nexuspay',time:'45 mins ago',txnIdx:1,read:false},
    {id:'n3',type:'info',icon:'⚠️',title:'Payment Failed',sub:'₹350 from Aman Verma · aman.v@nexuspay',time:'1 hr ago',txnIdx:2,read:false},
  ];
  
  let selTxn=null, selIssue=null;
  let revInst=null, growInst=null, volInst=null, an1Inst=null, an3Inst=null, an4Inst=null;
  let curRevDays=7;
  
  const CD = {
    7:  {labels:['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],data:[5200,6800,4900,8200,7600,9100,5850]},
    30: {labels:['W1','W2','W3','W4'],data:[26900,32700,21500,34150]},
    90: {labels:['Jan','Feb','Mar'],data:[85000,102500,124500]},
  };
  const VD = {
    7:  {labels:['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],ok:[38,55,30,68,60,77,45],fail:[4,3,5,3,3,3,3]},
    14: {labels:['D1','D2','D3','D4','D5','D6','D7','D8','D9','D10','D11','D12','D13','D14'],ok:[38,55,30,68,60,77,45,52,37,62,68,47,41,57],fail:[4,3,5,3,3,3,3,3,3,4,4,3,3,4]},
  };
  // Monthly growth data — shared between dashboard and analytics
  const MRG = {
    '6m':{labels:['Jul','Aug','Sep','Oct','Nov','Dec'],data:[49000,61000,54000,67000,78500,85000],colors:['rgba(91,91,255,.35)','rgba(91,91,255,.45)','rgba(91,91,255,.55)','rgba(91,91,255,.7)','rgba(91,91,255,.85)','rgba(91,91,255,1)']},
    '12m':{labels:['Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec','Jan','Feb','Mar'],data:[32000,38500,45000,49000,61000,54000,67000,78500,85000,102500,124500,148000],colors:['rgba(91,91,255,.2)','rgba(91,91,255,.27)','rgba(91,91,255,.34)','rgba(91,91,255,.41)','rgba(91,91,255,.48)','rgba(91,91,255,.55)','rgba(91,91,255,.65)','rgba(91,91,255,.75)','rgba(91,91,255,.82)','rgba(91,91,255,.88)','rgba(91,91,255,.94)','rgba(91,91,255,1)']}
  };
  
  // ===================== LOGIN / LOGOUT =====================
  function doLogin() {
    const email = document.getElementById('loginEmail').value.trim();
    const pass  = document.getElementById('loginPass').value;
    const err   = document.getElementById('loginErr');
    // Accept any non-empty credentials (demo)
    if(!email || !pass) { err.classList.add('show'); return; }
    err.classList.remove('show');
    document.getElementById('loginScreen').classList.remove('show');
    document.getElementById('appContainer').style.display = 'flex';
  }
  
  function openLogoutModal() {
    closeDD();
    openModal('logoutModal');
  }

  function confirmLogout() {
    closeModal('logoutModal');
    window.location.href = '../Public_Pages/Signin.html?role=merchant';
  }
  
  // Enter key on login
  document.addEventListener('DOMContentLoaded', async ()=>{
    // Load data from API
    try {
      const txns = await api.get('/transactions');
      if (txns && txns.length) TXN_DATA = txns.map(t => ({id:t.id, customer:t.sender, nid:t.sender.toLowerCase().replace(/\s+/g,'.')+'@nexuspay', amount:t.amount, category:t.category||'General', date:t.date, time:'', status:t.status==='Completed'?'Success':t.status}));
    } catch(e) { console.warn('Using fallback txn data'); }
    await loadDisputes();
    document.getElementById('loginPass').addEventListener('keydown', e=>{ if(e.key==='Enter') doLogin(); });
    document.getElementById('loginEmail').addEventListener('keydown', e=>{ if(e.key==='Enter') doLogin(); });
  });
  
  // ===================== NAVIGATION =====================
  function go(id, btn) {
    document.querySelectorAll('.section').forEach(s=>s.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(i=>i.classList.remove('active'));
    document.getElementById(id).classList.add('active');
    if(btn) btn.classList.add('active');
    else document.querySelectorAll('.nav-item').forEach(b=>{ if(b.getAttribute('onclick')&&b.getAttribute('onclick').includes("'"+id+"'")) b.classList.add('active'); });
    closeDD();
    if(id==='dashboard'||id==='analytics') setTimeout(initCharts,50);
  }
  
  // ===================== DROPDOWNS =====================
  function toggleNotif(e) {
    e.stopPropagation();
    document.getElementById('profileDropdown').classList.remove('open');
    document.getElementById('notifDropdown').classList.toggle('open');
    renderNotifs();
  }
  function toggleProfile(e) {
    e.stopPropagation();
    document.getElementById('notifDropdown').classList.remove('open');
    document.getElementById('profileDropdown').classList.toggle('open');
  }
  function closeDD() {
    document.getElementById('notifDropdown').classList.remove('open');
    document.getElementById('profileDropdown').classList.remove('open');
  }
  document.addEventListener('click', closeDD);
  document.addEventListener('click', ()=>document.querySelectorAll('.menu-dd').forEach(m=>m.classList.remove('open')));
  
  function updateNotifDot() {
    const n = notifs.filter(x=>!x.read).length;
    document.getElementById('notifDot').style.display = n>0?'block':'none';
  }
  function renderNotifs() {
    const l = document.getElementById('notifList');
    if(!notifs.length){l.innerHTML='<div class="notif-empty">No notifications</div>';return;}
    l.innerHTML = notifs.map(n=>`
      <div class="notif-item ${n.read?'':'unread'}" onclick="clickNotif('${n.id}')">
        <div class="notif-icon ${n.type}">${n.icon}</div>
        <div class="notif-body">
          <div class="notif-title">${n.title}</div>
          <div class="notif-sub">${n.sub}</div>
          <div class="notif-time">${n.time}</div>
        </div>
      </div>`).join('');
  }
  function clickNotif(id) {
    const n = notifs.find(x=>x.id===id);
    if(!n) return;
    n.read = true;
    updateNotifDot();
    closeDD();
    if(n.txnIdx !== undefined && TXN_DATA[n.txnIdx]) openTxnModal(TXN_DATA[n.txnIdx]);
  }
  function clearNotifs() { notifs.forEach(n=>n.read=true); updateNotifDot(); renderNotifs(); }
  function addNotif(type, icon, title, sub) {
    notifs.unshift({id:'n'+Date.now(),type,icon,title,sub,time:'Just now',txnIdx:undefined,read:false});
    updateNotifDot();
  }
  
  // ===================== TRANSACTIONS =====================
  function renderTxns(list) {
    document.getElementById('txnBody').innerHTML = list.map(t=>{
      const comm = (t.amount*0.005).toFixed(2);
      const net  = (t.amount - parseFloat(comm)).toFixed(2);
      return `<tr onclick='openTxnModal(${JSON.stringify(t)})'>
        <td>${t.date}</td>
        <td><div class="cn">${t.customer}</div></td>
        <td><div class="nid">${t.nid}</div></td>
        <td class="amt">₹${t.amount.toLocaleString('en-IN')}</td>
        <td class="comm-cell">₹${comm}</td>
        <td class="amt">${t.status==='Success'?'₹'+parseFloat(net).toLocaleString('en-IN',{minimumFractionDigits:2}):'—'}</td>
        <td><span class="status-badge ${t.status==='Success'?'s-success':'s-failed'}">${t.status}</span></td>
      </tr>`;
    }).join('');
  }
  function filterTxns() {
    const q = document.getElementById('txnSearch').value.toLowerCase();
    const f = document.getElementById('txnFilter').value;
    renderTxns(TXN_DATA.filter(t=>{
      const mq = !q || t.customer.toLowerCase().includes(q)||t.nid.toLowerCase().includes(q)||t.id.toLowerCase().includes(q);
      const mf = !f || t.status===f;
      return mq&&mf;
    }));
  }
  function renderRecentTxns() {
    document.getElementById('recentTxnBody').innerHTML = TXN_DATA.slice(0,8).map(t=>{
      const comm = (t.amount*0.005).toFixed(2);
      return `<tr onclick='openTxnModal(${JSON.stringify(t)})'>
        <td><div class="cn">${t.customer}</div></td>
        <td><div class="nid">${t.nid}</div></td>
        <td class="amt">₹${t.amount.toLocaleString('en-IN')}</td>
        <td class="comm-cell">₹${comm}</td>
        <td><span class="status-badge ${t.status==='Success'?'s-success':'s-failed'}">${t.status}</span></td>
      </tr>`;
    }).join('');
  }
  function openTxnModal(t) {
    if(typeof t==='string') t=JSON.parse(t);
    const comm = (t.amount*0.005).toFixed(2);
    const net  = (t.amount-parseFloat(comm)).toFixed(2);
    document.getElementById('tmName').textContent = t.customer;
    document.getElementById('tmNid').textContent  = t.nid;
    const box = document.getElementById('tmBox');
    box.className = 'amt-box '+(t.status==='Success'?'success':'failed');
    document.getElementById('tmAmt').textContent  = '₹'+t.amount.toLocaleString('en-IN');
    document.getElementById('tmStat').textContent = t.status;
    document.getElementById('tmComm').textContent = '₹'+comm;
    document.getElementById('tmCommRow').style.display = t.status==='Success'?'flex':'none';
    document.getElementById('tmFrom').textContent   = t.customer;
    document.getElementById('tmCat').textContent    = t.category;
    document.getElementById('tmDate').textContent   = t.date+' · '+t.time;
    document.getElementById('tmTxnId').textContent  = t.id;
    document.getElementById('tmNet').textContent    = t.status==='Success'?'₹'+parseFloat(net).toLocaleString('en-IN',{minimumFractionDigits:2}):'Payment Failed';
    openModal('txnModal');
  }
  
  // ===================== CUSTOMERS =====================
  function renderCusts(list) {
    document.getElementById('custBody').innerHTML = list.map(c=>`
      <tr>
        <td><div class="cn">${c.name}</div></td>
        <td><div class="nid">${c.nid}</div></td>
        <td>${c.payments}</td>
        <td>${c.last}</td>
        <td class="amt">₹${c.spent.toLocaleString('en-IN')}</td>
      </tr>`).join('');
  }
  function filterCusts() {
    const q = document.getElementById('custSearch').value.toLowerCase();
    renderCusts(q?CUST_DATA.filter(c=>c.name.toLowerCase().includes(q)||c.nid.toLowerCase().includes(q)):CUST_DATA);
  }
  
  // ===================== BANK ACCOUNTS =====================
  function renderBanks() {
    document.getElementById('bankList').innerHTML = banks.map((b,i)=>`
      <div class="bank-item">
        <div class="bank-left">
          <div class="bank-icon" style="background:${b.color}">${b.name.split(' ').map(w=>w[0]).slice(0,4).join('')}</div>
          <div class="bank-info">
            <h3>${b.name}${b.isPrimary?'<span class="bank-badge">Primary</span>':''}</h3>
            <p>····${b.last4} · ${b.type}</p>
          </div>
        </div>
        <div class="bank-right">
          <div class="balance-wrap">
            <div class="balance-lbl">Available Balance</div>
            <div class="balance-val">${balVis?b.balance:'₹ ••••••'}</div>
          </div>
          ${!b.isPrimary?`<div class="menu-wrap">
            <button class="menu-trigger" onclick="toggleBkMenu(event,${i})">⋯</button>
            <div class="menu-dd" id="bkm${i}">
              <button class="menu-dd-item" onclick="setPrimary(${i})">⭐ Set as Primary</button>
              <button class="menu-dd-item danger" onclick="deleteBank(${i})">🗑 Delete Account</button>
            </div>
          </div>`:''}
        </div>
      </div>`).join('');
  }
  function toggleBalances() {
    balVis = !balVis;
    document.getElementById('viewBalBtn').textContent = balVis?'🙈 Hide Balance':'👁 View Balance';
    renderBanks();
  }
  function toggleBkMenu(e,i) {
    e.stopPropagation();
    document.querySelectorAll('.menu-dd').forEach(m=>m.classList.remove('open'));
    document.getElementById('bkm'+i).classList.toggle('open');
  }
  function setPrimary(i) { banks.forEach((b,j)=>b.isPrimary=j===i); renderBanks(); showToast(banks[i].name+' set as primary','green'); }
  function deleteBank(i) { const n=banks[i].name; banks.splice(i,1); renderBanks(); showToast(n+' account removed','red'); }
  function addBank() {
    const name=document.getElementById('bkName').value.trim();
    const holder=document.getElementById('bkHolder').value.trim();
    const accno=document.getElementById('bkAccNo').value.trim();
    const ifsc=document.getElementById('bkIFSC').value.trim().toUpperCase();
    const type=document.getElementById('bkType').value;
    if(!name||!holder||!accno||!ifsc){showToast('Please fill all required fields','red');return;}
    if(holder.replace(/[^A-Za-z]/g,'').length < 5){showToast('Account holder name must contain at least 5 letters','red');return;}
    if(!/^\d{12}$/.test(accno)){showToast('Account number must be exactly 12 digits','red');return;}
    if(ifsc.length !== 11 || !/^[A-Z]{4}\d{7}$/.test(ifsc)){showToast('IFSC must be 11 characters: first 4 letters and next 7 numbers','red');return;}
    document.getElementById('bkIFSC').value = ifsc;
    const cols=['#0d9488','#7c3aed','#b45309','#1d4ed8','#be185d'];
    banks.push({name,last4:accno.slice(-4),type,color:cols[banks.length%cols.length],isPrimary:false,balance:'₹0'});
    closeModal('addBankModal');
    renderBanks();
    ['bkName','bkHolder','bkAccNo','bkIFSC'].forEach(id=>document.getElementById(id).value='');
    addNotif('bank','🏦','Bank Account Added',name+' (····'+accno.slice(-4)+') linked successfully');
    showToast(name+' account added!','green');
  }
  
  // ===================== DISPUTE =====================
  function renderDTxns(list) {
    document.getElementById('dTxnList').innerHTML = list.map(t=>`
      <div class="txn-pick-item" onclick="pickTxn(this,'${t.id}','${t.customer}','${t.nid}',${t.amount})">
        <div class="txn-pick-name">${t.customer}</div>
        <div class="txn-pick-id">${t.nid}</div>
        <div class="txn-pick-meta">${t.date} · ${t.time} · ${t.id}</div>
        <div class="txn-pick-amt">₹${t.amount.toLocaleString('en-IN')} <span class="status-badge ${t.status==='Success'?'s-success':'s-failed'}" style="margin-left:6px">${t.status}</span></div>
      </div>`).join('');
  }
  function filterDTxns(q) {
    q=q.toLowerCase();
    renderDTxns(q?TXN_DATA.filter(t=>t.customer.toLowerCase().includes(q)||t.nid.toLowerCase().includes(q)||t.id.toLowerCase().includes(q)):TXN_DATA);
  }
  function pickTxn(el,id,customer,nid,amount) {
    document.querySelectorAll('.txn-pick-item').forEach(i=>i.classList.remove('selected'));
    el.classList.add('selected');
    selTxn={id,customer,nid,amount};
    document.getElementById('selTxnVal').innerHTML=`${customer} · ₹${amount.toLocaleString('en-IN')}<br><small style="color:#9ca3af;font-size:11px;">${id}</small>`;
  }
  function pickIssue(el,issue) {
    document.querySelectorAll('.form-option').forEach(o=>o.classList.remove('selected'));
    el.classList.add('selected');
    selIssue=issue;
  }
  function submitDispute() {
    if(!selTxn){showToast('Please select a transaction','red');return;}
    if(!selIssue){showToast('Please select an issue type','red');return;}
    const desc=document.getElementById('disputeDesc').value;
    if(desc.length<20){showToast('Description must be at least 20 characters','red');return;}
    const d={
      id:'D'+String(disputes.length+1).padStart(3,'0'),
      customer:selTxn.customer,nid:selTxn.nid,amount:selTxn.amount,
      txnId:selTxn.id,issue:selIssue,desc,status:'Under Review',
      date:new Date().toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'}),resolution:''
    };
    disputes.unshift(d);
    saveDisputes();
    renderDHist();
    document.querySelectorAll('.txn-pick-item').forEach(i=>i.classList.remove('selected'));
    document.querySelectorAll('.form-option').forEach(o=>o.classList.remove('selected'));
    document.getElementById('selTxnVal').textContent='No transaction selected';
    document.getElementById('disputeDesc').value='';
    selTxn=null; selIssue=null;
    showToast('Dispute submitted!','green');
    document.querySelectorAll('.dispute-tab').forEach(t=>t.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(b=>b.classList.remove('active'));
    document.getElementById('disputeHistory').classList.add('active');
    document.querySelectorAll('.tab-btn')[1].classList.add('active');
  }
  function renderDHist() {
    const l=document.getElementById('dHistList');
    if(!disputes.length){l.innerHTML='<p style="color:#9ca3af;font-size:13px;">No disputes raised yet.</p>';return;}
    l.innerHTML=disputes.map(d=>`
      <div class="dhi">
        <div class="dhi-header">
          <div><div class="dhi-name">${d.customer} <span class="status-badge ${d.status==='Resolved'?'s-resolved':'s-review'}">${d.status}</span></div><div class="dhi-nid">${d.nid}</div></div>
          <div style="text-align:right"><div class="dhi-amt">₹${d.amount.toLocaleString('en-IN')}</div><div class="dhi-did">Dispute ID: ${d.id}</div></div>
        </div>
        <div class="dhi-meta">
          <div><div class="dhi-ml">Transaction ID</div><div class="dhi-mv">${d.txnId}</div></div>
          <div><div class="dhi-ml">Issue Type</div><div class="dhi-mv">${d.issue}</div></div>
          <div><div class="dhi-ml">Submitted</div><div class="dhi-mv">${d.date}</div></div>
        </div>
        <div class="dhi-desc">${d.desc}</div>
        ${d.resolution?`<div class="resolution-box"><div class="resolution-title">Resolution</div><div class="resolution-text">${d.resolution}</div></div>`:''}
      </div>`).join('');
  }
  function switchTab(e,tabId) {
    e.preventDefault();
    document.querySelectorAll('.dispute-tab').forEach(t=>t.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(b=>b.classList.remove('active'));
    document.getElementById(tabId).classList.add('active');
    e.target.classList.add('active');
    if(tabId==='disputeHistory') renderDHist();
  }
  
  // ===================== CHARTS =====================
  function mkGrad(ctx, h) {
    const g=ctx.createLinearGradient(0,0,0,h||200);
    g.addColorStop(0,'rgba(91,91,255,0.18)'); g.addColorStop(1,'rgba(91,91,255,0)');
    return g;
  }
  const TIP = {
    backgroundColor:'#111827',titleColor:'#fff',bodyColor:'#d1d5db',
    padding:12,cornerRadius:8,displayColors:false,
    callbacks:{label:ctx=>'₹'+ctx.parsed.y.toLocaleString('en-IN')}
  };
  
  function initCharts() {
    // Revenue Trend
    const rc=document.getElementById('revChart');
    if(rc&&!revInst) {
      revInst=new Chart(rc,{
        type:'line',
        data:{labels:CD[7].labels,datasets:[{label:'Revenue',data:CD[7].data,borderColor:'#5B5BFF',backgroundColor:ctx=>mkGrad(ctx.chart.ctx,200),borderWidth:2.5,fill:true,tension:.4,pointRadius:5,pointBackgroundColor:'#5B5BFF',pointBorderColor:'#fff',pointBorderWidth:2,pointHoverRadius:7}]},
        options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false},tooltip:TIP},interaction:{mode:'index',intersect:false},
          scales:{y:{beginAtZero:true,grid:{color:'#f3f4f9'},ticks:{callback:v=>'₹'+v.toLocaleString('en-IN'),font:{size:10}}},x:{grid:{display:false},ticks:{font:{size:10}}}},
          onHover:(e,els)=>{const el=document.getElementById('revHover');el.textContent=els.length?CD[curRevDays].labels[els[0].index]+': ₹'+CD[curRevDays].data[els[0].index].toLocaleString('en-IN'):'Hover for details';}
        }
      });
    }
    // Dashboard Monthly Growth — identical to Analytics (MRG data, 6M/12M)
    const gc=document.getElementById('growthChart');
    if(gc&&!growInst) {
      growInst=new Chart(gc,{
        type:'bar',
        data:{labels:MRG['6m'].labels,datasets:[{label:'Revenue',data:MRG['6m'].data,backgroundColor:MRG['6m'].colors,borderRadius:6,borderSkipped:false}]},
        options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false},tooltip:{backgroundColor:'#111827',titleColor:'#fff',bodyColor:'#d1d5db',padding:10,cornerRadius:8,displayColors:false,callbacks:{label:ctx=>'₹'+ctx.parsed.y.toLocaleString('en-IN')}}},interaction:{mode:'index',intersect:false},
          scales:{y:{beginAtZero:true,grid:{color:'#f3f4f9'},ticks:{callback:v=>'₹'+v.toLocaleString('en-IN'),font:{size:10}}},x:{grid:{display:false},ticks:{font:{size:10}}}}
        }
      });
    }
    // Success vs Failed
    const vc=document.getElementById('volChart');
    if(vc&&!volInst) {
      volInst=new Chart(vc,{
        type:'bar',
        data:{labels:VD[7].labels,datasets:[
          {label:'Success',data:VD[7].ok,backgroundColor:'rgba(16,185,129,.75)',borderRadius:5,stack:'s'},
          {label:'Failed',data:VD[7].fail,backgroundColor:'rgba(239,68,68,.75)',borderRadius:5,stack:'s'},
        ]},
        options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{labels:{font:{size:11},boxWidth:12}},tooltip:{backgroundColor:'#111827',titleColor:'#fff',bodyColor:'#d1d5db',padding:10,cornerRadius:8}},interaction:{mode:'index',intersect:false},
          scales:{y:{beginAtZero:true,grid:{color:'#f3f4f9'},ticks:{font:{size:10}}},x:{grid:{display:false},ticks:{font:{size:10}}}}
        }
      });
    }
    // Analytics 1: Revenue Over Time
    const a1=document.getElementById('an1Chart');
    if(a1&&!an1Inst) {
      an1Inst=new Chart(a1,{
        type:'line',
        data:{labels:CD[7].labels,datasets:[{label:'Gross Revenue',data:CD[7].data,borderColor:'#5B5BFF',backgroundColor:ctx=>mkGrad(ctx.chart.ctx,260),borderWidth:2.5,fill:true,tension:.4,pointRadius:5,pointBackgroundColor:'#5B5BFF',pointBorderColor:'#fff',pointBorderWidth:2,pointHoverRadius:7}]},
        options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false},tooltip:TIP},interaction:{mode:'index',intersect:false},
          scales:{y:{beginAtZero:true,grid:{color:'#f3f4f9'},ticks:{callback:v=>'₹'+v.toLocaleString('en-IN'),font:{size:10}}},x:{grid:{display:false},ticks:{font:{size:10}}}}
        }
      });
    }
    // Analytics 3: Success vs Failed
    const a3=document.getElementById('an3Chart');
    if(a3&&!an3Inst) {
      an3Inst=new Chart(a3,{
        type:'bar',
        data:{labels:VD[7].labels,datasets:[
          {label:'Success',data:VD[7].ok,backgroundColor:'rgba(16,185,129,.7)',borderRadius:4,stack:'s'},
          {label:'Failed',data:VD[7].fail,backgroundColor:'rgba(239,68,68,.7)',borderRadius:4,stack:'s'},
        ]},
        options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{labels:{font:{size:11},boxWidth:12}},tooltip:{backgroundColor:'#111827',titleColor:'#fff',bodyColor:'#d1d5db',padding:10,cornerRadius:8}},interaction:{mode:'index',intersect:false},
          scales:{y:{beginAtZero:true,grid:{color:'#f3f4f9'},ticks:{font:{size:10}}},x:{grid:{display:false},ticks:{font:{size:10}}}}
        }
      });
    }
    // Analytics 4: Monthly Revenue Growth (same MRG data)
    const a4=document.getElementById('an4Chart');
    if(a4&&!an4Inst) {
      an4Inst=new Chart(a4,{
        type:'bar',
        data:{labels:MRG['6m'].labels,datasets:[{label:'Revenue',data:MRG['6m'].data,backgroundColor:MRG['6m'].colors,borderRadius:6,borderSkipped:false}]},
        options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false},tooltip:{backgroundColor:'#111827',titleColor:'#fff',bodyColor:'#d1d5db',padding:10,cornerRadius:8,displayColors:false,callbacks:{label:ctx=>'₹'+ctx.parsed.y.toLocaleString('en-IN')}}},interaction:{mode:'index',intersect:false},
          scales:{y:{beginAtZero:true,grid:{color:'#f3f4f9'},ticks:{callback:v=>'₹'+v.toLocaleString('en-IN'),font:{size:10}}},x:{grid:{display:false},ticks:{font:{size:10}}}}
        }
      });
    }
  }
  
  function updCtrl(btn) { btn.closest('.chart-controls').querySelectorAll('.chart-btn').forEach(b=>b.classList.remove('active')); btn.classList.add('active'); }
  function updateRev(days,btn){ curRevDays=days; updCtrl(btn); if(revInst){revInst.data.labels=CD[days].labels;revInst.data.datasets[0].data=CD[days].data;revInst.update();} }
  function updateDashVol(days,btn){ updCtrl(btn); if(volInst){volInst.data.labels=VD[days].labels;volInst.data.datasets[0].data=VD[days].ok;volInst.data.datasets[1].data=VD[days].fail;volInst.update();} }
  function updateAn1(days,btn){ updCtrl(btn); if(an1Inst){an1Inst.data.labels=CD[days].labels;an1Inst.data.datasets[0].data=CD[days].data;an1Inst.update();} }
  function updateAn3(days,btn){ updCtrl(btn); if(an3Inst){an3Inst.data.labels=VD[days].labels;an3Inst.data.datasets[0].data=VD[days].ok;an3Inst.data.datasets[1].data=VD[days].fail;an3Inst.update();} }
  // updateGrowth handles BOTH dashboard growth chart AND analytics growth chart (same MRG data, same function)
  function updateGrowth(period,btn){ updCtrl(btn); if(growInst){growInst.data.labels=MRG[period].labels;growInst.data.datasets[0].data=MRG[period].data;growInst.data.datasets[0].backgroundColor=MRG[period].colors;growInst.update();} }
  function updateAn4(period,btn){ updCtrl(btn); if(an4Inst){an4Inst.data.labels=MRG[period].labels;an4Inst.data.datasets[0].data=MRG[period].data;an4Inst.data.datasets[0].backgroundColor=MRG[period].colors;an4Inst.update();} }
  
  // ===================== SETTINGS TABS =====================
  function switchSettingsTab(name, btn) {
    document.querySelectorAll('.stab').forEach(t=>t.classList.remove('active'));
    document.querySelectorAll('.snav-item').forEach(b=>b.classList.remove('active'));
    const tab = document.getElementById('stab-'+name);
    if(tab) tab.classList.add('active');
    btn.classList.add('active');
  }
  
  // ===================== MODALS =====================
  function openModal(id){ document.getElementById(id).classList.add('open'); }
  function closeModal(id){ document.getElementById(id).classList.remove('open'); }
  
  // ===================== UTILS =====================
  function copyLink() { navigator.clipboard.writeText('https://pay.nexuspay.in/merchant@techcorp').catch(()=>{}); showToast('Payment link copied!','green'); closeModal('shareLinkModal'); }
  function shareVia(p) {
    const url='https://pay.nexuspay.in/merchant@techcorp';
    const msg='Pay TechCorp Solutions via NexusPay Merchant ID: '+url;
    if(p==='WhatsApp') window.open('https://wa.me/?text='+encodeURIComponent(msg),'_blank');
    else if(p==='Email') window.open('mailto:?subject=Payment Link&body='+encodeURIComponent(msg),'_blank');
    else if(p==='SMS') window.open('sms:?body='+encodeURIComponent(msg),'_blank');
    showToast('Sharing via '+p+'...','blue');
  }
  function showToast(msg, type='') {
    const c=document.getElementById('toastContainer');
    const t=document.createElement('div');
    t.className='toast '+(type||''); t.textContent=msg;
    c.appendChild(t);
    setTimeout(()=>t.classList.add('show'),10);
    setTimeout(()=>{t.classList.remove('show');setTimeout(()=>t.remove(),300);},3500);
  }
  
  // ===================== INIT =====================
  document.addEventListener('DOMContentLoaded',()=>{
    const bkAccNo = document.getElementById('bkAccNo');
    const bkIFSC = document.getElementById('bkIFSC');
    if (bkAccNo) {
      bkAccNo.addEventListener('input', () => {
        bkAccNo.value = bkAccNo.value.replace(/\D/g,'').slice(0,12);
      });
    }
    if (bkIFSC) {
      bkIFSC.addEventListener('input', () => {
        const cleaned = bkIFSC.value.replace(/[^a-zA-Z0-9]/g,'').toUpperCase().slice(0,11);
        bkIFSC.value = cleaned.slice(0,4).replace(/[^A-Z]/g,'') + cleaned.slice(4).replace(/\D/g,'');
      });
    }
    loadDisputes();
    renderRecentTxns();
    renderTxns(TXN_DATA);
    renderCusts(CUST_DATA);
    renderBanks();
    renderDTxns(TXN_DATA);
    renderDHist();
    updateNotifDot();
    setTimeout(initCharts,100);
  });
