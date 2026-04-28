# 🔄 Lekhpal Test Series Recovery - Step by Step Guide

## ✅ Simple 5-Minute Solution

---

## 📋 Method 1: Browser Console (Recommended - Fastest)

### Step 1: Admin Panel Kholo
```
1. Browser me jao
2. URL type karo: https://up-exam-mantra.web.app/admin
3. Admin login karo
   Username: yogendra
   Password: yug@123
```

### Step 2: Browser Console Kholo
```
Option A: F12 key press karo
Option B: Right click → Inspect → Console tab
Option C: Ctrl + Shift + J (Windows) / Cmd + Option + J (Mac)
```

### Step 3: Script Copy Karo
```
1. File kholo: LEKHPAL_RECOVERY_SCRIPT.js
2. Pura code select karo (Ctrl+A)
3. Copy karo (Ctrl+C)
```

### Step 4: Console Me Paste Karo
```
1. Console me click karo
2. Paste karo (Ctrl+V)
3. Enter press karo
```

### Step 5: Wait Karo
```
Script automatically:
✅ Firestore se connect karega
✅ Lekhpal test series search karega
✅ Status ko "active" kar dega
✅ Success message dikhayega
```

### Step 6: Refresh Karo
```
1. F5 press karo (page refresh)
2. Dashboard me Lekhpal test series visible hogi
3. Status "✅ Active" dikhega
```

---

## 📋 Method 2: HTML Recovery Tool

### Step 1: Recovery Tool Kholo
```
1. File kholo: FIRESTORE_RECOVERY_SCRIPT.html
2. Browser me open karo (double click)
```

### Step 2: Connect to Firebase
```
1. "🔗 Connect to Firebase" button par click karo
2. Wait karo connection ke liye
3. Success message dikhai dega
```

### Step 3: Search Lekhpal
```
1. "🔍 Search Lekhpal" button par click karo
2. Tool automatically search karega
3. Lekhpal test series details dikhegi
```

### Step 4: Activate
```
1. "✅ Activate Lekhpal" button par click karo
2. Wait karo activation ke liye
3. Success message dikhai dega
```

### Step 5: Verify
```
1. "🔎 Verify Status" button par click karo
2. Status "active" confirm hoga
3. Admin panel refresh karo
```

---

## 📋 Method 3: Manual (Admin Panel Se)

### Agar Lekhpal Test Series Admin Panel Me Dikhai De Rahi Hai:

#### Step 1: Check Status
```
1. Admin panel → Dashboard
2. Lekhpal test series dhundo
3. Badge dekho:
   - "📝 Draft" = Hidden
   - "✅ Active" = Visible
```

#### Step 2: Unhide Karo
```
Option A: Individual
1. Lekhpal test series ke saath "🚫" button hoga
2. Us button par click karo
3. Status "✅ Active" ho jayega

Option B: Unhide All
1. Top right me "👁️ Unhide All" button
2. Click karo
3. Sabhi test series visible ho jayengi
```

---

## 🔍 Troubleshooting

### Problem 1: Script Error Dikhai De Raha Hai
**Solution:**
```
1. Console clear karo (Ctrl+L)
2. Page refresh karo (F5)
3. Script phir se paste karo
4. Enter press karo
```

### Problem 2: "Lekhpal Not Found" Message
**Solution:**
```
1. Check spelling - "Lekhpal" ya "lekhpal" ya "LEKHPAL"
2. Firestore console me manually check karo:
   https://console.firebase.google.com/project/up-exam-mantra/firestore
3. testSeries collection me dekho
4. Agar nahi mili to manually create karo
```

### Problem 3: Script Run Nahi Ho Rahi
**Solution:**
```
1. Browser update karo (latest version)
2. Incognito/Private mode try karo
3. Different browser try karo (Chrome recommended)
4. Internet connection check karo
```

### Problem 4: Activated But Still Not Visible
**Solution:**
```
1. Hard refresh karo: Ctrl+Shift+R (Windows) / Cmd+Shift+R (Mac)
2. Browser cache clear karo
3. Logout karke phir login karo
4. Different browser try karo
```

---

## 📊 What the Script Does

### Step-by-Step Process:
```
1. 🔗 Firestore se connect karta hai
2. 🔍 testSeries collection me search karta hai
3. 📝 "lekhpal" word search karta hai (case insensitive)
4. 🎯 Match hone par ID save karta hai
5. 🔄 Status field ko "active" update karta hai
6. ✅ Success message dikhata hai
7. 🎉 Admin panel me visible ho jata hai
```

### Technical Details:
```javascript
// Firestore query
const testSeriesRef = collection(db, 'testSeries');
const snapshot = await getDocs(testSeriesRef);

// Search for Lekhpal
snapshot.forEach((doc) => {
    if (doc.data().title.toLowerCase().includes('lekhpal')) {
        // Found!
        lekhpalId = doc.id;
    }
});

// Activate
await updateDoc(doc(db, 'testSeries', lekhpalId), {
    status: 'active'
});
```

---

## ✅ Verification Checklist

After recovery, verify these:

- [ ] Admin panel me Lekhpal test series visible hai
- [ ] Status badge "✅ Active" dikhai de raha hai
- [ ] "Manage →" button kaam kar raha hai
- [ ] Sections visible hain
- [ ] Tests visible hain
- [ ] Questions visible hain
- [ ] User account se test series dikhai de rahi hai
- [ ] Test start ho raha hai

---

## 🎯 Quick Commands

### Console Commands for Quick Actions:

#### Check All Test Series:
```javascript
const { getFirestore, collection, getDocs } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js');
const db = getFirestore();
const snapshot = await getDocs(collection(db, 'testSeries'));
snapshot.forEach(doc => console.log(doc.data().title, '-', doc.data().status));
```

#### Activate Specific Test Series by ID:
```javascript
const { getFirestore, doc, updateDoc } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js');
const db = getFirestore();
await updateDoc(doc(db, 'testSeries', 'YOUR_TEST_SERIES_ID'), { status: 'active' });
console.log('✅ Activated!');
```

#### Activate All Test Series:
```javascript
const { getFirestore, collection, getDocs, doc, updateDoc } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js');
const db = getFirestore();
const snapshot = await getDocs(collection(db, 'testSeries'));
for (const docSnap of snapshot.docs) {
    await updateDoc(doc(db, 'testSeries', docSnap.id), { status: 'active' });
}
console.log('✅ All activated!');
```

---

## 📞 Need Help?

### If Script Doesn't Work:

1. **Check Firestore Directly:**
   ```
   https://console.firebase.google.com/project/up-exam-mantra/firestore
   ```

2. **Manual Update:**
   - Go to Firestore console
   - Open testSeries collection
   - Find Lekhpal document
   - Edit status field to "active"
   - Save

3. **Contact Support:**
   - Check browser console for errors
   - Take screenshot
   - Share error message

---

## 🎉 Success Indicators

### You'll Know It Worked When:

✅ Console shows: "🎊 RECOVERY COMPLETE! 🎊"
✅ Alert popup: "Lekhpal test series activated!"
✅ Admin panel refresh shows Lekhpal
✅ Status badge shows "✅ Active"
✅ Users can see and attempt tests

---

## 📚 Files Reference

1. **LEKHPAL_RECOVERY_SCRIPT.js** - Main recovery script
2. **FIRESTORE_RECOVERY_SCRIPT.html** - Visual recovery tool
3. **LEKHPAL_RECOVERY_GUIDE.md** - This guide

---

**🎊 Good Luck! Lekhpal test series jaldi recover ho jayegi! 🎊**
