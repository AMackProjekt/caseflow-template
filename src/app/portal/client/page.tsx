"use client";

import { useState, useEffect } from "react";
import { 
  Heart, Smile, BookOpen, Megaphone, Plus, Quote, Zap, AlertCircle,
  ExternalLink, CheckCircle2, Clock, Upload, MessageSquare,
  Check, Send, Users, Video
} from "lucide-react";
import { useStaff } from "@/context/StaffContext";

const QUOTES = [
  "Your current situation is not your final destination. The best is yet to come.",
  "Every small step is progress. Keep moving forward.",
  "You are stronger than you think. Org is here with you.",
  "Rise up and attack the day with an enthusiastic spirit.",
  "The only way to do great work is to love what you do. Or to start doing it today.",
  "Your progress is not a sprint, it's a journey. Every mile counts.",
  "It's okay not to be okay. Asking for help is strength.",
  "Progress over perfection. You're doing better than you think.",
  "Believe in yourself. You have the power to change your story.",
  "Your struggles are not your story. They're just a chapter. Write the next one boldly.",
  "Every day is a new opportunity to turn your life around.",
  "You deserve kindness and compassion—especially from yourself.",
  "Small changes lead to big results. Stay committed.",
  "Your past does not define your future. You do.",
  "Celebrate the wins, no matter how small. You earned them.",
  "What you do today can improve all your tomorrows.",
  "You are braver than you believe, stronger than you seem, and smarter than you think.",
  "Your story isn't over. Keep writing.",
  "Obstacles are opportunities in disguise. You've got this.",
  "Progress is progress, no matter how small. Be proud of yourself.",
  "You are worthy of love, respect, and success.",
  "Transform your pain into purpose. Your story can inspire others.",
  "The best time to start was yesterday. The second best time is now.",
  "You've survived 100% of your worst days. You're unstoppable.",
  "Growth looks like discomfort, but it leads to freedom.",
  "Don't compare your beginning to someone else's middle. You're exactly where you need to be.",
  "Your resilience is your superpower.",
  "One day at a time. That's all you need to focus on.",
  "You are not alone in this journey. We're here for you.",
  "Dreams don't happen by accident. They happen by action.",
  "The only limitation is the one you accept.",
  "You have the strength to face another day.",
  "Your value is not determined by your circumstances.",
  "Every mistake is a lesson. Keep learning, keep growing.",
  "You are capable of more than you know.",
  "Take it one moment at a time. You're doing just fine.",
  "Your perseverance will pay off. Trust the process.",
  "Be the change you want to see in your life.",
  "You are enough. Right here, right now.",
  "Your contribution matters. Your voice matters. You matter.",
  "Challenges are just opportunities to prove your strength.",
  "You deserve a life filled with joy and purpose.",
  "Keep pushing forward. Great things await you.",
  "Your comeback will be greater than your setback.",
  "Focus on what you can control. Let go of the rest.",
  "You are a work in progress, and that's perfectly okay.",
  "Today is the perfect day to start believing in yourself.",
  "Together we overcome obstacles and limitations — no one rises alone.",
  "TOOL: Together Overcoming Obstacles & Limitations. That's what community looks like.",
  "When we walk together, every barrier becomes smaller.",
  "You are not alone in facing your limitations — together we rise.",
  "The strength of the group lifts the individual. We are TOOL.",
  "Every sunrise is a reminder that you survived yesterday.",
  "The courage it takes to ask for help is the same courage that changes lives.",
  "Your healing doesn't have to look like anyone else's.",
  "Setbacks are setups for comebacks. You are still in the story.",
  "You are worth every resource, every conversation, every second chance.",
  "Stability isn't built in a day — it's built in thousands of small decisions.",
  "The fact that you're here means you haven't given up. That matters enormously.",
  "Housing is not the end — it's the beginning. You're just getting started.",
  "Your needs are valid. Your voice matters. Your future is real.",
  "What you've been through doesn't diminish who you are — it reveals your strength.",
  "Every conversation with your case manager is a step in the right direction.",
  "You don't have to have it all figured out. Just figure out today.",
  "Asking for help is not weakness — it's the bravest, most strategic move you can make.",
  "Momentum starts with one step. You already took it by walking through the door.",
  "Your comeback story is being written right now, in every choice you make.",
  "A stable home creates the space for everything else to grow.",
  "You are the author of your next chapter. Let it be hopeful.",
  "Hard days don't erase your progress. They test your commitment to it.",
  "There is dignity in your journey — every part of it.",
  "Rest is not the same as giving up. Rest, and then keep going.",
  "No storm lasts forever. You are stronger than this season.",
  "People who have been through the fire know what warmth really means.",
  "Celebrate every win — the small ones add up to something incredible.",
  "You are more than your circumstances. You are your vision of the future.",
  "Community is not just a place — it's a promise that no one walks alone.",
  "What feels impossible today becomes possible tomorrow when you don't quit tonight.",
  "Your dreams deserve a real foundation. That's what you're building, right now.",
  "Grace is available right now — extend it to yourself first.",
  "You have overcome things that others would never understand. Give yourself credit.",
  "Support is not charity — it's what humans were designed to give each other."
];

const FINANCIAL_COURSES = [
  { title: "Khan Academy Finance & Capital Markets", url: "https://www.khanacademy.org", description: "Free comprehensive finance fundamentals" },
  { title: "GreenPath Financial Wellness", url: "https://www.greenpath.org", description: "Free credit counseling and workshops" },
  { title: "NFCC Money Management", url: "https://www.nfcc.org", description: "Free financial education and resources" },
  { title: "Coursera: Finance for Everyone", url: "https://www.coursera.org", description: "Free audit option available" }
];

const ANGER_MANAGEMENT = [
  { title: "Mental Health America - Anger Management", url: "https://www.mhanational.org", description: "Free anger management tools and resources" },
  { title: "San Diego County Mental Health", url: "https://www.sandiegocounty.gov", description: "County anger management programs" },
  { title: "NAMI San Diego - Support Groups", url: "https://nami.org", description: "Free community support" },
  { title: "Coursera: Emotional Intelligence", url: "https://www.coursera.org", description: "Free audit option" }
];

const AA_NA_MEETINGS = [
  { time: "Daily", location: "Downtown San Diego (92101)", type: "AA/NA", url: "https://www.sandiegocountyaa.org/meetings", online: true, phone: "(619) 223-1183" },
  { time: "Multiple Daily", location: "North Park (92104)", type: "AA", url: "https://www.sandiegocountyaa.org/meetings", online: true, phone: "(619) 223-1183" },
  { time: "Evening", location: "El Cajon (92020)", type: "NA", url: "https://www.sandiegona.org", online: true, phone: "(619) 560-0811" },
  { time: "Afternoon/Evening", location: "Chula Vista (91910)", type: "AA/NA", url: "https://www.sandiegocountyaa.org/meetings", online: true, phone: "(619) 223-1183" }
];

type MoodType = 'happy' | 'good' | 'neutral' | 'stressed' | 'bad';

export default function ClientDashboard() {
  const { addJournal, addFeedback } = useStaff();
  
  const [quote, setQuote] = useState(QUOTES[0]);
  const [activeTab, setActiveTab] = useState("overview");
  const [journalContent, setJournalContent] = useState("");
  const [mood, setMood] = useState<MoodType>("neutral");
  const [feedbackType, _setFeedbackType] = useState<'complaint' | 'suggestion'>('suggestion');
  const [feedbackContent, setFeedbackContent] = useState("");
  const [ventMessage, setVentMessage] = useState("");
  const [ventMessages, setVentMessages] = useState<Array<{id: number; msg: string; time: string}>>([]);
  const [_showVentPreview, _setShowVentPreview] = useState(false);
  const [clothingSizes, setClothingSizes] = useState({ gender: 'male', shirt: 'M', pants: '32', shoes: '10' });

  useEffect(() => {
    setQuote(QUOTES[Math.floor(Math.random() * QUOTES.length)]);
  }, []);

  const handleAddJournal = () => {
    if (!journalContent.trim()) return;
    addJournal({
      client: "Participant",
      date: new Date().toLocaleDateString(),
      mood,
      content: journalContent
    });
    setJournalContent("");
    alert("Journal entry saved! 📝");
  };

  const handleAddFeedback = () => {
    if (!feedbackContent.trim()) return;
    addFeedback({
      client: "Participant",
      type: feedbackType,
      content: feedbackContent,
      date: new Date().toLocaleDateString()
    });
    setFeedbackContent("");
    alert("Thank you for your feedback! Your voice matters. ✨");
  };

  const submitVent = () => {
    if (!ventMessage.trim()) return;
    setVentMessages([...ventMessages, { id: Date.now(), msg: ventMessage, time: new Date().toLocaleTimeString() }]);
    setVentMessage("");
  };

  const submitClothingRequest = () => {
    const sizeInfo = `Gender: ${clothingSizes.gender === 'male' ? 'Male'  : 'Female'}, Shirt: ${clothingSizes.shirt}, Pants: ${clothingSizes.pants}, Shoes: ${clothingSizes.shoes}`;
    alert(`✅ Clothing request submitted!\n\n${sizeInfo}\n\nWe'll process your request this week.`);
  };

  const TABS = [
    { id: 'overview', label: 'Home', icon: Zap },
    { id: 'wellness', label: 'Wellness', icon: Heart },
    { id: 'resources', label: 'Resources', icon: BookOpen },
    { id: 'community', label: 'Community', icon: Smile },
    { id: 'needs', label: 'Immediate Needs', icon: AlertCircle },
    { id: 'okay', label: 'It\'s Okay', icon: Megaphone },
    { id: 'why', label: 'What\'s Your Why', icon: Quote }
  ];


  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      
      {/* INSPIRATIONAL BANNER */}
      <div className="relative bg-gradient-to-br from-charcoal-900 via-charcoal-950 to-indigo-950 rounded-[2.5rem] p-10 text-white shadow-2xl overflow-hidden group">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-teal-500/10 rounded-full blur-[120px] -mr-40 -mt-40 transition-all duration-1000 group-hover:bg-teal-500/20"></div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <span className="p-2 bg-teal-500/20 text-teal-400 rounded-xl border border-teal-500/30">
               <Quote className="w-5 h-5" />
            </span>
            <span className="text-white/40 text-[10px] font-bold uppercase tracking-[0.2em]">Daily Inspiration</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight max-w-3xl leading-tight italic font-serif text-teal-100">
            \"{quote}\"
          </h1>
          <div className="flex flex-wrap items-center gap-6">
             <button onClick={() => setQuote(QUOTES[Math.floor(Math.random() * QUOTES.length)])} className="text-xs font-bold text-teal-400 hover:text-white transition flex items-center gap-2">
                Get New Quote <Zap className="w-3 h-3" />
             </button>
            <a href="https://forms.cloud.microsoft/Pages/ResponsePage.aspx?id=DQSIkWdsW0yxEjajBLZtrQAAAAAAAAAAAAMAAZQOUnpUMzFSVENWT1NFWUhIMFpPRUhKQVhPTkhTVy4u" target="_blank" rel="noopener noreferrer" className="text-xs font-bold bg-teal-500 text-charcoal-900 px-4 py-2 rounded-lg hover:bg-teal-400 transition flex items-center gap-1">
               Quick Survey <ExternalLink className="w-3 h-3" />
             </a>
          </div>
        </div>
      </div>

      {/* QUICK STATS ─────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <a href="/portal/client/goals" className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col gap-1 hover:shadow-md hover:border-teal-300 transition group">
          <div className="w-8 h-8 bg-teal-50 rounded-xl flex items-center justify-center group-hover:bg-teal-100 transition">
            <CheckCircle2 className="w-4 h-4 text-teal-600" />
          </div>
          <p className="text-xl font-black text-charcoal-900 tracking-tighter mt-1">Goals</p>
          <p className="text-[10px] font-bold text-teal-600 uppercase tracking-widest leading-tight">Track Progress →</p>
        </a>
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col gap-1 hover:shadow-md transition">
          <div className="w-8 h-8 bg-purple-50 rounded-xl flex items-center justify-center">
            <BookOpen className="w-4 h-4 text-purple-600" />
          </div>
          <p className="text-2xl font-black text-charcoal-900 tracking-tighter mt-1">{ventMessages.length}</p>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-tight">Vents Shared</p>
        </div>
        <a href="/portal/client/messages" className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col gap-1 hover:shadow-md hover:border-indigo-300 transition group">
          <div className="w-8 h-8 bg-indigo-50 rounded-xl flex items-center justify-center group-hover:bg-indigo-100 transition">
            <MessageSquare className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="flex items-center gap-1.5 mt-1">
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            <p className="text-xl font-black text-charcoal-900 tracking-tighter">Live</p>
          </div>
          <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest leading-tight">Messages →</p>
        </a>
        <button onClick={() => setActiveTab("needs")} className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col gap-1 hover:shadow-md hover:border-amber-300 transition group text-left w-full">
          <div className="w-8 h-8 bg-amber-50 rounded-xl flex items-center justify-center group-hover:bg-amber-100 transition">
            <AlertCircle className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-xl font-black text-charcoal-900 tracking-tighter mt-1">Needs</p>
          <p className="text-[10px] font-bold text-amber-600 uppercase tracking-widest leading-tight">Request Help →</p>
        </button>
      </div>

      {/* QUICK STATS ───────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <a href="/portal/client/goals" className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col gap-1 hover:shadow-md hover:border-teal-300 transition group">
          <div className="w-8 h-8 bg-teal-50 rounded-xl flex items-center justify-center group-hover:bg-teal-100 transition">
            <CheckCircle2 className="w-4 h-4 text-teal-600" />
          </div>
          <p className="text-xl font-black text-charcoal-900 tracking-tighter mt-1">Goals</p>
          <p className="text-[10px] font-bold text-teal-600 uppercase tracking-widest leading-tight">Track Progress →</p>
        </a>
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col gap-1 hover:shadow-md transition">
          <div className="w-8 h-8 bg-purple-50 rounded-xl flex items-center justify-center">
            <BookOpen className="w-4 h-4 text-purple-600" />
          </div>
          <p className="text-2xl font-black text-charcoal-900 tracking-tighter mt-1">{ventMessages.length}</p>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-tight">Vents Shared</p>
        </div>
        <a href="/portal/client/messages" className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col gap-1 hover:shadow-md hover:border-indigo-300 transition group">
          <div className="w-8 h-8 bg-indigo-50 rounded-xl flex items-center justify-center group-hover:bg-indigo-100 transition">
            <MessageSquare className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="flex items-center gap-1.5 mt-1">
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            <p className="text-xl font-black text-charcoal-900 tracking-tighter">Live</p>
          </div>
          <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest leading-tight">Messages →</p>
        </a>
        <button onClick={() => setActiveTab("needs")} className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col gap-1 hover:shadow-md hover:border-amber-300 transition group text-left w-full">
          <div className="w-8 h-8 bg-amber-50 rounded-xl flex items-center justify-center group-hover:bg-amber-100 transition">
            <AlertCircle className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-xl font-black text-charcoal-900 tracking-tighter mt-1">Needs</p>
          <p className="text-[10px] font-bold text-amber-600 uppercase tracking-widest leading-tight">Request Help →</p>
        </button>
      </div>

      {/* QUICK LAUNCH ────────────────────────────────────────── */}
      <div className="flex flex-wrap gap-3">
        <a
          href={process.env.NEXT_PUBLIC_TEAMS_URL ?? "https://teams.microsoft.com"}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#6264A7] hover:bg-[#4f51a3] text-white text-sm font-semibold rounded-2xl shadow-sm transition-all active:scale-95"
        >
          <Video className="w-4 h-4" />
          Microsoft Teams
          <ExternalLink className="w-3 h-3 opacity-70" />
        </a>
        <a
          href={process.env.NEXT_PUBLIC_ZOOM_URL ?? "https://zoom.us/join"}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#2D8CFF] hover:bg-[#1a7aee] text-white text-sm font-semibold rounded-2xl shadow-sm transition-all active:scale-95"
        >
          <Video className="w-4 h-4" />
          Zoom
          <ExternalLink className="w-3 h-3 opacity-70" />
        </a>
      </div>

      {/* TABS */}
      <div className="flex items-center gap-2 bg-white p-2 rounded-2xl border border-slate-200 shadow-sm overflow-x-auto no-scrollbar flex-wrap">
         {TABS.map(tab => (
           <button 
             key={tab.id}
             onClick={() => setActiveTab(tab.id)}
             className={`flex items-center gap-1.5 px-4 py-2.5 rounded-lg font-bold text-xs transition-all whitespace-nowrap ${
                activeTab === tab.id ? 'bg-teal-600 text-white shadow-lg shadow-teal-500/20' : 'text-slate-500 hover:bg-slate-50 hover:text-charcoal-900'
             }`}
           >
             <tab.icon className="w-3.5 h-3.5" /> {tab.label}
           </button>
         ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* MAIN CONTENT */}
        <div className="lg:col-span-2 space-y-8">

          {/* OVERVIEW TAB */}
          {activeTab === 'overview' && (
            <div className="space-y-6 animate-in slide-in-from-bottom-4">
              <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm">
                <h2 className="text-2xl font-black text-charcoal-900 mb-3">Welcome to Your Portal</h2>
                <p className="text-slate-600 leading-relaxed mb-4">This is your safe space to track your journey, access resources, and connect with support. Everything here is designed for your growth and wellbeing.</p>
                <div className="flex flex-wrap gap-3">
                  <a href="https://accounts.google.com/ServiceLogin?service=mail&continue=https://chat.google.com" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition text-sm font-bold">
                    <MessageSquare className="w-4 h-4" /> Chat with Mack
                  </a>
                  <a href="https://chat.google.com/room/AAQABMc-VMI?cls=7" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition text-sm font-bold">
                    <Users className="w-4 h-4" /> Join Team Channel
                  </a>
                  <a href="https://forms.cloud.microsoft/Pages/ResponsePage.aspx?id=DQSIkWdsW0yxEjajBLZtrQAAAAAAAAAAAAMAAZQOUnpUMzFSVENWT1NFWUhIMFpPRUhKQVhPTkhTVy4u" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition text-sm font-bold">
                    <Upload className="w-4 h-4" /> Submit Feedback Form
                  </a>
                </div>
              </div>

              <div className="bg-gradient-to-br from-emerald-50 to-teal-50 p-8 rounded-[2rem] border border-teal-200 shadow-sm">
                <h3 className="text-lg font-bold text-emerald-900 mb-4 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5" /> Quick Wins This Week
                </h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3 bg-white rounded-lg">
                    <div className="w-5 h-5 rounded border-2 border-emerald-500 flex items-center justify-center mt-0.5">
                      <Check className="w-3 h-3 text-emerald-500" />
                    </div>
                    <div>
                      <p className="font-bold text-sm text-charcoal-900">Challenge yourself today</p>
                      <p className="text-xs text-slate-500">Join a resource or take one action toward your goal</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-white rounded-lg">
                    <div className="w-5 h-5 rounded border-2 border-emerald-500 flex items-center justify-center mt-0.5" />
                    <div>
                      <p className="font-bold text-sm text-charcoal-900">Journal your feelings</p>
                      <p className="text-xs text-slate-500">Head to Wellness and write what's on your mind</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm">
                <h3 className="text-lg font-bold text-charcoal-900 mb-4">How are you feeling today?</h3>
                <div className="flex gap-3">
                   {[ { id: 'happy' as MoodType, icon: '😊', color: 'bg-green-100 text-green-700' },
                      { id: 'good' as MoodType, icon: '🙂', color: 'bg-teal-100 text-teal-700' },
                      { id: 'neutral' as MoodType, icon: '😐', color: 'bg-slate-100 text-slate-700' },
                      { id: 'stressed' as MoodType, icon: '😟', color: 'bg-amber-100 text-amber-700' },
                      { id: 'bad' as MoodType, icon: '😔', color: 'bg-rose-100 text-rose-700' }
                    ].map(e => (
                      <button 
                        key={e.id}
                        onClick={() => setMood(e.id)}
                        className={`flex flex-col items-center gap-2 flex-1 p-3 rounded-lg border-2 transition-all ${
                          mood === e.id ? `border-indigo-500 scale-105 shadow-md ${e.color}` : 'border-slate-100 hover:border-slate-200'
                        }`}
                      >
                        <span className="text-2xl">{e.icon}</span>
                      </button>
                    ))}
                </div>
              </div>
            </div>
          )}

          {/* WELLNESS TAB */}
          {activeTab === 'wellness' && (
            <div className="space-y-6 animate-in slide-in-from-bottom-4">
              <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm">
                <h3 className="text-xl font-bold text-charcoal-900 mb-4 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-indigo-600" /> My Daily Journal
                </h3>
                <textarea 
                  value={journalContent}
                  onChange={(e) => setJournalContent(e.target.value)}
                  placeholder="Write your thoughts for today... What was your biggest win? What are you grateful for?"
                  className="w-full h-40 bg-slate-50 border border-slate-100 rounded-lg p-4 text-slate-700 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-teal-500/20 transition mb-4 font-serif text-sm leading-relaxed"
                />
                <button 
                  onClick={handleAddJournal}
                  className="w-full bg-indigo-600 text-white font-bold px-4 py-3 rounded-lg hover:bg-indigo-700 transition flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20"
                >
                  Save Journal Entry <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* RESOURCES TAB */}
          {activeTab === 'resources' && (
            <div className="space-y-6 animate-in slide-in-from-bottom-4">
              <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm">
                <h3 className="text-xl font-bold text-charcoal-900 mb-4 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-emerald-600" /> 💰 Free Financial Management Courses
                </h3>
                <div className="space-y-3">
                  {FINANCIAL_COURSES.map((course, i) => (
                    <a key={i} href={course.url} target="_blank" rel="noopener noreferrer" className="block p-4 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-lg hover:shadow-md transition">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-bold text-charcoal-900 text-sm">{course.title}</p>
                          <p className="text-xs text-slate-600 mt-1">{course.description}</p>
                        </div>
                        <ExternalLink className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      </div>
                    </a>
                  ))}
                </div>
              </div>

              <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm">
                <h3 className="text-xl font-bold text-charcoal-900 mb-4 flex items-center gap-2">
                  <Heart className="w-5 h-5 text-rose-600" /> 💪 Anger & Emotional Management
                </h3>
                <div className="space-y-3">
                  {ANGER_MANAGEMENT.map((course, i) => (
                    <a key={i} href={course.url} target="_blank" rel="noopener noreferrer" className="block p-4 bg-gradient-to-r from-rose-50 to-amber-50 border border-rose-200 rounded-lg hover:shadow-md transition">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-bold text-charcoal-900 text-sm">{course.title}</p>
                          <p className="text-xs text-slate-600 mt-1">{course.description}</p>
                        </div>
                        <ExternalLink className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                      </div>
                    </a>
                  ))}
                </div>
              </div>

              <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm">
                <h3 className="text-xl font-bold text-charcoal-900 mb-4 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-indigo-600" /> 🤝 AA/NA Meetings & Support
                </h3>
                <p className="text-xs text-slate-600 mb-4">San Diego area meetings (online & in-person)</p>
                <div className="space-y-3">
                  {AA_NA_MEETINGS.map((meeting, i) => (
                    <div key={i} className="p-4 bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-bold text-charcoal-900 text-sm">{meeting.type} - {meeting.location}</p>
                          <p className="text-xs text-slate-600 mt-1 flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {meeting.time}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2 pt-2">
                        <a href={`tel:${meeting.phone}`} className="text-xs font-bold text-indigo-600 hover:text-indigo-700 bg-white px-3 py-1.5 rounded flex items-center gap-1">
                          Call: {meeting.phone}
                        </a>
                        <a href={meeting.url} target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-indigo-600 hover:text-indigo-700 bg-white px-3 py-1.5 rounded flex items-center gap-1">
                          <ExternalLink className="w-3 h-3" /> Details
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-slate-500 mt-4 p-3 bg-slate-50 rounded">
                  <span className="font-bold">📚 AA Literature:</span> <a href="https://www.sandiegocountyaa.org" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">sandiegocountyaa.org</a> • 
                  <span className="font-bold ml-2">📚 NA Literature:</span> <a href="https://www.sandiegona.org" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">sandiegona.org</a>
                </p>
              </div>
            </div>
          )}

          {/* COMMUNITY TAB */}
          {activeTab === 'community' && (
            <div className="space-y-6 animate-in slide-in-from-bottom-4">
              <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm">
                <h3 className="text-xl font-bold text-charcoal-900 mb-2 flex items-center gap-2">
                  <Smile className="w-5 h-5 text-teal-600" /> Positive Vibes Board
                </h3>
                <p className="text-xs text-slate-600 mb-4">Share encouragement and celebrate wins</p>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    placeholder="Share a positive message or win..." 
                    value={feedbackContent}
                    onChange={(e) => setFeedbackContent(e.target.value)}
                    className="flex-1 bg-slate-50 border border-slate-100 rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-teal-500/20"
                  />
                  <button 
                    onClick={handleAddFeedback}
                    className="bg-teal-600 text-white font-bold px-4 py-2 rounded-lg hover:bg-teal-700 transition"
                  >
                    Post
                  </button>
                </div>
              </div>

              <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm">
                <h3 className="text-xl font-bold text-charcoal-900 mb-4 flex items-center gap-2">
                  <Heart className="w-5 h-5 text-rose-600" /> Anonymous Community Corner
                </h3>
                <p className="text-xs text-slate-600 mb-4">🔒 Completely anonymous. Share, vent, process your feelings without judgment.</p>
                <div>
                  <textarea 
                    value={ventMessage}
                    onChange={(e) => setVentMessage(e.target.value)}
                    placeholder="What's on your mind? You're safe here and completely anonymous..."
                    className="w-full h-24 bg-slate-50 border border-slate-100 rounded-lg p-4 text-sm outline-none focus:ring-2 focus:ring-rose-500/20 resize-none"
                  />
                  <button 
                    onClick={submitVent}
                    className="w-full mt-3 bg-rose-600 text-white font-bold px-4 py-2.5 rounded-lg hover:bg-rose-700 transition flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" /> Share Anonymously
                  </button>
                </div>

                {ventMessages.length > 0 && (
                  <div className="mt-6 space-y-3">
                    <p className="text-xs font-bold text-slate-500 uppercase">Community Messages</p>
                    {ventMessages.map((msg) => (
                      <div key={msg.id} className="p-4 bg-gradient-to-r from-purple-50 to-rose-50 border border-purple-200 rounded-lg text-sm">
                        <p className="text-charcoal-900 italic mb-2">\"{msg.msg}\"</p>
                        <p className="text-xs text-slate-500">—Anonymous • {msg.time}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* IMMEDIATE NEEDS TAB */}
          {activeTab === 'needs' && (
            <div className="space-y-6 animate-in slide-in-from-bottom-4">
              <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm">
                <h3 className="text-xl font-bold text-charcoal-900 mb-4 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-amber-600" /> 📋 Immediate Needs Assessment
                </h3>
                <div className="space-y-4">
                  <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                    <p className="font-bold text-charcoal-900 text-sm mb-2">Housing Stability</p>
                    <div className="flex gap-2 flex-wrap">
                      <button className="text-xs px-3 py-1 bg-white border border-amber-300 rounded hover:bg-amber-50 transition">Urgent</button>
                      <button className="text-xs px-3 py-1 bg-white border border-amber-300 rounded hover:bg-amber-50 transition">Stable but at risk</button>
                      <button className="text-xs px-3 py-1 bg-white border border-amber-300 rounded hover:bg-amber-50 transition">Stable</button>
                    </div>
                  </div>

                  <div className="p-4 bg-rose-50 border border-rose-200 rounded-lg">
                    <p className="font-bold text-charcoal-900 text-sm mb-2">👕 Clothing Request</p>
                    <div className="space-y-3">
                      <div>
                        <label className="text-xs font-bold text-slate-600 block mb-1">I need clothing for</label>
                        <select title="I need clothing for" value={clothingSizes.gender} onChange={e => setClothingSizes({...clothingSizes, gender: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-rose-500/20">
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                        </select>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <div>
                          <label className="text-xs font-bold text-slate-600 block mb-1">Shirt</label>
                          <select title="Shirt size" value={clothingSizes.shirt} onChange={e => setClothingSizes({...clothingSizes, shirt: e.target.value})} className="w-full px-2 py-2 border border-slate-200 rounded text-xs outline-none focus:ring-2 focus:ring-rose-500/20">
                            <option>XS</option><option>S</option><option>M</option><option>L</option><option>XL</option><option>2XL</option><option>3XL</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-xs font-bold text-slate-600 block mb-1">Pants</label>
                          <input type="text" value={clothingSizes.pants} onChange={e => setClothingSizes({...clothingSizes, pants: e.target.value})} placeholder="32" className="w-full px-2 py-2 border border-slate-200 rounded text-xs outline-none focus:ring-2 focus:ring-rose-500/20" />
                        </div>
                        <div>
                          <label className="text-xs font-bold text-slate-600 block mb-1">Shoe</label>
                          <input type="text" value={clothingSizes.shoes} onChange={e => setClothingSizes({...clothingSizes, shoes: e.target.value})} placeholder="10" className="w-full px-2 py-2 border border-slate-200 rounded text-xs outline-none focus:ring-2 focus:ring-rose-500/20" />
                        </div>
                      </div>
                      <button 
                        onClick={submitClothingRequest}
                        className="w-full bg-rose-600 text-white font-bold py-2 rounded-lg hover:bg-rose-700 transition text-sm"
                      >
                        Submit Clothing Request
                      </button>
                    </div>
                  </div>

                  <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
                    <p className="font-bold text-charcoal-900 text-sm mb-2">🥗 Food Security</p>
                    <a href="https://www.feedingsandiego.org" target="_blank" rel="noopener noreferrer" className="text-xs text-emerald-600 hover:underline font-bold flex items-center gap-1">
                      Feeding San Diego Resources <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>

                  <div className="p-4 bg-sky-50 border border-sky-200 rounded-lg">
                    <p  className="font-bold text-charcoal-900 text-sm mb-2">🏥 Healthcare Access</p>
                    <a href="https://www.sandiegocounty.gov" target="_blank" rel="noopener noreferrer" className="text-xs text-sky-600 hover:underline font-bold flex items-center gap-1">
                      San Diego County Health Services <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* IT'S OKAY NOT TO BE OKAY TAB */}
          {activeTab === 'okay' && (
            <div className="space-y-6 animate-in slide-in-from-bottom-4">
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-8 rounded-[2rem] border border-purple-300 shadow-sm">
                <h2 className="text-3xl font-black text-purple-900 mb-3">It's Okay Not to Be Okay</h2>
                <p className="text-purple-800 leading-relaxed font-medium mb-4">
                  Asking for help is a sign of strength, not weakness. Every single person struggles sometimes. You're not alone, and reaching out — like you're doing right now — is exactly what healing looks like.
                </p>
              </div>

              <div className="space-y-4">
                {[
                  { title: "Crisis Resources (24/7)", desc: "If you're in crisis, help is immediately available", items: ["National Suicide Prevention: 988", "Crisis Text Line: Text HOME to 741741", "San Diego 211: Dial 211"] },
                  { title: "Your feelings are valid", desc: "Whatever you're experiencing is real and matters", items: ["Sadness. Anger. Confusion. Disappointment. All okay.", "Your pace is your pace. No judgment here.", "Growth isn't linear. Setbacks happen."] },
                  { title: "You deserve support", desc: "Professional help can change your life", items: ["NAMI Peer Support: (619) 491-NAMI", "Community Mental Health Center: hotline available", "Therapy is for everyone, not just 'sick' people"] }
                ].map((section, i) => (
                  <div key={i} className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm">
                    <h3 className="font-bold text-charcoal-900 mb-2">{section.title}</h3>
                    <p className="text-xs text-slate-600 mb-4">{section.desc}</p>
                    <ul className="space-y-2">
                      {section.items.map((item, j) => (
                        <li key={j} className="text-sm text-charcoal-900 flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-purple-500 shrink-0 mt-0.5" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm">
                <h3 className="text-lg font-bold text-charcoal-900 mb-3">💬 What's something you're struggling with right now?</h3>
                <textarea 
                  placeholder="Write it here. No judgment. No filters. Just honesty..."
                  rows={6}
                  className="w-full bg-slate-50 border border-slate-100 rounded-lg p-4 text-sm outline-none focus:ring-2 focus:ring-purple-500/20"
                />
                <button className="w-full mt-3 bg-purple-600 text-white font-bold py-3 rounded-lg hover:bg-purple-700 transition">
                  Save My Thoughts Privately
                </button>
              </div>
            </div>
          )}

          {/* WHAT'S YOUR WHY TAB */}
          {activeTab === 'why' && (
            <div className="space-y-6 animate-in slide-in-from-bottom-4">
              <div className="bg-gradient-to-br from-indigo-50 to-blue-50 p-8 rounded-[2rem] border border-indigo-300 shadow-sm">
                <h2 className="text-3xl font-black text-indigo-900 mb-3">What's Your Why?</h2>
                <p className="text-indigo-800 leading-relaxed font-medium">
                  Your 'Why' is your anchor. When things get hard, it reminds you why you started. Your reason. Your dream. Your purpose. Let's get clear on it.
                </p>
              </div>

              <div className="space-y-4">
                {[
                  { q: "What does your ideal future look like?", hint: "Describe it in vivid detail. Where are you? What are you doing? Who's with you?" },
                  { q: "What do you want for your family or loved ones?", hint: "What impact do you want to have? What legacy?" },
                  { q: "What would your past self want you to know?", hint: "The version of you from 5 years ago — what would they tell you?" },
                  { q: "When was the last time you felt truly proud of yourself?", hint: "What led to that moment? Can you recreate that feeling?" }
                ].map((item, i) => (
                  <div key={i} className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm">
                    <h3 className="font-bold text-charcoal-900 mb-1 text-sm">{item.q}</h3>
                    <p className="text-xs text-slate-500 mb-3 italic">{item.hint}</p>
                    <textarea 
                      placeholder="Write your answer..."
                      rows={4}
                      className="w-full bg-slate-50 border border-slate-100 rounded-lg p-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500/20"
                    />
                  </div>
                ))}
              </div>

              <div className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white p-8 rounded-[2rem] shadow-lg">
                <h3 className="text-xl font-bold mb-2">🎯 Your Why Statement</h3>
                <p className="text-sm mb-4 text-white/90">Create a powerful statement that reminds you why you're doing this. Say it to yourself every morning.</p>
                <textarea 
                  placeholder='"I am fighting for __________ because __________. My future is worth it."'
                  rows={4}
                  className="w-full bg-white/10 border border-white/20 text-white rounded-lg p-4 text-sm outline-none focus:ring-2 focus:ring-white/50 placeholder:text-white/50 resize-none"
                />
                <button className="w-full mt-3 bg-white text-indigo-600 font-bold py-3 rounded-lg hover:bg-blue-50 transition">
                  Save My Why
                </button>
              </div>
            </div>
          )}
        </div>

        {/* SIDEBAR */}
        <div className="space-y-6">
          
          {/* Self-Care Tips */}
          <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm sticky top-4">
            <h3 className="text-lg font-bold text-charcoal-900 mb-4 flex items-center gap-2">
              <Heart className="w-5 h-5 text-rose-500" /> Self-Care Today
            </h3>
            <div className="space-y-3">
              <div className="p-3 bg-gradient-to-r from-teal-50 to-blue-50 border border-teal-100 rounded-lg">
                <p className="text-xs font-bold text-charcoal-900 mb-1">💧 Hydrate</p>
                <p className="text-[11px] text-slate-600">Drink a glass of water right now</p>
              </div>
              <div className="p-3 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-100 rounded-lg">
                <p className="text-xs font-bold text-charcoal-900 mb-1">🚶 Move</p>
                <p className="text-[11px] text-slate-600">A 5-minute walk can reset your mood</p>
              </div>
              <div className="p-3 bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-100 rounded-lg">
                <p className="text-xs font-bold text-charcoal-900 mb-1">🎁 Celebrate</p>
                <p className="text-[11px] text-slate-600">Write down one thing you're doing well</p>
              </div>
              <div className="p-3 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-100 rounded-lg">
                <p className="text-xs font-bold text-charcoal-900 mb-1">❤️ Breathe</p>
                <p className="text-[11px] text-slate-600">5 deep breaths. In through nose, out through mouth</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-6 rounded-[2rem] border border-indigo-200 shadow-sm">
            <p className="text-sm font-bold text-indigo-900 mb-2">🌟 You're Doing Great</p>
            <p className="text-xs text-indigo-800 leading-relaxed">The fact that you're here, taking steps to improve your life, shows incredible strength. Keep going. You've got this.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
