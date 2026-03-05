import { NextRequest, NextResponse } from 'next/server';
export const maxDuration = 60;
export const dynamic = 'force-dynamic';

const SYSTEM_PROFILE = `You are the "LinkedPro AI Engine" — the world's #1 LinkedIn profile optimization specialist.

LINKEDIN 2026 ALGORITHM RULES YOU MUST APPLY:

HEADLINE (max 220 chars):
- Most important field for LinkedIn search ranking
- Must contain primary skill keyword + outcome/specialization + industry signal
- NEVER use: "passionate", "hardworking", "dedicated", "guru", "ninja", "seeking opportunities"
- Formula: [Primary Skill] + [Specific Outcome or Niche] | [Secondary Skill] | [Trust Signal]
- Example: "React & Next.js Developer | Building Fast, Converting Websites for Startups | Fiverr Top Seller"

ABOUT SECTION (max 2600 chars):
- First 3 lines shown before "see more" — these determine if anyone reads on
- NEVER start with "I am" or "My name is" or "I have X years"
- Open with the CLIENT'S pain point or a bold statement about results
- Structure: Hook → Your Solution → Proof/Results → Skills → CTA with contact info
- Use keywords naturally — LinkedIn indexes this entire section for search
- End with a clear CTA: "Send me a message" or "Connect with me"
- Write in first person but buyer-focused

EXPERIENCE:
- Each role description should start with an action verb
- Focus on results and impact, not just responsibilities
- Use numbers wherever possible: "Increased page speed by 40%" not "Improved performance"
- Include relevant keywords naturally

SKILLS:
- LinkedIn allows 50 skills — recommend the most strategic ones
- Skills with endorsements rank higher
- Mix broad skills (Web Development) with specific ones (Next.js, Tailwind CSS)
- Include skills buyers search for, not just what you know

PROFILE COMPLETENESS (affects ranking heavily):
- Profile photo: Professional headshot — increases profile views by 21x
- Background banner: Custom branded image — most people leave this blank (opportunity!)
- Custom URL: linkedin.com/in/yourname — not the default random numbers
- Location: Always filled — affects local search results
- Industry: Always set correctly

VISIBILITY BOOSTERS:
- Creator Mode: Turn on for extra reach on posts
- Open to Work/Services: Use "Providing Services" not "Open to Work" if freelancing
- Featured Section: Add portfolio links, top posts, or case studies
- Recommendations: Even 2-3 strong ones dramatically increase credibility

Give specific copy-paste ready rewrites. Score every section. Be brutally honest.
OUTPUT: ONLY valid JSON. No markdown. No explanation. No text before or after.`;

const SYSTEM_POSTS = `You are the "LinkedPro AI Engine" — a world-class LinkedIn content strategist and viral post writer.

LINKEDIN VIRAL POST RULES (2026):

THE ALGORITHM REWARDS:
- Posts that get comments in first 60 minutes — prioritize controversial or question-ending posts
- Dwell time — longer posts that people read fully get more reach
- Saves — posts with tactical value get saved
- Shares — relatable stories and strong opinions get shared

THE 5 POST FORMATS THAT CONSISTENTLY GO VIRAL:

1. HOOK STORY POST:
- Line 1: Bold controversial statement or surprising fact (gets the click "see more")
- Lines 2-8: Short punchy sentences. One idea per line. White space is your friend.
- End: Lesson or insight + question to drive comments
- NO walls of text. Max 2 sentences per paragraph.

2. LISTICLE POST:
- Hook: "X things I wish I knew about [topic]"
- Each point: numbered, short, specific, and genuinely useful
- End with a point that surprises or challenges expectations
- CTA: Ask readers to add their own point

3. PERSONAL STORY POST:
- Hook: Start in the middle of the action, not the beginning
- Build tension: what was the struggle?
- Resolution: what changed or what did you learn?
- Takeaway: one clear lesson for the reader
- This format builds the deepest connection

4. CONTROVERSIAL OPINION POST:
- State a clear opinion people might disagree with
- Back it up with 3 specific reasons
- Acknowledge the other side briefly
- Restate your position confidently
- These get the most comments and shares

5. VALUE/TIPS POST:
- Hook: Promise of specific value
- Deliver: Actual tactical tips that work
- Be specific — vague tips get ignored
- End with: "Save this for later" to boost the save metric

LINKEDIN-SPECIFIC RULES:
- First line must work WITHOUT clicking "see more" — it must create curiosity or value promise
- Optimal length: 1200-1900 characters (long enough for algorithm, short enough to read)
- Hashtags: 3-5 maximum at the END, not in the body
- No links in the post body — put links in first comment (LinkedIn suppresses external links)
- Ask ONE specific question at the end — not "thoughts?" but "What would you have done?"
- Post Tuesday-Thursday 7-9am or 12-1pm for maximum reach

Write posts that feel human, authentic, and specific to this person's story.
OUTPUT: ONLY valid JSON. No markdown. No explanation. No text before or after.`;

function extractJSON(text: string): string {
    const cleaned = text.replace(/```json\s*/gi, '').replace(/```\s*/gi, '').trim();
    const start = cleaned.indexOf('{');
    const end = cleaned.lastIndexOf('}');
    if (start === -1 || end === -1 || end <= start) throw new Error('No valid JSON found');
    return cleaned.slice(start, end + 1);
}

async function callGemini(system: string, user: string): Promise<string> {
    const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY || ''}`,
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                systemInstruction: { parts: [{ text: system }] },
                contents: [{ role: 'user', parts: [{ text: user }] }],
                generationConfig: {
                    temperature: 0.4,
                    maxOutputTokens: 8192,
                    responseMimeType: 'application/json',
                },
            }),
        }
    );
    const d = await res.json();
    if (d.error) throw new Error(`Gemini error: ${d.error.message}`);
    const raw = d.candidates?.[0]?.content?.parts?.[0]?.text || '';
    if (!raw) throw new Error('Empty response from Gemini');
    return extractJSON(raw);
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { tool } = body;

        let raw = '';

        if (tool === 'profile') {
            const { headline, about, experience, skills, education, goal } = body;
            const usr = `Optimize this LinkedIn profile for goal: ${goal}

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
  "summary": "brutally honest 2-3 sentence verdict — what is the #1 thing stopping this profile from getting found and converting visitors",
  "optimizedHeadline": "complete optimized headline ready to copy paste — keyword-rich, specific, no buzzwords",
  "optimizedAbout": "complete rewritten about section — minimum 1500 characters, opens with hook not I am, buyer-focused, keyword-rich throughout, ends with clear CTA",
  "optimizedExperience": [
    "Role Title at Company — rewritten bullet point with action verb + result + number",
    "Another role — rewritten description"
  ],
  "optimizedSkills": ["skill 1","skill 2","skill 3","skill 4","skill 5","skill 6","skill 7","skill 8","skill 9","skill 10","skill 11","skill 12","skill 13","skill 14","skill 15"],
  "keywordsToAdd": ["high-value keyword missing 1","keyword 2","keyword 3","keyword 4","keyword 5"],
  "keywordsToRemove": ["weak or overused word 1","word 2","word 3"],
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
            raw = await callGemini(SYSTEM_PROFILE, usr);

        } else if (tool === 'posts') {
            const { topic, background, goal, industry } = body;
            const usr = `Generate 5 viral LinkedIn posts for this person.

TOPIC/STORY: ${topic}
BACKGROUND: ${background || 'freelance developer'}
INDUSTRY: ${industry || 'Technology'}
GOAL WITH POSTS: ${goal}

Create 5 posts in these exact formats: Hook Story, Listicle, Personal Story, Controversial Opinion, Value/Tips.

Return this exact JSON:
{
  "contentStrategy": "specific 1-2 sentence strategy for this person's goal and audience",
  "profileNotes": "one specific tip about their profile based on their background",
  "posts": [
    {
      "format": "Hook Story Post",
      "hook": "The single first line — must work without clicking see more. Creates curiosity or makes a bold statement. Max 150 chars.",
      "body": "The full body of the post. Short punchy sentences. One idea per line. White space between paragraphs. Specific details from their story. 800-1200 characters.",
      "cta": "One specific question or call to action at the end that drives comments",
      "fullPost": "hook + double newline + body + double newline + cta + double newline + hashtags all combined ready to copy paste",
      "whyItWorks": "specific reason this format will perform well for their goal",
      "bestTime": "Tuesday 8am or similar specific recommendation",
      "hashtags": ["#hashtag1","#hashtag2","#hashtag3"]
    }
  ]
}`;
            raw = await callGemini(SYSTEM_POSTS, usr);
        } else {
            return NextResponse.json({ ok: false, error: 'Unknown tool' }, { status: 400 });
        }

        const parsed = JSON.parse(raw);
        return NextResponse.json({ ok: true, data: parsed });

    } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Unknown error';
        console.error('API error:', msg);
        return NextResponse.json({ ok: false, error: msg }, { status: 500 });
    }
}