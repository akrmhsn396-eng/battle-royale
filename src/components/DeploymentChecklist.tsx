import React, { useState } from 'react';
import { soundManager } from '../utils/audio';
import { CheckCircle2, Circle, Terminal, Cpu, Smartphone, ShieldCheck, Rocket, FileCode } from 'lucide-react';

interface ChecklistStep {
  id: string;
  title: string;
  description: string;
  code?: string;
  details: string;
}

const STEPS: ChecklistStep[] = [
  {
    id: 'step-1',
    title: '1. Set up Linux / WSL2 Environment',
    description: 'Ensure you are running Ubuntu 20.04/22.04 or WSL2 on Windows as required by Buildozer.',
    code: 'sudo apt update && sudo apt install -y python3-venv git zip unzip openjdk-17-jdk',
    details: 'Buildozer requires a Linux environment with Java JDK 17 to compile Android packages successfully.',
  },
  {
    id: 'step-2',
    title: '2. Create Python Virtual Environment',
    description: 'Isolate your Python dependencies using venv.',
    code: 'python3 -m venv venv\nsource venv/bin/activate\npip install --upgrade pip',
    details: 'Always work inside an activated virtual environment to prevent system package conflicts.',
  },
  {
    id: 'step-3',
    title: '3. Install Cython & Buildozer',
    description: 'Install the core build tools for packaging Kivy apps into Android APKs.',
    code: 'pip install cython buildozer',
    details: 'Cython compiles Python modules to C extensions for Android execution.',
  },
  {
    id: 'step-4',
    title: '4. Verify buildozer.spec Configuration',
    description: 'Review your project specs (Title: YemenBattle, API: 31, NDK: 25b, Portrait).',
    code: '[app]\ntitle = YemenBattle\npackage.name = yemenbattle\npackage.domain = com.example\nrequirements = python3,kivy\nandroid.api = 31\nandroid.ndk = 25b',
    details: 'Your buildozer.spec is pre-configured with the correct API level 31 and NDK 25b for modern Android devices.',
  },
  {
    id: 'step-5',
    title: '5. Clean Previous Build Cache',
    description: 'Clear old build artifacts to ensure a pristine compilation.',
    code: 'buildozer android clean',
    details: 'Running clean prevents stale build artifacts from causing compilation errors.',
  },
  {
    id: 'step-6',
    title: '6. Build Debug Android APK',
    description: 'Trigger the Buildozer compilation pipeline to generate your APK.',
    code: 'buildozer -v android debug',
    details: 'Buildozer will automatically download Android SDK/NDK and Gradle on first run. Output APK will be in bin/.',
  },
  {
    id: 'step-7',
    title: '7. Install & Test on Android Device',
    description: 'Transfer the generated APK to your phone via USB or adb and test your game.',
    code: 'adb install -r bin/yemenbattle-0.1-arm64-v8a-debug.apk',
    details: 'Enable USB Debugging on your Android device to install and test directly.',
  },
];

export const DeploymentChecklist: React.FC = () => {
  const [completedSteps, setCompletedSteps] = useState<Record<string, boolean>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const toggleStep = (id: string) => {
    soundManager.playMenuClick();
    setCompletedSteps((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleCopyCode = (id: string, code: string) => {
    soundManager.playMenuClick();
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const completedCount = Object.values(completedSteps).filter(Boolean).length;
  const progressPercent = Math.round((completedCount / STEPS.length) * 100);

  return (
    <div className="max-w-4xl mx-auto px-6 py-10 space-y-8">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>INTERACTIVE DEPLOYMENT CHECKLIST</span>
        </div>
        <h1 className="text-4xl font-extrabold text-white tracking-tight">
          Kivy Mobile <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">Build &amp; Deploy Guide</span>
        </h1>
        <p className="text-slate-400 max-w-xl mx-auto text-sm">
          Follow this interactive checklist grounded in your YemenBattle <code className="text-emerald-400 font-mono">buildozer.spec</code> configuration to successfully build and deploy your Android APK.
        </p>
      </div>

      {/* Progress Bar */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-3">
        <div className="flex justify-between items-center text-xs font-mono">
          <span className="text-slate-300">Deployment Progress</span>
          <span className="text-emerald-400 font-bold">{completedCount} of {STEPS.length} Steps Completed ({progressPercent}%)</span>
        </div>
        <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Checklist Steps */}
      <div className="space-y-4">
        {STEPS.map((step, index) => {
          const isDone = !!completedSteps[step.id];
          return (
            <div
              key={step.id}
              onClick={() => toggleStep(step.id)}
              className={`p-6 rounded-3xl border transition-all cursor-pointer flex items-start gap-4 ${
                isDone
                  ? 'bg-emerald-950/20 border-emerald-500/40 shadow-lg shadow-emerald-950/20'
                  : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
              }`}
            >
              <button
                type="button"
                className="mt-1 text-emerald-400 focus:outline-none shrink-0"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleStep(step.id);
                }}
              >
                {isDone ? (
                  <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                ) : (
                  <Circle className="w-6 h-6 text-slate-600 hover:text-slate-400 transition-colors" />
                )}
              </button>

              <div className="flex-1 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className={`text-base font-bold transition-colors ${isDone ? 'text-emerald-300 line-through' : 'text-white'}`}>
                    {step.title}
                  </h3>
                  <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-slate-950 border border-slate-800 text-slate-400">
                    Step {index + 1}
                  </span>
                </div>

                <p className="text-xs text-slate-300">{step.description}</p>
                <p className="text-[11px] text-slate-400 italic">{step.details}</p>

                {step.code && (
                  <div
                    className="relative bg-slate-950 border border-slate-800/80 rounded-2xl p-4 font-mono text-xs text-emerald-300 overflow-x-auto"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <pre><code>{step.code}</code></pre>
                    <button
                      onClick={() => handleCopyCode(step.id, step.code!)}
                      className="absolute top-3 right-3 px-3 py-1 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 hover:text-white transition-colors flex items-center gap-1.5"
                    >
                      <span>{copiedId === step.id ? 'Copied!' : 'Copy'}</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
