const fs = require('fs');
let content = fs.readFileSync('src/components/Auth.tsx', 'utf8');

if (!content.includes('import TiltWrapper')) {
  content = "import TiltWrapper from './TiltWrapper';\n" + content;
}

content = content.replace(
  '      </div>\n      \n      <motion.div \n        initial={{ opacity: 0, y: 20 }}\n        animate={{ opacity: 1, y: 0 }}\n        className="w-full max-w-md z-10"',
  '      </div>\n      \n      <TiltWrapper maxRotation={4} className="w-full max-w-md z-10">\n      <motion.div \n        initial={{ opacity: 0, y: 20 }}\n        animate={{ opacity: 1, y: 0 }}\n        className="w-full"\n        style={{ transformStyle: "preserve-3d" }}'
);

content = content.replace(
  '            </div>\n          </form>\n        </div>\n      </motion.div>\n    </div>\n  );\n}',
  '            </div>\n          </form>\n        </div>\n      </motion.div>\n      </TiltWrapper>\n    </div>\n  );\n}'
);

content = content.replace(
  '        <div className="bg-white/10 dark:bg-slate-900/40 backdrop-blur-3xl rounded-3xl p-8 shadow-2xl border border-white/20 relative overflow-hidden">',
  '        <div className="bg-white/10 dark:bg-slate-900/40 backdrop-blur-3xl rounded-3xl p-8 shadow-2xl border border-white/20 relative overflow-hidden" style={{ transformStyle: "preserve-3d", transform: "translateZ(30px)" }}>'
);

fs.writeFileSync('src/components/Auth.tsx', content);
