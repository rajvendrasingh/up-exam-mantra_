import { useContext, useState, useEffect } from "react";
import { TestSeriesContext } from "./TestSeriesContext";
import { 
  createTestSeries,
  updateTestSeries,
  deleteTestSeries,
  createSection,
  updateSection,
  deleteSection,
  createTest,
  updateTest,
  deleteTest,
  createQuestion,
  updateQuestion,
  deleteQuestion,
  bulkCreateQuestions,
  migrateSeriesDataSafely,
  scheduleLiveTest,
  getLiveTestSchedule,
  deleteLiveTestSchedule,
  createStudyMaterial,
  getAllStudyMaterials,
  updateStudyMaterial,
  deleteStudyMaterial,
  createStudySection,
  updateStudySection,
  deleteStudySection,
  createStudyItem,
  updateStudyItem,
  deleteStudyItem
} from "./services/firestoreService";
import RichTextEditor from "./components/RichTextEditor";
import AIPdfConverter from "./components/AIPdfConverter";
import { storage } from "./firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export default function Admin() {
  const { testSeries, addNotification, reloadTestSeries } = useContext(TestSeriesContext);
  
  // Load ALL test series (including hidden) when Admin panel opens
  useEffect(() => {
    console.log("🔄 Admin panel opened - loading all test series...");
    reloadTestSeries(true);
    // Study materials bhi load karo
    getAllStudyMaterials().then(setStudyMaterials).catch(console.error);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  // Teacher Photo Upload State
  const [teacherPhoto, setTeacherPhoto] = useState(null);
  const [teacherPhotoURL, setTeacherPhotoURL] = useState("");
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  
  // View States
  const [currentView, setCurrentView] = useState("dashboard");
  const [selectedSeriesIdx, setSelectedSeriesIdx] = useState(null);
  const [selectedSectionIdx, setSelectedSectionIdx] = useState(null);
  const [selectedTestIdx, setSelectedTestIdx] = useState(null);
  
  // Modal States
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("");
  const [editingIdx, setEditingIdx] = useState(null);
  
  // Test Series Form
  const [seriesTitle, setSeriesTitle] = useState("");
  const [seriesDescription, setSeriesDescription] = useState("");
  const [seriesCategory, setSeriesCategory] = useState("");
  const [seriesStatus, setSeriesStatus] = useState("active");
  
  // Section Form
  const [sectionTitle, setSectionTitle] = useState("");
  const [sectionDescription, setSectionDescription] = useState("");
  
  // Test Form
  const [testTitle, setTestTitle] = useState("");
  const [testDuration, setTestDuration] = useState(60);
  const [testMarksPerQuestion, setTestMarksPerQuestion] = useState(1);
  const [testNegativeMarking, setTestNegativeMarking] = useState(0.25);
  const [testInstructions, setTestInstructions] = useState("");
  const [testStatus, setTestStatus] = useState("active");
  
  // Question Form
  const [questionText, setQuestionText] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [numberOfOptions, setNumberOfOptions] = useState(4); // Admin can change this
  const [correctAnswer, setCorrectAnswer] = useState(0);
  const [explanation, setExplanation] = useState("");
  const [questionImage, setQuestionImage] = useState("");
  
  // Bulk Delete
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [bulkDeleteMode, setBulkDeleteMode] = useState(false);
  
  // Bulk Upload States
  const [showBulkUpload, setShowBulkUpload] = useState(false);
  const [bulkJsonInput, setBulkJsonInput] = useState("");
  
  // Filter States
  // eslint-disable-next-line no-unused-vars
  const [showOnlyHidden, setShowOnlyHidden] = useState(false);
  
  // AI Generator States
  const [showAiGenerator, setShowAiGenerator] = useState(false);
  const [aiTopic, setAiTopic] = useState("");
  const [aiQuestionCount, setAiQuestionCount] = useState(10);
  const [aiDifficulty, setAiDifficulty] = useState("medium");
  const [aiLanguage, setAiLanguage] = useState("english");
  const [aiQuestionType, setAiQuestionType] = useState("mixed");
  const [aiIncludeExplanation, setAiIncludeExplanation] = useState(true);
  
  // AI PDF Converter State
  const [showPdfConverter, setShowPdfConverter] = useState(false);
  
  // Text to JSON Converter State
  const [showTextConverter, setShowTextConverter] = useState(false);
  const [converterText, setConverterText] = useState("");

  // Live Test Scheduling State
  const [showLiveModal, setShowLiveModal] = useState(false);
  const [liveTestIdx, setLiveTestIdx] = useState(null); // test index in currentSection
  const [liveStartTime, setLiveStartTime] = useState("");
  const [liveEndTime, setLiveEndTime] = useState("");
  const [liveSchedule, setLiveSchedule] = useState(null); // existing schedule for selected test

  // Saving state — double submit rokne ke liye
  const [saving, setSaving] = useState(false);

  // ==================== STUDY MATERIAL STATE ====================
  const [studyMaterials, setStudyMaterials] = useState([]);
  const [studyView, setStudyView] = useState("list"); // "list" | "sections" | "items"
  const [selectedStudyMatIdx, setSelectedStudyMatIdx] = useState(null);
  const [selectedStudySectionIdx, setSelectedStudySectionIdx] = useState(null);
  const [showStudyModal, setShowStudyModal] = useState(false);
  const [studyModalType, setStudyModalType] = useState(""); // "mat" | "section" | "item"
  const [studyEditingIdx, setStudyEditingIdx] = useState(null);
  const [studySaving, setStudySaving] = useState(false);
  // Form fields
  const [studyTitle, setStudyTitle] = useState("");
  const [studyDescription, setStudyDescription] = useState("");
  const [studyItemType, setStudyItemType] = useState("video"); // "video" | "notes"
  const [studyYoutubeUrl, setStudyYoutubeUrl] = useState("");
  const [studyPdfUrl, setStudyPdfUrl] = useState("");

  // Get current items
  const currentSeries = selectedSeriesIdx !== null ? testSeries[selectedSeriesIdx] : null;
  const currentSection = currentSeries && selectedSectionIdx !== null ? currentSeries.sections?.[selectedSectionIdx] : null;
  const currentTest = currentSection && selectedTestIdx !== null ? currentSection.tests?.[selectedTestIdx] : null;

  // ==================== LIVE TEST FUNCTIONS ====================

  // Live test schedule modal kholna
  const openLiveModal = async (testIdx) => {
    const test = currentSection.tests[testIdx];
    setLiveTestIdx(testIdx);

    // Default: aaj se 1 ghante baad start, 2 ghante baad end
    const now = new Date();
    const start = new Date(now.getTime() + 60 * 60 * 1000);
    const end = new Date(now.getTime() + 3 * 60 * 60 * 1000);

    // Datetime-local format: YYYY-MM-DDTHH:MM
    const toLocal = (d) => {
      const pad = (n) => String(n).padStart(2, '0');
      return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
    };

    // Existing schedule check karo
    try {
      const existing = await getLiveTestSchedule(currentSeries.id, currentSection.id, test.id);
      if (existing) {
        setLiveSchedule(existing);
        setLiveStartTime(toLocal(new Date(existing.startTime)));
        setLiveEndTime(toLocal(new Date(existing.endTime)));
      } else {
        setLiveSchedule(null);
        setLiveStartTime(toLocal(start));
        setLiveEndTime(toLocal(end));
      }
    } catch {
      setLiveSchedule(null);
      setLiveStartTime(toLocal(start));
      setLiveEndTime(toLocal(end));
    }

    setShowLiveModal(true);
  };

  // Live test schedule save karo
  const handleSaveLiveSchedule = async () => {
    if (!liveStartTime || !liveEndTime) {
      alert("❌ Start aur End time dono bharo!");
      return;
    }

    const start = new Date(liveStartTime).getTime();
    const end = new Date(liveEndTime).getTime();

    if (end <= start) {
      alert("❌ End time, Start time se baad honi chahiye!");
      return;
    }

    const test = currentSection.tests[liveTestIdx];

    try {
      await scheduleLiveTest({
        testSeriesId: currentSeries.id,
        sectionId: currentSection.id,
        testId: test.id,
        testTitle: test.title,
        seriesTitle: currentSeries.title,
        sectionTitle: currentSection.title,
        startTime: start,
        endTime: end,
        oneAttemptPerUser: true,
        isActive: true
      });

      setShowLiveModal(false);
      alert(`✅ Live test schedule ho gaya!\n\n📝 Test: ${test.title}\n⏰ Start: ${new Date(start).toLocaleString('en-IN')}\n⏰ End: ${new Date(end).toLocaleString('en-IN')}\n\n🔒 Har user sirf ek baar de sakta hai.`);
    } catch (error) {
      alert("❌ Error: " + error.message);
    }
  };

  // Live test schedule hatao
  const handleRemoveLiveSchedule = async () => {
    if (!liveSchedule) return;
    if (!window.confirm("Kya aap yeh live schedule hatana chahte hain?")) return;

    try {
      await deleteLiveTestSchedule(liveSchedule.id);
      setShowLiveModal(false);
      alert("✅ Live schedule hata diya gaya!");
    } catch (error) {
      alert("❌ Error: " + error.message);
    }
  };

  // ==================== STUDY MATERIAL FUNCTIONS ====================

  const reloadStudyMaterials = async () => {
    const data = await getAllStudyMaterials();
    setStudyMaterials(data);
  };

  const currentStudyMat = selectedStudyMatIdx !== null ? studyMaterials[selectedStudyMatIdx] : null;
  const currentStudySection = currentStudyMat && selectedStudySectionIdx !== null ? currentStudyMat.sections?.[selectedStudySectionIdx] : null;

  const openStudyModal = (type, editIdx = null) => {
    setStudyModalType(type);
    setStudyEditingIdx(editIdx);
    setStudySaving(false);

    if (type === "mat" && editIdx !== null) {
      const m = studyMaterials[editIdx];
      setStudyTitle(m.title || ""); setStudyDescription(m.description || "");
    } else if (type === "section" && editIdx !== null) {
      const s = currentStudyMat.sections[editIdx];
      setStudyTitle(s.title || ""); setStudyDescription("");
    } else if (type === "item" && editIdx !== null) {
      const item = currentStudySection.items[editIdx];
      setStudyTitle(item.title || ""); setStudyDescription(item.description || "");
      setStudyItemType(item.type || "video");
      setStudyYoutubeUrl(item.youtubeUrl || ""); setStudyPdfUrl(item.pdfUrl || "");
    } else {
      setStudyTitle(""); setStudyDescription("");
      setStudyItemType("video"); setStudyYoutubeUrl(""); setStudyPdfUrl("");
    }
    setShowStudyModal(true);
  };

  const handleStudySave = async () => {
    if (!studyTitle.trim()) { alert("Title bharo!"); return; }
    if (studySaving) return;
    setStudySaving(true);
    try {
      if (studyModalType === "mat") {
        const data = { title: studyTitle, description: studyDescription, order: studyMaterials.length };
        if (studyEditingIdx !== null) {
          await updateStudyMaterial(studyMaterials[studyEditingIdx].id, data);
        } else {
          await createStudyMaterial(data);
        }
      } else if (studyModalType === "section") {
        const data = { title: studyTitle, order: (currentStudyMat.sections?.length || 0) };
        if (studyEditingIdx !== null) {
          await updateStudySection(currentStudyMat.id, currentStudyMat.sections[studyEditingIdx].id, data);
        } else {
          await createStudySection(currentStudyMat.id, data);
        }
      } else if (studyModalType === "item") {
        const data = {
          title: studyTitle, description: studyDescription,
          type: studyItemType,
          youtubeUrl: studyItemType === "video" ? studyYoutubeUrl : "",
          pdfUrl: studyItemType === "notes" ? studyPdfUrl : "",
          order: (currentStudySection.items?.length || 0)
        };
        if (studyEditingIdx !== null) {
          await updateStudyItem(currentStudyMat.id, currentStudySection.id, currentStudySection.items[studyEditingIdx].id, data);
        } else {
          await createStudyItem(currentStudyMat.id, currentStudySection.id, data);
        }
      }
      await reloadStudyMaterials();
      setShowStudyModal(false);
      alert("✅ Saved!");
    } catch (err) {
      alert("❌ Error: " + err.message);
    } finally {
      setStudySaving(false);
    }
  };

  const handleStudyDelete = async (type, idx) => {
    if (!window.confirm("Delete karo?")) return;
    try {
      if (type === "mat") {
        await deleteStudyMaterial(studyMaterials[idx].id);
        setStudyView("list"); setSelectedStudyMatIdx(null);
      } else if (type === "section") {
        await deleteStudySection(currentStudyMat.id, currentStudyMat.sections[idx].id);
        setStudyView("sections"); setSelectedStudySectionIdx(null);
      } else if (type === "item") {
        await deleteStudyItem(currentStudyMat.id, currentStudySection.id, currentStudySection.items[idx].id);
      }
      await reloadStudyMaterials();
      alert("✅ Deleted!");
    } catch (err) {
      alert("❌ Error: " + err.message);
    }
  };

  /**
   * Auto-migrate helper: agar series purane nested format mein hai (section/test ke paas Firestore ID nahi)
   * to pehle migrate karo, phir reload karo.
   * Returns true agar migration hua, false agar pehle se subcollections mein tha.
   */
  const ensureMigrated = async (series) => {
    // Agar section ke paas Firestore ID hai to subcollections mein hai — sab theek hai
    const firstSection = series.sections?.[0];
    if (!firstSection || firstSection.id) return false; // Already migrated ya koi section nahi

    // Purana nested format — migrate karo
    const confirmed = window.confirm(
      `⚠️ "${series.title}" ka data purane format mein hai.\n\nEdit karne se pehle isko naye format mein migrate karna hoga.\n\nMigrate karo? (Data safe rahega)`
    );
    if (!confirmed) throw new Error("Migration cancelled by user");

    await migrateSeriesDataSafely(series);
    await reloadTestSeries(true);
    alert("✅ Migration complete! Ab aap edit kar sakte hain.");
    return true;
  };

  // ==================== TEST SERIES FUNCTIONS ====================
  
  const openCreateSeriesModal = () => {
    setModalType("create-series");
    setSeriesTitle("");
    setSeriesDescription("");
    setSeriesCategory("");
    setSeriesStatus("active");
    setEditingIdx(null);
    setSaving(false);
    setShowModal(true);
  };

  const openEditSeriesModal = (idx) => {
    const series = testSeries[idx];
    setModalType("edit-series");
    setSeriesTitle(series.title);
    setSeriesDescription(series.description || "");
    setSeriesCategory(series.category || "");
    setSeriesStatus(series.status || "active");
    setEditingIdx(idx);
    setShowModal(true);
  };

  const handleCreateSeries = async () => {
    if (!seriesTitle.trim()) { alert("Please enter a title"); return; }
    if (saving) return;
    setSaving(true);
    try {
      const newSeries = {
        title: seriesTitle,
        description: seriesDescription,
        category: seriesCategory,
        status: seriesStatus,
        sections: [],
        order: testSeries.length
      };
      const createdSeries = await createTestSeries(newSeries);
      console.log("Test series created:", createdSeries.id);
      await reloadTestSeries(true);
      setShowModal(false);
      addNotification({ icon: "🎉", title: "New Test Series Created!", message: `"${seriesTitle}" has been created successfully.`, type: "success" });
      alert("✅ Test series created successfully!");
    } catch (error) {
      console.error("Error creating test series:", error);
      alert("❌ Error creating test series: " + error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateSeries = async () => {
    if (!seriesTitle.trim()) { alert("Please enter a title"); return; }
    if (saving) return;
    setSaving(true);
    try {
      const seriesToUpdate = testSeries[editingIdx];
      await updateTestSeries(seriesToUpdate.id, { title: seriesTitle, description: seriesDescription, category: seriesCategory, status: seriesStatus });
      await reloadTestSeries(true);
      setShowModal(false);
      alert("✅ Test series updated successfully!");
    } catch (error) {
      console.error("Error updating test series:", error);
      alert("❌ Error updating test series: " + error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteSeries = async (idx) => {
    if (!window.confirm("Are you sure? This will delete all sections, tests, and questions!")) {
      return;
    }

    try {
      const seriesToDelete = testSeries[idx];
      
      // BACKUP: Save to localStorage before deleting (for recovery)
      const backupKey = `deleted_series_${Date.now()}`;
      const backup = {
        data: seriesToDelete,
        deletedAt: new Date().toISOString(),
        deletedBy: "admin"
      };
      localStorage.setItem(backupKey, JSON.stringify(backup));
      console.log("✅ Backup saved:", backupKey);
      
      // Delete from Firebase
      console.log("Deleting test series from Firebase:", seriesToDelete.id);
      await deleteTestSeries(seriesToDelete.id);
      console.log("Test series deleted successfully");

      // Reload from Firebase
      await reloadTestSeries(true);
      
      alert("✅ Test series deleted successfully!\n\n💾 Backup saved for recovery.");
    } catch (error) {
      console.error("Error deleting test series:", error);
      alert("❌ Error deleting test series: " + error.message);
    }
  };

  // LEKHPAL RECOVERY: Direct Firestore recovery for Lekhpal/Constable test series
  const handleRecoverLekhpalConstable = async () => {
    try {
      console.log("🔍 Searching for Lekhpal/Constable test series in Firestore...");
      
      // Search keywords
      const keywords = ["lekhpal", "constable", "police", "लेखपाल", "कांस्टेबल"];
      
      let foundSeries = [];
      
      // Search through all test series
      for (const series of testSeries) {
        const title = (series.title || "").toLowerCase();
        const description = (series.description || "").toLowerCase();
        const category = (series.category || "").toLowerCase();
        const status = series.status || "draft";
        
        // Check if any keyword matches
        const hasKeyword = keywords.some(keyword => 
          title.includes(keyword) || 
          description.includes(keyword) || 
          category.includes(keyword)
        );
        
        if (hasKeyword) {
          foundSeries.push({
            series: series,
            currentStatus: status,
            matchedIn: []
          });
          
          // Log what matched
          keywords.forEach(keyword => {
            if (title.includes(keyword)) foundSeries[foundSeries.length - 1].matchedIn.push(`Title: "${keyword}"`);
            if (description.includes(keyword)) foundSeries[foundSeries.length - 1].matchedIn.push(`Description: "${keyword}"`);
            if (category.includes(keyword)) foundSeries[foundSeries.length - 1].matchedIn.push(`Category: "${keyword}"`);
          });
        }
      }
      
      console.log(`✅ Found ${foundSeries.length} matching test series`);
      
      if (foundSeries.length === 0) {
        alert("❌ No Lekhpal/Constable test series found in database!\n\n🔍 Searched for: Lekhpal, Constable, Police, लेखपाल, कांस्टेबल\n\n💡 Make sure the test series exists in Firestore.");
        return;
      }
      
      // Show found series
      let message = `🎯 Found ${foundSeries.length} test series:\n\n`;
      foundSeries.forEach((item, idx) => {
        message += `${idx + 1}. ${item.series.title}\n`;
        message += `   Status: ${item.currentStatus}\n`;
        message += `   Matched: ${item.matchedIn.join(", ")}\n\n`;
      });
      
      message += `\n✅ Activate all these test series?`;
      
      if (!window.confirm(message)) {
        return;
      }
      
      // Activate all found series
      let activatedCount = 0;
      for (const item of foundSeries) {
        if (item.currentStatus !== "active") {
          console.log(`🔄 Activating: ${item.series.title}`);
          await updateTestSeries(item.series.id, { status: "active" });
          activatedCount++;
        } else {
          console.log(`✓ Already active: ${item.series.title}`);
        }
      }
      
      // Reload test series
      await reloadTestSeries(true);
      
      alert(`✅ SUCCESS!\n\n${activatedCount} test series activated!\n${foundSeries.length - activatedCount} were already active.\n\n🎉 Refresh the page to see all test series!`);
      
    } catch (error) {
      console.error("❌ Error recovering Lekhpal/Constable:", error);
      alert("❌ Error: " + error.message);
    }
  };

  // TEACHER PHOTO UPLOAD: Upload teacher photo to Firebase Storage
  const handleTeacherPhotoUpload = async () => {
    if (!teacherPhoto) {
      alert("❌ Please select a photo first!");
      return;
    }

    try {
      setUploadingPhoto(true);
      console.log("📤 Uploading teacher photo...");

      // Create a reference to Firebase Storage
      const photoRef = ref(storage, 'teacher/yogendra-photo.jpg');
      
      // Upload the file
      await uploadBytes(photoRef, teacherPhoto);
      console.log("✅ Photo uploaded successfully");
      
      // Get the download URL
      const downloadURL = await getDownloadURL(photoRef);
      console.log("✅ Photo URL:", downloadURL);
      
      setTeacherPhotoURL(downloadURL);
      
      // Save URL to localStorage for quick access
      localStorage.setItem('teacherPhotoURL', downloadURL);
      
      alert(`✅ SUCCESS!\n\nTeacher photo uploaded successfully!\n\nPhoto URL: ${downloadURL}\n\n🎉 Photo will now appear on the home page!`);
      
      // Add notification
      addNotification({
        icon: "📸",
        title: "Teacher Photo Uploaded!",
        message: "Yogendra Pratap Singh's photo has been uploaded successfully.",
        type: "success"
      });
      
    } catch (error) {
      console.error("❌ Error uploading photo:", error);
      alert("❌ Error uploading photo: " + error.message);
    } finally {
      setUploadingPhoto(false);
    }
  };

  // Load teacher photo URL on mount
  useEffect(() => {
    const savedURL = localStorage.getItem('teacherPhotoURL');
    if (savedURL) {
      setTeacherPhotoURL(savedURL);
    }
  }, []);

  // RECOVERY: Recover deleted test series from backup
  const handleRecoverDeletedSeries = async () => {
    try {
      // Get all backup keys from localStorage
      const backupKeys = Object.keys(localStorage).filter(key => key.startsWith('deleted_series_'));
      
      console.log(`🔍 Found ${backupKeys.length} backups in localStorage`);
      
      if (backupKeys.length === 0) {
        alert("❌ No deleted test series found in backup!\n\nNote: Backups are only available if test series was deleted using the delete button.");
        return;
      }
      
      // Show list of deleted series
      let backupList = "📋 Deleted Test Series (Available for Recovery):\n\n";
      const backups = [];
      
      backupKeys.forEach((key, index) => {
        try {
          const backup = JSON.parse(localStorage.getItem(key));
          backups.push({ key, backup });
          const deletedDate = new Date(backup.deletedAt).toLocaleString('en-IN');
          backupList += `${index + 1}. ${backup.data.title}\n`;
          backupList += `   Deleted: ${deletedDate}\n`;
          backupList += `   Sections: ${backup.data.sections?.length || 0}\n\n`;
          
          console.log(`Backup ${index + 1}:`, backup.data.title);
        } catch (e) {
          console.error(`Error parsing backup ${key}:`, e);
        }
      });
      
      const selection = prompt(backupList + "\nEnter number to recover (or 'all' for all, 'cancel' to exit):");
      
      if (!selection || selection.toLowerCase() === 'cancel') {
        return;
      }
      
      // Recover all
      if (selection.toLowerCase() === 'all') {
        if (!window.confirm(`Recover ALL ${backups.length} test series?`)) {
          return;
        }
        
        let recovered = 0;
        for (const { key, backup } of backups) {
          try {
            const seriesData = backup.data;
            const { id: _unusedId, ...dataWithoutId } = seriesData;
            
            console.log(`🔄 Recovering: ${seriesData.title}`);
            await createTestSeries(dataWithoutId);
            localStorage.removeItem(key);
            recovered++;
          } catch (error) {
            console.error(`Error recovering ${backup.data.title}:`, error);
          }
        }
        
        await reloadTestSeries(true);
        alert(`✅ Success!\n\n${recovered} test series recovered!`);
        return;
      }
      
      // Recover single
      const selectedIndex = parseInt(selection) - 1;
      
      if (selectedIndex < 0 || selectedIndex >= backups.length) {
        alert("❌ Invalid selection!");
        return;
      }
      
      const selectedBackup = backups[selectedIndex];
      const seriesData = selectedBackup.backup.data;
      
      // Remove the id field (Firebase will generate new one)
      const { id: _unusedId, ...dataWithoutId } = seriesData;
      
      // Recreate in Firebase
      console.log("🔄 Recovering test series:", seriesData.title);
      const recovered = await createTestSeries(dataWithoutId);
      console.log("✅ Test series recovered:", recovered.id);
      
      // Remove from backup
      localStorage.removeItem(selectedBackup.key);
      
      // Reload test series
      await reloadTestSeries(true);
      
      alert(`✅ Test series "${seriesData.title}" recovered successfully!\n\n🎉 You can now see it in the dashboard.`);
      
    } catch (error) {
      console.error("Error recovering test series:", error);
      alert("❌ Error recovering test series: " + error.message);
    }
  };

  // CLEAR BACKUPS: Delete all backups from localStorage
  const handleClearBackups = async () => {
    try {
      // Get all backup keys from localStorage
      const backupKeys = Object.keys(localStorage).filter(key => key.startsWith('deleted_series_'));
      
      console.log(`🔍 Found ${backupKeys.length} backups in localStorage`);
      
      if (backupKeys.length === 0) {
        alert("❌ No backups found!\n\nBackup storage is already empty.");
        return;
      }
      
      // Show list of backups
      let backupList = "🗑️ Backups to be deleted:\n\n";
      const backups = [];
      
      backupKeys.forEach((key, index) => {
        try {
          const backup = JSON.parse(localStorage.getItem(key));
          backups.push({ key, backup });
          const deletedDate = new Date(backup.deletedAt).toLocaleString('en-IN');
          backupList += `${index + 1}. ${backup.data.title}\n`;
          backupList += `   Deleted: ${deletedDate}\n`;
          backupList += `   Sections: ${backup.data.sections?.length || 0}\n\n`;
        } catch (e) {
          console.error(`Error parsing backup ${key}:`, e);
        }
      });
      
      backupList += `\n⚠️ WARNING: This will PERMANENTLY delete all ${backups.length} backup(s)!\n`;
      backupList += `You will NOT be able to recover these test series after clearing.\n\n`;
      backupList += `Are you ABSOLUTELY SURE?`;
      
      if (!window.confirm(backupList)) {
        return;
      }
      
      // Double confirmation
      const doubleConfirm = window.confirm(`⚠️ FINAL CONFIRMATION\n\nThis action CANNOT be undone!\n\nDelete ${backups.length} backup(s) permanently?`);
      
      if (!doubleConfirm) {
        console.log("❌ Cancelled by user");
        return;
      }
      
      // Delete all backups
      console.log("🗑️ Clearing all backups...");
      let deletedCount = 0;
      
      backupKeys.forEach(key => {
        localStorage.removeItem(key);
        deletedCount++;
        console.log(`✓ Deleted backup: ${key}`);
      });
      
      console.log(`✅ All backups cleared: ${deletedCount} deleted`);
      
      alert(`✅ SUCCESS!\n\n${deletedCount} backup(s) permanently deleted from storage.\n\n💾 Backup storage is now empty.`);
      
    } catch (error) {
      console.error("❌ Error clearing backups:", error);
      alert("❌ Error clearing backups: " + error.message);
    }
  };

  // RESTORE FROM LOCALSTORAGE: localStorage backup se data restore karo
  const handleRestoreFromLocalStorage = async () => {
    try {
      const savedData = localStorage.getItem("testSeries");
      if (!savedData) {
        alert("❌ localStorage mein koi backup nahi mila!\n\nBrowser ne data save nahi kiya tha.");
        return;
      }

      const parsed = JSON.parse(savedData);
      if (!Array.isArray(parsed) || parsed.length === 0) {
        alert("❌ localStorage backup empty hai!");
        return;
      }

      let list = `📦 localStorage mein ${parsed.length} test series mili:\n\n`;
      parsed.forEach((s, i) => {
        const sectionCount = s.sections?.length || 0;
        let questionCount = 0;
        s.sections?.forEach(sec => sec.tests?.forEach(t => { questionCount += t.questions?.length || 0; }));
        list += `${i + 1}. ${s.title}\n   Sections: ${sectionCount} | Questions: ${questionCount}\n\n`;
      });

      if (!window.confirm(list + "\nKya aap yeh data Firestore mein restore karna chahte hain?\n\n⚠️ Existing data overwrite nahi hoga — sirf nayi entries banegi.")) {
        return;
      }

      let restoredCount = 0;
      for (const series of parsed) {
        try {
          // Check karo ki yeh series already exist karti hai
          const existingIds = testSeries.map(s => s.id);
          if (existingIds.includes(series.id)) {
            console.log(`⏭️ Already exists: ${series.title}`);
            continue;
          }

          // Nayi series create karo (nested data ke saath — getAllTestSeries ab isko handle karega)
          const { id: _id, ...seriesData } = series;
          await createTestSeries({ ...seriesData, status: seriesData.status || 'active' });
          restoredCount++;
          console.log(`✅ Restored: ${series.title}`);
        } catch (err) {
          console.error(`❌ Failed to restore: ${series.title}`, err);
        }
      }

      await reloadTestSeries(true);
      alert(`✅ ${restoredCount} test series restore ho gayi!\n\n${parsed.length - restoredCount} already exist thi (skip ki gayi).`);
    } catch (error) {
      console.error("❌ Restore failed:", error);
      alert("❌ Restore failed: " + error.message);
    }
  };

  // Toggle Series Visibility with safety check
  const handleToggleSeriesVisibility = async (idx) => {
    try {
      const seriesToUpdate = testSeries[idx];
      const currentStatus = seriesToUpdate.status || "draft";
      const newStatus = currentStatus === "active" ? "draft" : "active";
      
      // Confirmation dialog for safety
      const action = newStatus === "active" ? "SHOW (make visible)" : "HIDE";
      const confirmMsg = `${action} this test series?\n\n"${seriesToUpdate.title}"\n\nCurrent: ${currentStatus}\nNew: ${newStatus}`;
      
      if (!window.confirm(confirmMsg)) {
        return;
      }
      
      console.log(`🔄 Toggling visibility: ${seriesToUpdate.title}`);
      console.log(`   From: ${currentStatus} → To: ${newStatus}`);
      
      await updateTestSeries(seriesToUpdate.id, { status: newStatus });
      await reloadTestSeries(true);
      
      const statusText = newStatus === "active" ? "visible to users" : "hidden from users";
      alert(`✅ Success!\n\n"${seriesToUpdate.title}"\nis now ${statusText}!`);
      
      console.log(`✅ Visibility toggled successfully`);
    } catch (error) {
      console.error("❌ Error toggling visibility:", error);
      alert("❌ Error: " + error.message);
    }
  };

  // ==================== SECTION FUNCTIONS ====================

  const openCreateSectionModal = () => {
    setModalType("create-section");
    setSectionTitle("");
    setSectionDescription("");
    setEditingIdx(null);
    setShowModal(true);
  };

  const openEditSectionModal = (idx) => {
    const section = currentSeries.sections[idx];
    setModalType("edit-section");
    setSectionTitle(section.title);
    setSectionDescription(section.description || "");
    setEditingIdx(idx);
    setShowModal(true);
  };

  const handleCreateSection = async () => {
    if (!sectionTitle.trim()) { alert("Please enter a section title"); return; }
    if (saving) return;
    setSaving(true);
    try {
      const migrated = await ensureMigrated(currentSeries);
      if (migrated) { setSaving(false); return; }
      await createSection(currentSeries.id, { title: sectionTitle, description: sectionDescription, order: (currentSeries.sections?.length || 0), createdAt: new Date().toISOString() });
      await reloadTestSeries(true);
      setShowModal(false);
      alert("✅ Section created successfully!");
    } catch (error) {
      console.error("Error creating section:", error);
      alert("❌ Error creating section: " + error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateSection = async () => {
    if (!sectionTitle.trim()) { alert("Please enter a section title"); return; }
    if (saving) return;
    setSaving(true);
    try {
      const migrated = await ensureMigrated(currentSeries);
      if (migrated) { setSaving(false); return; }
      const section = currentSeries.sections[editingIdx];
      if (!section || !section.id) { alert("❌ Section ID nahi mila. Page refresh karo."); setSaving(false); return; }
      await updateSection(currentSeries.id, section.id, { title: sectionTitle, description: sectionDescription });
      await reloadTestSeries(true);
      setShowModal(false);
      alert("✅ Section updated successfully!");
    } catch (error) {
      console.error("Error updating section:", error);
      alert("❌ Error updating section: " + error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteSection = async (idx) => {
    if (!window.confirm("Are you sure? This will delete all tests and questions in this section!")) {
      return;
    }

    try {
      const migrated = await ensureMigrated(currentSeries);
      if (migrated) return;

      const section = currentSeries.sections[idx];
      // Subcollection se delete karo
      await deleteSection(currentSeries.id, section.id);
      await reloadTestSeries(true);
      alert("✅ Section deleted successfully!");
    } catch (error) {
      console.error("Error deleting section:", error);
      alert("❌ Error deleting section: " + error.message);
    }
  };

  // ==================== TEST FUNCTIONS ====================

  const openCreateTestModal = () => {
    setModalType("create-test");
    setTestTitle("");
    setTestDuration(60);
    setTestMarksPerQuestion(1);
    setTestNegativeMarking(0.25);
    setTestInstructions("");
    setTestStatus("active");
    setEditingIdx(null);
    setShowModal(true);
  };

  const openEditTestModal = (idx) => {
    const test = currentSection.tests[idx];
    setModalType("edit-test");
    setTestTitle(test.title);
    setTestDuration(test.duration || 60);
    setTestMarksPerQuestion(test.marksPerQuestion || 1);
    setTestNegativeMarking(test.negativeMarking || 0.25);
    setTestInstructions(test.instructions || "");
    setTestStatus(test.status || "active");
    setEditingIdx(idx);
    setShowModal(true);
  };

  const handleCreateTest = async () => {
    if (!testTitle.trim()) { alert("Please enter a test title"); return; }
    if (saving) return;
    setSaving(true);
    try {
      const migrated = await ensureMigrated(currentSeries);
      if (migrated) { setSaving(false); return; }
      await createTest(currentSeries.id, currentSection.id, { title: testTitle, duration: testDuration, marksPerQuestion: testMarksPerQuestion, negativeMarking: testNegativeMarking, instructions: testInstructions, status: testStatus, order: (currentSection.tests?.length || 0), createdAt: new Date().toISOString() });
      await reloadTestSeries(true);
      setShowModal(false);
      addNotification({ icon: "📝", title: "New Test Created!", message: `"${testTitle}" has been added to ${currentSection.title}.`, type: "success" });
      alert("✅ Test created successfully!");
    } catch (error) {
      console.error("Error creating test:", error);
      alert("❌ Error creating test: " + error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateTest = async () => {
    if (!testTitle.trim()) { alert("Please enter a test title"); return; }
    if (saving) return;
    setSaving(true);
    try {
      const migrated = await ensureMigrated(currentSeries);
      if (migrated) { setSaving(false); return; }
      const test = currentSection.tests[editingIdx];
      if (!test || !test.id) { alert("❌ Test ID nahi mila. Pehle data migrate karo ya page refresh karo."); setSaving(false); return; }
      await updateTest(currentSeries.id, currentSection.id, test.id, { title: testTitle, duration: testDuration, marksPerQuestion: testMarksPerQuestion, negativeMarking: testNegativeMarking, instructions: testInstructions, status: testStatus });
      await reloadTestSeries(true);
      setShowModal(false);
      addNotification({ icon: "✏️", title: "Test Updated!", message: `"${testTitle}" has been updated successfully.`, type: "info" });
      alert("✅ Test updated successfully!");
    } catch (error) {
      console.error("Error updating test:", error);
      alert("❌ Error updating test: " + error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteTest = async (idx) => {
    if (!window.confirm("Are you sure? This will delete all questions in this test!")) {
      return;
    }

    try {
      const migrated = await ensureMigrated(currentSeries);
      if (migrated) return;

      const test = currentSection.tests[idx];
      // Subcollection se delete karo
      await deleteTest(currentSeries.id, currentSection.id, test.id);
      await reloadTestSeries(true);
      alert("✅ Test deleted successfully!");
    } catch (error) {
      console.error("Error deleting test:", error);
      alert("❌ Error deleting test: " + error.message);
    }
  };

  // Toggle Test Visibility
  const handleToggleTestVisibility = async (idx) => {
    try {
      const migrated = await ensureMigrated(currentSeries);
      if (migrated) return;

      const test = currentSection.tests[idx];
      const newStatus = test.status === "active" ? "draft" : "active";
      
      await updateTest(currentSeries.id, currentSection.id, test.id, { status: newStatus });
      await reloadTestSeries(true);
      
      const statusText = newStatus === "active" ? "visible" : "hidden";
      alert(`✅ Test is now ${statusText}!`);
    } catch (error) {
      console.error("Error toggling visibility:", error);
      alert("❌ Error: " + error.message);
    }
  };

  // ==================== QUESTION FUNCTIONS ====================

  const openCreateQuestionModal = () => {
    setModalType("create-question");
    setQuestionText("");
    setNumberOfOptions(4); // Default 4 options
    setOptions(["", "", "", ""]);
    setCorrectAnswer(0);
    setExplanation("");
    setQuestionImage("");
    setEditingIdx(null);
    setShowModal(true);
  };

  const openEditQuestionModal = (idx) => {
    const question = currentTest.questions[idx];
    setModalType("edit-question");
    setQuestionText(question.question);
    setNumberOfOptions(question.options.length); // Set based on existing question
    setOptions([...question.options]);
    setCorrectAnswer(question.answer);
    setExplanation(question.explanation || "");
    setQuestionImage(question.image || "");
    setEditingIdx(idx);
    setShowModal(true);
  };

  // Function to update number of options
  const handleNumberOfOptionsChange = (newNumber) => {
    const num = parseInt(newNumber);
    if (num < 2 || num > 10) {
      alert("❌ Number of options must be between 2 and 10!");
      return;
    }
    
    setNumberOfOptions(num);
    
    // Adjust options array
    const newOptions = [...options];
    if (num > options.length) {
      // Add empty options
      for (let i = options.length; i < num; i++) {
        newOptions.push("");
      }
    } else if (num < options.length) {
      // Remove extra options
      newOptions.splice(num);
    }
    setOptions(newOptions);
    
    // Adjust correct answer if needed
    if (correctAnswer >= num) {
      setCorrectAnswer(0);
    }
  };

  const handleCreateQuestion = async () => {
    if (!questionText.trim()) { alert("Please enter a question"); return; }
    if (options.some(opt => !opt.trim())) { alert(`Please fill all ${numberOfOptions} options`); return; }
    if (saving) return;
    setSaving(true);
    try {
      const migrated = await ensureMigrated(currentSeries);
      if (migrated) { setSaving(false); return; }
      await createQuestion(currentSeries.id, currentSection.id, currentTest.id, { question: questionText, options: [...options], answer: correctAnswer, explanation, image: questionImage, order: (currentTest.questions?.length || 0) });
      await reloadTestSeries(true);
      setShowModal(false);
      alert("✅ Question added successfully!");
    } catch (error) {
      console.error("Error adding question:", error);
      alert("❌ Error adding question: " + error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateQuestion = async () => {
    if (!questionText.trim()) { alert("Please enter a question"); return; }
    if (options.some(opt => !opt.trim())) { alert(`Please fill all ${numberOfOptions} options`); return; }
    if (saving) return;
    setSaving(true);
    try {
      const migrated = await ensureMigrated(currentSeries);
      if (migrated) { setSaving(false); return; }
      const question = currentTest.questions[editingIdx];
      await updateQuestion(currentSeries.id, currentSection.id, currentTest.id, question.id, { question: questionText, options: [...options], answer: correctAnswer, explanation, image: questionImage });
      await reloadTestSeries(true);
      setShowModal(false);
      alert("✅ Question updated successfully!");
    } catch (error) {
      console.error("Error updating question:", error);
      alert("❌ Error updating question: " + error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteQuestion = async (idx) => {
    if (!window.confirm("Are you sure you want to delete this question?")) {
      return;
    }

    try {
      const migrated = await ensureMigrated(currentSeries);
      if (migrated) return;

      const question = currentTest.questions[idx];
      // Subcollection se question delete karo
      await deleteQuestion(currentSeries.id, currentSection.id, currentTest.id, question.id);
      await reloadTestSeries(true);
      alert("✅ Question deleted successfully!");
    } catch (error) {
      console.error("Error deleting question:", error);
      alert("❌ Error deleting question: " + error.message);
    }
  };

  // Bulk Delete Functions
  const toggleQuestionSelection = (idx) => {
    setSelectedQuestions(prev => {
      if (prev.includes(idx)) {
        return prev.filter(i => i !== idx);
      }
      return [...prev, idx];
    });
  };

  const selectAllQuestions = () => {
    if (selectedQuestions.length === currentTest.questions.length) {
      setSelectedQuestions([]);
    } else {
      setSelectedQuestions(currentTest.questions.map((_, idx) => idx));
    }
  };

  const handleBulkDelete = async () => {
    if (selectedQuestions.length === 0) {
      alert("Please select questions to delete");
      return;
    }

    if (!window.confirm(`Are you sure you want to delete ${selectedQuestions.length} question(s)?`)) {
      return;
    }

    try {
      const migrated = await ensureMigrated(currentSeries);
      if (migrated) return;

      // Selected questions ko subcollection se delete karo
      const questionsToDelete = selectedQuestions.map(idx => currentTest.questions[idx]);
      await Promise.all(
        questionsToDelete.map(q => deleteQuestion(currentSeries.id, currentSection.id, currentTest.id, q.id))
      );
      
      await reloadTestSeries(true);
      setSelectedQuestions([]);
      setBulkDeleteMode(false);
      alert(`✅ ${selectedQuestions.length} question(s) deleted successfully!`);
    } catch (error) {
      console.error("Error deleting questions:", error);
      alert("❌ Error deleting questions: " + error.message);
    }
  };

  // ==================== BULK UPLOAD WITH AI ERROR DETECTION ====================

  // Find JSON errors
  const findJsonErrors = (jsonString) => {
    if (!jsonString || jsonString.trim() === '') {
      return { hasErrors: true, errors: ["❌ JSON input is empty"] };
    }

    const errors = [];
    const text = jsonString.trim();

    // Check for common errors
    if (text.charCodeAt(0) === 0xFEFF) errors.push("❌ BOM character found");
    if (/[\u201C\u201D\u2018\u2019]/.test(text)) errors.push("❌ Smart quotes found");
    if (text.includes("'")) errors.push(`❌ ${(text.match(/'/g) || []).length} single quote(s) found`);
    if (/,(\s*[}\]])/.test(text)) errors.push(`❌ ${(text.match(/,(\s*[}\]])/g) || []).length} trailing comma(s)`);
    if (/}(\s*){/.test(text)) errors.push(`❌ ${(text.match(/}(\s*){/g) || []).length} missing comma(s) between objects`);
    if (/](\s*)\[/.test(text)) errors.push(`❌ ${(text.match(/](\s*)\[/g) || []).length} missing comma(s) in arrays`);
    if (/,\s*,+/.test(text)) errors.push(`❌ ${(text.match(/,\s*,+/g) || []).length} duplicate comma(s)`);
    if (/(\{|,)(\s*)([a-zA-Z_][a-zA-Z0-9_]*)(\s*):/.test(text)) errors.push("❌ Unquoted property names");
    if (text.includes('//') || text.includes('/*')) errors.push("❌ Comments found");
    if (/:\s*(True|False)\s*([,}\]])/.test(text)) errors.push("❌ Capitalized booleans");

    const openBrackets = (text.match(/\[/g) || []).length;
    const closeBrackets = (text.match(/\]/g) || []).length;
    const openBraces = (text.match(/\{/g) || []).length;
    const closeBraces = (text.match(/\}/g) || []).length;

    if (openBrackets !== closeBrackets) errors.push(`❌ Unbalanced brackets: ${openBrackets} [ but ${closeBrackets} ]`);
    if (openBraces !== closeBraces) errors.push(`❌ Unbalanced braces: ${openBraces} { but ${closeBraces} }`);

    try {
      JSON.parse(text);
      if (errors.length === 0) return { hasErrors: false, message: "✅ No errors found!" };
    } catch (e) {
      errors.push(`❌ Parse Error: ${e.message}`);
    }

    return { hasErrors: true, errors, totalErrors: errors.length };
  };

  // Auto-fix JSON errors
  const autoFixJson = (jsonString) => {
    if (!jsonString || jsonString.trim() === '') {
      return { success: false, error: "JSON input is empty" };
    }

    let fixed = jsonString.trim();
    const fixes = [];

    try {
      const parsed = JSON.parse(fixed);
      // Preserve answer field as number
      if (Array.isArray(parsed)) {
        parsed.forEach(q => {
          if (q.answer !== undefined && typeof q.answer === 'string') {
            const num = parseInt(q.answer);
            if (!isNaN(num)) {
              q.answer = num;
            }
          }
        });
      }
      return { success: true, fixedJson: JSON.stringify(parsed, null, 2), fixes: [], totalFixes: 0, data: parsed };
    } catch {
      // Continue with fixes
    }

    // Fix 1: Remove BOM
    if (fixed.charCodeAt(0) === 0xFEFF) {
      fixed = fixed.slice(1);
      fixes.push("✓ Removed BOM");
    }

    // Fix 2: Smart quotes
    if (/[\u201C\u201D\u2018\u2019]/.test(fixed)) {
      fixed = fixed.replace(/[\u201C\u201D]/g, '"').replace(/[\u2018\u2019]/g, "'");
      fixes.push("✓ Fixed smart quotes");
    }

    // Fix 3: Single → Double quotes
    if (fixed.includes("'")) {
      let result = '';
      let inDoubleQuote = false;
      let inSingleQuote = false;
      
      for (let i = 0; i < fixed.length; i++) {
        const char = fixed[i];
        const prevChar = i > 0 ? fixed[i-1] : '';
        
        if (char === '"' && prevChar !== '\\') {
          inDoubleQuote = !inDoubleQuote;
          result += char;
        } else if (char === "'" && prevChar !== '\\' && !inDoubleQuote) {
          result += inSingleQuote ? '"' : '"';
          inSingleQuote = !inSingleQuote;
        } else {
          result += char;
        }
      }
      fixed = result;
      fixes.push("✓ Converted quotes");
    }

    // Fix 4: Remove comments
    if (fixed.includes('//') || fixed.includes('/*')) {
      fixed = fixed.split('\n').map(line => {
        const idx = line.indexOf('//');
        return idx !== -1 ? line.substring(0, idx) : line;
      }).join('\n');
      fixed = fixed.replace(/\/\*[\s\S]*?\*\//g, '');
      fixes.push("✓ Removed comments");
    }

    // Fix 5: Trailing commas
    let count = 0;
    fixed = fixed.replace(/,(\s*)([\]}])/g, (m, s, b) => { count++; return s + b; });
    if (count > 0) fixes.push(`✓ Removed ${count} trailing comma(s)`);

    // Fix 6: Missing commas between objects
    count = 0;
    fixed = fixed.replace(/}(\s*\n\s*){/g, (m, s) => { count++; return '},' + s + '{'; });
    if (count > 0) fixes.push(`✓ Added ${count} comma(s) between objects`);

    // Fix 7: Missing commas in arrays
    count = 0;
    fixed = fixed.replace(/](\s*\n\s*)\[/g, (m, s) => { count++; return '],' + s + '['; });
    if (count > 0) fixes.push(`✓ Added ${count} comma(s) in arrays`);

    // Fix 8: Duplicate commas
    count = 0;
    fixed = fixed.replace(/,(\s*),+/g, (m, s) => { count++; return ',' + s; });
    if (count > 0) fixes.push(`✓ Removed ${count} duplicate comma(s)`);

    // Fix 9: Unquoted properties
    count = 0;
    fixed = fixed.replace(/([{,]\s*)([a-zA-Z_$][a-zA-Z0-9_$]*)(\s*):/g, (m, b, p, a) => {
      if (['true', 'false', 'null'].includes(p)) return m;
      count++;
      return b + '"' + p + '"' + a + ':';
    });
    if (count > 0) fixes.push(`✓ Quoted ${count} property name(s)`);

    // Fix 10: Capitalized booleans
    count = 0;
    fixed = fixed.replace(/:\s*(True|False)\s*([,}\]])/g, (m, b, a) => { count++; return ': ' + b.toLowerCase() + a; });
    if (count > 0) fixes.push(`✓ Fixed ${count} boolean(s)`);

    // Fix 11: undefined/NaN
    if (/:\s*(undefined|NaN)\s*([,}\]])/g.test(fixed)) {
      fixed = fixed.replace(/:\s*undefined\s*([,}\]])/g, ': null$1');
      fixed = fixed.replace(/:\s*NaN\s*([,}\]])/g, ': null$1');
      fixes.push("✓ Replaced invalid values");
    }

    // Fix 12: Wrap in array
    const trimmed = fixed.trim();
    if (trimmed.startsWith('{') && !trimmed.startsWith('[')) {
      fixed = '[' + fixed + ']';
      fixes.push("✓ Wrapped in array");
    }

    // Fix 13: Balance brackets
    const openB = (fixed.match(/\[/g) || []).length;
    const closeB = (fixed.match(/\]/g) || []).length;
    const openBr = (fixed.match(/\{/g) || []).length;
    const closeBr = (fixed.match(/\}/g) || []).length;

    if (openB > closeB) {
      fixed += ']'.repeat(openB - closeB);
      fixes.push(`✓ Added ${openB - closeB} missing ]`);
    }
    if (openBr > closeBr) {
      fixed += '}'.repeat(openBr - closeBr);
      fixes.push(`✓ Added ${openBr - closeBr} missing }`);
    }

    // Fix 14: Clean whitespace
    fixed = fixed.replace(/\s+/g, ' ').trim();

    try {
      const parsed = JSON.parse(fixed);
      
      // Preserve answer field as number (don't let it become string)
      if (Array.isArray(parsed)) {
        parsed.forEach(q => {
          if (q.answer !== undefined && typeof q.answer === 'string') {
            const num = parseInt(q.answer);
            if (!isNaN(num)) {
              q.answer = num;
            }
          }
        });
      }
      
      const formatted = JSON.stringify(parsed, null, 2);
      return { success: true, fixedJson: formatted, fixes, totalFixes: fixes.length, data: parsed };
    } catch (e) {
      return { success: false, error: e.message, fixes, attemptedFixes: fixes.length };
    }
  };

  // Handle bulk upload
  // Handle bulk upload
  const handleBulkUpload = async () => {
    if (!bulkJsonInput || bulkJsonInput.trim() === '') {
      alert("❌ Please paste JSON data first!");
      return;
    }

    let questions;
    let wasAutoFixed = false;
    
    try {
      questions = JSON.parse(bulkJsonInput);
    } catch {
      const fixResult = autoFixJson(bulkJsonInput);
      
      if (!fixResult.success) {
        alert(`❌ Cannot Import!\n\nError: ${fixResult.error}\n\n💡 Click "🤖 Auto-Fix" button first to fix errors.`);
        return;
      }
      
      questions = fixResult.data;
      wasAutoFixed = true;
      setBulkJsonInput(fixResult.fixedJson);
    }
    
    if (!Array.isArray(questions)) {
      alert("❌ JSON must be an array of questions!");
      return;
    }

    if (questions.length === 0) {
      alert("❌ Array is empty!");
      return;
    }

    // Validation
    const errors = [];
    const warnings = [];
    
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      const n = i + 1;
      
      if (!q.question || typeof q.question !== 'string') errors.push(`Q${n}: Missing question`);
      else if (q.question.trim().length < 3) warnings.push(`Q${n}: Question too short`);
      
      if (!q.options) errors.push(`Q${n}: Missing options`);
      else if (!Array.isArray(q.options)) errors.push(`Q${n}: Options must be array`);
      else if (q.options.length < 2 || q.options.length > 10) errors.push(`Q${n}: Must have 2-10 options (found ${q.options.length})`);
      else q.options.forEach((opt, idx) => {
        if (!opt || typeof opt !== 'string' || opt.trim() === '') {
          errors.push(`Q${n}: Option ${idx + 1} is empty`);
        }
      });
      
      if (q.answer === undefined || q.answer === null) errors.push(`Q${n}: Missing answer`);
      else if (typeof q.answer !== 'number') errors.push(`Q${n}: Answer must be number`);
      else if (!Number.isInteger(q.answer)) errors.push(`Q${n}: Answer must be integer`);
      else if (q.options && (q.answer < 0 || q.answer >= q.options.length)) errors.push(`Q${n}: Answer must be 0-${q.options.length - 1} (for ${q.options.length} options)`);
      
      if (!q.explanation || q.explanation.trim() === '') warnings.push(`Q${n}: No explanation`);
    }

    if (errors.length > 0) {
      alert(`❌ Validation Failed!\n\n${errors.slice(0, 8).join('\n')}${errors.length > 8 ? `\n\n...and ${errors.length - 8} more` : ''}`);
      return;
    }

    if (warnings.length > 0 && warnings.length <= 5) {
      if (!window.confirm(`⚠️ ${warnings.length} warning(s):\n\n${warnings.join('\n')}\n\nContinue?`)) return;
    }

    try {
      const migrated = await ensureMigrated(currentSeries);
      if (migrated) return;

      // Subcollection mein bulk questions save karo
      const newQuestions = questions.map((q, i) => ({
        question: q.question,
        options: q.options,
        answer: q.answer,
        explanation: q.explanation || '',
        image: q.image || '',
        order: (currentTest.questions?.length || 0) + i
      }));
      
      await bulkCreateQuestions(currentSeries.id, currentSection.id, currentTest.id, newQuestions);
      await reloadTestSeries(true);
      
      setShowBulkUpload(false);
      setBulkJsonInput("");
      
      addNotification({
        icon: "📦",
        title: "Bulk Upload Successful!",
        message: `${questions.length} question(s) imported successfully.`,
        type: "success"
      });
      
      let msg = `✅ Imported ${questions.length} question(s)!`;
      if (wasAutoFixed) msg += '\n\n🤖 JSON was auto-fixed';
      if (warnings.length > 5) msg += `\n\n⚠️ ${warnings.length} missing explanations`;
      
      alert(msg);
    } catch (error) {
      console.error("Error bulk uploading questions:", error);
      alert("❌ Error uploading questions: " + error.message);
    }
  };

  // ==================== AI QUESTION GENERATOR ====================

  const handleAiGenerate = async () => {
    if (!aiTopic.trim()) {
      alert("❌ Please enter a topic!");
      return;
    }

    if (aiQuestionCount < 1 || aiQuestionCount > 50) {
      alert("❌ Please enter a number between 1 and 50!");
      return;
    }

    // Show loading
    const generateBtn = document.querySelector('[data-ai-generate]');
    if (generateBtn) {
      generateBtn.textContent = "🤖 Generating...";
      generateBtn.disabled = true;
    }

    try {
      const generatedQuestions = [];
      
      // Question templates based on difficulty and type
      const templates = {
        easy: {
          factual: [
            `What is ${aiTopic}?`,
            `${aiTopic} is related to which field?`,
            `Who is associated with ${aiTopic}?`,
            `When was ${aiTopic} introduced?`,
            `Where is ${aiTopic} commonly used?`
          ],
          definition: [
            `Define ${aiTopic}.`,
            `${aiTopic} can be defined as:`,
            `The term ${aiTopic} refers to:`,
            `${aiTopic} means:`
          ],
          identification: [
            `Identify the correct statement about ${aiTopic}.`,
            `Which of the following is true about ${aiTopic}?`,
            `${aiTopic} is characterized by:`
          ]
        },
        medium: {
          conceptual: [
            `What is the main concept behind ${aiTopic}?`,
            `How does ${aiTopic} work?`,
            `Explain the principle of ${aiTopic}.`,
            `What are the key features of ${aiTopic}?`
          ],
          application: [
            `${aiTopic} is primarily used for:`,
            `In which scenario would you use ${aiTopic}?`,
            `The practical application of ${aiTopic} includes:`,
            `${aiTopic} can be applied in:`
          ],
          comparison: [
            `What is the difference between ${aiTopic} and related concepts?`,
            `Compare ${aiTopic} with similar topics.`,
            `${aiTopic} differs from others in:`
          ]
        },
        hard: {
          analytical: [
            `Analyze the impact of ${aiTopic} on modern practices.`,
            `What are the advantages and disadvantages of ${aiTopic}?`,
            `Critically evaluate ${aiTopic}.`,
            `Assess the significance of ${aiTopic}.`
          ],
          problem_solving: [
            `How would you solve a problem related to ${aiTopic}?`,
            `What approach would you take for ${aiTopic}?`,
            `In a complex scenario involving ${aiTopic}, what would be the best solution?`
          ],
          synthesis: [
            `How can ${aiTopic} be integrated with other concepts?`,
            `What is the relationship between ${aiTopic} and advanced applications?`,
            `Synthesize the key aspects of ${aiTopic}.`
          ]
        }
      };

      // Generate questions
      for (let i = 0; i < aiQuestionCount; i++) {
        const difficultyTemplates = templates[aiDifficulty];
        const typeKeys = Object.keys(difficultyTemplates);
        const selectedType = aiQuestionType === 'mixed' 
          ? typeKeys[i % typeKeys.length]
          : aiQuestionType;
        
        const questionTemplates = difficultyTemplates[selectedType] || difficultyTemplates[typeKeys[0]];
        const questionTemplate = questionTemplates[i % questionTemplates.length];
        
        // Generate question text
        let questionText = questionTemplate;
        
        // Add language prefix for Hindi
        if (aiLanguage === 'hindi') {
          questionText = `${aiTopic} के बारे में: ${questionTemplate}`;
        } else if (aiLanguage === 'bilingual') {
          questionText = `${questionTemplate} (${aiTopic} से संबंधित)`;
        }
        
        // Generate options based on difficulty
        const options = [];
        const correctIndex = Math.floor(Math.random() * 4);
        
        for (let j = 0; j < 4; j++) {
          if (j === correctIndex) {
            if (aiLanguage === 'hindi') {
              options.push(`सही उत्तर: ${aiTopic} का मुख्य पहलू ${j + 1}`);
            } else {
              options.push(`Correct: Key aspect of ${aiTopic} (Option ${j + 1})`);
            }
          } else {
            if (aiLanguage === 'hindi') {
              options.push(`विकल्प ${j + 1}: ${aiTopic} से संबंधित`);
            } else {
              options.push(`Option ${j + 1}: Related to ${aiTopic}`);
            }
          }
        }
        
        // Generate explanation based on difficulty
        let explanation = '';
        if (aiIncludeExplanation) {
          if (aiLanguage === 'hindi') {
            explanation = `यह सही उत्तर है क्योंकि ${aiTopic} इस अवधारणा से मौलिक रूप से संबंधित है। इस बुनियादी सिद्धांत को समझना विषय को समझने के लिए आवश्यक है।`;
          } else if (aiDifficulty === 'easy') {
            explanation = `This is the correct answer because ${aiTopic} fundamentally relates to this concept. Understanding this basic principle is essential.`;
          } else if (aiDifficulty === 'medium') {
            explanation = `The correct answer demonstrates a key application of ${aiTopic}. This concept shows how ${aiTopic} functions in practical scenarios.`;
          } else {
            explanation = `This answer requires deep understanding of ${aiTopic}. The reasoning involves analyzing multiple factors and synthesizing information.`;
          }
        }
        
        generatedQuestions.push({
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          question: questionText,
          options: options,
          answer: correctIndex,
          explanation: explanation,
          difficulty: aiDifficulty,
          topic: aiTopic,
          generatedBy: 'AI'
        });

        // Small delay for realistic feel
        await new Promise(resolve => setTimeout(resolve, 50));
      }

      // AI generated questions ko subcollection mein save karo
      const migrated = await ensureMigrated(currentSeries);
      if (migrated) return;

      await bulkCreateQuestions(currentSeries.id, currentSection.id, currentTest.id, 
        generatedQuestions.map((q, i) => ({ ...q, order: (currentTest.questions?.length || 0) + i }))
      );
      
      // Reload from Firebase
      await reloadTestSeries(true);
      
      setShowAiGenerator(false);
      
      // Reset form
      setAiTopic("");
      setAiQuestionCount(10);
      setAiDifficulty("medium");
      setAiLanguage("english");
      setAiQuestionType("mixed");
      setAiIncludeExplanation(true);
      
      // Add notification
      addNotification({
        icon: "🤖",
        title: "AI Questions Generated!",
        message: `${generatedQuestions.length} questions on "${aiTopic}" created successfully.`,
        type: "success"
      });
      
      let successMsg = `✅ Successfully generated ${generatedQuestions.length} questions!\n\n`;
      successMsg += `📊 Details:\n`;
      successMsg += `• Topic: ${aiTopic}\n`;
      successMsg += `• Difficulty: ${aiDifficulty}\n`;
      successMsg += `• Language: ${aiLanguage}\n`;
      successMsg += `• Type: ${aiQuestionType}\n`;
      successMsg += `• Explanations: ${aiIncludeExplanation ? 'Yes' : 'No'}\n\n`;
      successMsg += `💡 Note: Please review and customize the generated questions to match your exact requirements.`;
      
      alert(successMsg);
    } catch (error) {
      console.error("Error generating questions:", error);
      alert("❌ Error generating questions: " + error.message);
    } finally {
      if (generateBtn) {
        generateBtn.textContent = "🤖 Generate Questions";
        generateBtn.disabled = false;
      }
    }
  };

  // ==================== AI PDF CONVERTER ====================
  
  const handlePdfQuestionsGenerated = async (questions) => {
    try {
      // Validate questions
      if (!Array.isArray(questions) || questions.length === 0) {
        alert("❌ No questions found in PDF!");
        return;
      }

      const migrated = await ensureMigrated(currentSeries);
      if (migrated) return;

      // PDF se extracted questions ko subcollection mein save karo
      const pdfQuestions = questions.map((q, i) => ({
        question: q.question,
        options: q.options,
        answer: q.answer,
        explanation: q.explanation || '',
        image: q.image || '',
        order: (currentTest.questions?.length || 0) + i
      }));
      
      await bulkCreateQuestions(currentSeries.id, currentSection.id, currentTest.id, pdfQuestions);
      
      // Reload from Firebase
      await reloadTestSeries(true);
      
      // Close modal
      setShowPdfConverter(false);
      
      // Add notification
      addNotification({
        icon: "🤖",
        title: "PDF Converted Successfully!",
        message: `${questions.length} questions extracted from PDF and added to test.`,
        type: "success"
      });
      
      alert(`✅ Successfully extracted ${questions.length} questions from PDF!\n\n📊 All questions have been added to the test.\n\n💡 Please review the questions to ensure accuracy.`);
    } catch (error) {
      console.error("Error adding PDF questions:", error);
      alert("❌ Error adding questions: " + error.message);
    }
  };

  // ==================== NAVIGATION ====================

  const goToDashboard = () => {
    setCurrentView("dashboard");
    setSelectedSeriesIdx(null);
    setSelectedSectionIdx(null);
    setSelectedTestIdx(null);
  };

  const goToSections = (seriesIdx) => {
    setCurrentView("sections");
    setSelectedSeriesIdx(seriesIdx);
    setSelectedSectionIdx(null);
    setSelectedTestIdx(null);
  };

  const goToTests = (sectionIdx) => {
    setCurrentView("tests");
    setSelectedSectionIdx(sectionIdx);
    setSelectedTestIdx(null);
  };

  const goToQuestions = (testIdx) => {
    setCurrentView("questions");
    setSelectedTestIdx(testIdx);
  };

  // ==================== RENDER ====================

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #2563EB 0%, #3B82F6 100%)",
      padding: "20px"
    }}>
      <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
        
        {/* Header */}
        <div style={{
          background: "#fff",
          borderRadius: "20px",
          padding: "30px",
          marginBottom: "30px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.1)"
        }}>
          <h1 style={{
            margin: 0,
            fontSize: "2.5rem",
            fontWeight: "800",
            background: "linear-gradient(135deg, #2563EB 0%, #3B82F6 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent"
          }}>
            🎓 Admin Panel - Test Series Management
          </h1>
          <p style={{ margin: "10px 0 0 0", color: "#64748b", fontSize: "1.1rem" }}>
            Manage Test Series → Sections → Tests → Questions
          </p>
        </div>

        {/* Breadcrumb */}
        <div style={{
          background: "#fff",
          borderRadius: "15px",
          padding: "15px 25px",
          marginBottom: "20px",
          boxShadow: "0 4px 15px rgba(0,0,0,0.08)",
          display: "flex",
          alignItems: "center",
          gap: "10px",
          flexWrap: "wrap"
        }}>
          <button
            onClick={goToDashboard}
            style={{
              padding: "8px 16px",
              background: currentView === "dashboard" ? "#2563EB" : "#e2e8f0",
              color: currentView === "dashboard" ? "#fff" : "#64748b",
              border: "none",
              borderRadius: "8px",
              fontWeight: "600",
              cursor: "pointer"
            }}
          >
            📊 Dashboard
          </button>

          {currentSeries && (
            <>
              <span style={{ color: "#64748b" }}>→</span>
              <button
                onClick={() => goToSections(selectedSeriesIdx)}
                style={{
                  padding: "8px 16px",
                  background: currentView === "sections" ? "#2563EB" : "#e2e8f0",
                  color: currentView === "sections" ? "#fff" : "#64748b",
                  border: "none",
                  borderRadius: "8px",
                  fontWeight: "600",
                  cursor: "pointer"
                }}
              >
                📚 {currentSeries.title}
              </button>
            </>
          )}

          {currentSection && (
            <>
              <span style={{ color: "#64748b" }}>→</span>
              <button
                onClick={() => goToTests(selectedSectionIdx)}
                style={{
                  padding: "8px 16px",
                  background: currentView === "tests" ? "#2563EB" : "#e2e8f0",
                  color: currentView === "tests" ? "#fff" : "#64748b",
                  border: "none",
                  borderRadius: "8px",
                  fontWeight: "600",
                  cursor: "pointer"
                }}
              >
                📂 {currentSection.title}
              </button>
            </>
          )}

          {currentTest && (
            <>
              <span style={{ color: "#64748b" }}>→</span>
              <span style={{
                padding: "8px 16px",
                background: "#2563EB",
                color: "#fff",
                borderRadius: "8px",
                fontWeight: "600"
              }}>
                📝 {currentTest.title}
              </span>
            </>
          )}
        </div>

        {/* Main Content */}
        <div style={{
          background: "#fff",
          borderRadius: "20px",
          padding: "30px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
          minHeight: "400px"
        }}>

          {/* DASHBOARD VIEW */}
          {currentView === "dashboard" && (
            <>
              {/* Teacher Photo Upload Section */}
              <div style={{
                background: "linear-gradient(135deg, #ec4899 0%, #db2777 100%)",
                borderRadius: "15px",
                padding: "25px",
                marginBottom: "25px",
                color: "#fff",
                boxShadow: "0 8px 25px rgba(236, 72, 153, 0.3)"
              }}>
                <h3 style={{ margin: "0 0 15px 0", fontSize: "1.5rem", fontWeight: "700" }}>
                  📸 Teacher Photo Upload
                </h3>
                <p style={{ margin: "0 0 20px 0", fontSize: "0.95rem", opacity: 0.9 }}>
                  Upload Yogendra Pratap Singh's photo for the home page (Max: 5MB, JPG/PNG)
                </p>
                
                <div style={{ display: "flex", gap: "15px", alignItems: "center", flexWrap: "wrap" }}>
                  <input
                    type="file"
                    accept="image/jpeg,image/jpg,image/png"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        // Check file size (5MB = 5 * 1024 * 1024 bytes)
                        const maxSize = 5 * 1024 * 1024;
                        if (file.size > maxSize) {
                          alert("❌ File too large!\n\nMaximum size: 5MB\nYour file: " + (file.size / (1024 * 1024)).toFixed(2) + "MB\n\nPlease compress the image and try again.");
                          e.target.value = "";
                          return;
                        }
                        
                        // Check file type
                        if (!file.type.match(/image\/(jpeg|jpg|png)/)) {
                          alert("❌ Invalid file type!\n\nOnly JPG and PNG images are allowed.");
                          e.target.value = "";
                          return;
                        }
                        
                        setTeacherPhoto(file);
                        console.log("✅ Photo selected:", file.name, "Size:", (file.size / 1024).toFixed(2) + "KB");
                      }
                    }}
                    style={{
                      padding: "10px",
                      background: "#fff",
                      color: "#1e293b",
                      border: "2px solid #fff",
                      borderRadius: "8px",
                      fontSize: "0.95rem",
                      cursor: "pointer"
                    }}
                  />
                  
                  <button
                    onClick={handleTeacherPhotoUpload}
                    disabled={!teacherPhoto || uploadingPhoto}
                    style={{
                      padding: "12px 24px",
                      background: uploadingPhoto ? "#94a3b8" : "#fff",
                      color: uploadingPhoto ? "#fff" : "#ec4899",
                      border: "none",
                      borderRadius: "8px",
                      fontSize: "1rem",
                      fontWeight: "700",
                      cursor: uploadingPhoto ? "not-allowed" : "pointer",
                      opacity: !teacherPhoto ? 0.5 : 1
                    }}
                  >
                    {uploadingPhoto ? "⏳ Uploading..." : "📤 Upload Photo"}
                  </button>
                  
                  {teacherPhotoURL && (
                    <div style={{
                      padding: "10px 20px",
                      background: "rgba(255,255,255,0.2)",
                      borderRadius: "8px",
                      fontSize: "0.9rem"
                    }}>
                      ✅ Photo uploaded successfully!
                    </div>
                  )}
                </div>
                
                {teacherPhotoURL && (
                  <div style={{ marginTop: "15px" }}>
                    <p style={{ margin: "0 0 10px 0", fontSize: "0.9rem" }}>Preview:</p>
                    <img 
                      src={teacherPhotoURL} 
                      alt="Teacher Preview" 
                      style={{
                        width: "100px",
                        height: "100px",
                        borderRadius: "50%",
                        objectFit: "cover",
                        border: "3px solid #fff",
                        boxShadow: "0 4px 15px rgba(0,0,0,0.2)"
                      }}
                    />
                  </div>
                )}
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "25px", flexWrap: "wrap", gap: "15px" }}>
                <h2 style={{ margin: 0, fontSize: "1.8rem", fontWeight: "700", color: "#1e293b" }}>
                  📋 All Test Series
                </h2>
                <div style={{ display: "flex", gap: "15px", flexWrap: "wrap" }}>
                  <button
                    onClick={async () => {
                      try {
                        console.log("📊 All Test Series in Database:");
                        console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
                        
                        let list = "📋 All Test Series:\n\n";
                        testSeries.forEach((series, idx) => {
                          const status = series.status === "active" ? "✅ Active" : "📝 Draft";
                          list += `${idx + 1}. ${series.title}\n`;
                          list += `   Status: ${status}\n`;
                          list += `   Description: ${series.description?.substring(0, 50)}...\n\n`;
                          
                          console.log(`${idx + 1}. ${series.title}`);
                          console.log(`   ID: ${series.id}`);
                          console.log(`   Status: ${series.status}`);
                          console.log(`   Description: ${series.description}`);
                          console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
                        });
                        
                        alert(list + "\nCheck console (F12) for full details");
                      } catch (error) {
                        console.error("Error:", error);
                        alert("Error: " + error.message);
                      }
                    }}
                    style={{
                      padding: "12px 24px",
                      background: "linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)",
                      color: "#fff",
                      border: "none",
                      borderRadius: "10px",
                      fontSize: "1rem",
                      fontWeight: "700",
                      cursor: "pointer",
                      boxShadow: "0 4px 15px rgba(6, 182, 212, 0.4)"
                    }}
                    title="Show all test series with details"
                  >
                    📊 Show All
                  </button>
                  <button
                    onClick={async () => {
                      const searchTerm = prompt("Enter test series name or keyword to search:\n(e.g., Lekhpal, UPSSSC, Police, etc.)");
                      
                      if (!searchTerm || searchTerm.trim() === "") {
                        return;
                      }
                      
                      try {
                        console.log(`🔍 Searching for: "${searchTerm}"`);
                        let found = [];
                        
                        testSeries.forEach((series, idx) => {
                          const title = (series.title || "").toLowerCase();
                          const description = (series.description || "").toLowerCase();
                          const category = (series.category || "").toLowerCase();
                          const search = searchTerm.toLowerCase();
                          
                          if (title.includes(search) || description.includes(search) || category.includes(search)) {
                            found.push({ series, idx });
                            console.log("✅ Found:", series.title);
                            console.log("   Status:", series.status);
                            console.log("   Description:", series.description);
                          }
                        });
                        
                        if (found.length === 0) {
                          alert(`❌ No test series found with "${searchTerm}"\n\nTry:\n1. Different spelling\n2. Click "📊 Show All" to see all test series`);
                          return;
                        }
                        
                        let message = `Found ${found.length} test series:\n\n`;
                        found.forEach((item, i) => {
                          const status = item.series.status === "active" ? "✅ Active" : "📝 Draft";
                          message += `${i + 1}. ${item.series.title}\n   Status: ${status}\n\n`;
                        });
                        
                        if (found.length === 1) {
                          const item = found[0];
                          if (item.series.status !== "active") {
                            const activate = window.confirm(message + `\nActivate "${item.series.title}"?`);
                            if (activate) {
                              await updateTestSeries(item.series.id, { status: "active" });
                              await reloadTestSeries(true);
                              alert(`✅ SUCCESS!\n\n"${item.series.title}" is now active and visible!`);
                            }
                          } else {
                            alert(message + "\nAlready active!");
                          }
                        } else {
                          const selection = prompt(message + "\nEnter number to activate (or cancel):");
                          if (selection) {
                            const idx = parseInt(selection) - 1;
                            if (idx >= 0 && idx < found.length) {
                              const item = found[idx];
                              await updateTestSeries(item.series.id, { status: "active" });
                              await reloadTestSeries(true);
                              alert(`✅ SUCCESS!\n\n"${item.series.title}" is now active!`);
                            }
                          }
                        }
                      } catch (error) {
                        console.error("Error:", error);
                        alert("❌ Error: " + error.message);
                      }
                    }}
                    style={{
                      padding: "12px 24px",
                      background: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)",
                      color: "#fff",
                      border: "none",
                      borderRadius: "10px",
                      fontSize: "1rem",
                      fontWeight: "700",
                      cursor: "pointer",
                      boxShadow: "0 4px 15px rgba(139, 92, 246, 0.4)"
                    }}
                    title="Search test series by name, description, or category"
                  >
                    🔍 Smart Search
                  </button>
                  <button
                    onClick={handleRecoverDeletedSeries}
                    style={{
                      padding: "12px 24px",
                      background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
                      color: "#fff",
                      border: "none",
                      borderRadius: "10px",
                      fontSize: "1rem",
                      fontWeight: "700",
                      cursor: "pointer",
                      boxShadow: "0 4px 15px rgba(245, 158, 11, 0.4)"
                    }}
                    title="Recover deleted test series from backup"
                  >
                    🔄 Recover Deleted
                  </button>
                  <button
                    onClick={handleRestoreFromLocalStorage}
                    style={{
                      padding: "12px 24px",
                      background: "linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)",
                      color: "#fff",
                      border: "none",
                      borderRadius: "10px",
                      fontSize: "1rem",
                      fontWeight: "700",
                      cursor: "pointer",
                      boxShadow: "0 4px 15px rgba(14, 165, 233, 0.4)"
                    }}
                    title="localStorage backup se data restore karo"
                  >
                    💾 Restore from Backup
                  </button>
                  <button
                    onClick={handleClearBackups}
                    style={{
                      padding: "12px 24px",
                      background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
                      color: "#fff",
                      border: "none",
                      borderRadius: "10px",
                      fontSize: "1rem",
                      fontWeight: "700",
                      cursor: "pointer",
                      boxShadow: "0 4px 15px rgba(239, 68, 68, 0.4)"
                    }}
                    title="Permanently delete all backups from storage"
                  >
                    🗑️ Clear Backups
                  </button>
                  <button
                    onClick={handleRecoverLekhpalConstable}
                    style={{
                      padding: "12px 24px",
                      background: "linear-gradient(135deg, #ec4899 0%, #db2777 100%)",
                      color: "#fff",
                      border: "none",
                      borderRadius: "10px",
                      fontSize: "1rem",
                      fontWeight: "700",
                      cursor: "pointer",
                      boxShadow: "0 4px 15px rgba(236, 72, 153, 0.4)"
                    }}
                    title="Recover Lekhpal/Constable test series from Firestore"
                  >
                    🚀 Recover Lekhpal/Constable
                  </button>
                  <button
                    onClick={async () => {
                      if (!window.confirm("Are you sure you want to make ALL test series visible to users?")) {
                        return;
                      }
                      
                      try {
                        let updatedCount = 0;
                        
                        // Loop through all test series and make them active
                        for (let i = 0; i < testSeries.length; i++) {
                          const series = testSeries[i];
                          if (series.status !== "active") {
                            await updateTestSeries(series.id, { status: "active" });
                            updatedCount++;
                          }
                        }
                        
                        // Reload test series
                        await reloadTestSeries(true);
                        
                        alert(`✅ Success! ${updatedCount} test series made visible to users!`);
                      } catch (error) {
                        console.error("Error unhiding test series:", error);
                        alert("❌ Error: " + error.message);
                      }
                    }}
                    style={{
                      padding: "12px 24px",
                      background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                      color: "#fff",
                      border: "none",
                      borderRadius: "10px",
                      fontSize: "1rem",
                      fontWeight: "700",
                      cursor: "pointer",
                      boxShadow: "0 4px 15px rgba(16, 185, 129, 0.4)"
                    }}
                    title="Make all hidden test series visible to users"
                  >
                    👁️ Unhide All
                  </button>
                  <button
                    onClick={openCreateSeriesModal}
                    style={{
                      padding: "12px 24px",
                      background: "linear-gradient(135deg, #2563EB 0%, #3B82F6 100%)",
                      color: "#fff",
                      border: "none",
                      borderRadius: "10px",
                      fontSize: "1rem",
                      fontWeight: "700",
                      cursor: "pointer",
                      boxShadow: "0 4px 15px rgba(102, 126, 234, 0.4)"
                    }}
                  >
                    ➕ Create Test Series
                  </button>
                </div>
              </div>

              {testSeries.length === 0 ? (
                <div style={{ textAlign: "center", padding: "60px 20px", color: "#64748b" }}>
                  <div style={{ fontSize: "4rem", marginBottom: "20px" }}>📚</div>
                  <div style={{ fontSize: "1.3rem", fontWeight: "600", marginBottom: "10px" }}>
                    No test series yet
                  </div>
                  <div style={{ fontSize: "1rem" }}>
                    Click "Create Test Series" to get started
                  </div>
                </div>
              ) : (
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
                  gap: "20px"
                }}>
                  {testSeries.map((series, idx) => (
                    <div
                      key={series.id}
                      style={{
                        background: "#f8fafc",
                        borderRadius: "15px",
                        padding: "25px",
                        border: "2px solid #e2e8f0",
                        transition: "all 0.3s ease"
                      }}
                    >
                      <div style={{
                        display: "inline-block",
                        padding: "6px 15px",
                        background: series.status === "active" ? "#10b981" : "#f59e0b",
                        color: "#fff",
                        borderRadius: "50px",
                        fontSize: "0.85rem",
                        fontWeight: "700",
                        marginBottom: "15px"
                      }}>
                        {series.status === "active" ? "✅ Active" : "📝 Draft"}
                      </div>

                      <h3 style={{ margin: "0 0 10px 0", fontSize: "1.4rem", fontWeight: "700", color: "#1e293b" }}>
                        {series.title}
                      </h3>

                      <p style={{ margin: "0 0 15px 0", color: "#64748b", fontSize: "0.95rem", lineHeight: "1.5" }}>
                        {series.description || "No description"}
                      </p>

                      {series.category && (
                        <div style={{
                          display: "inline-block",
                          padding: "4px 12px",
                          background: "#e0e7ff",
                          color: "#2563EB",
                          borderRadius: "20px",
                          fontSize: "0.85rem",
                          fontWeight: "600",
                          marginBottom: "15px"
                        }}>
                          📂 {series.category}
                        </div>
                      )}

                      <div style={{ color: "#64748b", fontSize: "0.9rem", marginBottom: "15px" }}>
                        📚 {series.sections?.length || 0} Sections
                      </div>

                      <div style={{
                        display: "flex",
                        gap: "10px",
                        paddingTop: "15px",
                        borderTop: "1px solid #e2e8f0"
                      }}>
                        <button
                          onClick={() => goToSections(idx)}
                          style={{
                            flex: 1,
                            padding: "10px",
                            background: "linear-gradient(135deg, #2563EB 0%, #3B82F6 100%)",
                            color: "#fff",
                            border: "none",
                            borderRadius: "8px",
                            fontWeight: "600",
                            cursor: "pointer",
                            fontSize: "0.9rem"
                          }}
                        >
                          Manage →
                        </button>
                        <button
                          onClick={() => handleToggleSeriesVisibility(idx)}
                          style={{
                            padding: "10px 15px",
                            background: series.status === "active" ? "#f59e0b" : "#10b981",
                            color: "#fff",
                            border: "none",
                            borderRadius: "8px",
                            fontWeight: "600",
                            cursor: "pointer"
                          }}
                          title={series.status === "active" ? "Hide from users" : "Show to users"}
                        >
                          {series.status === "active" ? "👁️" : "🚫"}
                        </button>
                        <button
                          onClick={() => openEditSeriesModal(idx)}
                          style={{
                            padding: "10px 15px",
                            background: "#3b82f6",
                            color: "#fff",
                            border: "none",
                            borderRadius: "8px",
                            fontWeight: "600",
                            cursor: "pointer"
                          }}
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => handleDeleteSeries(idx)}
                          style={{
                            padding: "10px 15px",
                            background: "#ef4444",
                            color: "#fff",
                            border: "none",
                            borderRadius: "8px",
                            fontWeight: "600",
                            cursor: "pointer"
                          }}
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {/* STUDY MATERIAL SECTION — dashboard ke andar */}
          {currentView === "dashboard" && (
            <div style={{ marginTop: "40px" }}>
              <div style={{
                background: "linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)",
                borderRadius: "15px", padding: "25px", marginBottom: "20px", color: "#fff"
              }}>
                <h2 style={{ margin: "0 0 5px 0", fontSize: "1.6rem", fontWeight: "800" }}>📚 Study Material</h2>
                <p style={{ margin: 0, opacity: 0.9 }}>Video Lectures aur Notes manage karo</p>
              </div>

              {/* Study Material nav */}
              {studyView === "list" && (
                <>
                  <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "15px" }}>
                    <button onClick={() => openStudyModal("mat")} style={{ padding: "10px 22px", background: "linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)", color: "#fff", border: "none", borderRadius: "10px", fontWeight: "700", cursor: "pointer" }}>
                      ➕ Add Category
                    </button>
                  </div>
                  {studyMaterials.length === 0 ? (
                    <div style={{ textAlign: "center", padding: "40px", color: "#64748b", background: "#f8fafc", borderRadius: "12px" }}>
                      📭 Koi study material nahi hai. "Add Category" se shuru karo.
                    </div>
                  ) : (
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "15px" }}>
                      {studyMaterials.map((mat, idx) => (
                        <div key={mat.id} style={{ background: "#f8fafc", borderRadius: "12px", padding: "20px", border: "2px solid #e2e8f0" }}>
                          <h3 style={{ margin: "0 0 6px 0", color: "#1e293b" }}>{mat.title}</h3>
                          <p style={{ margin: "0 0 15px 0", color: "#64748b", fontSize: "0.9rem" }}>{mat.description || "No description"}</p>
                          <p style={{ margin: "0 0 15px 0", color: "#7c3aed", fontSize: "0.85rem", fontWeight: "600" }}>
                            📂 {mat.sections?.length || 0} Sections
                          </p>
                          <div style={{ display: "flex", gap: "8px" }}>
                            <button onClick={() => { setSelectedStudyMatIdx(idx); setStudyView("sections"); }} style={{ flex: 1, padding: "8px", background: "#7c3aed", color: "#fff", border: "none", borderRadius: "8px", fontWeight: "600", cursor: "pointer" }}>Manage →</button>
                            <button onClick={() => openStudyModal("mat", idx)} style={{ padding: "8px 12px", background: "#3b82f6", color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer" }}>✏️</button>
                            <button onClick={() => handleStudyDelete("mat", idx)} style={{ padding: "8px 12px", background: "#ef4444", color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer" }}>🗑️</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}

              {/* Sections view */}
              {studyView === "sections" && currentStudyMat && (
                <>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px", flexWrap: "wrap", gap: "10px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <button onClick={() => { setStudyView("list"); setSelectedStudyMatIdx(null); }} style={{ padding: "8px 16px", background: "#e2e8f0", color: "#1e293b", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "600" }}>← Back</button>
                      <h3 style={{ margin: 0, color: "#1e293b" }}>📂 {currentStudyMat.title} — Sections</h3>
                    </div>
                    <button onClick={() => openStudyModal("section")} style={{ padding: "10px 20px", background: "#7c3aed", color: "#fff", border: "none", borderRadius: "10px", fontWeight: "700", cursor: "pointer" }}>➕ Add Section</button>
                  </div>
                  {(currentStudyMat.sections || []).length === 0 ? (
                    <div style={{ textAlign: "center", padding: "40px", color: "#64748b", background: "#f8fafc", borderRadius: "12px" }}>📭 Koi section nahi. "Add Section" se shuru karo.</div>
                  ) : (
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "12px" }}>
                      {currentStudyMat.sections.map((sec, idx) => (
                        <div key={sec.id} style={{ background: "#f8fafc", borderRadius: "12px", padding: "18px", border: "2px solid #e2e8f0" }}>
                          <h4 style={{ margin: "0 0 8px 0", color: "#1e293b" }}>{sec.title}</h4>
                          <p style={{ margin: "0 0 12px 0", color: "#7c3aed", fontSize: "0.85rem" }}>📄 {sec.items?.length || 0} Items</p>
                          <div style={{ display: "flex", gap: "8px" }}>
                            <button onClick={() => { setSelectedStudySectionIdx(idx); setStudyView("items"); }} style={{ flex: 1, padding: "8px", background: "#7c3aed", color: "#fff", border: "none", borderRadius: "8px", fontWeight: "600", cursor: "pointer" }}>Items →</button>
                            <button onClick={() => openStudyModal("section", idx)} style={{ padding: "8px 12px", background: "#3b82f6", color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer" }}>✏️</button>
                            <button onClick={() => handleStudyDelete("section", idx)} style={{ padding: "8px 12px", background: "#ef4444", color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer" }}>🗑️</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}

              {/* Items view */}
              {studyView === "items" && currentStudySection && (
                <>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px", flexWrap: "wrap", gap: "10px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <button onClick={() => { setStudyView("sections"); setSelectedStudySectionIdx(null); }} style={{ padding: "8px 16px", background: "#e2e8f0", color: "#1e293b", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "600" }}>← Back</button>
                      <h3 style={{ margin: 0, color: "#1e293b" }}>📄 {currentStudySection.title} — Items</h3>
                    </div>
                    <button onClick={() => openStudyModal("item")} style={{ padding: "10px 20px", background: "#7c3aed", color: "#fff", border: "none", borderRadius: "10px", fontWeight: "700", cursor: "pointer" }}>➕ Add Item</button>
                  </div>
                  {(currentStudySection.items || []).length === 0 ? (
                    <div style={{ textAlign: "center", padding: "40px", color: "#64748b", background: "#f8fafc", borderRadius: "12px" }}>📭 Koi item nahi. "Add Item" se shuru karo.</div>
                  ) : (
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "12px" }}>
                      {currentStudySection.items.map((item, idx) => (
                        <div key={item.id} style={{ background: "#f8fafc", borderRadius: "12px", padding: "18px", border: "2px solid #e2e8f0" }}>
                          <div style={{ display: "flex", gap: "8px", alignItems: "center", marginBottom: "6px" }}>
                            <span>{item.type === "video" ? "▶️" : "📄"}</span>
                            <h4 style={{ margin: 0, color: "#1e293b", fontSize: "1rem" }}>{item.title}</h4>
                          </div>
                          <p style={{ margin: "0 0 6px 0", color: "#64748b", fontSize: "0.85rem" }}>{item.description}</p>
                          <p style={{ margin: "0 0 12px 0", color: "#7c3aed", fontSize: "0.8rem", fontWeight: "600" }}>
                            {item.type === "video" ? "🎬 Video" : "📄 Notes"}
                          </p>
                          <div style={{ display: "flex", gap: "8px" }}>
                            <button onClick={() => openStudyModal("item", idx)} style={{ flex: 1, padding: "8px", background: "#3b82f6", color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer" }}>✏️ Edit</button>
                            <button onClick={() => handleStudyDelete("item", idx)} style={{ padding: "8px 12px", background: "#ef4444", color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer" }}>🗑️</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {/* SECTIONS VIEW */}
          {currentView === "sections" && currentSeries && (
            <>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "25px" }}>
                <h2 style={{ margin: 0, fontSize: "1.8rem", fontWeight: "700", color: "#1e293b" }}>
                  📂 Sections in "{currentSeries.title}"
                </h2>
                <button
                  onClick={openCreateSectionModal}
                  style={{
                    padding: "12px 24px",
                    background: "linear-gradient(135deg, #2563EB 0%, #3B82F6 100%)",
                    color: "#fff",
                    border: "none",
                    borderRadius: "10px",
                    fontSize: "1rem",
                    fontWeight: "700",
                    cursor: "pointer",
                    boxShadow: "0 4px 15px rgba(102, 126, 234, 0.4)"
                  }}
                >
                  ➕ Create Section
                </button>
              </div>

              {(!currentSeries.sections || currentSeries.sections.length === 0) ? (
                <div style={{ textAlign: "center", padding: "60px 20px", color: "#64748b" }}>
                  <div style={{ fontSize: "4rem", marginBottom: "20px" }}>📂</div>
                  <div style={{ fontSize: "1.3rem", fontWeight: "600", marginBottom: "10px" }}>
                    No sections yet
                  </div>
                  <div style={{ fontSize: "1rem" }}>
                    Click "Create Section" to add sections like "Previous Year Papers", "Mock Tests", etc.
                  </div>
                </div>
              ) : (
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
                  gap: "20px"
                }}>
                  {currentSeries.sections.map((section, idx) => (
                    <div
                      key={section.id}
                      style={{
                        background: "#f8fafc",
                        borderRadius: "15px",
                        padding: "25px",
                        border: "2px solid #e2e8f0"
                      }}
                    >
                      <h3 style={{ margin: "0 0 10px 0", fontSize: "1.4rem", fontWeight: "700", color: "#1e293b" }}>
                        {section.title}
                      </h3>

                      <p style={{ margin: "0 0 15px 0", color: "#64748b", fontSize: "0.95rem", lineHeight: "1.5" }}>
                        {section.description || "No description"}
                      </p>

                      <div style={{ color: "#64748b", fontSize: "0.9rem", marginBottom: "15px" }}>
                        📝 {section.tests?.length || 0} Tests
                      </div>

                      <div style={{
                        display: "flex",
                        gap: "10px",
                        paddingTop: "15px",
                        borderTop: "1px solid #e2e8f0"
                      }}>
                        <button
                          onClick={() => goToTests(idx)}
                          style={{
                            flex: 1,
                            padding: "10px",
                            background: "linear-gradient(135deg, #2563EB 0%, #3B82F6 100%)",
                            color: "#fff",
                            border: "none",
                            borderRadius: "8px",
                            fontWeight: "600",
                            cursor: "pointer",
                            fontSize: "0.9rem"
                          }}
                        >
                          Manage Tests →
                        </button>
                        <button
                          onClick={() => openEditSectionModal(idx)}
                          style={{
                            padding: "10px 15px",
                            background: "#3b82f6",
                            color: "#fff",
                            border: "none",
                            borderRadius: "8px",
                            fontWeight: "600",
                            cursor: "pointer"
                          }}
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => handleDeleteSection(idx)}
                          style={{
                            padding: "10px 15px",
                            background: "#ef4444",
                            color: "#fff",
                            border: "none",
                            borderRadius: "8px",
                            fontWeight: "600",
                            cursor: "pointer"
                          }}
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {/* TESTS VIEW */}
          {currentView === "tests" && currentSection && (
            <>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "25px" }}>
                <h2 style={{ margin: 0, fontSize: "1.8rem", fontWeight: "700", color: "#1e293b" }}>
                  📝 Tests in "{currentSection.title}"
                </h2>
                <button
                  onClick={openCreateTestModal}
                  style={{
                    padding: "12px 24px",
                    background: "linear-gradient(135deg, #2563EB 0%, #3B82F6 100%)",
                    color: "#fff",
                    border: "none",
                    borderRadius: "10px",
                    fontSize: "1rem",
                    fontWeight: "700",
                    cursor: "pointer",
                    boxShadow: "0 4px 15px rgba(102, 126, 234, 0.4)"
                  }}
                >
                  ➕ Create Test
                </button>
              </div>

              {(!currentSection.tests || currentSection.tests.length === 0) ? (
                <div style={{ textAlign: "center", padding: "60px 20px", color: "#64748b" }}>
                  <div style={{ fontSize: "4rem", marginBottom: "20px" }}>📝</div>
                  <div style={{ fontSize: "1.3rem", fontWeight: "600", marginBottom: "10px" }}>
                    No tests yet
                  </div>
                  <div style={{ fontSize: "1rem" }}>
                    Click "Create Test" to add tests to this section
                  </div>
                </div>
              ) : (
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
                  gap: "20px"
                }}>
                  {currentSection.tests.map((test, idx) => (
                    <div
                      key={test.id}
                      style={{
                        background: "#f8fafc",
                        borderRadius: "15px",
                        padding: "25px",
                        border: "2px solid #e2e8f0"
                      }}
                    >
                      <div style={{
                        display: "inline-block",
                        padding: "6px 15px",
                        background: test.status === "active" ? "#10b981" : "#f59e0b",
                        color: "#fff",
                        borderRadius: "50px",
                        fontSize: "0.85rem",
                        fontWeight: "700",
                        marginBottom: "15px"
                      }}>
                        {test.status === "active" ? "✅ Active" : "📝 Draft"}
                      </div>

                      <h3 style={{ margin: "0 0 10px 0", fontSize: "1.4rem", fontWeight: "700", color: "#1e293b" }}>
                        {test.title}
                      </h3>

                      <div style={{ display: "flex", gap: "15px", marginBottom: "15px", flexWrap: "wrap" }}>
                        <div style={{ color: "#64748b", fontSize: "0.9rem" }}>
                          ⏱️ {test.duration} min
                        </div>
                        <div style={{ color: "#64748b", fontSize: "0.9rem" }}>
                          ❓ {test.questions?.length || 0} Questions
                        </div>
                        <div style={{ color: "#64748b", fontSize: "0.9rem" }}>
                          ✅ +{test.marksPerQuestion} marks
                        </div>
                        <div style={{ color: "#64748b", fontSize: "0.9rem" }}>
                          ❌ -{test.negativeMarking} marks
                        </div>
                      </div>

                      <div style={{
                        display: "flex",
                        gap: "10px",
                        paddingTop: "15px",
                        borderTop: "1px solid #e2e8f0"
                      }}>
                        <button
                          onClick={() => goToQuestions(idx)}
                          style={{
                            flex: 1,
                            padding: "10px",
                            background: "linear-gradient(135deg, #2563EB 0%, #3B82F6 100%)",
                            color: "#fff",
                            border: "none",
                            borderRadius: "8px",
                            fontWeight: "600",
                            cursor: "pointer",
                            fontSize: "0.9rem"
                          }}
                        >
                          Manage Questions →
                        </button>
                        <button
                          onClick={() => openLiveModal(idx)}
                          style={{
                            padding: "10px 15px",
                            background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
                            color: "#fff",
                            border: "none",
                            borderRadius: "8px",
                            fontWeight: "700",
                            cursor: "pointer",
                            fontSize: "0.85rem"
                          }}
                          title="Test ko live schedule karo"
                        >
                          🔴 Live
                        </button>
                        <button
                          onClick={() => handleToggleTestVisibility(idx)}
                          style={{
                            padding: "10px 15px",
                            background: test.status === "active" ? "#f59e0b" : "#10b981",
                            color: "#fff",
                            border: "none",
                            borderRadius: "8px",
                            fontWeight: "600",
                            cursor: "pointer"
                          }}
                          title={test.status === "active" ? "Hide from users" : "Show to users"}
                        >
                          {test.status === "active" ? "👁️" : "🚫"}
                        </button>
                        <button
                          onClick={() => openEditTestModal(idx)}
                          style={{
                            padding: "10px 15px",
                            background: "#3b82f6",
                            color: "#fff",
                            border: "none",
                            borderRadius: "8px",
                            fontWeight: "600",
                            cursor: "pointer"
                          }}
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => handleDeleteTest(idx)}
                          style={{
                            padding: "10px 15px",
                            background: "#ef4444",
                            color: "#fff",
                            border: "none",
                            borderRadius: "8px",
                            fontWeight: "600",
                            cursor: "pointer"
                          }}
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {/* QUESTIONS VIEW */}
          {currentView === "questions" && currentTest && (
            <>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "25px", flexWrap: "wrap", gap: "15px" }}>
                <h2 style={{ margin: 0, fontSize: "1.8rem", fontWeight: "700", color: "#1e293b" }}>
                  ❓ Questions in "{currentTest.title}"
                </h2>
                <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                  {!bulkDeleteMode ? (
                    <>
                      <button
                        onClick={openCreateQuestionModal}
                        style={{
                          padding: "12px 24px",
                          background: "linear-gradient(135deg, #2563EB 0%, #3B82F6 100%)",
                          color: "#fff",
                          border: "none",
                          borderRadius: "10px",
                          fontSize: "1rem",
                          fontWeight: "700",
                          cursor: "pointer",
                          boxShadow: "0 4px 15px rgba(102, 126, 234, 0.4)"
                        }}
                      >
                        ➕ Add Question
                      </button>
                      <button
                        onClick={() => setShowBulkUpload(true)}
                        style={{
                          padding: "12px 24px",
                          background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
                          color: "#fff",
                          border: "none",
                          borderRadius: "10px",
                          fontSize: "1rem",
                          fontWeight: "700",
                          cursor: "pointer",
                          boxShadow: "0 4px 15px rgba(59, 130, 246, 0.4)"
                        }}
                      >
                        📦 Bulk Upload (JSON)
                      </button>
                      <button
                        onClick={() => setShowPdfConverter(true)}
                        style={{
                          padding: "12px 24px",
                          background: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)",
                          color: "#fff",
                          border: "none",
                          borderRadius: "10px",
                          fontSize: "1rem",
                          fontWeight: "700",
                          cursor: "pointer",
                          boxShadow: "0 4px 15px rgba(139, 92, 246, 0.4)"
                        }}
                      >
                        🤖 AI PDF to Questions
                      </button>
                      <button
                        onClick={() => setShowAiGenerator(true)}
                        style={{
                          padding: "12px 24px",
                          background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                          color: "#fff",
                          border: "none",
                          borderRadius: "10px",
                          fontSize: "1rem",
                          fontWeight: "700",
                          cursor: "pointer",
                          boxShadow: "0 4px 15px rgba(16, 185, 129, 0.4)"
                        }}
                      >
                        🤖 AI Generate Questions
                      </button>
                      {currentTest.questions && currentTest.questions.length > 0 && (
                        <button
                          onClick={() => {
                            setBulkDeleteMode(true);
                            setSelectedQuestions([]);
                          }}
                          style={{
                            padding: "12px 24px",
                            background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
                            color: "#fff",
                            border: "none",
                            borderRadius: "10px",
                            fontSize: "1rem",
                            fontWeight: "700",
                            cursor: "pointer",
                            boxShadow: "0 4px 15px rgba(239, 68, 68, 0.4)"
                          }}
                        >
                          🗑️ Bulk Delete
                        </button>
                      )}
                    </>
                  ) : (
                    <>
                      <button
                        onClick={selectAllQuestions}
                        style={{
                          padding: "12px 24px",
                          background: selectedQuestions.length === currentTest.questions.length ? "#3b82f6" : "#e2e8f0",
                          color: selectedQuestions.length === currentTest.questions.length ? "#fff" : "#64748b",
                          border: "none",
                          borderRadius: "10px",
                          fontSize: "1rem",
                          fontWeight: "700",
                          cursor: "pointer"
                        }}
                      >
                        {selectedQuestions.length === currentTest.questions.length ? "✓ Deselect All" : "☐ Select All"}
                      </button>
                      <button
                        onClick={handleBulkDelete}
                        disabled={selectedQuestions.length === 0}
                        style={{
                          padding: "12px 24px",
                          background: selectedQuestions.length === 0 ? "#e2e8f0" : "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
                          color: selectedQuestions.length === 0 ? "#94a3b8" : "#fff",
                          border: "none",
                          borderRadius: "10px",
                          fontSize: "1rem",
                          fontWeight: "700",
                          cursor: selectedQuestions.length === 0 ? "not-allowed" : "pointer",
                          boxShadow: selectedQuestions.length === 0 ? "none" : "0 4px 15px rgba(239, 68, 68, 0.4)"
                        }}
                      >
                        🗑️ Delete Selected ({selectedQuestions.length})
                      </button>
                      <button
                        onClick={() => {
                          setBulkDeleteMode(false);
                          setSelectedQuestions([]);
                        }}
                        style={{
                          padding: "12px 24px",
                          background: "#e2e8f0",
                          color: "#64748b",
                          border: "none",
                          borderRadius: "10px",
                          fontSize: "1rem",
                          fontWeight: "700",
                          cursor: "pointer"
                        }}
                      >
                        Cancel
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Text to JSON Converter */}
              <div style={{
                background: "#fff",
                borderRadius: "15px",
                padding: "30px",
                boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
                marginBottom: "30px"
              }}>
                <h3 style={{ margin: "0 0 15px 0", fontSize: "1.5rem", color: "#1e293b" }}>
                  📝 Text to JSON Converter
                </h3>
                
                {!showTextConverter ? (
                  <button
                    onClick={() => setShowTextConverter(true)}
                    style={{
                      padding: "12px 24px",
                      background: "linear-gradient(135deg, #2563EB 0%, #3B82F6 100%)",
                      color: "#fff",
                      border: "none",
                      borderRadius: "10px",
                      fontSize: "1rem",
                      fontWeight: "600",
                      cursor: "pointer"
                    }}
                  >
                    📝 Open Text Converter
                  </button>
                ) : (
                  <div>
                    <textarea
                      value={converterText}
                      onChange={(e) => setConverterText(e.target.value)}
                      placeholder={`Q1. What is the capital of India?
A) Mumbai
B) Delhi
C) Kolkata
D) Chennai
Answer: B

Q2. What is 2+2?
A) 1
B) 2
C) 3
D) 4
Answer: D`}
                      style={{
                        width: "100%",
                        minHeight: "250px",
                        padding: "15px",
                        border: "2px solid #e2e8f0",
                        borderRadius: "10px",
                        fontSize: "1rem",
                        fontFamily: "monospace",
                        marginBottom: "15px"
                      }}
                    />
                    
                    <div style={{
                      background: "#fef3c7",
                      padding: "12px",
                      borderRadius: "8px",
                      marginBottom: "15px",
                      fontSize: "0.9rem",
                      color: "#92400e"
                    }}>
                      Format: Q1. Question? | A) Option | B) Option | C) Option | D) Option | Answer: B
                    </div>
                    
                    <div style={{ display: "flex", gap: "10px" }}>
                      <button
                        onClick={async () => {
                          if (!converterText.trim()) {
                            alert('Please enter text!');
                            return;
                          }
                          
                          try {
                            const lines = converterText.split('\n').filter(l => l.trim());
                            const questions = [];
                            let current = null;
                            
                            console.log('🔍 Starting conversion...');
                            
                            for (const line of lines) {
                              const trimmed = line.trim();
                              
                              // New question
                              if (trimmed.match(/^(Q\d+\.|Question\s*\d+\.?|\d+\.)/i)) {
                                if (current?.question) {
                                  console.log('✅ Completed question:', {
                                    q: current.question.substring(0, 30),
                                    options: current.options.length,
                                    answer: current.answer,
                                    answerLetter: String.fromCharCode(65 + current.answer)
                                  });
                                  questions.push(current);
                                }
                                current = {
                                  id: Date.now() + Math.random(),
                                  question: trimmed.replace(/^(Q\d+\.|Question\s*\d+\.?|\d+\.)/i, '').trim(),
                                  options: [],
                                  answer: 0,
                                  explanation: ""
                                };
                                console.log('🆕 New question:', current.question.substring(0, 30));
                              }
                              // Options
                              else if (trimmed.match(/^[A-D][).]/i) && current) {
                                current.options.push(trimmed.replace(/^[A-D][).]/i, '').trim());
                                console.log(`  ➕ Option ${current.options.length}: ${trimmed.substring(0, 20)}`);
                              }
                              // Answer
                              else if (trimmed.toLowerCase().includes('answer') && current) {
                                // Extract letter AFTER "answer:" or "answer"
                                const answerPart = trimmed.toLowerCase().split('answer')[1];
                                if (answerPart) {
                                  const match = answerPart.match(/[A-D]/i);
                                  if (match) {
                                    const letter = match[0].toUpperCase();
                                    current.answer = letter.charCodeAt(0) - 65;
                                    console.log(`  ✓ ANSWER SET: ${letter} = index ${current.answer}`);
                                  }
                                }
                              }
                              // Explanation
                              else if (trimmed.match(/^Explanation/i) && current) {
                                current.explanation = trimmed.replace(/^Explanation\s*:?/i, '').trim();
                              }
                            }
                            
                            if (current?.question) {
                              console.log('✅ Completed last question:', {
                                q: current.question.substring(0, 30),
                                options: current.options.length,
                                answer: current.answer,
                                answerLetter: String.fromCharCode(65 + current.answer)
                              });
                              questions.push(current);
                            }
                            
                            console.log('📊 Total parsed:', questions.length);
                            console.table(questions.map((q, i) => ({
                              '#': i + 1,
                              Question: q.question.substring(0, 30),
                              Options: q.options.length,
                              AnswerIndex: q.answer,
                              AnswerLetter: String.fromCharCode(65 + q.answer)
                            })));
                            
                            const valid = questions.filter(q => 
                              q.question && q.options.length === 4 && q.answer >= 0 && q.answer <= 3
                            );
                            
                            console.log('✅ Valid questions:', valid.length);
                            
                            if (valid.length === 0) {
                              alert('No valid questions found!');
                              return;
                            }
                            
                            // Show preview before saving
                            const preview = valid.map((q, i) => 
                              `Q${i+1}. ${q.question.substring(0, 40)}...\nAnswer: ${String.fromCharCode(65 + q.answer)} (index: ${q.answer})`
                            ).join('\n\n');
                            
                            if (!confirm(`Found ${valid.length} questions:\n\n${preview}\n\nAdd these questions?`)) {
                              return;
                            }
                            
                            console.log('💾 Saving to Firebase...');
                            console.log('Questions to save:', JSON.stringify(valid.map(q => ({
                              question: q.question.substring(0, 20),
                              answer: q.answer
                            })), null, 2));
                            
                            // Text converter questions ko subcollection mein save karo
                            const textQuestions = valid.map((q, i) => ({
                              ...q,
                              order: (currentTest.questions?.length || 0) + i
                            }));
                            
                            console.log('📤 Sending to Firebase...');
                            await bulkCreateQuestions(currentSeries.id, currentSection.id, currentTest.id, textQuestions);
                            
                            console.log('🔄 Reloading...');
                            await reloadTestSeries(true);
                            
                            console.log('✅ Done!');
                            
                            addNotification({
                              icon: "✅",
                              title: "Questions Added!",
                              message: `${valid.length} question(s) added successfully.`,
                              type: "success"
                            });
                            
                            setConverterText("");
                            setShowTextConverter(false);
                          } catch (error) {
                            console.error('❌ Conversion error:', error);
                            alert('Error converting text. Check console.');
                          }
                        }}
                        style={{
                          flex: 1,
                          padding: "12px",
                          background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                          color: "#fff",
                          border: "none",
                          borderRadius: "8px",
                          fontWeight: "600",
                          cursor: "pointer"
                        }}
                      >
                        ✅ Convert & Add
                      </button>
                      <button
                        onClick={() => {
                          setShowTextConverter(false);
                          setConverterText("");
                        }}
                        style={{
                          padding: "12px 24px",
                          background: "#e2e8f0",
                          color: "#64748b",
                          border: "none",
                          borderRadius: "8px",
                          fontWeight: "600",
                          cursor: "pointer"
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {(!currentTest.questions || currentTest.questions.length === 0) ? (
                <div style={{ textAlign: "center", padding: "60px 20px", color: "#64748b" }}>
                  <div style={{ fontSize: "4rem", marginBottom: "20px" }}>❓</div>
                  <div style={{ fontSize: "1.3rem", fontWeight: "600", marginBottom: "10px" }}>
                    No questions yet
                  </div>
                  <div style={{ fontSize: "1rem" }}>
                    Add questions manually, use bulk upload, or generate with AI
                  </div>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                  {currentTest.questions.map((question, idx) => (
                    <div
                      key={question.id}
                      style={{
                        background: "#f8fafc",
                        borderRadius: "15px",
                        padding: "25px",
                        border: bulkDeleteMode && selectedQuestions.includes(idx) ? "3px solid #2563EB" : "2px solid #e2e8f0",
                        position: "relative"
                      }}
                    >
                      {bulkDeleteMode && (
                        <div style={{
                          position: "absolute",
                          top: "15px",
                          left: "15px",
                          zIndex: 10
                        }}>
                          <input
                            type="checkbox"
                            checked={selectedQuestions.includes(idx)}
                            onChange={() => toggleQuestionSelection(idx)}
                            style={{
                              width: "24px",
                              height: "24px",
                              cursor: "pointer",
                              accentColor: "#2563EB"
                            }}
                          />
                        </div>
                      )}
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "15px", marginLeft: bulkDeleteMode ? "40px" : "0" }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: "700", color: "#2563EB", marginBottom: "10px" }}>
                            Q{idx + 1}.
                          </div>
                          <div 
                            style={{ fontSize: "1.1rem", fontWeight: "600", color: "#1e293b", marginBottom: "15px" }}
                            dangerouslySetInnerHTML={{ __html: question.question }}
                          />

                          {question.image && (
                            <div style={{ marginBottom: "15px" }}>
                              <img 
                                src={question.image} 
                                alt="Question" 
                                style={{ 
                                  maxWidth: "100%", 
                                  maxHeight: "300px", 
                                  borderRadius: "10px",
                                  border: "2px solid #e2e8f0"
                                }} 
                              />
                            </div>
                          )}

                          <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "15px" }}>
                            {question.options.map((option, optIdx) => (
                              <div
                                key={optIdx}
                                style={{
                                  padding: "10px 15px",
                                  background: optIdx === question.answer ? "#d1fae5" : "#fff",
                                  border: `2px solid ${optIdx === question.answer ? "#10b981" : "#e2e8f0"}`,
                                  borderRadius: "8px",
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "10px"
                                }}
                              >
                                <span style={{ fontWeight: "700", color: optIdx === question.answer ? "#10b981" : "#64748b" }}>
                                  {String.fromCharCode(65 + optIdx)}.
                                </span>
                                <span style={{ color: "#1e293b" }}>{option}</span>
                                {optIdx === question.answer && (
                                  <span style={{ marginLeft: "auto", color: "#10b981", fontWeight: "700" }}>✓ Correct</span>
                                )}
                              </div>
                            ))}
                          </div>

                          {question.explanation && (
                            <div style={{
                              padding: "12px",
                              background: "#fef3c7",
                              border: "2px solid #fbbf24",
                              borderRadius: "8px",
                              fontSize: "0.9rem",
                              color: "#92400e"
                            }}>
                              <strong>💡 Explanation:</strong> <span dangerouslySetInnerHTML={{ __html: question.explanation }} />
                            </div>
                          )}
                        </div>

                        {!bulkDeleteMode && (
                          <div style={{ display: "flex", gap: "8px", marginLeft: "15px" }}>
                            <button
                              onClick={() => openEditQuestionModal(idx)}
                              style={{
                                padding: "8px 12px",
                                background: "#3b82f6",
                                color: "#fff",
                                border: "none",
                                borderRadius: "8px",
                                fontWeight: "600",
                                cursor: "pointer",
                                fontSize: "0.9rem"
                              }}
                            >
                              ✏️
                            </button>
                            <button
                              onClick={() => handleDeleteQuestion(idx)}
                              style={{
                                padding: "8px 12px",
                                background: "#ef4444",
                                color: "#fff",
                                border: "none",
                                borderRadius: "8px",
                                fontWeight: "600",
                                cursor: "pointer",
                                fontSize: "0.9rem"
                              }}
                            >
                              🗑️
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

        </div>
      </div>

      {/* MODALS */}
      
      {/* Test Series Modal */}
      {showModal && (modalType === "create-series" || modalType === "edit-series") && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(0,0,0,0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000,
          padding: "20px"
        }}>
          <div style={{
            background: "#fff",
            borderRadius: "20px",
            padding: "40px",
            maxWidth: "600px",
            width: "100%",
            maxHeight: "90vh",
            overflowY: "auto"
          }}>
            <h2 style={{ margin: "0 0 25px 0", fontSize: "2rem", fontWeight: "800", color: "#1e293b" }}>
              {modalType === "create-series" ? "➕ Create Test Series" : "✏️ Edit Test Series"}
            </h2>

            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "#1e293b" }}>
                Title *
              </label>
              <input
                type="text"
                value={seriesTitle}
                onChange={(e) => setSeriesTitle(e.target.value)}
                placeholder="e.g., Lekhpal 2026 Test Series"
                style={{
                  width: "100%",
                  padding: "12px",
                  borderRadius: "8px",
                  border: "2px solid #e2e8f0",
                  fontSize: "1rem"
                }}
              />
            </div>

            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "#1e293b" }}>
                Description
              </label>
              <textarea
                value={seriesDescription}
                onChange={(e) => setSeriesDescription(e.target.value)}
                placeholder="Brief description"
                rows="3"
                style={{
                  width: "100%",
                  padding: "12px",
                  borderRadius: "8px",
                  border: "2px solid #e2e8f0",
                  fontSize: "1rem",
                  resize: "vertical"
                }}
              />
            </div>

            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "#1e293b" }}>
                Category
              </label>
              <input
                type="text"
                value={seriesCategory}
                onChange={(e) => setSeriesCategory(e.target.value)}
                placeholder="e.g., UPSSSC Lekhpal"
                style={{
                  width: "100%",
                  padding: "12px",
                  borderRadius: "8px",
                  border: "2px solid #e2e8f0",
                  fontSize: "1rem"
                }}
              />
            </div>

            <div style={{ marginBottom: "30px" }}>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "#1e293b" }}>
                Status
              </label>
              <select
                value={seriesStatus}
                onChange={(e) => setSeriesStatus(e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px",
                  borderRadius: "8px",
                  border: "2px solid #e2e8f0",
                  fontSize: "1rem",
                  cursor: "pointer"
                }}
              >
                <option value="active">✅ Active</option>
                <option value="draft">📝 Draft</option>
              </select>
            </div>

            <div style={{ display: "flex", gap: "15px" }}>
              <button
                onClick={modalType === "create-series" ? handleCreateSeries : handleUpdateSeries}
                disabled={saving}
                style={{
                  flex: 1,
                  padding: "15px",
                  background: saving ? "#94a3b8" : "linear-gradient(135deg, #2563EB 0%, #3B82F6 100%)",
                  color: "#fff",
                  border: "none",
                  borderRadius: "10px",
                  fontSize: "1.1rem",
                  fontWeight: "700",
                  cursor: saving ? "not-allowed" : "pointer"
                }}
              >
                {saving ? "⏳ Saving..." : (modalType === "create-series" ? "✅ Create" : "💾 Update")}
              </button>
              <button
                onClick={() => setShowModal(false)}
                style={{
                  flex: 1,
                  padding: "15px",
                  background: "#e2e8f0",
                  color: "#64748b",
                  border: "none",
                  borderRadius: "10px",
                  fontSize: "1.1rem",
                  fontWeight: "700",
                  cursor: "pointer"
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Section Modal */}
      {showModal && (modalType === "create-section" || modalType === "edit-section") && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(0,0,0,0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000,
          padding: "20px"
        }}>
          <div style={{
            background: "#fff",
            borderRadius: "20px",
            padding: "40px",
            maxWidth: "600px",
            width: "100%"
          }}>
            <h2 style={{ margin: "0 0 25px 0", fontSize: "2rem", fontWeight: "800", color: "#1e293b" }}>
              {modalType === "create-section" ? "➕ Create Section" : "✏️ Edit Section"}
            </h2>

            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "#1e293b" }}>
                Section Title *
              </label>
              <input
                type="text"
                value={sectionTitle}
                onChange={(e) => setSectionTitle(e.target.value)}
                placeholder="e.g., Previous Year Papers"
                style={{
                  width: "100%",
                  padding: "12px",
                  borderRadius: "8px",
                  border: "2px solid #e2e8f0",
                  fontSize: "1rem"
                }}
              />
            </div>

            <div style={{ marginBottom: "30px" }}>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "#1e293b" }}>
                Description
              </label>
              <textarea
                value={sectionDescription}
                onChange={(e) => setSectionDescription(e.target.value)}
                placeholder="Brief description"
                rows="3"
                style={{
                  width: "100%",
                  padding: "12px",
                  borderRadius: "8px",
                  border: "2px solid #e2e8f0",
                  fontSize: "1rem",
                  resize: "vertical"
                }}
              />
            </div>

            <div style={{ display: "flex", gap: "15px" }}>
              <button
                onClick={modalType === "create-section" ? handleCreateSection : handleUpdateSection}
                disabled={saving}
                style={{
                  flex: 1,
                  padding: "15px",
                  background: saving ? "#94a3b8" : "linear-gradient(135deg, #2563EB 0%, #3B82F6 100%)",
                  color: "#fff",
                  border: "none",
                  borderRadius: "10px",
                  fontSize: "1.1rem",
                  fontWeight: "700",
                  cursor: saving ? "not-allowed" : "pointer"
                }}
              >
                {saving ? "⏳ Saving..." : (modalType === "create-section" ? "✅ Create" : "💾 Update")}
              </button>
              <button
                onClick={() => setShowModal(false)}
                style={{
                  flex: 1,
                  padding: "15px",
                  background: "#e2e8f0",
                  color: "#64748b",
                  border: "none",
                  borderRadius: "10px",
                  fontSize: "1.1rem",
                  fontWeight: "700",
                  cursor: "pointer"
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Test Modal */}
      {showModal && (modalType === "create-test" || modalType === "edit-test") && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(0,0,0,0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000,
          padding: "20px"
        }}>
          <div style={{
            background: "#fff",
            borderRadius: "20px",
            padding: "40px",
            maxWidth: "600px",
            width: "100%",
            maxHeight: "90vh",
            overflowY: "auto"
          }}>
            <h2 style={{ margin: "0 0 25px 0", fontSize: "2rem", fontWeight: "800", color: "#1e293b" }}>
              {modalType === "create-test" ? "➕ Create Test" : "✏️ Edit Test"}
            </h2>

            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "#1e293b" }}>
                Test Title *
              </label>
              <input
                type="text"
                value={testTitle}
                onChange={(e) => setTestTitle(e.target.value)}
                placeholder="e.g., Lekhpal 2024 Paper"
                style={{
                  width: "100%",
                  padding: "12px",
                  borderRadius: "8px",
                  border: "2px solid #e2e8f0",
                  fontSize: "1rem"
                }}
              />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px", marginBottom: "20px" }}>
              <div>
                <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "#1e293b" }}>
                  Duration (minutes)
                </label>
                <input
                  type="number"
                  value={testDuration}
                  onChange={(e) => setTestDuration(Number(e.target.value))}
                  style={{
                    width: "100%",
                    padding: "12px",
                    borderRadius: "8px",
                    border: "2px solid #e2e8f0",
                    fontSize: "1rem"
                  }}
                />
              </div>

              <div>
                <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "#1e293b" }}>
                  Marks per Question
                </label>
                <input
                  type="number"
                  step="0.25"
                  value={testMarksPerQuestion}
                  onChange={(e) => setTestMarksPerQuestion(Number(e.target.value))}
                  style={{
                    width: "100%",
                    padding: "12px",
                    borderRadius: "8px",
                    border: "2px solid #e2e8f0",
                    fontSize: "1rem"
                  }}
                />
              </div>
            </div>

            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "#1e293b" }}>
                Negative Marking
              </label>
              <input
                type="number"
                step="0.25"
                value={testNegativeMarking}
                onChange={(e) => setTestNegativeMarking(Number(e.target.value))}
                style={{
                  width: "100%",
                  padding: "12px",
                  borderRadius: "8px",
                  border: "2px solid #e2e8f0",
                  fontSize: "1rem"
                }}
              />
            </div>

            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "#1e293b" }}>
                Instructions
              </label>
              <textarea
                value={testInstructions}
                onChange={(e) => setTestInstructions(e.target.value)}
                placeholder="Test instructions..."
                rows="3"
                style={{
                  width: "100%",
                  padding: "12px",
                  borderRadius: "8px",
                  border: "2px solid #e2e8f0",
                  fontSize: "1rem",
                  resize: "vertical"
                }}
              />
            </div>

            <div style={{ marginBottom: "30px" }}>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "#1e293b" }}>
                Status
              </label>
              <select
                value={testStatus}
                onChange={(e) => setTestStatus(e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px",
                  borderRadius: "8px",
                  border: "2px solid #e2e8f0",
                  fontSize: "1rem",
                  cursor: "pointer"
                }}
              >
                <option value="active">✅ Active</option>
                <option value="draft">📝 Draft</option>
              </select>
            </div>

            <div style={{ display: "flex", gap: "15px" }}>
              <button
                onClick={modalType === "create-test" ? handleCreateTest : handleUpdateTest}
                disabled={saving}
                style={{
                  flex: 1,
                  padding: "15px",
                  background: saving ? "#94a3b8" : "linear-gradient(135deg, #2563EB 0%, #3B82F6 100%)",
                  color: "#fff",
                  border: "none",
                  borderRadius: "10px",
                  fontSize: "1.1rem",
                  fontWeight: "700",
                  cursor: saving ? "not-allowed" : "pointer"
                }}
              >
                {saving ? "⏳ Saving..." : (modalType === "create-test" ? "✅ Create" : "💾 Update")}
              </button>
              <button
                onClick={() => setShowModal(false)}
                style={{
                  flex: 1,
                  padding: "15px",
                  background: "#e2e8f0",
                  color: "#64748b",
                  border: "none",
                  borderRadius: "10px",
                  fontSize: "1.1rem",
                  fontWeight: "700",
                  cursor: "pointer"
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Question Modal */}
      {showModal && (modalType === "create-question" || modalType === "edit-question") && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(0,0,0,0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000,
          padding: "20px"
        }}>
          <div style={{
            background: "#fff",
            borderRadius: "20px",
            padding: "40px",
            maxWidth: "700px",
            width: "100%",
            maxHeight: "90vh",
            overflowY: "auto"
          }}>
            <h2 style={{ margin: "0 0 25px 0", fontSize: "2rem", fontWeight: "800", color: "#1e293b" }}>
              {modalType === "create-question" ? "➕ Add Question" : "✏️ Edit Question"}
            </h2>

            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "#1e293b" }}>
                Question *
              </label>
              <RichTextEditor
                value={questionText}
                onChange={setQuestionText}
                placeholder="Enter your question here... Use toolbar for formatting"
              />
            </div>

            {/* Number of Options Selector */}
            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "#1e293b" }}>
                Number of Options *
              </label>
              <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                <input
                  type="number"
                  min="2"
                  max="10"
                  value={numberOfOptions}
                  onChange={(e) => handleNumberOfOptionsChange(e.target.value)}
                  style={{
                    width: "100px",
                    padding: "12px",
                    borderRadius: "8px",
                    border: "2px solid #e2e8f0",
                    fontSize: "1rem"
                  }}
                />
                <span style={{ color: "#64748b", fontSize: "0.9rem" }}>
                  (Min: 2, Max: 10)
                </span>
              </div>
            </div>

            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", marginBottom: "12px", fontWeight: "600", color: "#1e293b" }}>
                Options * ({numberOfOptions} options)
              </label>
              {options.map((option, idx) => (
                <div key={idx} style={{ marginBottom: "10px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <span style={{ fontWeight: "700", color: "#2563EB", minWidth: "30px" }}>
                      {String.fromCharCode(65 + idx)}.
                    </span>
                    <input
                      type="text"
                      value={option}
                      onChange={(e) => {
                        const newOptions = [...options];
                        newOptions[idx] = e.target.value;
                        setOptions(newOptions);
                      }}
                      placeholder={`Option ${String.fromCharCode(65 + idx)}`}
                      style={{
                        flex: 1,
                        padding: "12px",
                        borderRadius: "8px",
                        border: "2px solid #e2e8f0",
                        fontSize: "1rem"
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "#1e293b" }}>
                Correct Answer *
              </label>
              <select
                value={correctAnswer}
                onChange={(e) => setCorrectAnswer(Number(e.target.value))}
                style={{
                  width: "100%",
                  padding: "12px",
                  borderRadius: "8px",
                  border: "2px solid #e2e8f0",
                  fontSize: "1rem",
                  cursor: "pointer"
                }}
              >
                {options.map((option, idx) => (
                  <option key={idx} value={idx}>
                    {String.fromCharCode(65 + idx)} - {option || `Option ${String.fromCharCode(65 + idx)}`}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "#1e293b" }}>
                Question Image (Optional)
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    // Check file size (50KB = 51200 bytes)
                    if (file.size > 51200) {
                      alert("❌ Image size must be less than 50KB!\n\nCurrent size: " + (file.size / 1024).toFixed(2) + "KB");
                      e.target.value = "";
                      return;
                    }

                    // Convert to base64
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      setQuestionImage(reader.result);
                    };
                    reader.readAsDataURL(file);
                  }
                }}
                style={{
                  width: "100%",
                  padding: "12px",
                  borderRadius: "8px",
                  border: "2px solid #e2e8f0",
                  fontSize: "1rem",
                  cursor: "pointer"
                }}
              />
              {questionImage && (
                <div style={{ marginTop: "15px", position: "relative" }}>
                  <img 
                    src={questionImage} 
                    alt="Preview" 
                    style={{ 
                      maxWidth: "100%", 
                      maxHeight: "250px", 
                      borderRadius: "8px",
                      border: "2px solid #10b981",
                      display: "block"
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setQuestionImage("")}
                    style={{
                      position: "absolute",
                      top: "10px",
                      right: "10px",
                      padding: "8px 12px",
                      background: "#ef4444",
                      color: "#fff",
                      border: "none",
                      borderRadius: "6px",
                      fontWeight: "600",
                      cursor: "pointer",
                      fontSize: "0.9rem"
                    }}
                  >
                    🗑️ Remove
                  </button>
                </div>
              )}
              <div style={{
                marginTop: "8px",
                padding: "10px",
                background: "#dbeafe",
                borderRadius: "6px",
                fontSize: "0.85rem",
                color: "#1e40af"
              }}>
                📌 Max file size: 50KB | Supported: JPG, PNG, GIF, WebP
              </div>
            </div>

            <div style={{ marginBottom: "30px" }}>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "#1e293b" }}>
                Explanation (Optional)
              </label>
              <RichTextEditor
                value={explanation}
                onChange={setExplanation}
                placeholder="Explain why this is the correct answer... Use toolbar for formatting"
              />
            </div>

            <div style={{ display: "flex", gap: "15px" }}>
              <button
                onClick={modalType === "create-question" ? handleCreateQuestion : handleUpdateQuestion}
                disabled={saving}
                style={{
                  flex: 1,
                  padding: "15px",
                  background: saving ? "#94a3b8" : "linear-gradient(135deg, #2563EB 0%, #3B82F6 100%)",
                  color: "#fff",
                  border: "none",
                  borderRadius: "10px",
                  fontSize: "1.1rem",
                  fontWeight: "700",
                  cursor: saving ? "not-allowed" : "pointer"
                }}
              >
                {saving ? "⏳ Saving..." : (modalType === "create-question" ? "✅ Add" : "💾 Update")}
              </button>
              <button
                onClick={() => setShowModal(false)}
                style={{
                  flex: 1,
                  padding: "15px",
                  background: "#e2e8f0",
                  color: "#64748b",
                  border: "none",
                  borderRadius: "10px",
                  fontSize: "1.1rem",
                  fontWeight: "700",
                  cursor: "pointer"
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Upload Modal with AI Error Detection */}
      {showBulkUpload && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(0,0,0,0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000,
          padding: "20px"
        }}>
          <div style={{
            background: "#fff",
            borderRadius: "20px",
            padding: "40px",
            maxWidth: "800px",
            width: "100%",
            maxHeight: "90vh",
            overflowY: "auto"
          }}>
            <h2 style={{ margin: "0 0 25px 0", fontSize: "2rem", fontWeight: "800", color: "#1e293b" }}>
              📦 Bulk Upload Questions (JSON)
            </h2>

            <div style={{
              marginBottom: "20px",
              padding: "15px",
              background: "#e0f2fe",
              border: "2px solid #0ea5e9",
              borderRadius: "10px",
              fontSize: "0.9rem",
              color: "#0c4a6e"
            }}>
              <strong>📋 JSON Format:</strong>
              <pre style={{ 
                margin: "10px 0 0 0", 
                padding: "10px", 
                background: "#fff", 
                borderRadius: "5px",
                fontSize: "0.85rem",
                overflow: "auto"
              }}>
{`[
  {
    "question": "Your question here?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "answer": 0,
    "explanation": "Explanation here"
  },
  {
    "question": "True/False question?",
    "options": ["True", "False"],
    "answer": 0,
    "explanation": "Explanation for true/false"
  },
  {
    "question": "Question with 5 options?",
    "options": ["Option A", "Option B", "Option C", "Option D", "Option E"],
    "answer": 2,
    "explanation": "Explanation here"
  }
]`}
              </pre>
              <div style={{ marginTop: "10px", fontSize: "0.85rem" }}>
                • <strong>options</strong>: 2-10 options allowed (flexible!)<br/>
                • <strong>answer</strong>: 0-based index (0=first option, 1=second, etc.)<br/>
                • <strong>explanation</strong>: optional<br/>
                • Examples: 2 options (True/False), 4 options (MCQ), 5+ options (extended MCQ)
              </div>
            </div>

            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "#1e293b" }}>
                Paste JSON Data
              </label>
              <textarea
                value={bulkJsonInput}
                onChange={(e) => setBulkJsonInput(e.target.value)}
                placeholder='[{"question": "...", "options": [...], "answer": 0, "explanation": "..."}]'
                rows="12"
                style={{
                  width: "100%",
                  padding: "12px",
                  borderRadius: "8px",
                  border: "2px solid #e2e8f0",
                  fontSize: "0.9rem",
                  fontFamily: "monospace",
                  resize: "vertical"
                }}
              />
            </div>

            {/* AI Error Detection Buttons */}
            <div style={{ 
              display: "flex", 
              gap: "10px", 
              marginBottom: "20px",
              padding: "15px",
              background: "#f8fafc",
              borderRadius: "10px",
              border: "2px solid #e2e8f0"
            }}>
              <button
                onClick={() => {
                  const result = findJsonErrors(bulkJsonInput);
                  if (result.hasErrors) {
                    alert(`🔍 Found ${result.totalErrors || result.errors.length} Error(s):\n\n${result.errors.join('\n')}`);
                  } else {
                    alert(result.message);
                  }
                }}
                style={{
                  flex: 1,
                  padding: "12px 20px",
                  background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
                  color: "#fff",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "1rem",
                  fontWeight: "700",
                  cursor: "pointer",
                  boxShadow: "0 4px 15px rgba(59, 130, 246, 0.4)"
                }}
              >
                🔍 Find Errors
              </button>
              <button
                onClick={() => {
                  const result = autoFixJson(bulkJsonInput);
                  if (result.success) {
                    setBulkJsonInput(result.fixedJson);
                    alert(`✅ Auto-Fixed Successfully!\n\n${result.totalFixes} Fix(es) Applied:\n\n${result.fixes.join('\n')}\n\n✨ JSON updated in textarea!`);
                  } else {
                    alert(`❌ Auto-Fix Failed!\n\nError: ${result.error}\n\n${result.attemptedFixes ? `Attempted ${result.attemptedFixes} fix(es):\n${result.fixes.join('\n')}` : ''}\n\n💡 Try fixing manually or check the format.`);
                  }
                }}
                style={{
                  flex: 1,
                  padding: "12px 20px",
                  background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                  color: "#fff",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "1rem",
                  fontWeight: "700",
                  cursor: "pointer",
                  boxShadow: "0 4px 15px rgba(16, 185, 129, 0.4)"
                }}
              >
                🤖 Auto-Fix Errors
              </button>
            </div>

            <div style={{
              marginBottom: "20px",
              padding: "12px",
              background: "#fef3c7",
              border: "2px solid #fbbf24",
              borderRadius: "8px",
              fontSize: "0.85rem",
              color: "#92400e"
            }}>
              <strong>🤖 AI Features:</strong><br/>
              • <strong>Find Errors:</strong> Detects 10+ types of JSON errors<br/>
              • <strong>Auto-Fix:</strong> Fixes errors automatically with 19 algorithms<br/>
              • Handles: quotes, commas, brackets, comments, and more
            </div>

            <div style={{ display: "flex", gap: "15px" }}>
              <button
                onClick={handleBulkUpload}
                style={{
                  flex: 2,
                  padding: "15px",
                  background: "linear-gradient(135deg, #2563EB 0%, #3B82F6 100%)",
                  color: "#fff",
                  border: "none",
                  borderRadius: "10px",
                  fontSize: "1.1rem",
                  fontWeight: "700",
                  cursor: "pointer",
                  boxShadow: "0 4px 15px rgba(102, 126, 234, 0.4)"
                }}
              >
                📤 Import Questions
              </button>
              <button
                onClick={() => {
                  setShowBulkUpload(false);
                  setBulkJsonInput("");
                }}
                style={{
                  flex: 1,
                  padding: "15px",
                  background: "#e2e8f0",
                  color: "#64748b",
                  border: "none",
                  borderRadius: "10px",
                  fontSize: "1.1rem",
                  fontWeight: "700",
                  cursor: "pointer"
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Advanced AI Generator Modal */}
      {showAiGenerator && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(0,0,0,0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000,
          padding: "20px"
        }}>
          <div style={{
            background: "#fff",
            borderRadius: "20px",
            padding: "40px",
            maxWidth: "600px",
            width: "100%"
          }}>
            <h2 style={{ margin: "0 0 25px 0", fontSize: "2rem", fontWeight: "800", color: "#1e293b" }}>
              🤖 AI Question Generator
            </h2>

            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "#1e293b" }}>
                Topic
              </label>
              <input
                type="text"
                value={aiTopic}
                onChange={(e) => setAiTopic(e.target.value)}
                placeholder="e.g., Indian History, Mathematics"
                style={{
                  width: "100%",
                  padding: "12px",
                  borderRadius: "8px",
                  border: "2px solid #e2e8f0",
                  fontSize: "1rem"
                }}
              />
            </div>

            <div style={{ marginBottom: "30px" }}>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "#1e293b" }}>
                Number of Questions (1-50)
              </label>
              <input
                type="number"
                value={aiQuestionCount}
                onChange={(e) => setAiQuestionCount(Number(e.target.value))}
                min="1"
                max="50"
                style={{
                  width: "100%",
                  padding: "12px",
                  borderRadius: "8px",
                  border: "2px solid #e2e8f0",
                  fontSize: "1rem"
                }}
              />
            </div>

            {/* Difficulty Level */}
            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "#1e293b" }}>
                Difficulty Level
              </label>
              <select
                value={aiDifficulty}
                onChange={(e) => setAiDifficulty(e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px",
                  borderRadius: "8px",
                  border: "2px solid #e2e8f0",
                  fontSize: "1rem",
                  cursor: "pointer"
                }}
              >
                <option value="easy">🟢 Easy - Basic concepts</option>
                <option value="medium">🟡 Medium - Conceptual</option>
                <option value="hard">🔴 Hard - Analytical</option>
              </select>
            </div>

            {/* Language */}
            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "#1e293b" }}>
                Language
              </label>
              <select
                value={aiLanguage}
                onChange={(e) => setAiLanguage(e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px",
                  borderRadius: "8px",
                  border: "2px solid #e2e8f0",
                  fontSize: "1rem",
                  cursor: "pointer"
                }}
              >
                <option value="english">🇬🇧 English</option>
                <option value="hindi">🇮🇳 Hindi</option>
                <option value="bilingual">🌐 Bilingual</option>
              </select>
            </div>

            {/* Question Type */}
            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "#1e293b" }}>
                Question Type
              </label>
              <select
                value={aiQuestionType}
                onChange={(e) => setAiQuestionType(e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px",
                  borderRadius: "8px",
                  border: "2px solid #e2e8f0",
                  fontSize: "1rem",
                  cursor: "pointer"
                }}
              >
                <option value="mixed">🎲 Mixed</option>
                <option value="factual">📚 Factual</option>
                <option value="conceptual">💡 Conceptual</option>
                <option value="application">🔧 Application</option>
                <option value="analytical">🔍 Analytical</option>
              </select>
            </div>

            {/* Include Explanation */}
            <div style={{ marginBottom: "30px" }}>
              <label style={{ 
                display: "flex", 
                alignItems: "center", 
                gap: "10px",
                cursor: "pointer",
                padding: "12px",
                background: "#f8fafc",
                borderRadius: "8px"
              }}>
                <input
                  type="checkbox"
                  checked={aiIncludeExplanation}
                  onChange={(e) => setAiIncludeExplanation(e.target.checked)}
                  style={{ width: "20px", height: "20px", cursor: "pointer" }}
                />
                <span style={{ fontWeight: "600", color: "#1e293b" }}>
                  Include explanations
                </span>
              </label>
            </div>

            <div style={{ display: "flex", gap: "15px" }}>
              <button
                onClick={handleAiGenerate}
                data-ai-generate
                style={{
                  flex: 2,
                  padding: "15px",
                  background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                  color: "#fff",
                  border: "none",
                  borderRadius: "10px",
                  fontSize: "1.1rem",
                  fontWeight: "700",
                  cursor: "pointer",
                  boxShadow: "0 4px 15px rgba(16, 185, 129, 0.4)"
                }}
              >
                🤖 Generate Questions
              </button>
              <button
                onClick={() => {
                  setShowAiGenerator(false);
                  setAiTopic("");
                  setAiQuestionCount(10);
                  setAiDifficulty("medium");
                  setAiLanguage("english");
                  setAiQuestionType("mixed");
                  setAiIncludeExplanation(true);
                }}
                style={{
                  flex: 1,
                  padding: "15px",
                  background: "#e2e8f0",
                  color: "#64748b",
                  border: "none",
                  borderRadius: "10px",
                  fontSize: "1.1rem",
                  fontWeight: "700",
                  cursor: "pointer"
                }}
              >
                Cancel
              </button>
            </div>

            <div style={{
              marginTop: "20px",
              padding: "15px",
              background: "#fef3c7",
              border: "2px solid #fbbf24",
              borderRadius: "10px",
              fontSize: "0.9rem",
              color: "#92400e"
            }}>
              <strong>📝 Note:</strong> AI generates template questions. Please review and customize them for accuracy.
            </div>
          </div>
        </div>
      )}

      {/* AI PDF Converter Modal */}
      {showPdfConverter && (
        <AIPdfConverter
          onQuestionsGenerated={handlePdfQuestionsGenerated}
          onClose={() => setShowPdfConverter(false)}
        />
      )}

      {/* Live Test Schedule Modal */}
      {showLiveModal && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(0,0,0,0.6)", display: "flex",
          alignItems: "center", justifyContent: "center", zIndex: 2000, padding: "20px"
        }}>
          <div style={{
            background: "#fff", borderRadius: "20px", padding: "35px",
            maxWidth: "500px", width: "100%", boxShadow: "0 20px 60px rgba(0,0,0,0.3)"
          }}>
            <h2 style={{ margin: "0 0 8px 0", fontSize: "1.6rem", fontWeight: "800", color: "#1e293b" }}>
              🔴 Live Test Schedule
            </h2>
            <p style={{ margin: "0 0 25px 0", color: "#64748b", fontSize: "0.95rem" }}>
              {currentSection?.tests?.[liveTestIdx]?.title}
            </p>

            {liveSchedule && (
              <div style={{
                background: "#fef3c7", border: "2px solid #fbbf24",
                borderRadius: "10px", padding: "12px 16px", marginBottom: "20px",
                fontSize: "0.9rem", color: "#92400e"
              }}>
                ⚠️ Existing schedule hai — update karne ke liye naya time set karo.
                <br />
                <strong>Current:</strong> {new Date(liveSchedule.startTime).toLocaleString('en-IN')} → {new Date(liveSchedule.endTime).toLocaleString('en-IN')}
              </div>
            )}

            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", fontWeight: "700", color: "#1e293b", marginBottom: "8px" }}>
                ⏰ Start Time
              </label>
              <input
                type="datetime-local"
                value={liveStartTime}
                onChange={(e) => setLiveStartTime(e.target.value)}
                style={{
                  width: "100%", padding: "12px", border: "2px solid #e2e8f0",
                  borderRadius: "10px", fontSize: "1rem", boxSizing: "border-box"
                }}
              />
            </div>

            <div style={{ marginBottom: "25px" }}>
              <label style={{ display: "block", fontWeight: "700", color: "#1e293b", marginBottom: "8px" }}>
                ⏰ End Time
              </label>
              <input
                type="datetime-local"
                value={liveEndTime}
                onChange={(e) => setLiveEndTime(e.target.value)}
                style={{
                  width: "100%", padding: "12px", border: "2px solid #e2e8f0",
                  borderRadius: "10px", fontSize: "1rem", boxSizing: "border-box"
                }}
              />
            </div>

            <div style={{
              background: "#f0fdf4", border: "2px solid #86efac",
              borderRadius: "10px", padding: "12px 16px", marginBottom: "25px",
              fontSize: "0.9rem", color: "#166534"
            }}>
              🔒 <strong>One Attempt Per User:</strong> Har Gmail account se sirf ek baar test diya ja sakta hai.
            </div>

            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
              <button
                onClick={handleSaveLiveSchedule}
                style={{
                  flex: 2, padding: "14px",
                  background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
                  color: "#fff", border: "none", borderRadius: "10px",
                  fontWeight: "700", cursor: "pointer", fontSize: "1rem"
                }}
              >
                🔴 {liveSchedule ? "Update Schedule" : "Go Live"}
              </button>
              {liveSchedule && (
                <button
                  onClick={handleRemoveLiveSchedule}
                  style={{
                    flex: 1, padding: "14px",
                    background: "#f1f5f9", color: "#ef4444",
                    border: "2px solid #ef4444", borderRadius: "10px",
                    fontWeight: "700", cursor: "pointer", fontSize: "1rem"
                  }}
                >
                  🗑️ Remove
                </button>
              )}
              <button
                onClick={() => setShowLiveModal(false)}
                style={{
                  flex: 1, padding: "14px",
                  background: "#e2e8f0", color: "#64748b",
                  border: "none", borderRadius: "10px",
                  fontWeight: "700", cursor: "pointer", fontSize: "1rem"
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Study Material Modal */}
      {showStudyModal && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 2000, padding: "20px" }}>
          <div style={{ background: "#fff", borderRadius: "20px", padding: "30px", maxWidth: "480px", width: "100%", boxShadow: "0 20px 60px rgba(0,0,0,0.3)" }}>
            <h2 style={{ margin: "0 0 20px 0", fontSize: "1.4rem", fontWeight: "800", color: "#1e293b" }}>
              {studyModalType === "mat" ? (studyEditingIdx !== null ? "✏️ Edit Category" : "➕ Add Category") :
               studyModalType === "section" ? (studyEditingIdx !== null ? "✏️ Edit Section" : "➕ Add Section") :
               (studyEditingIdx !== null ? "✏️ Edit Item" : "➕ Add Item")}
            </h2>

            <div style={{ marginBottom: "15px" }}>
              <label style={{ display: "block", fontWeight: "700", marginBottom: "6px", color: "#1e293b" }}>Title *</label>
              <input value={studyTitle} onChange={e => setStudyTitle(e.target.value)} placeholder="Title..." style={{ width: "100%", padding: "10px", border: "2px solid #e2e8f0", borderRadius: "8px", fontSize: "1rem", boxSizing: "border-box" }} />
            </div>

            {studyModalType !== "section" && (
              <div style={{ marginBottom: "15px" }}>
                <label style={{ display: "block", fontWeight: "700", marginBottom: "6px", color: "#1e293b" }}>Description</label>
                <textarea value={studyDescription} onChange={e => setStudyDescription(e.target.value)} placeholder="Description..." rows={3} style={{ width: "100%", padding: "10px", border: "2px solid #e2e8f0", borderRadius: "8px", fontSize: "1rem", boxSizing: "border-box", resize: "vertical" }} />
              </div>
            )}

            {studyModalType === "item" && (
              <>
                <div style={{ marginBottom: "15px" }}>
                  <label style={{ display: "block", fontWeight: "700", marginBottom: "8px", color: "#1e293b" }}>Type</label>
                  <div style={{ display: "flex", gap: "10px" }}>
                    <button onClick={() => setStudyItemType("video")} style={{ flex: 1, padding: "10px", background: studyItemType === "video" ? "#7c3aed" : "#e2e8f0", color: studyItemType === "video" ? "#fff" : "#64748b", border: "none", borderRadius: "8px", fontWeight: "700", cursor: "pointer" }}>▶️ Video</button>
                    <button onClick={() => setStudyItemType("notes")} style={{ flex: 1, padding: "10px", background: studyItemType === "notes" ? "#0ea5e9" : "#e2e8f0", color: studyItemType === "notes" ? "#fff" : "#64748b", border: "none", borderRadius: "8px", fontWeight: "700", cursor: "pointer" }}>📄 Notes</button>
                  </div>
                </div>
                {studyItemType === "video" && (
                  <div style={{ marginBottom: "15px" }}>
                    <label style={{ display: "block", fontWeight: "700", marginBottom: "6px", color: "#1e293b" }}>YouTube URL</label>
                    <input value={studyYoutubeUrl} onChange={e => setStudyYoutubeUrl(e.target.value)} placeholder="https://youtube.com/watch?v=..." style={{ width: "100%", padding: "10px", border: "2px solid #e2e8f0", borderRadius: "8px", fontSize: "0.95rem", boxSizing: "border-box" }} />
                  </div>
                )}
                {studyItemType === "notes" && (
                  <div style={{ marginBottom: "15px" }}>
                    <label style={{ display: "block", fontWeight: "700", marginBottom: "6px", color: "#1e293b" }}>Telegram Link</label>
                    <input value={studyPdfUrl} onChange={e => setStudyPdfUrl(e.target.value)} placeholder="https://t.me/..." style={{ width: "100%", padding: "10px", border: "2px solid #e2e8f0", borderRadius: "8px", fontSize: "0.95rem", boxSizing: "border-box" }} />
                  </div>
                )}
              </>
            )}

            <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
              <button onClick={handleStudySave} disabled={studySaving} style={{ flex: 2, padding: "12px", background: studySaving ? "#94a3b8" : "linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)", color: "#fff", border: "none", borderRadius: "10px", fontWeight: "700", cursor: studySaving ? "not-allowed" : "pointer", fontSize: "1rem" }}>
                {studySaving ? "⏳ Saving..." : "✅ Save"}
              </button>
              <button onClick={() => setShowStudyModal(false)} style={{ flex: 1, padding: "12px", background: "#e2e8f0", color: "#64748b", border: "none", borderRadius: "10px", fontWeight: "700", cursor: "pointer" }}>Cancel</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}


