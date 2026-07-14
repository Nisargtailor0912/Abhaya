const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

content = content.replace(
  '  const [user, setUser] = useState<FirebaseUser | null>(null);',
  '  const [user, setUser] = useState<FirebaseUser | any | null>(null);\n  const [localMock, setLocalMock] = useState(localStorage.getItem("localMockAuth") === "true");'
);

content = content.replace(
  '  if (!user) {\n    return <Auth onAuth={() => {}}',
  '  if (!user && !localMock) {\n    return <Auth onAuth={() => { setLocalMock(true); localStorage.setItem("localMockAuth", "true"); }}'
);

// We should also replace the `if (!user) return;` in saveUserData
content = content.replace(
  '  const saveUserData = async (updates: any) => {\n    if (!user) return;\n    const userDocRef = doc(db, \'users\', user.uid);',
  '  const saveUserData = async (updates: any) => {\n    if (!user && !localMock) return;\n    if (localMock) { localStorage.setItem("mockUserData", JSON.stringify({...JSON.parse(localStorage.getItem("mockUserData") || "{}"), ...updates})); return; }\n    const userDocRef = doc(db, \'users\', user.uid);'
);

// We need to catch the data fetch if localMock is true
const fetchCodeRegex = /        try \{\n          const userDocRef = doc\(db, 'users', currentUser.uid\);[\s\S]*?\} catch \(err: any\) \{[\s\S]*?\}\n      \}/;

const replacementFetchCode = `
        if (currentUser.uid === 'local-mock') {
          const localData = JSON.parse(localStorage.getItem("mockUserData") || "{}");
          if (localData.personalInfo) setPersonalInfo({ ...defaultPersonalInfo, ...localData.personalInfo });
          if (localData.settings) setSettings({ ...defaultSettings, ...localData.settings });
          if (localData.contacts) setContacts(localData.contacts);
        } else {
          try {
            const userDocRef = doc(db, 'users', currentUser.uid);
            const userDoc = await getDoc(userDocRef);
            if (userDoc.exists()) {
              const data = userDoc.data();
              if (data.personalInfo) setPersonalInfo({ ...defaultPersonalInfo, ...data.personalInfo });
              if (data.settings) setSettings({ ...defaultSettings, ...data.settings });
              if (data.contacts) setContacts(data.contacts);
            } else {
              const initialPersonalInfo = { ...defaultPersonalInfo, fullName: currentUser.displayName || defaultPersonalInfo.fullName };
              await setDoc(userDocRef, { personalInfo: initialPersonalInfo, settings: defaultSettings, contacts: [] });
              setPersonalInfo(initialPersonalInfo);
            }
          } catch (err: any) {
            console.error("Failed to fetch user data:", err);
          }
        }
      }`;

content = content.replace(fetchCodeRegex, replacementFetchCode);

// Add useEffect for localMock to trigger fetch
content = content.replace(
  '    return () => unsubscribe();\n  }, []);',
  '    return () => unsubscribe();\n  }, []);\n\n  useEffect(() => { if (localMock && !user) { setUser({uid: "local-mock", email: "guest@local"}); } }, [localMock, user]);'
);

// And the emergencies collection should skip if localMock
content = content.replace(
  "        const emgRef = await addDoc(collection(db, 'emergencies'), {",
  "        if (localMock) return;\n        const emgRef = await addDoc(collection(db, 'emergencies'), {"
);
content = content.replace(
  "      updateDoc(doc(db, 'emergencies', currentEmergencyId), {",
  "      if (localMock) return;\n      updateDoc(doc(db, 'emergencies', currentEmergencyId), {"
);
content = content.replace(
  "          await updateDoc(doc(db, 'emergencies', currentEmergencyId), {",
  "          if (localMock) return;\n          await updateDoc(doc(db, 'emergencies', currentEmergencyId), {"
);

fs.writeFileSync('src/App.tsx', content);
