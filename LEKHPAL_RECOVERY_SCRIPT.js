// ═══════════════════════════════════════════════════════════════
//     🔄 LEKHPAL TEST SERIES RECOVERY SCRIPT
// ═══════════════════════════════════════════════════════════════
//
// INSTRUCTIONS:
// 1. Admin panel kholo: https://up-exam-mantra.web.app/admin
// 2. Browser console kholo (F12 key press karo)
// 3. Yeh pura code copy karke console me paste karo
// 4. Enter press karo
// 5. Script automatically Lekhpal test series ko activate kar degi!
//
// ═══════════════════════════════════════════════════════════════

(async function recoverLekhpalSeries() {
    console.log('🔄 Starting Lekhpal Test Series Recovery...\n');
    
    try {
        // Import Firebase functions
        const { getFirestore, collection, getDocs, doc, updateDoc } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js');
        
        // Get Firestore instance (already initialized in your app)
        const db = getFirestore();
        
        console.log('✅ Connected to Firestore');
        console.log('🔍 Searching for Lekhpal test series...\n');
        
        // Get all test series
        const testSeriesRef = collection(db, 'testSeries');
        const snapshot = await getDocs(testSeriesRef);
        
        console.log(`📊 Total test series in database: ${snapshot.size}\n`);
        
        let found = false;
        let lekhpalId = null;
        let lekhpalData = null;
        
        // Search for Lekhpal
        snapshot.forEach((docSnap) => {
            const data = docSnap.data();
            const title = data.title || '';
            
            // Check if title contains "lekhpal" (case insensitive)
            if (title.toLowerCase().includes('lekhpal')) {
                found = true;
                lekhpalId = docSnap.id;
                lekhpalData = data;
                
                console.log('🎯 FOUND! Lekhpal Test Series:');
                console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
                console.log(`📝 Title: ${data.title}`);
                console.log(`🆔 ID: ${docSnap.id}`);
                console.log(`📊 Status: ${data.status || 'unknown'}`);
                console.log(`📂 Sections: ${data.sections?.length || 0}`);
                console.log(`📚 Category: ${data.category || 'N/A'}`);
                console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
            }
        });
        
        if (!found) {
            console.error('❌ Lekhpal test series NOT FOUND in database!');
            console.log('\n💡 Possible reasons:');
            console.log('   1. Test series name spelling different hai');
            console.log('   2. Test series delete ho chuki hai');
            console.log('   3. Database me exist nahi karti');
            console.log('\n📋 All test series in database:');
            snapshot.forEach((docSnap) => {
                console.log(`   - ${docSnap.data().title}`);
            });
            return;
        }
        
        // Activate the test series
        console.log('🔄 Activating Lekhpal test series...');
        
        const seriesRef = doc(db, 'testSeries', lekhpalId);
        await updateDoc(seriesRef, {
            status: 'active',
            updatedAt: new Date().toISOString()
        });
        
        console.log('✅ SUCCESS! Lekhpal test series ACTIVATED!\n');
        console.log('🎉 Test series is now:');
        console.log('   ✅ Visible in admin panel');
        console.log('   ✅ Visible to users');
        console.log('   ✅ Available for testing');
        console.log('\n💡 Next steps:');
        console.log('   1. Refresh admin panel (F5)');
        console.log('   2. Check dashboard - Lekhpal should be visible');
        console.log('   3. Verify status shows "✅ Active"');
        console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('🎊 RECOVERY COMPLETE! 🎊');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
        
        // Show alert
        alert('✅ SUCCESS!\n\nLekhpal test series activated!\n\nRefresh the page (F5) to see changes.');
        
    } catch (error) {
        console.error('❌ ERROR:', error.message);
        console.error('Full error:', error);
        alert('❌ Error: ' + error.message + '\n\nCheck console for details.');
    }
})();
