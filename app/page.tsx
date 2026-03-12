'use client';
import { useState } from 'react';

const SYSTEM_PROFILE = `You are the "LinkedPro AI Engine" — the world's #1 LinkedIn profile optimization specialist.

LINKEDIN 2026 ALGORITHM RULES YOU MUST APPLY:

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
- Use numbers wherever possible

SKILLS:
- LinkedIn allows 50 skills — recommend the most strategic ones
- Mix broad skills with specific ones
- Include skills buyers search for

PROFILE COMPLETENESS:
- Profile photo: Professional headshot — increases profile views by 21x
- Background banner: Custom branded image
- Custom URL: linkedin.com/in/yourname
- Creator Mode, Open to Work/Services, Featured Section, Recommendations

Give specific copy-paste ready rewrites. Score every section. Be brutally honest.
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
    {"section":"Headline","status":"fail","issue":"specific problem found","fix":"exact copy-paste fix ready to apply"},
    {"section":"About","status":"warn","issue":"specific problem","fix":"exact fix"},
    {"section":"Profile Photo","status":"warn","issue":"cannot verify but reminder","fix":"professional headshot, plain background, natural smile"},
    {"section":"Custom URL","status":"warn","issue":"likely still default URL","fix":"go to Edit Profile then Edit public profile and URL — set to linkedin.com/in/yourfirstnamelastname"},
    {"section":"Background Banner","status":"fail","issue":"likely default blue banner","fix":"create a 1584x396px banner on Canva showing your skills and contact info"}
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
    // Load jsPDF from CDN if not already loaded
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
      return (t || '').replace(/\*\*([^*]+)\*\*/g,'$1').replace(/\*([^*]+)\*/g,'$1')
          .replace(/[\u2018\u2019]/g,"'").replace(/[\u201c\u201d]/g,'"')
          .replace(/[\u2013\u2014]/g,'-').replace(/\u2192/g,'>').replace(/\u2022/g,'-')
          .replace(/[^\x20-\x7E\xA0-\xFF]/g,'').trim();
    }
    function wrap(t: string, w: number, fs: number) { doc.setFontSize(fs); return doc.splitTextToSize(cl(t), w); }
    function sCol(s: number): [number,number,number] { return s >= 80 ? [0,180,120] : s >= 60 ? [234,179,8] : [220,50,50]; }
    function footer(p: number, t: number) {
      doc.setPage(p);
      doc.setFillColor(0, 100, 255); doc.rect(0, H-8, W, 8, 'F');
      doc.setTextColor(255,255,255); doc.setFontSize(7);
      doc.text('LinkedPro AI', M, H-3);
      doc.text(`Page ${p} of ${t}`, W/2, H-3, { align: 'center' });
      doc.text('linkedin-optimizer.vercel.app', W-M, H-3, { align: 'right' });
    }

    // COVER
    doc.setFillColor(8, 12, 20); doc.rect(0, 0, W, H, 'F');
    doc.setFillColor(0, 100, 255); doc.rect(0, 0, W, 70, 'F');
    doc.setTextColor(255,255,255); doc.setFontSize(22); doc.setFont('helvetica','bold');
    doc.text('LinkedIn Profile Optimization Report', M, 28);
    doc.setFontSize(11); doc.setFont('helvetica','normal');
    doc.text('Generated by LinkedPro AI', M, 40);
    doc.setFontSize(9); doc.text(new Date().toLocaleDateString('en-US',{weekday:'long',year:'numeric',month:'long',day:'numeric'}), M, 52);
    // Score badge
    doc.setFillColor(20, 29, 46); doc.roundedRect(W-56, 10, 40, 48, 4, 4, 'F');
    doc.setTextColor(...sCol(profileResult.overallScore));
    doc.setFontSize(28); doc.setFont('helvetica','bold');
    doc.text(String(profileResult.overallScore), W-36, 36, { align: 'center' });
    doc.setFontSize(8); doc.setTextColor(150,180,220);
    doc.text('/100', W-36, 44, { align: 'center' });
    doc.text('OVERALL', W-36, 52, { align: 'center' });
    // Sub scores
    const scores = [
      {l:'Headline', v:profileResult.headlineScore},{l:'About', v:profileResult.aboutScore},
      {l:'Experience', v:profileResult.experienceScore},{l:'Skills', v:profileResult.skillsScore},
    ];
    let sx = M;
    scores.forEach((s: {l:string, v:number}) => {
      doc.setFillColor(20,29,46); doc.roundedRect(sx, 82, 40, 22, 3, 3, 'F');
      doc.setTextColor(...sCol(s.v)); doc.setFontSize(14); doc.setFont('helvetica','bold');
      doc.text(String(s.v), sx+20, 93, { align: 'center' });
      doc.setFontSize(7); doc.setTextColor(100,140,180);
      doc.text(s.l.toUpperCase(), sx+20, 100, { align: 'center' });
      sx += 46;
    });
    // Summary box
    doc.setFillColor(15,25,45); doc.roundedRect(M, 114, cW, 40, 4, 4, 'F');
    doc.setTextColor(0,180,120); doc.setFontSize(8); doc.setFont('helvetica','bold');
    doc.text('SUMMARY', M+8, 124);
    doc.setTextColor(200,220,240); doc.setFont('helvetica','normal');
    wrap(profileResult.summary, cW-16, 8.5).slice(0,4).forEach((l:string,i:number) => doc.text(l, M+8, 132+i*6));

    // PAGE 2 — HEADLINE & ABOUT
    doc.addPage(); y = M;
    doc.setFillColor(0,100,255); doc.rect(0,0,W,14,'F');
    doc.setTextColor(255,255,255); doc.setFontSize(10); doc.setFont('helvetica','bold');
    doc.text('OPTIMIZED HEADLINE & ABOUT SECTION', M, 10); y = 22;

    // Headline
    cy(30);
    doc.setFillColor(240,245,255); doc.roundedRect(M, y, cW, 24, 3, 3, 'F');
    doc.setFillColor(0,100,255); doc.rect(M, y, 3, 24, 'F');
    doc.setTextColor(30,50,100); doc.setFontSize(8); doc.setFont('helvetica','bold');
    doc.text('OPTIMIZED HEADLINE', M+7, y+8);
    doc.setFont('helvetica','normal'); doc.setFontSize(9);
    wrap(profileResult.optimizedHeadline, cW-16, 9).slice(0,2).forEach((l:string,i:number) => doc.text(l, M+7, y+16+i*5));
    y += 30;

    // About
    const aboutLines = wrap(profileResult.optimizedAbout, cW-16, 8);
    const aboutH = Math.min(aboutLines.length * 5 + 20, 180);
    cy(aboutH);
    doc.setFillColor(240,245,255); doc.roundedRect(M, y, cW, aboutH, 3, 3, 'F');
    doc.setFillColor(0,100,255); doc.rect(M, y, 3, aboutH, 'F');
    doc.setTextColor(30,50,100); doc.setFontSize(8); doc.setFont('helvetica','bold');
    doc.text('OPTIMIZED ABOUT SECTION', M+7, y+8);
    doc.setFont('helvetica','normal'); doc.setFontSize(8);
    let ay = y + 16;
    for (const l of aboutLines) {
      if (ay + 5 > y + aboutH - 4) break;
      doc.text(l, M+7, ay); ay += 5;
    }
    y += aboutH + 6;

    // PAGE 3 — EXPERIENCE & SKILLS
    doc.addPage(); y = M;
    doc.setFillColor(0,100,255); doc.rect(0,0,W,14,'F');
    doc.setTextColor(255,255,255); doc.setFontSize(10); doc.setFont('helvetica','bold');
    doc.text('EXPERIENCE & SKILLS', M, 10); y = 22;

    profileResult.optimizedExperience?.forEach((exp: string, i: number) => {
      const lines = wrap(exp, cW-16, 8);
      const bh = Math.max(20, lines.length*5+14);
      cy(bh+4);
      doc.setFillColor(240,245,255); doc.roundedRect(M, y, cW, bh, 3, 3, 'F');
      doc.setFillColor(0,100,255); doc.rect(M, y, 3, bh, 'F');
      doc.setTextColor(30,50,100); doc.setFontSize(8); doc.setFont('helvetica','bold');
      doc.text(`ROLE ${i+1}`, M+7, y+8);
      doc.setFont('helvetica','normal');
      lines.forEach((l:string,j:number) => doc.text(l, M+7, y+15+j*5));
      y += bh+6;
    });

    cy(14); doc.setFillColor(0,180,120); doc.rect(0,y,W,10,'F');
    doc.setTextColor(255,255,255); doc.setFontSize(9); doc.setFont('helvetica','bold');
    doc.text('RECOMMENDED SKILLS', M, y+7); y += 16;
    const skillsPerRow = 4; const skillW = (cW-12)/skillsPerRow;
    profileResult.optimizedSkills?.forEach((s: string, i: number) => {
      const col = i % skillsPerRow; const row = Math.floor(i/skillsPerRow);
      if (col === 0 && row > 0) { cy(12); }
      const sx2 = M + col*(skillW+4);
      const sy = y + Math.floor(i/skillsPerRow)*12;
      if (sy + 10 < H - M) {
        doc.setFillColor(230,240,255); doc.roundedRect(sx2, sy, skillW, 9, 2, 2, 'F');
        doc.setTextColor(0,60,180); doc.setFontSize(7); doc.setFont('helvetica','normal');
        doc.text(cl(s), sx2+skillW/2, sy+6, { align:'center', maxWidth: skillW-4 });
      }
    });
    y += (Math.ceil((profileResult.optimizedSkills?.length||0)/skillsPerRow))*12+6;

    // PAGE 4 — KEYWORDS & PROFILE CHECKS
    doc.addPage(); y = M;
    doc.setFillColor(0,100,255); doc.rect(0,0,W,14,'F');
    doc.setTextColor(255,255,255); doc.setFontSize(10); doc.setFont('helvetica','bold');
    doc.text('KEYWORDS & PROFILE CHECKS', M, 10); y = 22;

    // Keywords side by side
    const hw = (cW-8)/2;
    doc.setFillColor(230,255,245); doc.roundedRect(M, y, hw, 8, 2, 2, 'F');
    doc.setTextColor(0,120,80); doc.setFontSize(8); doc.setFont('helvetica','bold');
    doc.text('KEYWORDS TO ADD', M+4, y+6);
    doc.setFillColor(255,235,235); doc.roundedRect(M+hw+8, y, hw, 8, 2, 2, 'F');
    doc.setTextColor(160,0,0); doc.text('KEYWORDS TO REMOVE', M+hw+12, y+6);
    y += 12;
    const maxKw = Math.max(profileResult.keywordsToAdd?.length||0, profileResult.keywordsToRemove?.length||0);
    for (let i=0; i<maxKw; i++) {
      cy(7);
      if (profileResult.keywordsToAdd?.[i]) {
        doc.setTextColor(0,120,80); doc.setFontSize(8); doc.setFont('helvetica','normal');
        doc.text(`+ ${cl(profileResult.keywordsToAdd[i])}`, M+4, y+5);
      }
      if (profileResult.keywordsToRemove?.[i]) {
        doc.setTextColor(160,0,0);
        doc.text(`- ${cl(profileResult.keywordsToRemove[i])}`, M+hw+12, y+5);
      }
      y += 7;
    }
    y += 6;

    // Profile checks
    const statusC = (s:string): [number,number,number] => s==='pass'?[0,150,80]:s==='warn'?[180,120,0]:[180,0,0];
    profileResult.profileChecks?.forEach((c: {section:string,status:string,issue:string,fix:string}) => {
      const issueL = wrap(c.issue, cW-36, 7.5);
      const fixL = wrap('Fix: '+c.fix, cW-36, 7.5);
      const bh = Math.max(18, issueL.length*5+fixL.length*5+14);
      cy(bh+4);
      doc.setFillColor(248,250,252); doc.roundedRect(M, y, cW, bh, 3, 3, 'F');
      doc.setFillColor(...statusC(c.status)); doc.rect(M, y, 3, bh, 'F');
      doc.setTextColor(...statusC(c.status)); doc.setFontSize(7.5); doc.setFont('helvetica','bold');
      doc.text(c.status.toUpperCase(), M+7, y+8);
      doc.setTextColor(30,50,80); doc.setFontSize(9);
      doc.text(cl(c.section), M+28, y+8);
      doc.setTextColor(80,80,80); doc.setFont('helvetica','normal'); doc.setFontSize(7.5);
      issueL.forEach((l:string,i:number) => doc.text(l, M+7, y+15+i*5));
      let fy = y+15+issueL.length*5+2;
      doc.setTextColor(0,120,60);
      fixL.forEach((l:string,i:number) => doc.text(l, M+7, fy+i*5));
      y += bh+5;
    });

    // PAGE 5 — TIPS & ACTIONS
    doc.addPage(); y = M;
    doc.setFillColor(0,100,255); doc.rect(0,0,W,14,'F');
    doc.setTextColor(255,255,255); doc.setFontSize(10); doc.setFont('helvetica','bold');
    doc.text('TIPS & ACTION PLAN', M, 10); y = 22;

    const drawTips = (title: string, tips: string[], color: [number,number,number]) => {
      cy(12); doc.setFillColor(...color); doc.rect(0,y,W,10,'F');
      doc.setTextColor(255,255,255); doc.setFontSize(9); doc.setFont('helvetica','bold');
      doc.text(title, M, y+7); y += 14;
      tips?.forEach((t: string) => {
        const lines = wrap(t, cW-16, 8);
        const bh = Math.max(14, lines.length*5+8);
        cy(bh+3);
        doc.setFillColor(248,250,252); doc.roundedRect(M, y, cW, bh, 2, 2, 'F');
        doc.setTextColor(...color); doc.setFontSize(10); doc.text('>', M+5, y+bh/2+3);
        doc.setTextColor(50,60,80); doc.setFontSize(8); doc.setFont('helvetica','normal');
        lines.forEach((l:string,i:number) => doc.text(l, M+14, y+8+i*5));
        y += bh+4;
      });
      y += 4;
    };

    drawTips('VISIBILITY TIPS', profileResult.visibilityTips, [0,100,255]);
    drawTips('CONNECTION GROWTH TIPS', profileResult.connectionTips, [0,150,100]);

    // Action plan
    cy(12); doc.setFillColor(20,29,46); doc.rect(0,y,W,10,'F');
    doc.setTextColor(0,180,120); doc.setFontSize(9); doc.setFont('helvetica','bold');
    doc.text('ACTION PLAN', M, y+7); y += 14;
    [
      {label:'DO TODAY', items:profileResult.nextActions?.today, color:[220,50,50] as [number,number,number]},
      {label:'THIS WEEK', items:profileResult.nextActions?.thisWeek, color:[180,120,0] as [number,number,number]},
      {label:'THIS MONTH', items:profileResult.nextActions?.thisMonth, color:[0,140,80] as [number,number,number]},
    ].forEach((g: {label:string, items:string[]|undefined, color:[number,number,number]}) => {
      cy(10); doc.setTextColor(...g.color); doc.setFontSize(9); doc.setFont('helvetica','bold');
      doc.text(g.label, M, y+6); y += 10;
      g.items?.forEach((a: string) => {
        const lines = wrap(a, cW-14, 8);
        const bh = Math.max(12, lines.length*5+6);
        cy(bh+3);
        doc.setFillColor(248,250,252); doc.roundedRect(M, y, cW, bh, 2, 2, 'F');
        doc.setTextColor(...g.color); doc.setFontSize(9); doc.text('•', M+5, y+bh/2+3);
        doc.setTextColor(50,60,80); doc.setFont('helvetica','normal'); doc.setFontSize(8);
        lines.forEach((l:string,i:number) => doc.text(l, M+12, y+7+i*5));
        y += bh+4;
      });
      y += 4;
    });

    // Footers
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