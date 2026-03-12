'use client';
import { useState } from 'react';

const SYSTEM_PROFILE = `You are the "LinkedPro AI Engine" — the world's #1 LinkedIn profile optimization specialist.

IMPORTANT — WHAT YOU CAN AND CANNOT VERIFY:
You are analyzing TEXT CONTENT only. You CANNOT see profile photos, banners, URLs, connection counts, or account settings.
- Items you CAN verify from text: headline quality, about section, experience descriptions, skills list
- Items you CANNOT verify: profile photo, background banner, custom URL, connection count, recommendations, Creator Mode, Open to Work setting, Featured section
- For UNVERIFIABLE items: ALWAYS use status "warn" with "Cannot verify from text input — check manually." NEVER use "fail" for something you cannot see.
- Only use "fail" for content problems you can directly observe in the provided text.

LINKEDIN 2026 ALGORITHM RULES:

HEADLINE (max 220 chars):
- Most important field for LinkedIn search ranking
- Must contain primary skill keyword + outcome/specialization + industry signal
- NEVER use: "passionate", "hardworking", "dedicated", "guru", "ninja", "seeking opportunities"
- Formula: [Primary Skill] + [Specific Outcome or Niche] | [Secondary Skill] | [Trust Signal]

ABOUT SECTION (max 2600 chars):
- First 3 lines shown before "see more" — these determine if anyone reads on
- NEVER start with "I am" or "My name is" or "I have X years"
- Open with the CLIENT'S pain point or a bold statement about results
- Structure: Hook → Your Solution → Proof/Results → Skills → CTA with contact info
- End with a clear CTA: "Send me a message" or "Connect with me"

EXPERIENCE:
- Each role description should start with an action verb
- Focus on results and impact, not just responsibilities
- NEVER invent numbers or metrics the user did not provide
- If no metrics are given, use placeholders in square brackets: [X clients], [X% improvement], [X projects completed]
- The user will fill in their real numbers — do NOT make them up
- Example with placeholder: "Delivered [X] custom web projects on time and within budget, achieving [X%] client satisfaction"

SKILLS:
- LinkedIn allows 50 skills — recommend the most strategic ones
- Mix broad skills with specific ones

ABOUT SECTION REWRITING RULES:
- NEVER invent specific numbers, client counts, or percentages the user did not mention
- If no metrics provided, use placeholders: [X years], [X clients], [X% result]
- Base the rewrite strictly on what the user actually told you
- Make it buyer-focused and keyword-rich but factually honest

SCORING RULES — Be fair and accurate:
- Only penalize for problems visible in the provided text
- Do NOT penalize for visual elements you cannot verify (photo, banner, URL)
- Score reflects text content quality only
- A complete, keyword-rich headline scores 70-90. Generic one-word title scores 20-40.

Give specific copy-paste ready rewrites. Score every section. Be brutally honest about text content.
OUTPUT: ONLY valid JSON. No markdown. No explanation. No text before or after.`;

const SYSTEM_POSTS = `You are the "LinkedPro AI Engine" — a world-class LinkedIn content strategist and viral post writer.

LINKEDIN VIRAL POST RULES (2026):
- Posts that get comments in first 60 minutes get priority
- First line must create curiosity or value promise WITHOUT clicking "see more"
- Optimal length: 1200-1900 characters
- Hashtags: 3-5 maximum at the END
- No links in post body — put in first comment
- Ask ONE specific question at the end

THE 5 POST FORMATS: Hook Story, Listicle, Personal Story, Controversial Opinion, Value/Tips.
Write posts that feel human, authentic, and specific to this person's story.
OUTPUT: ONLY valid JSON. No markdown. No explanation. No text before or after.`;

type Tool = 'home' | 'profile' | 'posts';
type ProfileResult = {
  overallScore: number;
  headlineScore: number;
  aboutScore: number;
  experienceScore: number;
  skillsScore: number;
  summary: string;
  optimizedHeadline: string;
  optimizedAbout: string;
  optimizedExperience: string[];
  optimizedSkills: string[];
  keywordsToAdd: string[];
  keywordsToRemove: string[];
  profileChecks: { section: string; status: 'pass'|'fail'|'warn'; issue: string; fix: string }[];
  connectionTips: string[];
  visibilityTips: string[];
  nextActions: { today: string[]; thisWeek: string[]; thisMonth: string[] };
};
type PostResult = {
  posts: {
    format: string;
    hook: string;
    body: string;
    cta: string;
    fullPost: string;
    whyItWorks: string;
    bestTime: string;
    hashtags: string[];
  }[];
  contentStrategy: string;
  profileNotes: string;
};

export default function Home() {
  const [tool, setTool] = useState<Tool>('home');
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [error, setError] = useState('');

  const profileSteps = ['Reading your profile...', 'Scoring each section...', 'Writing optimized content...', 'Generating keywords & tips...', 'Building your report...'];
  const postSteps = ['Analyzing your topic...', 'Crafting Hook Story post...', 'Writing Listicle & Story posts...', 'Generating Opinion & Tips posts...', 'Finalizing your content...'];
  const [profileResult, setProfileResult] = useState<ProfileResult | null>(null);
  const [postResult, setPostResult] = useState<PostResult | null>(null);

  // Profile form
  const [headline, setHeadline] = useState('');
  const [about, setAbout] = useState('');
  const [experience, setExperience] = useState('');
  const [skills, setSkills] = useState('');
  const [education, setEducation] = useState('');
  const [goal, setGoal] = useState('get clients');

  // Post form
  const [postTopic, setPostTopic] = useState('');
  const [postBackground, setPostBackground] = useState('');
  const [postGoal, setPostGoal] = useState('get clients');
  const [industry, setIndustry] = useState('');

  async function runProfileOptimizer() {
    if (!headline && !about) { setError('Please fill in at least your headline and about section.'); return; }
    setLoading(true); setError(''); setProfileResult(null); setLoadingStep(0);
    const stepInterval = setInterval(() => setLoadingStep(s => Math.min(s + 1, profileSteps.length - 1)), 2500);
    try {
      const GEMINI_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY || '';
      if (!GEMINI_KEY) throw new Error('Gemini API key not configured');
      const userPrompt = `Optimize this LinkedIn profile for goal: ${goal}

CURRENT HEADLINE: ${headline || 'not provided'}
CURRENT ABOUT: ${about || 'not provided'}
CURRENT EXPERIENCE: ${experience || 'not provided'}
CURRENT SKILLS: ${skills || 'not provided'}
EDUCATION: ${education || 'not provided'}

Analyze every section and return this exact JSON:
{
  "overallScore": 62,
  "headlineScore": 70,
  "aboutScore": 55,
  "experienceScore": 60,
  "skillsScore": 65,
  "summary": "brutally honest 2-3 sentence verdict",
  "optimizedHeadline": "complete optimized headline ready to copy paste",
  "optimizedAbout": "complete rewritten about section — minimum 1500 characters, opens with hook not I am, buyer-focused, keyword-rich throughout, ends with clear CTA",
  "optimizedExperience": ["Role Title at Company — rewritten bullet point with action verb + result + number"],
  "optimizedSkills": ["skill 1","skill 2","skill 3","skill 4","skill 5","skill 6","skill 7","skill 8","skill 9","skill 10","skill 11","skill 12","skill 13","skill 14","skill 15"],
  "keywordsToAdd": ["keyword 1","keyword 2","keyword 3","keyword 4","keyword 5"],
  "keywordsToRemove": ["weak word 1","word 2","word 3"],
  "profileChecks": [
    {"section":"Headline","status":"fail","issue":"specific problem found in the text","fix":"exact copy-paste fix ready to apply"},
    {"section":"About Section","status":"fail","issue":"specific problem found in the text","fix":"exact fix"},
    {"section":"Experience Descriptions","status":"warn","issue":"problem found or cannot verify","fix":"exact fix"},
    {"section":"Skills Count","status":"warn","issue":"problem found or cannot verify","fix":"exact fix"},
    {"section":"Profile Photo","status":"warn","issue":"Cannot verify from text input — a professional headshot increases views by 21x","fix":"Ensure your photo is a clear headshot, well-lit, plain background, natural smile. Update at linkedin.com/in/yourprofile"},
    {"section":"Background Banner","status":"warn","issue":"Cannot verify from text input — most profiles leave this as default","fix":"Create a custom 1584x396px banner on Canva showing your skills, title, and a contact detail"},
    {"section":"Custom URL","status":"warn","issue":"Cannot verify from text input — default URLs look unprofessional","fix":"Go to Edit public profile and URL — set to linkedin.com/in/yourfirstnamelastname"},
    {"section":"Open to Work vs Providing Services","status":"warn","issue":"Cannot verify from text input — if freelancing, switch from Open to Work to Providing Services","fix":"Go to your profile, click the Open to badge, switch to Providing Services to attract clients instead of employers"},
    {"section":"Recommendations","status":"warn","issue":"Cannot verify from text input — profiles with 3+ recommendations convert significantly better","fix":"Message 3 former colleagues or clients this week and ask for a short LinkedIn recommendation"}
  ],
  "connectionTips": ["specific tip to grow connections fast 1","tip 2","tip 3","tip 4","tip 5"],
  "visibilityTips": ["specific LinkedIn visibility tip 1","tip 2","tip 3","tip 4","tip 5"],
  "nextActions": {
    "today": ["specific action 1","specific action 2","specific action 3"],
    "thisWeek": ["specific action 1","specific action 2","specific action 3"],
    "thisMonth": ["specific action 1","specific action 2","specific action 3"]
  }
}`;
      const res = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_KEY}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              systemInstruction: { parts: [{ text: SYSTEM_PROFILE }] },
              contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
              generationConfig: { temperature: 0.4, maxOutputTokens: 65000, responseMimeType: 'application/json' },
            }),
          }
      );
      const d = await res.json();
      if (d.error) throw new Error(`Gemini error: ${d.error.message}`);
      const raw = d.candidates?.[0]?.content?.parts?.[0]?.text || '';
      if (!raw) throw new Error('Empty response from Gemini');
      const cleaned = raw.replace(/```json\s*/gi, '').replace(/```\s*/gi, '').trim();
      const start = cleaned.indexOf('{'); const end = cleaned.lastIndexOf('}');
      if (start === -1 || end === -1) throw new Error('Invalid JSON from Gemini');
      setProfileResult(JSON.parse(cleaned.slice(start, end + 1)));
    } catch(e: unknown) {
      setError(e instanceof Error ? e.message : 'Something went wrong');
    }
    clearInterval(stepInterval);
    setLoading(false);
  }

  async function runPostGenerator() {
    if (!postTopic) { setError('Please enter a topic.'); return; }
    setLoading(true); setError(''); setPostResult(null); setLoadingStep(0);
    const stepInterval = setInterval(() => setLoadingStep(s => Math.min(s + 1, postSteps.length - 1)), 2500);
    try {
      const GEMINI_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY || '';
      if (!GEMINI_KEY) throw new Error('Gemini API key not configured');
      const userPrompt = `Generate 5 viral LinkedIn posts for this person.

TOPIC/STORY: ${postTopic}
BACKGROUND: ${postBackground || 'freelance developer'}
INDUSTRY: ${industry || 'Technology'}
GOAL WITH POSTS: ${postGoal}

Create 5 posts in these exact formats: Hook Story, Listicle, Personal Story, Controversial Opinion, Value/Tips.

Return this exact JSON:
{
  "contentStrategy": "specific 1-2 sentence strategy for this person's goal and audience",
  "profileNotes": "one specific tip about their profile based on their background",
  "posts": [
    {
      "format": "Hook Story Post",
      "hook": "The single first line — must work without clicking see more. Max 150 chars.",
      "body": "The full body. Short punchy sentences. One idea per line. White space between paragraphs. 800-1200 characters.",
      "cta": "One specific question or call to action that drives comments",
      "fullPost": "hook + double newline + body + double newline + cta + double newline + hashtags all combined ready to copy paste",
      "whyItWorks": "specific reason this format will perform well for their goal",
      "bestTime": "Tuesday 8am or similar specific recommendation",
      "hashtags": ["#hashtag1","#hashtag2","#hashtag3"]
    }
  ]
}`;
      const res = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_KEY}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              systemInstruction: { parts: [{ text: SYSTEM_POSTS }] },
              contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
              generationConfig: { temperature: 0.4, maxOutputTokens: 32000, responseMimeType: 'application/json' },
            }),
          }
      );
      const d = await res.json();
      if (d.error) throw new Error(`Gemini error: ${d.error.message}`);
      const raw = d.candidates?.[0]?.content?.parts?.[0]?.text || '';
      if (!raw) throw new Error('Empty response from Gemini');
      const cleaned = raw.replace(/```json\s*/gi, '').replace(/```\s*/gi, '').trim();
      const start = cleaned.indexOf('{'); const end = cleaned.lastIndexOf('}');
      if (start === -1 || end === -1) throw new Error('Invalid JSON from Gemini');
      setPostResult(JSON.parse(cleaned.slice(start, end + 1)));
    } catch(e: unknown) {
      setError(e instanceof Error ? e.message : 'Something went wrong');
    }
    clearInterval(stepInterval);
    setLoading(false);
  }

  function copy(text: string) {
    navigator.clipboard.writeText(text);
  }

  async function downloadPDF() {
    if (!profileResult) return;
    if (!(window as any).jspdf) {
      await new Promise<void>((resolve, reject) => {
        const s = document.createElement('script');
        s.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
        s.onload = () => resolve(); s.onerror = reject;
        document.head.appendChild(s);
      });
    }
    const { jsPDF } = (window as any).jspdf;
    const doc: any = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const W = 210, H = 297, ML = 18, MR = 18, cW = W - ML - MR;
    let y = 0;

    // --- HELPERS ---
    function np() { doc.addPage(); y = 20; }
    function cy(n: number) { if (y + n > H - 18) np(); }
    function cl(t: string) {
      return (t || '')
          .replace(/\*\*([^*]+)\*\*/g,'$1')
          .replace(/\*([^*]+)\*/g,'$1')
          .replace(/\*/g,'')
          .replace(/✓/g,'+').replace(/✗/g,'x').replace(/→/g,'>').replace(/←/g,'<')
          .replace(/[\u2018\u2019]/g,"'").replace(/[\u201c\u201d]/g,'"')
          .replace(/[\u2013\u2014]/g,'-').replace(/\u2192/g,'>').replace(/\u2022/g,'-')
          .replace(/[^\x20-\x7E\xA0-\xFF]/g,' ')
          .replace(/  +/g,' ')
          .trim();
    }
    function wrap(t: string, w: number, fs: number) { doc.setFontSize(fs); return doc.splitTextToSize(cl(t), w); }
    function scoreColor(s: number): [number,number,number] { return s >= 80 ? [22,163,74] : s >= 60 ? [202,138,4] : [220,38,38]; }
    function statusColor(s: string): [number,number,number] { return s==='pass'?[22,163,74]:s==='warn'?[202,138,4]:[220,38,38]; }
    function statusBg(s: string): [number,number,number] { return s==='pass'?[240,253,244]:s==='warn'?[254,252,232]:[254,242,242]; }

    function sectionHeader(title: string, subtitle?: string) {
      cy(16);
      doc.setFillColor(30, 64, 175); doc.roundedRect(ML, y, cW, 10, 2, 2, 'F');
      doc.setTextColor(255,255,255); doc.setFontSize(9); doc.setFont('helvetica','bold');
      doc.text(title, ML+6, y+7);
      if (subtitle) {
        doc.setFontSize(7); doc.setFont('helvetica','normal');
        doc.text(subtitle, W-MR-2, y+7, { align: 'right' });
      }
      y += 14;
    }

    function scoreBox(label: string, score: number, x: number, bY: number, bW: number) {
      const col = scoreColor(score);
      doc.setFillColor(248,250,252); doc.roundedRect(x, bY, bW, 22, 3, 3, 'F');
      doc.setDrawColor(...col); doc.setLineWidth(0.5); doc.roundedRect(x, bY, bW, 22, 3, 3, 'S');
      doc.setTextColor(...col); doc.setFontSize(16); doc.setFont('helvetica','bold');
      doc.text(String(score), x+bW/2, bY+13, { align:'center' });
      doc.setFontSize(6); doc.setTextColor(100,116,139); doc.setFont('helvetica','normal');
      doc.text(label.toUpperCase(), x+bW/2, bY+19, { align:'center' });
    }

    function footer(p: number, t: number) {
      doc.setPage(p);
      doc.setDrawColor(226,232,240); doc.setLineWidth(0.3);
      doc.line(ML, H-12, W-MR, H-12);
      doc.setTextColor(148,163,184); doc.setFontSize(7); doc.setFont('helvetica','normal');
      doc.text('LinkedPro AI — LinkedIn Profile Optimization Report', ML, H-7);
      doc.text(`Page ${p} of ${t}`, W/2, H-7, { align:'center' });
      doc.text(new Date().toLocaleDateString('en-US',{year:'numeric',month:'short',day:'numeric'}), W-MR, H-7, { align:'right' });
    }

    // ═══════════════════════════════════════
    // PAGE 1 — COVER
    // ═══════════════════════════════════════
    doc.setFillColor(255,255,255); doc.rect(0,0,W,H,'F');

    // Top accent bar
    doc.setFillColor(30,64,175); doc.rect(0,0,W,3,'F');

    // Logo area
    doc.setFillColor(30,64,175); doc.roundedRect(ML, 14, 12, 12, 2, 2, 'F');
    doc.setTextColor(255,255,255); doc.setFontSize(9); doc.setFont('helvetica','bold');
    doc.text('LP', ML+6, 22, { align:'center' });
    doc.setTextColor(30,64,175); doc.setFontSize(14); doc.setFont('helvetica','bold');
    doc.text('LinkedPro', ML+16, 22);
    doc.setTextColor(100,116,139); doc.setFontSize(8); doc.setFont('helvetica','normal');
    doc.text('AI Profile Optimizer', ML+16, 28);

    // Title section
    doc.setDrawColor(226,232,240); doc.setLineWidth(0.3);
    doc.line(ML, 36, W-MR, 36);
    doc.setTextColor(15,23,42); doc.setFontSize(22); doc.setFont('helvetica','bold');
    doc.text('LinkedIn Profile', ML, 52);
    doc.text('Optimization Report', ML, 63);
    doc.setFillColor(30,64,175); doc.rect(ML, 68, 40, 2, 'F');
    doc.setTextColor(100,116,139); doc.setFontSize(9); doc.setFont('helvetica','normal');
    doc.text('Powered by LinkedPro', ML, 76);
    doc.text(new Date().toLocaleDateString('en-US',{weekday:'long',year:'numeric',month:'long',day:'numeric'}), ML, 83);

    // Overall score — big circle area
    const scoreVal = profileResult.overallScore;
    const sCol = scoreColor(scoreVal);
    doc.setFillColor(248,250,252); doc.roundedRect(W-MR-52, 38, 52, 52, 4, 4, 'F');
    doc.setDrawColor(...sCol); doc.setLineWidth(1); doc.roundedRect(W-MR-52, 38, 52, 52, 4, 4, 'S');
    doc.setTextColor(...sCol); doc.setFontSize(28); doc.setFont('helvetica','bold');
    doc.text(String(scoreVal), W-MR-26, 65, { align:'center' });
    doc.setFontSize(8); doc.setTextColor(100,116,139); doc.setFont('helvetica','normal');
    doc.text('/100', W-MR-26, 72, { align:'center' });
    doc.text('OVERALL SCORE', W-MR-26, 78, { align:'center' });
    doc.setFontSize(7);
    doc.text(scoreVal >= 80 ? 'Excellent' : scoreVal >= 60 ? 'Good' : scoreVal >= 40 ? 'Needs Work' : 'Critical', W-MR-26, 84, { align:'center' });

    // Sub scores row
    const subScores = [
      {l:'Headline', v:profileResult.headlineScore},
      {l:'About', v:profileResult.aboutScore},
      {l:'Experience', v:profileResult.experienceScore},
      {l:'Skills', v:profileResult.skillsScore},
    ];
    const sbW = (cW - 9) / 4;
    subScores.forEach((s, i) => scoreBox(s.l, s.v, ML + i*(sbW+3), 97, sbW));

    // Summary box
    doc.setFillColor(239,246,255); doc.roundedRect(ML, 126, cW, 8, 2, 2, 'F');
    doc.setTextColor(30,64,175); doc.setFontSize(8); doc.setFont('helvetica','bold');
    doc.text('AUDIT SUMMARY', ML+5, 132);
    const sumLines = wrap(profileResult.summary, cW-10, 8.5);
    const sumH = sumLines.length * 5.5 + 16;
    doc.setFillColor(255,255,255); doc.setDrawColor(226,232,240); doc.setLineWidth(0.3);
    doc.roundedRect(ML, 134, cW, sumH, 2, 2, 'FD');
    doc.setTextColor(51,65,85); doc.setFont('helvetica','normal');
    sumLines.forEach((l: string, i: number) => doc.text(l, ML+5, 142+i*5.5));

    // What this report covers box
    const coverY = 134 + sumH + 10;
    doc.setFillColor(240,253,244); doc.setDrawColor(187,247,208); doc.setLineWidth(0.3);
    doc.roundedRect(ML, coverY, cW, 42, 3, 3, 'FD');
    doc.setTextColor(22,163,74); doc.setFontSize(8); doc.setFont('helvetica','bold');
    doc.text('WHAT THIS REPORT COVERS', ML+5, coverY+8);
    doc.setTextColor(21,128,61); doc.setFontSize(7.5); doc.setFont('helvetica','normal');
    ['Headline — quality, keywords, formula, and full optimized rewrite',
      'About Section — hook, buyer focus, keyword density, CTA, and full rewrite',
      'Experience — action verbs, metrics, impact statements, per-role rewrites',
      'Skills — strategic recommendations based on your industry and goal',
      'Keywords — high-value terms to add and weak terms to remove',
    ].forEach((t, i) => {
      doc.setFillColor(22,163,74); doc.circle(ML+6, coverY+14+i*5.5, 2, 'F');
      doc.setTextColor(255,255,255); doc.setFontSize(6); doc.setFont('helvetica','bold');
      doc.text('+', ML+6, coverY+15.5+i*5.5, { align:'center' });
      doc.setTextColor(21,128,61); doc.setFontSize(7.5); doc.setFont('helvetica','normal');
      doc.text(t, ML+11, coverY+16+i*5.5);
    });

    // What requires manual check box
    const manualY = coverY + 50;
    doc.setFillColor(254,252,232); doc.setDrawColor(253,230,138); doc.setLineWidth(0.3);
    doc.roundedRect(ML, manualY, cW, 36, 3, 3, 'FD');
    doc.setTextColor(202,138,4); doc.setFontSize(8); doc.setFont('helvetica','bold');
    doc.text('REQUIRES MANUAL VERIFICATION (Cannot be analyzed from text)', ML+5, manualY+8);
    doc.setFontSize(7.5); doc.setFont('helvetica','normal');
    ['Profile photo, background banner, and custom URL — visual elements not accessible from text input',
      'Connection count, recommendations, Creator Mode, and Featured section',
      'Open to Work vs Providing Services setting — check your profile settings',
      'All items above are flagged as WARN in Section 4 with exact fix instructions',
    ].forEach((t, i) => {
      doc.setTextColor(202,138,4); doc.text('!', ML+5, manualY+16+i*5.5);
      doc.setTextColor(161,98,7); doc.text(t, ML+11, manualY+16+i*5.5);
    });

    // ═══════════════════════════════════════
    // PAGE 2 — OPTIMIZED HEADLINE & ABOUT
    // ═══════════════════════════════════════
    doc.addPage(); y = 20;
    doc.setFillColor(255,255,255); doc.rect(0,0,W,H,'F');
    doc.setFillColor(30,64,175); doc.rect(0,0,W,3,'F');

    sectionHeader('SECTION 1 — OPTIMIZED HEADLINE', `Score: ${profileResult.headlineScore}/100`);

    // Current headline
    cy(28);
    doc.setFillColor(254,242,242); doc.setDrawColor(254,202,202); doc.setLineWidth(0.3);
    doc.roundedRect(ML, y, cW, 20, 3, 3, 'FD');
    doc.setTextColor(220,38,38); doc.setFontSize(7); doc.setFont('helvetica','bold');
    doc.text('CURRENT HEADLINE', ML+5, y+7);
    doc.setTextColor(127,29,29); doc.setFont('helvetica','normal'); doc.setFontSize(8.5);
    wrap(headline || 'Not provided', cW-10, 8.5).slice(0,2).forEach((l:string,i:number) => doc.text(l, ML+5, y+14+i*5));
    y += 26;

    // Arrow
    doc.setTextColor(100,116,139); doc.setFontSize(12);
    doc.text('↓  Optimized to:', ML, y+6);
    y += 10;

    // Optimized headline
    cy(28);
    doc.setFillColor(240,253,244); doc.setDrawColor(187,247,208); doc.setLineWidth(0.3);
    doc.roundedRect(ML, y, cW, 22, 3, 3, 'FD');
    doc.setTextColor(22,163,74); doc.setFontSize(7); doc.setFont('helvetica','bold');
    doc.text('OPTIMIZED HEADLINE — COPY & PASTE THIS', ML+5, y+7);
    doc.setTextColor(20,83,45); doc.setFont('helvetica','bold'); doc.setFontSize(9);
    wrap(profileResult.optimizedHeadline, cW-10, 9).slice(0,2).forEach((l:string,i:number) => doc.text(l, ML+5, y+14+i*5.5));
    y += 28;

    // Headline tips
    cy(10);
    doc.setTextColor(100,116,139); doc.setFontSize(7.5); doc.setFont('helvetica','italic');
    doc.text('Tip: LinkedIn allows 220 characters. Include your primary skill, a specific outcome, and a trust signal.', ML, y+5);
    y += 12;

    // About section header
    sectionHeader('SECTION 2 — OPTIMIZED ABOUT SECTION', `Score: ${profileResult.aboutScore}/100`);

    // About explanation
    cy(12);
    doc.setFillColor(239,246,255); doc.roundedRect(ML, y, cW, 10, 2, 2, 'F');
    doc.setTextColor(30,64,175); doc.setFontSize(7.5); doc.setFont('helvetica','normal');
    doc.text('The first 3 lines appear before "See more". They must hook the reader immediately. Copy the full text below into your About section.', ML+5, y+7, { maxWidth: cW-10 });
    y += 14;

    // Optimized about — full text, properly paginated
    const aboutLines = wrap(profileResult.optimizedAbout, cW-10, 8);
    let aboutLineIdx = 0;
    let isFirstAboutBox = true;

    while (aboutLineIdx < aboutLines.length) {
      cy(30);
      const availH = H - y - 22;
      const linesPerBox = Math.floor((availH - 14) / 5);
      const chunkLines = aboutLines.slice(aboutLineIdx, aboutLineIdx + linesPerBox);
      const boxH = chunkLines.length * 5 + 14;

      doc.setFillColor(250,251,252); doc.setDrawColor(226,232,240); doc.setLineWidth(0.3);
      doc.roundedRect(ML, y, cW, boxH, 3, 3, 'FD');
      doc.setTextColor(22,163,74); doc.setFontSize(7); doc.setFont('helvetica','bold');
      doc.text(isFirstAboutBox ? 'OPTIMIZED ABOUT SECTION — COPY & PASTE THIS' : 'OPTIMIZED ABOUT (CONTINUED)', ML+5, y+7);
      doc.setTextColor(30,41,59); doc.setFont('helvetica','normal'); doc.setFontSize(8);
      chunkLines.forEach((l: string, idx: number) => doc.text(l, ML+5, y+13+idx*5));
      y += boxH + 6;
      aboutLineIdx += linesPerBox;
      isFirstAboutBox = false;
      if (aboutLineIdx < aboutLines.length) { doc.addPage(); y = 20; doc.setFillColor(255,255,255); doc.rect(0,0,W,H,'F'); doc.setFillColor(30,64,175); doc.rect(0,0,W,3,'F'); }
    }

    // ═══════════════════════════════════════
    // PAGE 3 — EXPERIENCE REWRITES
    // ═══════════════════════════════════════
    doc.addPage(); y = 20;
    doc.setFillColor(255,255,255); doc.rect(0,0,W,H,'F');
    doc.setFillColor(30,64,175); doc.rect(0,0,W,3,'F');

    sectionHeader('SECTION 3 — OPTIMIZED EXPERIENCE BULLETS', `Score: ${profileResult.experienceScore}/100`);

    cy(10);
    doc.setFillColor(239,246,255); doc.roundedRect(ML, y, cW, 9, 2, 2, 'F');
    doc.setTextColor(30,64,175); doc.setFontSize(7.5); doc.setFont('helvetica','normal');
    doc.text('Add these as bullet points under each role. Start every bullet with an action verb and include a result or number.', ML+5, y+6, { maxWidth: cW-10 });
    y += 13;

    profileResult.optimizedExperience?.forEach((exp: string, i: number) => {
      const lines = wrap(exp, cW-14, 8);
      const bh = Math.max(16, lines.length * 5 + 10);
      cy(bh + 4);
      doc.setFillColor(248,250,252); doc.setDrawColor(226,232,240); doc.setLineWidth(0.3);
      doc.roundedRect(ML, y, cW, bh, 2, 2, 'FD');
      // Number badge
      const numCol = scoreColor(75);
      doc.setFillColor(...numCol); doc.circle(ML+5, y+bh/2, 3.5, 'F');
      doc.setTextColor(255,255,255); doc.setFontSize(7); doc.setFont('helvetica','bold');
      doc.text(String(i+1), ML+5, y+bh/2+2.5, { align:'center' });
      doc.setTextColor(30,41,59); doc.setFont('helvetica','normal'); doc.setFontSize(8);
      lines.forEach((l: string, j: number) => doc.text(l, ML+12, y+9+j*5));
      y += bh + 4;
    });

    // Skills section
    cy(16);
    sectionHeader('SECTION 4 — RECOMMENDED SKILLS', `${profileResult.optimizedSkills?.length || 0} skills`);

    cy(10);
    doc.setFillColor(239,246,255); doc.roundedRect(ML, y, cW, 9, 2, 2, 'F');
    doc.setTextColor(30,64,175); doc.setFontSize(7.5); doc.setFont('helvetica','normal');
    doc.text('Add these in your Skills section. LinkedIn allows 50 — the more relevant skills, the higher you rank in searches.', ML+5, y+6, { maxWidth: cW-10 });
    y += 13;

    const skillCols = 4; const skillW2 = (cW - (skillCols-1)*3) / skillCols;
    let skillRow = 0, skillCol = 0;
    profileResult.optimizedSkills?.forEach((s: string) => {
      const sx2 = ML + skillCol * (skillW2 + 3);
      const sy2 = y + skillRow * 10;
      if (sy2 + 9 > H - 20) { doc.addPage(); doc.setFillColor(255,255,255); doc.rect(0,0,W,H,'F'); doc.setFillColor(30,64,175); doc.rect(0,0,W,3,'F'); y = 20; skillRow = 0; }
      const finalSy = y + skillRow * 10;
      doc.setFillColor(239,246,255); doc.roundedRect(sx2, finalSy, skillW2, 7, 1, 1, 'F');
      doc.setDrawColor(147,197,253); doc.setLineWidth(0.3); doc.roundedRect(sx2, finalSy, skillW2, 7, 1, 1, 'S');
      doc.setTextColor(30,64,175); doc.setFontSize(6.5); doc.setFont('helvetica','normal');
      doc.text(cl(s), sx2 + skillW2/2, finalSy+5, { align:'center', maxWidth: skillW2-2 });
      skillCol++;
      if (skillCol >= skillCols) { skillCol = 0; skillRow++; }
    });
    y += (skillRow + (skillCol > 0 ? 1 : 0)) * 10 + 6;

    // Keywords
    cy(16);
    sectionHeader('SECTION 5 — KEYWORDS');

    const kwHalf = (cW - 6) / 2;
    // Add keywords
    cy(10);
    doc.setFillColor(240,253,244); doc.setDrawColor(187,247,208); doc.setLineWidth(0.3);
    const addH = (profileResult.keywordsToAdd?.length || 0) * 7 + 14;
    doc.roundedRect(ML, y, kwHalf, addH, 2, 2, 'FD');
    doc.setTextColor(22,163,74); doc.setFontSize(7.5); doc.setFont('helvetica','bold');
    doc.text('ADD THESE KEYWORDS', ML+4, y+8);
    doc.setFont('helvetica','normal');
    profileResult.keywordsToAdd?.forEach((k: string, i: number) => {
      doc.setTextColor(22,163,74); doc.text('+', ML+4, y+15+i*7);
      doc.setTextColor(21,128,61); doc.text(cl(k), ML+9, y+15+i*7);
    });
    // Remove keywords
    const rmH = (profileResult.keywordsToRemove?.length || 0) * 7 + 14;
    doc.setFillColor(254,242,242); doc.setDrawColor(254,202,202);
    doc.roundedRect(ML+kwHalf+6, y, kwHalf, rmH, 2, 2, 'FD');
    doc.setTextColor(220,38,38); doc.setFontSize(7.5); doc.setFont('helvetica','bold');
    doc.text('REMOVE / REPLACE THESE', ML+kwHalf+10, y+8);
    doc.setFont('helvetica','normal');
    profileResult.keywordsToRemove?.forEach((k: string, i: number) => {
      doc.setTextColor(220,38,38); doc.text('-', ML+kwHalf+10, y+15+i*7);
      doc.setTextColor(153,27,27); doc.text(cl(k), ML+kwHalf+15, y+15+i*7);
    });
    y += Math.max(addH, rmH) + 8;

    // ═══════════════════════════════════════
    // PAGE 4+ — PROFILE CHECKS
    // ═══════════════════════════════════════
    cy(20);
    sectionHeader('SECTION 6 — PROFILE CHECKS');

    // Legend
    cy(10);
    doc.setFontSize(7); doc.setFont('helvetica','normal');
    [['FAIL', [220,38,38]], ['WARN', [202,138,4]], ['PASS', [22,163,74]]].forEach(([label, col]: any, i: number) => {
      doc.setFillColor(...col); doc.roundedRect(ML + i*28, y, 24, 6, 1, 1, 'F');
      doc.setTextColor(255,255,255); doc.text(label, ML+12+i*28, y+4.5, { align:'center' });
    });
    doc.setTextColor(100,116,139); doc.setFontSize(7);
    doc.text('FAIL = problem found in your text   WARN = cannot verify from text — check manually   PASS = looks good', ML+90, y+4.5);
    y += 12;

    profileResult.profileChecks?.forEach((c: {section:string,status:string,issue:string,fix:string}) => {
      const issueL = wrap(c.issue, cW-30, 7.5);
      const fixL = wrap(c.fix, cW-30, 7.5);
      const bh = Math.max(26, issueL.length*5 + fixL.length*5 + 22);
      cy(bh + 4);
      const bgCol = statusBg(c.status);
      doc.setFillColor(...bgCol); doc.setDrawColor(226,232,240); doc.setLineWidth(0.3);
      doc.roundedRect(ML, y, cW, bh, 3, 3, 'FD');
      // Status badge
      const stCol = statusColor(c.status);
      doc.setFillColor(...stCol); doc.roundedRect(ML+4, y+4, 18, 6, 2, 2, 'F');
      doc.setTextColor(255,255,255); doc.setFontSize(6.5); doc.setFont('helvetica','bold');
      doc.text(c.status.toUpperCase(), ML+13, y+8.5, { align:'center' });
      // Section name
      doc.setTextColor(15,23,42); doc.setFontSize(9); doc.setFont('helvetica','bold');
      doc.text(cl(c.section), ML+26, y+9);
      // Issue text
      doc.setTextColor(71,85,105); doc.setFont('helvetica','normal'); doc.setFontSize(7.5);
      issueL.forEach((l:string,i:number) => doc.text(l, ML+6, y+17+i*5));
      // Fix label + text
      const fy = y + 17 + issueL.length*5 + 3;
      doc.setFillColor(22,163,74); doc.roundedRect(ML+6, fy-4, 10, 5, 1, 1, 'F');
      doc.setTextColor(255,255,255); doc.setFontSize(6); doc.setFont('helvetica','bold');
      doc.text('FIX', ML+11, fy, { align:'center' });
      doc.setTextColor(21,128,61); doc.setFont('helvetica','normal'); doc.setFontSize(7.5);
      fixL.forEach((l:string,i:number) => doc.text(l, ML+20, fy+i*5));
      y += bh + 5;
    });

    // ═══════════════════════════════════════
    // TIPS & ACTION PLAN
    // ═══════════════════════════════════════
    cy(20);
    sectionHeader('SECTION 7 — VISIBILITY & CONNECTION TIPS');

    const drawTipList = (tips: string[], color: [number,number,number]) => {
      tips?.forEach((t: string) => {
        const lines = wrap(t, cW-16, 8);
        const bh = Math.max(14, lines.length * 5 + 8);
        cy(bh + 3);
        doc.setFillColor(248,250,252); doc.setDrawColor(226,232,240); doc.setLineWidth(0.2);
        doc.roundedRect(ML, y, cW, bh, 2, 2, 'FD');
        doc.setFillColor(...color); doc.circle(ML+6, y+bh/2, 2, 'F');
        doc.setTextColor(30,41,59); doc.setFontSize(8); doc.setFont('helvetica','normal');
        lines.forEach((l:string,i:number) => doc.text(l, ML+12, y+8+i*5));
        y += bh + 3;
      });
    };

    cy(10);
    doc.setTextColor(30,64,175); doc.setFontSize(8); doc.setFont('helvetica','bold');
    doc.text('Visibility Tips', ML, y+5); y += 8;
    drawTipList(profileResult.visibilityTips, [30,64,175]);
    cy(8);
    doc.setTextColor(22,163,74); doc.setFontSize(8); doc.setFont('helvetica','bold');
    doc.text('Connection Growth Tips', ML, y+5); y += 8;
    drawTipList(profileResult.connectionTips, [22,163,74]);

    cy(20);
    sectionHeader('SECTION 8 — ACTION PLAN');

    [
      {label:'DO TODAY', items:profileResult.nextActions?.today, color:[220,38,38] as [number,number,number], bg:[254,242,242] as [number,number,number]},
      {label:'THIS WEEK', items:profileResult.nextActions?.thisWeek, color:[202,138,4] as [number,number,number], bg:[254,252,232] as [number,number,number]},
      {label:'THIS MONTH', items:profileResult.nextActions?.thisMonth, color:[22,163,74] as [number,number,number], bg:[240,253,244] as [number,number,number]},
    ].forEach((g: {label:string,items:string[]|undefined,color:[number,number,number],bg:[number,number,number]}) => {
      cy(12);
      doc.setFillColor(...g.color); doc.roundedRect(ML, y, 28, 7, 2, 2, 'F');
      doc.setTextColor(255,255,255); doc.setFontSize(7.5); doc.setFont('helvetica','bold');
      doc.text(g.label, ML+14, y+5.5, { align:'center' });
      y += 10;
      g.items?.forEach((a: string) => {
        const lines = wrap(a, cW-14, 8);
        const bh = Math.max(14, lines.length*5+8);
        cy(bh+3);
        doc.setFillColor(...g.bg); doc.setDrawColor(226,232,240); doc.setLineWidth(0.2);
        doc.roundedRect(ML, y, cW, bh, 2, 2, 'FD');
        doc.setFillColor(...g.color); doc.circle(ML+6, y+bh/2, 2, 'F');
        doc.setTextColor(30,41,59); doc.setFont('helvetica','normal'); doc.setFontSize(8);
        lines.forEach((l:string,i:number) => doc.text(l, ML+12, y+8+i*5));
        y += bh+3;
      });
      y += 5;
    });

    // Final page — closing note
    cy(30);
    doc.setFillColor(30,64,175); doc.roundedRect(ML, y, cW, 28, 4, 4, 'F');
    doc.setTextColor(255,255,255); doc.setFontSize(11); doc.setFont('helvetica','bold');
    doc.text('Your profile is ready to be transformed.', ML+cW/2, y+11, { align:'center' });
    doc.setFontSize(8); doc.setFont('helvetica','normal');
    doc.text('Apply the rewrites above, check the manual verification items, and execute your action plan.', ML+cW/2, y+18, { align:'center' });
    doc.text('Questions? Visit linkedin-optimizer.vercel.app', ML+cW/2, y+24, { align:'center' });

    // All footers
    const total = doc.getNumberOfPages();
    for (let p = 1; p <= total; p++) footer(p, total);
    doc.save('linkedin-optimization-report.pdf');
  }

  async function downloadPostsPDF() {
    if (!postResult) return;
    if (!(window as any).jspdf) {
      await new Promise<void>((resolve, reject) => {
        const s = document.createElement('script');
        s.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
        s.onload = () => resolve(); s.onerror = reject;
        document.head.appendChild(s);
      });
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { jsPDF } = (window as any).jspdf;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const doc: any = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const W = 210, H = 297, M = 16, cW = 178;
    let y = 0;
    function np() { doc.addPage(); y = M; }
    function cy(n: number) { if (y + n > H - M) np(); }
    function cl(t: string) {
      return (t||'').replace(/\*\*([^*]+)\*\*/g,'$1').replace(/\*([^*]+)\*/g,'$1')
          .replace(/[\u2018\u2019]/g,"'").replace(/[\u201c\u201d]/g,'"')
          .replace(/[\u2013\u2014]/g,'-').replace(/\u2192/g,'>').replace(/\u2022/g,'-')
          .replace(/[^\x20-\x7E\xA0-\xFF]/g,'').trim();
    }
    function wrap(t: string, w: number, fs: number) { doc.setFontSize(fs); return doc.splitTextToSize(cl(t), w); }
    function footer(p: number, t: number) {
      doc.setPage(p);
      doc.setFillColor(0,100,255); doc.rect(0,H-8,W,8,'F');
      doc.setTextColor(255,255,255); doc.setFontSize(7);
      doc.text('LinkedPro AI — Post Generator', M, H-3);
      doc.text(`Page ${p} of ${t}`, W/2, H-3, { align:'center' });
      doc.text('linkedin-optimizer.vercel.app', W-M, H-3, { align:'right' });
    }

    // COVER
    doc.setFillColor(8,12,20); doc.rect(0,0,W,H,'F');
    doc.setFillColor(0,100,255); doc.rect(0,0,W,60,'F');
    doc.setTextColor(255,255,255); doc.setFontSize(20); doc.setFont('helvetica','bold');
    doc.text('LinkedIn Viral Posts', M, 26);
    doc.setFontSize(11); doc.setFont('helvetica','normal');
    doc.text('Generated by LinkedPro AI', M, 38);
    doc.setFontSize(9);
    doc.text(new Date().toLocaleDateString('en-US',{weekday:'long',year:'numeric',month:'long',day:'numeric'}), M, 50);
    // Strategy box
    doc.setFillColor(15,25,45); doc.roundedRect(M, 76, cW, 36, 4, 4, 'F');
    doc.setTextColor(0,180,120); doc.setFontSize(8); doc.setFont('helvetica','bold');
    doc.text('CONTENT STRATEGY', M+8, 86);
    doc.setTextColor(180,210,240); doc.setFont('helvetica','normal');
    wrap(postResult.contentStrategy, cW-16, 8.5).slice(0,3).forEach((l:string,i:number) => doc.text(l, M+8, 94+i*6));

    // One post per page
    postResult.posts?.forEach((p: {format:string,hook:string,body:string,cta:string,hashtags:string[],whyItWorks:string,bestTime:string,fullPost:string}, idx: number) => {
      doc.addPage(); y = M;
      doc.setFillColor(0,100,255); doc.rect(0,0,W,14,'F');
      doc.setTextColor(255,255,255); doc.setFontSize(10); doc.setFont('helvetica','bold');
      doc.text(`POST ${idx+1} — ${cl(p.format).toUpperCase()}`, M, 10); y = 22;

      // Best time badge
      doc.setFillColor(20,29,46); doc.roundedRect(W-M-50, 0, 52, 14, 0, 0, 'F');
      doc.setTextColor(100,160,255); doc.setFontSize(7);
      doc.text(`Best: ${cl(p.bestTime)}`, W-M-48, 9);

      // Hook
      const hookL = wrap(p.hook, cW-16, 10);
      const hookH = Math.max(20, hookL.length*7+14);
      cy(hookH+4);
      doc.setFillColor(230,240,255); doc.roundedRect(M, y, cW, hookH, 3, 3, 'F');
      doc.setFillColor(0,100,255); doc.rect(M, y, 3, hookH, 'F');
      doc.setTextColor(0,50,150); doc.setFontSize(7); doc.setFont('helvetica','bold');
      doc.text('HOOK (FIRST LINE)', M+7, y+8);
      doc.setTextColor(10,30,100); doc.setFont('helvetica','bold'); doc.setFontSize(10);
      hookL.forEach((l:string,i:number) => doc.text(l, M+7, y+15+i*7));
      y += hookH+6;

      // Body
      const bodyL = wrap(p.body, cW-16, 8);
      const bodyH = Math.max(30, bodyL.length*5+14);
      cy(20);
      doc.setFillColor(248,250,252); doc.roundedRect(M, y, cW, Math.min(bodyH, H-y-M-20), 3, 3, 'F');
      doc.setFillColor(80,120,200); doc.rect(M, y, 3, Math.min(bodyH, H-y-M-20), 'F');
      doc.setTextColor(50,80,150); doc.setFontSize(7); doc.setFont('helvetica','bold');
      doc.text('BODY', M+7, y+8);
      doc.setTextColor(40,50,70); doc.setFont('helvetica','normal'); doc.setFontSize(8);
      let by = y+14;
      for (const l of bodyL) {
        if (by+5 > H-M-20) { doc.addPage(); y=M; by=M; }
        doc.text(l, M+7, by); by+=5;
      }
      y = by+8;

      // CTA
      const ctaL = wrap(p.cta, cW-16, 9);
      const ctaH = Math.max(18, ctaL.length*6+12);
      cy(ctaH+4);
      doc.setFillColor(230,255,245); doc.roundedRect(M, y, cW, ctaH, 3, 3, 'F');
      doc.setFillColor(0,160,100); doc.rect(M, y, 3, ctaH, 'F');
      doc.setTextColor(0,100,60); doc.setFontSize(7); doc.setFont('helvetica','bold');
      doc.text('CALL TO ACTION', M+7, y+8);
      doc.setTextColor(0,80,50); doc.setFont('helvetica','normal'); doc.setFontSize(9);
      ctaL.forEach((l:string,i:number) => doc.text(l, M+7, y+14+i*6));
      y += ctaH+6;

      // Hashtags
      cy(14);
      doc.setTextColor(0,100,255); doc.setFontSize(9); doc.setFont('helvetica','bold');
      doc.text(p.hashtags?.join('  '), M, y+6);
      y += 14;

      // Why it works
      const whyL = wrap(p.whyItWorks, cW-16, 8);
      const whyH = Math.max(16, whyL.length*5+12);
      cy(whyH+4);
      doc.setFillColor(255,250,235); doc.roundedRect(M, y, cW, whyH, 3, 3, 'F');
      doc.setTextColor(150,100,0); doc.setFontSize(7); doc.setFont('helvetica','bold');
      doc.text('WHY THIS WORKS', M+7, y+8);
      doc.setTextColor(100,70,0); doc.setFont('helvetica','normal'); doc.setFontSize(7.5);
      whyL.forEach((l:string,i:number) => doc.text(l, M+7, y+14+i*5));
      y += whyH+6;
    });

    const total = doc.getNumberOfPages();
    for (let p=1; p<=total; p++) footer(p, total);
    doc.save('linkedin-viral-posts.pdf');
  }

  const scoreColor = (s: number) => s >= 80 ? '#00e5a0' : s >= 60 ? '#f59e0b' : '#ef4444';
  const statusColor = (s: string) => s === 'pass' ? '#00e5a0' : s === 'warn' ? '#f59e0b' : '#ef4444';

  return (
      <div style={{ minHeight: '100vh', background: '#080c14', color: '#e8edf5', fontFamily: "'DM Sans', 'Segoe UI', sans-serif" }}>

        {/* BG effects */}
        <div style={{ position: 'fixed', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
          <div style={{ position: 'absolute', top: '-20%', left: '-10%', width: 600, height: 600, background: 'radial-gradient(circle, rgba(0,100,255,0.08) 0%, transparent 70%)', borderRadius: '50%' }} />
          <div style={{ position: 'absolute', bottom: '-10%', right: '-5%', width: 500, height: 500, background: 'radial-gradient(circle, rgba(0,229,160,0.06) 0%, transparent 70%)', borderRadius: '50%' }} />
          <div style={{ position: 'absolute', top: '40%', left: '50%', width: 800, height: 2, background: 'linear-gradient(90deg, transparent, rgba(0,100,255,0.1), transparent)', transform: 'translateX(-50%)' }} />
        </div>

        <div style={{ position: 'relative', zIndex: 1 }}>

          {/* NAV */}
          <nav style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '0 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 32, height: 32, background: 'linear-gradient(135deg, #0064ff, #00e5a0)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 900 }}>L</div>
              <span style={{ fontWeight: 700, fontSize: 18, letterSpacing: -0.5 }}>Linked<span style={{ color: '#0064ff' }}>Pro</span></span>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => { setTool('home'); setProfileResult(null); setPostResult(null); setError(''); }} style={{ padding: '8px 16px', borderRadius: 8, border: 'none', background: 'transparent', color: '#64748b', fontSize: 13, cursor: 'pointer', fontWeight: 600 }}>← Home</button>
              {[{id:'profile',label:'Profile Optimizer'},{id:'posts',label:'Post Generator'}].map(t => (
                  <button key={t.id} onClick={() => { setTool(t.id as Tool); setError(''); }} style={{ padding: '8px 16px', borderRadius: 8, border: tool === t.id ? '1px solid #0064ff' : '1px solid rgba(255,255,255,0.1)', background: tool === t.id ? 'rgba(0,100,255,0.15)' : 'transparent', color: tool === t.id ? '#60a5fa' : '#94a3b8', cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>
                    {t.label}
                  </button>
              ))}
            </div>
          </nav>

          {/* HOME */}
          {tool === 'home' && (
              <div style={{ maxWidth: 900, margin: '0 auto', padding: '100px 40px', textAlign: 'center' }}>
                <div style={{ display: 'inline-block', padding: '6px 16px', borderRadius: 100, border: '1px solid rgba(0,100,255,0.3)', background: 'rgba(0,100,255,0.08)', color: '#60a5fa', fontSize: 12, fontWeight: 600, letterSpacing: 1, marginBottom: 32 }}>
                  AI-POWERED LINKEDIN GROWTH
                </div>
                <h1 style={{ fontSize: 'clamp(42px, 7vw, 80px)', fontWeight: 900, lineHeight: 1.05, letterSpacing: -2, margin: '0 0 24px' }}>
                  Your LinkedIn.<br />
                  <span style={{ background: 'linear-gradient(135deg, #0064ff, #00e5a0)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Completely Optimized.</span>
                </h1>
                <p style={{ fontSize: 18, color: '#64748b', maxWidth: 520, margin: '0 auto 48px', lineHeight: 1.7 }}>
                  Optimize your profile for maximum visibility. Generate viral posts that attract clients and opportunities.
                </p>
                <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
                  <button onClick={() => setTool('profile')} style={{ padding: '16px 32px', borderRadius: 12, background: 'linear-gradient(135deg, #0064ff, #0040cc)', border: 'none', color: 'white', fontSize: 16, fontWeight: 700, cursor: 'pointer', letterSpacing: -0.3 }}>
                    Optimize My Profile →
                  </button>
                  <button onClick={() => setTool('posts')} style={{ padding: '16px 32px', borderRadius: 12, background: 'transparent', border: '1px solid rgba(255,255,255,0.15)', color: '#e8edf5', fontSize: 16, fontWeight: 600, cursor: 'pointer' }}>
                    Generate Posts →
                  </button>
                </div>
                <div style={{ display: 'flex', gap: 24, justifyContent: 'center', marginTop: 64, flexWrap: 'wrap' }}>
                  {['Profile Score /100','Exact Rewrites','5 Viral Posts','PDF Report','100% Free'].map(f => (
                      <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#64748b', fontSize: 13 }}>
                        <span style={{ color: '#00e5a0' }}>✓</span> {f}
                      </div>
                  ))}
                </div>
              </div>
          )}

          {/* PROFILE OPTIMIZER */}
          {tool === 'profile' && (
              <div style={{ maxWidth: 800, margin: '0 auto', padding: '48px 24px' }}>
                <div style={{ marginBottom: 40 }}>
                  <h2 style={{ fontSize: 32, fontWeight: 800, letterSpacing: -1, margin: '0 0 8px' }}>Profile Optimizer</h2>
                  <p style={{ color: '#64748b', fontSize: 15 }}>Paste your current profile content. AI will score, rewrite and optimize everything for maximum LinkedIn visibility.</p>
                </div>

                {!profileResult ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                        <div>
                          <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#64748b', letterSpacing: 1, marginBottom: 8 }}>YOUR GOAL</label>
                          <select value={goal} onChange={e => setGoal(e.target.value)} style={{ width: '100%', padding: '12px 16px', borderRadius: 10, background: '#0f1623', border: '1px solid rgba(255,255,255,0.08)', color: '#e8edf5', fontSize: 14 }}>
                            <option value="get clients">Get freelance clients</option>
                            <option value="get job">Get hired for a job</option>
                            <option value="build brand">Build personal brand</option>
                            <option value="network">Grow network & connections</option>
                          </select>
                        </div>
                      </div>

                      {[
                        { label: 'CURRENT HEADLINE', val: headline, set: setHeadline, placeholder: 'e.g. Full Stack Developer | React & Next.js | Building web apps', hint: 'Max 220 chars on LinkedIn', multi: false },
                        { label: 'ABOUT / SUMMARY SECTION', val: about, set: setAbout, placeholder: 'Paste your full About section here...', hint: 'This is the most important section for SEO', multi: true },
                        { label: 'EXPERIENCE DESCRIPTIONS', val: experience, set: setExperience, placeholder: 'Paste your job titles, companies and descriptions...', hint: 'Include all roles you want optimized', multi: true },
                        { label: 'SKILLS (current list)', val: skills, set: setSkills, placeholder: 'e.g. React, JavaScript, Node.js, UI/UX Design...', hint: 'List all your current skills', multi: false },
                        { label: 'EDUCATION (optional)', val: education, set: setEducation, placeholder: 'e.g. BSc Computer Science, University of...', hint: 'Optional but helps with completeness score', multi: false },
                      ].map(f => (
                          <div key={f.label}>
                            <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#64748b', letterSpacing: 1, marginBottom: 8 }}>{f.label}</label>
                            {f.multi ? (
                                <textarea value={f.val} onChange={e => f.set(e.target.value)} placeholder={f.placeholder} rows={4} style={{ width: '100%', padding: '14px 16px', borderRadius: 10, background: '#0f1623', border: '1px solid rgba(255,255,255,0.08)', color: '#e8edf5', fontSize: 14, resize: 'vertical', boxSizing: 'border-box', lineHeight: 1.6 }} />
                            ) : (
                                <input value={f.val} onChange={e => f.set(e.target.value)} placeholder={f.placeholder} style={{ width: '100%', padding: '14px 16px', borderRadius: 10, background: '#0f1623', border: '1px solid rgba(255,255,255,0.08)', color: '#e8edf5', fontSize: 14, boxSizing: 'border-box' }} />
                            )}
                            <div style={{ fontSize: 11, color: '#475569', marginTop: 4 }}>{f.hint}</div>
                          </div>
                      ))}

                      {error && <div style={{ padding: '12px 16px', borderRadius: 10, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#ef4444', fontSize: 14 }}>{error}</div>}

                      {loading ? (
                          <div style={{ padding: '28px 24px', borderRadius: 16, background: '#0f1623', border: '1px solid rgba(0,100,255,0.2)', textAlign: 'center' }}>
                            <div style={{ fontSize: 32, marginBottom: 16 }}>⟳</div>
                            <div style={{ fontSize: 16, fontWeight: 700, color: '#e8edf5', marginBottom: 8 }}>{profileSteps[loadingStep]}</div>
                            <div style={{ fontSize: 13, color: '#475569', marginBottom: 20 }}>This takes 15-30 seconds — AI is writing your full rewrite</div>
                            <div style={{ display: 'flex', gap: 6, justifyContent: 'center' }}>
                              {profileSteps.map((_, i) => (
                                  <div key={i} style={{ width: i === loadingStep ? 24 : 8, height: 6, borderRadius: 3, background: i === loadingStep ? '#0064ff' : i < loadingStep ? '#00e5a0' : '#1e293b', transition: 'all 0.4s ease' }} />
                              ))}
                            </div>
                          </div>
                      ) : (
                          <button onClick={runProfileOptimizer} style={{ padding: '16px 32px', borderRadius: 12, background: 'linear-gradient(135deg, #0064ff, #0040cc)', border: 'none', color: 'white', fontSize: 16, fontWeight: 700, cursor: 'pointer', marginTop: 8 }}>
                            Optimize My LinkedIn Profile →
                          </button>
                      )}
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

                      <button onClick={() => setProfileResult(null)} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 18px', borderRadius: 10, background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: '#94a3b8', fontSize: 13, fontWeight: 600, cursor: 'pointer', width: 'fit-content' }}>← Back</button>

                      {/* SCORES */}
                      <div style={{ background: '#0f1623', borderRadius: 16, padding: 28, border: '1px solid rgba(255,255,255,0.06)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
                          <div>
                            <div style={{ fontSize: 13, color: '#64748b', marginBottom: 4 }}>OVERALL PROFILE SCORE</div>
                            <div style={{ fontSize: 52, fontWeight: 900, color: scoreColor(profileResult.overallScore), letterSpacing: -2 }}>{profileResult.overallScore}<span style={{ fontSize: 20, color: '#475569' }}>/100</span></div>
                          </div>
                          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                            {[
                              { label: 'Headline', score: profileResult.headlineScore },
                              { label: 'About', score: profileResult.aboutScore },
                              { label: 'Experience', score: profileResult.experienceScore },
                              { label: 'Skills', score: profileResult.skillsScore },
                            ].map(s => (
                                <div key={s.label} style={{ textAlign: 'center', background: '#141d2e', borderRadius: 10, padding: '12px 16px' }}>
                                  <div style={{ fontSize: 22, fontWeight: 800, color: scoreColor(s.score) }}>{s.score}</div>
                                  <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>{s.label}</div>
                                </div>
                            ))}
                          </div>
                        </div>
                        <p style={{ color: '#94a3b8', fontSize: 14, lineHeight: 1.7, margin: 0 }}>{profileResult.summary}</p>
                      </div>

                      {/* OPTIMIZED HEADLINE */}
                      <Section title="✦ OPTIMIZED HEADLINE" color="#0064ff">
                        <div style={{ background: '#141d2e', borderRadius: 10, padding: 16, fontSize: 15, lineHeight: 1.6, color: '#e8edf5', marginBottom: 12 }}>{profileResult.optimizedHeadline}</div>
                        <CopyBtn text={profileResult.optimizedHeadline} />
                      </Section>

                      {/* OPTIMIZED ABOUT */}
                      <Section title="✦ OPTIMIZED ABOUT SECTION" color="#0064ff">
                        <textarea readOnly value={profileResult.optimizedAbout} rows={8} style={{ width: '100%', background: '#141d2e', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 10, padding: 16, color: '#e8edf5', fontSize: 14, lineHeight: 1.7, resize: 'vertical', boxSizing: 'border-box' }} />
                        <div style={{ marginTop: 10 }}><CopyBtn text={profileResult.optimizedAbout} /></div>
                      </Section>

                      {/* EXPERIENCE */}
                      {profileResult.optimizedExperience?.length > 0 && (
                          <Section title="✦ OPTIMIZED EXPERIENCE BULLETS" color="#0064ff">
                            {profileResult.optimizedExperience.map((exp, i) => (
                                <div key={i} style={{ background: '#141d2e', borderRadius: 10, padding: 16, marginBottom: 10, fontSize: 14, lineHeight: 1.6, color: '#cbd5e1' }}>
                                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
                                    <span>{exp}</span>
                                    <button onClick={() => copy(exp)} style={{ flexShrink: 0, padding: '4px 10px', borderRadius: 6, background: 'rgba(0,100,255,0.15)', border: '1px solid rgba(0,100,255,0.3)', color: '#60a5fa', fontSize: 11, cursor: 'pointer' }}>Copy</button>
                                  </div>
                                </div>
                            ))}
                          </Section>
                      )}

                      {/* SKILLS */}
                      <Section title="✦ RECOMMENDED SKILLS" color="#00e5a0">
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
                          {profileResult.optimizedSkills?.map(s => (
                              <span key={s} style={{ padding: '6px 12px', borderRadius: 100, background: 'rgba(0,229,160,0.1)', border: '1px solid rgba(0,229,160,0.25)', color: '#00e5a0', fontSize: 13 }}>{s}</span>
                          ))}
                        </div>
                        <CopyBtn text={profileResult.optimizedSkills?.join(', ')} label="Copy All Skills" />
                      </Section>

                      {/* KEYWORDS */}
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                        <Section title="⊕ KEYWORDS TO ADD" color="#00e5a0">
                          {profileResult.keywordsToAdd?.map(k => (
                              <div key={k} style={{ padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.04)', fontSize: 13, color: '#94a3b8' }}>+ {k}</div>
                          ))}
                        </Section>
                        <Section title="⊖ KEYWORDS TO REMOVE" color="#ef4444">
                          {profileResult.keywordsToRemove?.map(k => (
                              <div key={k} style={{ padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.04)', fontSize: 13, color: '#94a3b8' }}>− {k}</div>
                          ))}
                        </Section>
                      </div>

                      {/* PROFILE CHECKS */}
                      <Section title="◈ PROFILE CHECKS" color="#f59e0b">
                        {profileResult.profileChecks?.map((c, i) => (
                            <div key={i} style={{ padding: '14px 16px', borderRadius: 10, background: '#141d2e', marginBottom: 10, borderLeft: `3px solid ${statusColor(c.status)}` }}>
                              <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 6 }}>
                                <span style={{ fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 4, background: `${statusColor(c.status)}20`, color: statusColor(c.status) }}>{c.status.toUpperCase()}</span>
                                <span style={{ fontWeight: 600, fontSize: 14 }}>{c.section}</span>
                              </div>
                              <div style={{ fontSize: 13, color: '#64748b', marginBottom: 6 }}>{c.issue}</div>
                              <div style={{ fontSize: 13, color: '#00e5a0' }}>Fix: {c.fix}</div>
                            </div>
                        ))}
                      </Section>

                      {/* VISIBILITY TIPS */}
                      <Section title="◎ VISIBILITY TIPS" color="#60a5fa">
                        {profileResult.visibilityTips?.map((t, i) => (
                            <div key={i} style={{ padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.04)', fontSize: 14, color: '#94a3b8', display: 'flex', gap: 10 }}>
                              <span style={{ color: '#0064ff', flexShrink: 0 }}>→</span>{t}
                            </div>
                        ))}
                      </Section>

                      {/* CONNECTION TIPS */}
                      <Section title="◎ CONNECTION GROWTH TIPS" color="#00e5a0">
                        {profileResult.connectionTips?.map((t, i) => (
                            <div key={i} style={{ padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.04)', fontSize: 14, color: '#94a3b8', display: 'flex', gap: 10 }}>
                              <span style={{ color: '#00e5a0', flexShrink: 0 }}>→</span>{t}
                            </div>
                        ))}
                      </Section>

                      {/* NEXT ACTIONS */}
                      <Section title="⚡ NEXT ACTIONS" color="#f59e0b">
                        {[
                          { label: 'TODAY', items: profileResult.nextActions?.today, color: '#ef4444' },
                          { label: 'THIS WEEK', items: profileResult.nextActions?.thisWeek, color: '#f59e0b' },
                          { label: 'THIS MONTH', items: profileResult.nextActions?.thisMonth, color: '#00e5a0' },
                        ].map(g => (
                            <div key={g.label} style={{ marginBottom: 16 }}>
                              <div style={{ fontSize: 11, fontWeight: 700, color: g.color, letterSpacing: 1, marginBottom: 8 }}>{g.label}</div>
                              {g.items?.map((a, i) => (
                                  <div key={i} style={{ padding: '8px 12px', borderRadius: 8, background: '#141d2e', marginBottom: 6, fontSize: 13, color: '#94a3b8', display: 'flex', gap: 10 }}>
                                    <span style={{ color: g.color }}>•</span>{a}
                                  </div>
                              ))}
                            </div>
                        ))}
                      </Section>

                      {/* ACTIONS */}
                      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                        <button onClick={downloadPDF} style={{ padding: '14px 24px', borderRadius: 12, background: 'linear-gradient(135deg, #0064ff, #0040cc)', border: 'none', color: 'white', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
                          ↓ Download Full Report
                        </button>
                        <button onClick={() => { setProfileResult(null); setHeadline(''); setAbout(''); setExperience(''); setSkills(''); setEducation(''); }} style={{ padding: '14px 24px', borderRadius: 12, background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: '#94a3b8', fontSize: 14, cursor: 'pointer' }}>
                          ↺ Optimize Again
                        </button>
                        <button onClick={() => setTool('posts')} style={{ padding: '14px 24px', borderRadius: 12, background: 'rgba(0,229,160,0.1)', border: '1px solid rgba(0,229,160,0.25)', color: '#00e5a0', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
                          Generate Posts →
                        </button>
                      </div>
                    </div>
                )}
              </div>
          )}

          {/* POST GENERATOR */}
          {tool === 'posts' && (
              <div style={{ maxWidth: 800, margin: '0 auto', padding: '48px 24px' }}>
                <div style={{ marginBottom: 40 }}>
                  <h2 style={{ fontSize: 32, fontWeight: 800, letterSpacing: -1, margin: '0 0 8px' }}>Post Generator</h2>
                  <p style={{ color: '#64748b', fontSize: 15 }}>Enter your topic and background. Get 5 viral LinkedIn posts in different formats — ready to copy and post.</p>
                </div>

                {!postResult ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                      <div>
                        <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#64748b', letterSpacing: 1, marginBottom: 8 }}>WHAT DO YOU WANT TO POST ABOUT? *</label>
                        <input value={postTopic} onChange={e => setPostTopic(e.target.value)} placeholder="e.g. I just landed my first freelance client after 3 months of trying..." style={{ width: '100%', padding: '14px 16px', borderRadius: 10, background: '#0f1623', border: '1px solid rgba(255,255,255,0.08)', color: '#e8edf5', fontSize: 14, boxSizing: 'border-box' }} />
                        <div style={{ fontSize: 11, color: '#475569', marginTop: 4 }}>Be specific — the more detail, the better the posts</div>
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#64748b', letterSpacing: 1, marginBottom: 8 }}>YOUR BACKGROUND / SKILLS</label>
                        <input value={postBackground} onChange={e => setPostBackground(e.target.value)} placeholder="e.g. Self-taught developer, React/Next.js, 2 years experience, freelancer" style={{ width: '100%', padding: '14px 16px', borderRadius: 10, background: '#0f1623', border: '1px solid rgba(255,255,255,0.08)', color: '#e8edf5', fontSize: 14, boxSizing: 'border-box' }} />
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                        <div>
                          <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#64748b', letterSpacing: 1, marginBottom: 8 }}>YOUR INDUSTRY</label>
                          <input value={industry} onChange={e => setIndustry(e.target.value)} placeholder="e.g. Web Development, Design, Marketing..." style={{ width: '100%', padding: '14px 16px', borderRadius: 10, background: '#0f1623', border: '1px solid rgba(255,255,255,0.08)', color: '#e8edf5', fontSize: 14, boxSizing: 'border-box' }} />
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#64748b', letterSpacing: 1, marginBottom: 8 }}>YOUR GOAL WITH THIS POST</label>
                          <select value={postGoal} onChange={e => setPostGoal(e.target.value)} style={{ width: '100%', padding: '14px 16px', borderRadius: 10, background: '#0f1623', border: '1px solid rgba(255,255,255,0.08)', color: '#e8edf5', fontSize: 14 }}>
                            <option value="get clients">Attract freelance clients</option>
                            <option value="get job">Get job opportunities</option>
                            <option value="build brand">Build personal brand</option>
                            <option value="grow network">Grow connections</option>
                            <option value="show expertise">Show expertise</option>
                          </select>
                        </div>
                      </div>

                      {error && <div style={{ padding: '12px 16px', borderRadius: 10, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#ef4444', fontSize: 14 }}>{error}</div>}

                      {loading ? (
                          <div style={{ padding: '28px 24px', borderRadius: 16, background: '#0f1623', border: '1px solid rgba(0,100,255,0.2)', textAlign: 'center' }}>
                            <div style={{ fontSize: 32, marginBottom: 16 }}>⟳</div>
                            <div style={{ fontSize: 16, fontWeight: 700, color: '#e8edf5', marginBottom: 8 }}>{postSteps[loadingStep]}</div>
                            <div style={{ fontSize: 13, color: '#475569', marginBottom: 20 }}>Writing 5 viral posts tailored to your story...</div>
                            <div style={{ display: 'flex', gap: 6, justifyContent: 'center' }}>
                              {postSteps.map((_, i) => (
                                  <div key={i} style={{ width: i === loadingStep ? 24 : 8, height: 6, borderRadius: 3, background: i === loadingStep ? '#0064ff' : i < loadingStep ? '#00e5a0' : '#1e293b', transition: 'all 0.4s ease' }} />
                              ))}
                            </div>
                          </div>
                      ) : (
                          <button onClick={runPostGenerator} style={{ padding: '16px 32px', borderRadius: 12, background: 'linear-gradient(135deg, #0064ff, #0040cc)', border: 'none', color: 'white', fontSize: 16, fontWeight: 700, cursor: 'pointer', marginTop: 8 }}>
                            Generate 5 Viral Posts →
                          </button>
                      )}
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                      <button onClick={() => setPostResult(null)} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 18px', borderRadius: 10, background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: '#94a3b8', fontSize: 13, fontWeight: 600, cursor: 'pointer', width: 'fit-content' }}>← Back</button>
                      <div style={{ padding: '16px 20px', borderRadius: 12, background: 'rgba(0,100,255,0.08)', border: '1px solid rgba(0,100,255,0.2)', fontSize: 14, color: '#94a3b8', lineHeight: 1.6 }}>
                        <span style={{ color: '#60a5fa', fontWeight: 600 }}>Content Strategy: </span>{postResult.contentStrategy}
                      </div>

                      {postResult.posts?.map((p, i) => (
                          <div key={i} style={{ background: '#0f1623', borderRadius: 16, padding: 24, border: '1px solid rgba(255,255,255,0.06)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16, flexWrap: 'wrap', gap: 12 }}>
                              <div>
                                <div style={{ fontSize: 11, fontWeight: 700, color: '#0064ff', letterSpacing: 1, marginBottom: 4 }}>POST {i+1}</div>
                                <div style={{ fontSize: 16, fontWeight: 700 }}>{p.format}</div>
                              </div>
                              <div style={{ fontSize: 11, color: '#475569', background: '#141d2e', padding: '6px 12px', borderRadius: 8 }}>Best time: {p.bestTime}</div>
                            </div>

                            <div style={{ background: '#141d2e', borderRadius: 12, padding: 20, marginBottom: 16 }}>
                              <div style={{ fontSize: 15, fontWeight: 700, color: '#e8edf5', marginBottom: 12, lineHeight: 1.5 }}>{p.hook}</div>
                              <div style={{ fontSize: 14, color: '#94a3b8', lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>{p.body}</div>
                              <div style={{ fontSize: 14, color: '#0064ff', marginTop: 12, fontWeight: 600 }}>{p.cta}</div>
                              <div style={{ marginTop: 12, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                                {p.hashtags?.map(h => (
                                    <span key={h} style={{ fontSize: 12, color: '#475569' }}>{h}</span>
                                ))}
                              </div>
                            </div>

                            <div style={{ fontSize: 12, color: '#475569', marginBottom: 14, fontStyle: 'italic' }}>💡 {p.whyItWorks}</div>

                            <CopyBtn text={`${p.hook}\n\n${p.body}\n\n${p.cta}\n\n${p.hashtags?.join(' ')}`} label="Copy Full Post" />
                          </div>
                      ))}

                      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                        <button onClick={downloadPostsPDF} style={{ padding: '14px 24px', borderRadius: 12, background: 'linear-gradient(135deg, #0064ff, #0040cc)', border: 'none', color: 'white', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
                          ↓ Download All Posts PDF
                        </button>
                        <button onClick={() => { setPostResult(null); setPostTopic(''); }} style={{ padding: '14px 24px', borderRadius: 12, background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: '#94a3b8', fontSize: 14, cursor: 'pointer' }}>
                          ↺ Generate New Posts
                        </button>
                        <button onClick={() => setTool('profile')} style={{ padding: '14px 24px', borderRadius: 12, background: 'rgba(0,100,255,0.1)', border: '1px solid rgba(0,100,255,0.25)', color: '#60a5fa', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
                          Optimize Profile →
                        </button>
                      </div>
                    </div>
                )}
              </div>
          )}
        </div>
      </div>
  );
}

function Section({ title, color, children }: { title: string; color: string; children: React.ReactNode }) {
  return (
      <div style={{ background: '#0f1623', borderRadius: 16, padding: 24, border: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ fontSize: 11, fontWeight: 700, color, letterSpacing: 1.5, marginBottom: 16 }}>{title}</div>
        {children}
      </div>
  );
}

function CopyBtn({ text, label = '⎘ Copy' }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  function handleCopy() {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }
  return (
      <button onClick={handleCopy} style={{ padding: '8px 16px', borderRadius: 8, background: copied ? 'rgba(0,229,160,0.15)' : 'rgba(0,100,255,0.15)', border: `1px solid ${copied ? 'rgba(0,229,160,0.3)' : 'rgba(0,100,255,0.3)'}`, color: copied ? '#00e5a0' : '#60a5fa', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
        {copied ? '✓ Copied!' : label}
      </button>
  );
}