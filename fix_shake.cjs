const fs = require('fs');
let app = fs.readFileSync('src/App.tsx', 'utf8');

// Use refs to avoid rebinding
app = app.replace(
  'const [sosActive, setSosActive] = useState(false);',
  'const [sosActive, setSosActive] = useState(false);\n  const sosActiveRef = useRef(sosActive);\n  useEffect(() => { sosActiveRef.current = sosActive; }, [sosActive]);'
);

app = app.replace(
  'const [countdown, setCountdown] = useState<number | null>(null);',
  'const [countdown, setCountdown] = useState<number | null>(null);\n  const countdownRef = useRef(countdown);\n  useEffect(() => { countdownRef.current = countdown; }, [countdown]);'
);

app = app.replace(
  'if (sosActive && settings.lowPowerMode) return;',
  'if (sosActiveRef.current && settings.lowPowerMode) return;'
);

app = app.replace(
  'if (!sosActive && countdown === null) {',
  'if (!sosActiveRef.current && countdownRef.current === null) {'
);

app = app.replace(
  '}, [settings.shakeToTriggerSOS, sosActive, countdown, settings.lowPowerMode]);',
  '}, [settings.shakeToTriggerSOS, settings.lowPowerMode]); // Use refs to avoid rebinding 60 times a second'
);

fs.writeFileSync('src/App.tsx', app);
