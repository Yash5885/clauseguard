export default function ContractIllustration() {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[610px]" aria-hidden="true">
      <div className="absolute inset-[8%] rounded-full bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.98),rgba(225,229,240,0.2)_64%,transparent_70%)] blur-xl" />
      <svg
        className="relative h-full w-full overflow-visible"
        fill="none"
        viewBox="0 0 640 640"
      >
        <defs>
          <filter
            id="documentShadow"
            height="170%"
            width="170%"
            x="-35%"
            y="-35%"
          >
            <feDropShadow
              dx="0"
              dy="24"
              floodColor="#20232b"
              floodOpacity="0.2"
              stdDeviation="18"
            />
          </filter>
          <linearGradient id="paperTop" x1="190" x2="490" y1="170" y2="380">
            <stop stopColor="#FFFFFF" />
            <stop offset="1" stopColor="#EFF1F7" />
          </linearGradient>
          <linearGradient id="softCube" x1="0" x2="1" y1="0" y2="1">
            <stop stopColor="#AAB3CB" />
            <stop offset="1" stopColor="#7C88A8" />
          </linearGradient>
        </defs>

        <circle cx="332" cy="317" r="246" stroke="#C8CEDD" strokeWidth="1.5" />
        <path
          d="M84 360C176 190 364 105 553 183"
          stroke="#B7C0D5"
          strokeDasharray="5 10"
          strokeLinecap="round"
          strokeWidth="1.5"
        />
        <path
          d="M147 118c92 20 154 68 181 142 27 73 13 159-41 258"
          stroke="#D5D9E4"
          strokeWidth="1.5"
        />
        <circle cx="104" cy="360" r="6" fill="#17191F" />
        <circle cx="550" cy="183" r="7" fill="#8E99B8" />

        <ellipse
          cx="334"
          cy="486"
          fill="#1E222C"
          fillOpacity="0.12"
          rx="190"
          ry="35"
        />

        <g filter="url(#documentShadow)">
          <path
            d="m154 300 189-108 174 95-190 112z"
            fill="#7783A3"
            stroke="#17191F"
            strokeLinejoin="round"
            strokeWidth="2"
          />
          <path
            d="m154 300 173 99v42l-173-99z"
            fill="#5E6B8E"
            stroke="#17191F"
            strokeLinejoin="round"
            strokeWidth="2"
          />
          <path
            d="m327 399 190-112v42L327 441z"
            fill="#A9B2C8"
            stroke="#17191F"
            strokeLinejoin="round"
            strokeWidth="2"
          />

          <path
            d="m172 266 190-108 172 94-190 111z"
            fill="#D8DDE9"
            stroke="#17191F"
            strokeLinejoin="round"
            strokeWidth="2"
          />
          <path
            d="m172 266 172 97v25l-172-98z"
            fill="#B7C0D5"
            stroke="#17191F"
            strokeLinejoin="round"
            strokeWidth="2"
          />
          <path
            d="m344 363 190-111v25L344 388z"
            fill="#EEF0F5"
            stroke="#17191F"
            strokeLinejoin="round"
            strokeWidth="2"
          />

          <path
            d="m188 230 190-108 172 94-190 111z"
            fill="url(#paperTop)"
            stroke="#17191F"
            strokeLinejoin="round"
            strokeWidth="2.4"
          />
          <path
            d="m188 230 172 97v25l-172-98z"
            fill="#DDE1EA"
            stroke="#17191F"
            strokeLinejoin="round"
            strokeWidth="2"
          />
          <path
            d="m360 327 190-111v25L360 352z"
            fill="#C5CCDC"
            stroke="#17191F"
            strokeLinejoin="round"
            strokeWidth="2"
          />

          <path
            d="m247 222 129-74"
            stroke="#17191F"
            strokeLinecap="round"
            strokeWidth="8"
          />
          <path
            d="m228 248 90-51"
            stroke="#8B96B4"
            strokeLinecap="round"
            strokeWidth="6"
          />
          <path
            d="m265 277 119-68"
            stroke="#CBD1DF"
            strokeLinecap="round"
            strokeWidth="6"
          />
          <path
            d="m307 300 91-52"
            stroke="#CBD1DF"
            strokeLinecap="round"
            strokeWidth="6"
          />

          <path
            d="m418 154 66 36-72 42-65-36z"
            fill="#F5D9D3"
            stroke="#17191F"
            strokeLinejoin="round"
            strokeWidth="2"
          />
          <path
            d="m429 177 20 11"
            stroke="#C15349"
            strokeLinecap="round"
            strokeWidth="5"
          />
          <circle cx="410" cy="178" r="5" fill="#C15349" />
        </g>

        <g transform="translate(304 235)">
          <g className="landing-float-slow">
          <path
            d="M33 1 63 12v24c0 23-13 40-30 49C16 76 3 59 3 36V12z"
            fill="#17191F"
            stroke="#F8F8F4"
            strokeLinejoin="round"
            strokeWidth="3"
          />
          <path
            d="m18 41 10 10 20-22"
            stroke="#F8F8F4"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="5"
          />
          </g>
        </g>

        <g transform="translate(95 407)">
          <g className="landing-float-reverse">
          <path
            d="m55 4 45 25-48 28L7 31z"
            fill="#EEF0F5"
            stroke="#17191F"
            strokeLinejoin="round"
            strokeWidth="2"
          />
          <path
            d="m7 31 45 26v48L7 79z"
            fill="#AAB3CB"
            stroke="#17191F"
            strokeLinejoin="round"
            strokeWidth="2"
          />
          <path
            d="m52 57 48-28v48l-48 28z"
            fill="#7C88A8"
            stroke="#17191F"
            strokeLinejoin="round"
            strokeWidth="2"
          />
          <circle cx="52" cy="53" r="17" stroke="#17191F" strokeWidth="3" />
          <path
            d="m64 65 13 13"
            stroke="#17191F"
            strokeLinecap="round"
            strokeWidth="4"
          />
          </g>
        </g>

        <g transform="translate(462 368)">
          <g className="landing-float-fast">
          <path
            d="m48 2 40 22-42 25L5 26z"
            fill="#17191F"
            stroke="#17191F"
            strokeLinejoin="round"
            strokeWidth="2"
          />
          <path
            d="m5 26 41 23v44L5 70z"
            fill="#343842"
            stroke="#17191F"
            strokeLinejoin="round"
            strokeWidth="2"
          />
          <path
            d="m46 49 42-25v44L46 93z"
            fill="url(#softCube)"
            stroke="#17191F"
            strokeLinejoin="round"
            strokeWidth="2"
          />
          <path
            d="M34 43v29M34 46l22 12-22 3"
            stroke="#F8F8F4"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="3"
          />
          </g>
        </g>

        <g transform="translate(434 72)">
          <g className="landing-float-reverse">
          <path
            d="m42 2 38 22-40 23L3 26z"
            fill="#FFFFFF"
            stroke="#17191F"
            strokeLinejoin="round"
            strokeWidth="2"
          />
          <path
            d="m3 26 37 21v39L3 65z"
            fill="#D9DEEA"
            stroke="#17191F"
            strokeLinejoin="round"
            strokeWidth="2"
          />
          <path
            d="m40 47 40-23v39L40 86z"
            fill="#9CA7C1"
            stroke="#17191F"
            strokeLinejoin="round"
            strokeWidth="2"
          />
          <path
            d="m27 46 9 8 15-18"
            stroke="#17191F"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="3.5"
          />
          </g>
        </g>
      </svg>
    </div>
  );
}
