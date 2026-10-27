import React, { useState } from 'react';
import { KIVY_PROJECT_FILES } from '../data/fighters';
import { soundManager } from '../utils/audio';
import { Code2, FileText, Copy, Check, Terminal, Cpu, Smartphone } from 'lucide-react';

export const PythonKivyExplorer: React.FC = () => {
  const [activeFile, setActiveFile] = useState<keyof typeof KIVY_PROJECT_FILES>('main.py');
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    soundManager.playMenuClick();
    navigator.clipboard.writeText(KIVY_PROJECT_FILES[activeFile]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 space-y-8">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-mono">
          <Code2 className="w-3.5 h-3.5" />
          <span>PYTHON KIVY &amp; BUILDOZER STUDIO</span>
        </div>
        <h1 className="text-4xl font-extrabold text-white tracking-tight">
          Mobile Fighter <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Source Files</span>
        </h1>
        <p className="text-slate-400 max-w-xl mx-auto text-sm">
          Explore the complete Python Kivy mobile game files and Buildozer configuration specs for compiling to Android APK.
        </p>
      </div>

      {/* Buildozer Guide Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-slate-900 border border-slate-800 p-6 rounded-3xl">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
            <Cpu className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-white">1. Install Requirements</h3>
            <p className="text-xs text-slate-400 font-mono">pip install -r requirements.txt</p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
            <Terminal className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-white">2. Run Locally</h3>
            <p className="text-xs text-slate-400 font-mono">python main.py</p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 shrink-0">
            <Smartphone className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-white">3. Compile Android APK</h3>
            <p className="text-xs text-slate-400 font-mono">buildozer -v android debug</p>
          </div>
        </div>
      </div>

      {/* Code Editor Explorer */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
        {/* File Tabs */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60 overflow-x-auto">
          <div className="flex items-center gap-2">
            {(Object.keys(KIVY_PROJECT_FILES) as Array<keyof typeof KIVY_PROJECT_FILES>).map((fileName) => (
              <button
                key={fileName}
                onClick={() => {
                  soundManager.playMenuClick();
                  setActiveFile(fileName);
                }}
                className={`px-4 py-2 rounded-xl text-xs font-mono transition-all flex items-center gap-2 whitespace-nowrap ${
                  activeFile === fileName
                    ? 'bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 font-semibold shadow-md'
                    : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-transparent'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>{fileName}</span>
              </button>
            ))}
          </div>

          <button
            onClick={handleCopy}
            className="px-4 py-2 rounded-xl bg-slate-800 text-slate-200 hover:text-white hover:bg-slate-700 transition-colors flex items-center gap-2 text-xs font-medium whitespace-nowrap"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied!' : 'Copy File Content'}</span>
          </button>
        </div>

        {/* Code Content View */}
        <div className="p-6 bg-slate-950 overflow-x-auto font-mono text-xs md:text-sm text-slate-300 leading-relaxed max-h-[500px] overflow-y-auto">
          <pre>
            <code>{KIVY_PROJECT_FILES[activeFile]}</code>
          </pre>
        </div>
      </div>
    </div>
  );
};
