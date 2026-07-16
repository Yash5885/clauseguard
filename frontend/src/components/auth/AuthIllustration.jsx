export default function AuthIllustration() {
  return (
    <div className="relative mx-auto w-full max-w-[620px]">
      <div className="pointer-events-none absolute left-1/2 top-[44%] h-[72%] w-[72%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-fuchsia-300/20 blur-3xl" />

      <svg
        aria-hidden="true"
        className="relative z-10 h-auto w-full overflow-visible drop-shadow-[0_34px_50px_rgba(42,15,92,0.28)]"
        fill="none"
        viewBox="0 0 620 500"
      >
        <defs>
          <linearGradient id="authFolderTop" x1="202" x2="422" y1="288" y2="404" gradientUnits="userSpaceOnUse">
            <stop stopColor="#CABDFF" />
            <stop offset="1" stopColor="#8A6BE8" />
          </linearGradient>
          <linearGradient id="authFolderFront" x1="183" x2="439" y1="340" y2="438" gradientUnits="userSpaceOnUse">
            <stop stopColor="#6E4FD0" />
            <stop offset="1" stopColor="#44209B" />
          </linearGradient>
          <linearGradient id="authPaper" x1="253" x2="390" y1="132" y2="344" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FFFFFF" />
            <stop offset="1" stopColor="#F0EBFF" />
          </linearGradient>
          <linearGradient id="authBadge" x1="0" x2="1" y1="0" y2="1">
            <stop stopColor="#B8FFDE" />
            <stop offset="1" stopColor="#60D8A1" />
          </linearGradient>
          <filter id="authSoftShadow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="16" floodColor="#2D116D" floodOpacity="0.22" stdDeviation="14" />
          </filter>
        </defs>

        <circle cx="310" cy="245" r="188" stroke="white" strokeDasharray="7 12" strokeOpacity="0.2" />
        <circle cx="310" cy="245" r="142" stroke="white" strokeOpacity="0.12" />
        <ellipse cx="310" cy="430" fill="#2C126A" fillOpacity="0.25" rx="157" ry="30" />

        <g className="auth-contract-sheet" filter="url(#authSoftShadow)">
          <path d="M244 124h122l34 35v190H244z" fill="url(#authPaper)" stroke="#38216F" strokeWidth="3" />
          <path d="M366 124v36h34" fill="#D8CEFF" stroke="#38216F" strokeLinejoin="round" strokeWidth="3" />
          <path d="M272 202h96M272 229h76M272 256h86" stroke="#8D80B3" strokeLinecap="round" strokeWidth="8" />
          <rect x="271" y="284" width="100" height="38" rx="19" fill="#E1D9FF" />
          <circle cx="293" cy="303" r="11" fill="url(#authBadge)" />
          <path d="m287.5 303 4 4 7.5-8" stroke="#255C49" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" />
          <path d="M316 303h36" stroke="#66568D" strokeLinecap="round" strokeWidth="6" />
        </g>

        <g className="auth-folder-shell">
          <path d="m154 302 151-82 161 88-154 91z" fill="url(#authFolderTop)" stroke="#32156F" strokeLinejoin="round" strokeWidth="4" />
          <path d="m154 302 158 97v59l-158-94z" fill="url(#authFolderFront)" stroke="#32156F" strokeLinejoin="round" strokeWidth="4" />
          <path d="m312 399 154-91v59l-154 91z" fill="#7F62DB" stroke="#32156F" strokeLinejoin="round" strokeWidth="4" />
          <path d="m210 273 80-43 42 23-80 45z" fill="#E5DEFF" stroke="#32156F" strokeLinejoin="round" strokeWidth="4" />
        </g>

        <g className="auth-folder-lid">
          <path d="m171 314 140-78 145 79-145 84z" fill="#B09BF8" stroke="#32156F" strokeLinejoin="round" strokeWidth="4" />
          <path d="m171 314 140 85v35l-140-83z" fill="#6E4FD0" stroke="#32156F" strokeLinejoin="round" strokeWidth="4" />
          <path d="m311 399 145-84v35l-145 84z" fill="#967DE8" stroke="#32156F" strokeLinejoin="round" strokeWidth="4" />
        </g>

        <g className="auth-pop-icon auth-pop-check" filter="url(#authSoftShadow)">
          <circle cx="448" cy="153" r="40" fill="url(#authBadge)" stroke="#2E176A" strokeWidth="4" />
          <path d="m429 153 13 13 26-29" stroke="#254D43" strokeLinecap="round" strokeLinejoin="round" strokeWidth="7" />
        </g>

        <g className="auth-pop-icon auth-pop-warning" filter="url(#authSoftShadow)">
          <path d="M155 175v82" stroke="#2E176A" strokeLinecap="round" strokeWidth="7" />
          <path d="M160 180h70l-18 23 18 24h-70z" fill="#FFD77A" stroke="#2E176A" strokeLinejoin="round" strokeWidth="4" />
          <path d="M193 191v16" stroke="#7B501A" strokeLinecap="round" strokeWidth="5" />
          <circle cx="193" cy="216" r="3" fill="#7B501A" />
        </g>

        <g className="auth-pop-icon auth-pop-search" filter="url(#authSoftShadow)">
          <circle cx="437" cy="286" r="30" fill="#FFFFFF" stroke="#2E176A" strokeWidth="4" />
          <circle cx="432" cy="281" r="12" stroke="#704ED3" strokeWidth="6" />
          <path d="m441 290 14 14" stroke="#704ED3" strokeLinecap="round" strokeWidth="7" />
        </g>
      </svg>

      <div className="auth-status-pill absolute bottom-[5%] left-1/2 z-20 flex -translate-x-1/2 items-center gap-2 whitespace-nowrap rounded-full border border-white/30 bg-white/15 px-4 py-2 text-xs font-semibold tracking-[0.08em] text-white shadow-lg backdrop-blur-md">
        <span className="h-2 w-2 rounded-full bg-emerald-300" />
        Clause review complete
      </div>
    </div>
  );
}
