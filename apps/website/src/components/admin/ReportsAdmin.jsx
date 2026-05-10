import React, { useState, useEffect } from "react";
import {
  BarChart3, Download, Calendar, Users, GraduationCap, File,
  Eye, Trophy, RefreshCw, TrendingUp, MapPin, BookOpen,
  AlertCircle, Clock, ArrowRight, User,
} from "lucide-react";
import { getAuthToken } from "../../services/api/core";

const TABS = [
  { id: "overview",   label: "Overview",    icon: BarChart3 },
  { id: "pipeline",   label: "Pipeline",    icon: TrendingUp },
  { id: "sessions",   label: "Sessions",    icon: Calendar },
  { id: "students",   label: "Students",    icon: Users },
  { id: "cellgroups", label: "Cell Groups", icon: MapPin },
  { id: "sermons",    label: "Sermons",     icon: BookOpen },
  { id: "resources",  label: "Resources",   icon: File },
];

const ReportsAdmin = () => {
  const [reportData, setReportData] = useState({
    discipleshipClasses: [], sessions: [], discipleshipRegistrations: [],
    resources: [], membershipRenewals: [], foundationRegistrations: [],
    eventSignups: [], cellGroups: [], joinRequests: [], sermons: [],
  });
  const [loading, setLoading] = useState(true);
  const [activeReport, setActiveReport] = useState("overview");
  const [dateRange, setDateRange] = useState({
    start: new Date(new Date().setMonth(new Date().getMonth() - 6)).toISOString().split("T")[0],
    end: new Date().toISOString().split("T")[0],
  });

  useEffect(() => { fetchReportData(); }, []);

  const fetchReportData = async () => {
    setLoading(true);
    try {
      const auth = { Authorization: `Bearer ${getAuthToken()}` };
      const safe = async (res, name) => {
        try {
          if (!res.ok) { console.warn(`${name} returned ${res.status}`); return { success: false, data: [] }; }
          const json = await res.json();
          // Some endpoints return a plain array, others return { success, data }
          if (Array.isArray(json)) return { success: true, data: json };
          return json;
        } catch { return { success: false, data: [] }; }
      };

      const [d1,d2,d3,d4,d5,d6,d7,d8,d9,d10] = await Promise.all([
        fetch("/api/discipleship/classes").then(r => safe(r,"Classes")),
        fetch("/api/discipleship/sessions").then(r => safe(r,"Sessions")),
        fetch("/api/discipleship/registrations",{headers:auth}).then(r => safe(r,"DiscRegs")),
        fetch("/api/resources").then(r => safe(r,"Resources")),
        fetch("/api/membership/renewals",{headers:auth}).then(r => safe(r,"Renewals")),
        fetch("/api/foundation-classes/registrations",{headers:auth}).then(r => safe(r,"FoundRegs")),
        fetch("/api/event-signup-requests",{headers:auth}).then(r => safe(r,"Events")),
        fetch("/api/cell-groups").then(r => safe(r,"CellGroups")),
        fetch("/api/cell-group-join-requests",{headers:auth}).then(r => safe(r,"JoinReqs")),
        fetch("/api/sermons").then(r => safe(r,"Sermons")),
      ]);

      setReportData({
        discipleshipClasses:       d1.success  ? d1.data  : [],
        sessions:                  d2.success  ? d2.data  : [],
        discipleshipRegistrations: d3.success  ? d3.data  : [],
        resources:                 d4.success  ? d4.data  : [],
        membershipRenewals:        d5.success  ? d5.data  : [],
        foundationRegistrations:   d6.success  ? d6.data  : [],
        eventSignups:              d7.success  ? d7.data  : [],
        cellGroups:                d8.success  ? d8.data  : [],
        joinRequests:              d9.success  ? d9.data  : [],
        sermons:                   d10.success ? d10.data : [],
      });
    } catch (e) {
      console.error("Error fetching report data:", e);
    } finally {
      setLoading(false);
    }
  };

  const getFilteredData = () => {
    const start = dateRange.start ? new Date(dateRange.start) : null;
    const end   = dateRange.end   ? new Date(dateRange.end + "T23:59:59") : null;
    const byDate = (items, field) => {
      if (!start && !end) return items;
      return items.filter(item => {
        const d = item[field] ? new Date(item[field]) : null;
        if (!d) return true;
        if (start && d < start) return false;
        if (end   && d > end)   return false;
        return true;
      });
    };
    return {
      discipleshipClasses:       reportData.discipleshipClasses,
      sessions:                  byDate(reportData.sessions,                 "startDate"),
      discipleshipRegistrations: byDate(reportData.discipleshipRegistrations,"registrationDate"),
      resources:                 byDate(reportData.resources,                "createdAt"),
      membershipRenewals:        byDate(reportData.membershipRenewals,       "renewalDate"),
      foundationRegistrations:   byDate(reportData.foundationRegistrations,  "registrationDate"),
      eventSignups:              byDate(reportData.eventSignups,             "createdAt"),
      cellGroups:                reportData.cellGroups,
      joinRequests:              reportData.joinRequests,
      sermons:                   byDate(reportData.sermons,                  "date"),
    };
  };

  // Always uses full unfiltered data so trends are meaningful regardless of date picker
  const getMonthlyTrends = () => {
    const months = Array.from({ length: 6 }, (_, i) => {
      const d = new Date(); d.setDate(1); d.setMonth(d.getMonth() - (5 - i));
      return { label: d.toLocaleDateString("en-US",{month:"short",year:"2-digit"}), y: d.getFullYear(), m: d.getMonth() };
    });
    const inMonth = (items, field, y, m) =>
      items.filter(item => { const d = item[field] ? new Date(item[field]) : null; return d && d.getFullYear()===y && d.getMonth()===m; }).length;
    return months.map(({ label, y, m }) => ({
      label,
      discipleship: inMonth(reportData.discipleshipRegistrations,"registrationDate",y,m),
      foundation:   inMonth(reportData.foundationRegistrations,  "registrationDate",y,m),
      membership:   inMonth(reportData.membershipRenewals,       "renewalDate",y,m),
      events:       inMonth(reportData.eventSignups,             "createdAt",y,m),
    }));
  };

  const getNeedsAttention = () => {
    const cutoff = new Date(); cutoff.setDate(cutoff.getDate() - 7);
    const oldPending = (items, field) =>
      items.filter(r => r.status === "pending" && new Date(r[field]||0) < cutoff).length;
    const nearCap = reportData.sessions.filter(s => {
      if (!s.capacity) return false;
      const enrolled = reportData.discipleshipRegistrations.filter(r => r.sessionId?._id === s._id).length;
      return enrolled / s.capacity >= 0.9;
    });
    return {
      oldPendingDiscipleship: oldPending(reportData.discipleshipRegistrations,"registrationDate"),
      oldPendingMembership:   oldPending(reportData.membershipRenewals,       "renewalDate"),
      oldPendingFoundation:   oldPending(reportData.foundationRegistrations,  "registrationDate"),
      nearCapSessions: nearCap,
    };
  };

  const getPipeline = () => {
    const fTotal     = reportData.foundationRegistrations.length;
    const fCompleted = reportData.foundationRegistrations.filter(r=>r.status==="completed").length;
    const dTotal     = reportData.discipleshipRegistrations.length;
    const dCompleted = reportData.discipleshipRegistrations.filter(r=>r.status==="completed").length;
    return [
      { label:"Foundation\nRegistered",  value:fTotal,     bg:"bg-gray-100 dark:bg-gray-700",         text:"text-gray-700 dark:text-gray-300" },
      { label:"Foundation\nCompleted",   value:fCompleted, bg:"bg-yellow-50 dark:bg-yellow-900/20",   text:"text-yellow-700 dark:text-yellow-300" },
      { label:"Discipleship\nEnrolled",  value:dTotal,     bg:"bg-red-50 dark:bg-red-900/20",         text:"text-red-600 dark:text-red-400" },
      { label:"Discipleship\nCompleted", value:dCompleted, bg:"bg-green-50 dark:bg-green-900/20",     text:"text-green-600 dark:text-green-400" },
    ];
  };

  const genOverview = (data) => {
    const { discipleshipClasses:dc=[], sessions:s=[], discipleshipRegistrations:dr=[],
            resources:res=[], membershipRenewals:mr=[], foundationRegistrations:fr=[],
            eventSignups:ev=[], joinRequests:jr=[] } = data;
    const allRegs = [...dr,...mr,...fr,...ev];
    const approved = jr.filter(r=>r.status==="approved").length;
    return {
      totalDiscipleshipClasses: dc.length,
      totalDiscipleshipSessions: s.length,
      totalAllRegistrations: allRegs.length,
      totalResources: res.length,
      totalCellGroupMembers: approved,
      activeSessions: s.filter(x=>x.status==="active").length,
      pendingRequests:   allRegs.filter(r=>r.status==="pending").length,
      approvedRequests:  [...dr.filter(r=>r.status==="approved"||r.status==="attending"),
                          ...mr.filter(r=>r.status==="approved"),
                          ...fr.filter(r=>r.status==="approved"||r.status==="attending"),
                          ...ev.filter(r=>r.status==="approved")].length,
      completedStudents: allRegs.filter(r=>r.status==="completed").length,
      averageAttendance: dr.length ? Math.round(dr.reduce((s,r)=>s+(r.attendancePercentage||0),0)/dr.length) : 0,
      classLevels: dc.reduce((a,c)=>{a[c.level]=(a[c.level]||0)+1;return a;},{}),
      requestTypes:{ Discipleship:dr.length, Foundation:fr.length, Membership:mr.length, Events:ev.length },
    };
  };

  const genSessions = (data) => {
    const { sessions:s=[], discipleshipRegistrations:dr=[] } = data;
    return s.map(session => {
      const regs = dr.filter(r=>r.sessionId?._id===session._id);
      const done = regs.filter(r=>r.status==="completed").length;
      const avg  = regs.length ? regs.reduce((s,r)=>s+(r.attendancePercentage||0),0)/regs.length : 0;
      return { ...session, registrationCount:regs.length, completedCount:done,
        completionRate: regs.length ? Math.round((done/regs.length)*100) : 0,
        averageAttendance: Math.round(avg),
        utilizationRate: session.capacity ? Math.round((regs.length/session.capacity)*100) : 0 };
    });
  };

  const genStudents = (data) => {
    const dr = data.discipleshipRegistrations || [];
    const statusBreakdown = dr.reduce((a,r)=>{a[r.status]=(a[r.status]||0)+1;return a;},{});
    const attendanceRanges = dr.reduce((a,r)=>{
      const p=r.attendancePercentage||0;
      if(p>=90) a.excellent=(a.excellent||0)+1;
      else if(p>=80) a.good=(a.good||0)+1;
      else if(p>=70) a.fair=(a.fair||0)+1;
      else a.poor=(a.poor||0)+1;
      return a;
    },{});
    return { totalStudents:dr.length, statusBreakdown, attendanceRanges };
  };

  const genCellGroups = (data) => {
    const { cellGroups:cg=[], joinRequests:jr=[] } = data;
    const approved = jr.filter(r=>r.status==="approved");
    const pending  = jr.filter(r=>r.status==="pending");
    const withCounts = cg.map(g=>({
      ...g,
      memberCount: approved.filter(r=>r.cellGroupId===g._id||r.cellGroup?._id===g._id).length
    })).sort((a,b)=>b.memberCount-a.memberCount);
    return { totalGroups:cg.length, totalMembers:approved.length, pendingJoinRequests:pending.length, groupsWithCounts:withCounts };
  };

  const genSermons = (data) => {
    const s = data.sermons || [];
    const speakerBreakdown = s.reduce((a,x)=>{a[x.speaker]=(a[x.speaker]||0)+1;return a;},{});
    const seriesBreakdown  = s.reduce((a,x)=>{if(x.series)a[x.series]=(a[x.series]||0)+1;return a;},{});
    const months = Array.from({length:6},(_,i)=>{
      const d=new Date(); d.setDate(1); d.setMonth(d.getMonth()-(5-i));
      return { label:d.toLocaleDateString("en-US",{month:"short",year:"2-digit"}), y:d.getFullYear(), m:d.getMonth() };
    });
    const monthlyOutput = months.map(({label,y,m})=>({
      label, count: s.filter(x=>{ const d=x.date?new Date(x.date):null; return d&&d.getFullYear()===y&&d.getMonth()===m; }).length
    }));
    const topSpeakers = Object.entries(speakerBreakdown).sort((a,b)=>b[1]-a[1]).slice(0,5);
    return { totalSermons:s.length, speakerBreakdown, seriesBreakdown, monthlyOutput, topSpeakers };
  };

  const genResources = (data) => {
    const r = data.resources || [];
    return {
      totalResources: r.length,
      totalDownloads: r.reduce((s,x)=>s+(x.downloads||0),0),
      totalViews:     r.reduce((s,x)=>s+(x.views||0),0),
      topResources:   [...r].sort((a,b)=>(b.downloads||0)-(a.downloads||0)).slice(0,10),
    };
  };

  const downloadCSV = (csv, name) => {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([csv],{type:"text/csv"}));
    a.download = name; a.click();
  };

  const exportReport = () => {
    const f = getFilteredData();
    const dt = new Date().toISOString().split("T")[0];
    const join = rows => rows.map(r=>r.join(",")).join("\n");
    switch (activeReport) {
      case "sessions": return downloadCSV(join([
        ["Session","Class","Start","End","Capacity","Enrolled","Completed","Completion","Avg Att","Utilization"],
        ...genSessions(f).map(s=>[s.cohortName,s.classId?.title||"",
          s.startDate?new Date(s.startDate).toLocaleDateString():"",
          s.endDate?new Date(s.endDate).toLocaleDateString():"",
          s.capacity,s.registrationCount,s.completedCount,
          `${s.completionRate}%`,`${s.averageAttendance}%`,`${s.utilizationRate}%`])
      ]),`session-report-${dt}.csv`);
      case "students": return downloadCSV(join([
        ["Name","Email","Class","Session","Status","Registered","Attendance"],
        ...f.discipleshipRegistrations.map(r=>[r.fullName,r.email,r.classId?.title||"",
          r.sessionId?.cohortName||"",r.status,
          r.registrationDate?new Date(r.registrationDate).toLocaleDateString():"",
          `${r.attendancePercentage||0}%`])
      ]),`student-report-${dt}.csv`);
      case "cellgroups": return downloadCSV(join([
        ["Group","Leader","Location","Zone","Members"],
        ...genCellGroups(f).groupsWithCounts.map(g=>[g.name,g.leader,g.location,g.zone?.name||g.zone||"",g.memberCount])
      ]),`cell-groups-${dt}.csv`);
      case "sermons": return downloadCSV(join([
        ["Title","Speaker","Series","Date"],
        ...reportData.sermons.map(s=>[s.title,s.speaker,s.series||"",s.date||""])
      ]),`sermon-report-${dt}.csv`);
      case "resources": return downloadCSV(join([
        ["Title","Category","Type","Views","Downloads","Featured","Created"],
        ...reportData.resources.map(r=>[r.title,r.category,r.type,r.views||0,r.downloads||0,
          r.featured?"Yes":"No",r.createdAt||""])
      ]),`resource-report-${dt}.csv`);
      default: {
        const st = genOverview(f);
        return downloadCSV(join([
          ["Metric","Value"],
          ["Discipleship Classes",st.totalDiscipleshipClasses],
          ["Active Sessions",st.activeSessions],
          ["Total Registrations",st.totalAllRegistrations],
          ["Total Resources",st.totalResources],
          ["Cell Group Members",st.totalCellGroupMembers],
          ["Completed Students",st.completedStudents],
          ["Avg Attendance",`${st.averageAttendance}%`],
        ]),`overview-report-${dt}.csv`);
      }
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600" />
    </div>
  );

  const filtered       = getFilteredData();
  const overviewStats  = genOverview(filtered);
  const sessionReport  = genSessions(filtered);
  const studentReport  = genStudents(filtered);
  const cellGrpReport  = genCellGroups(filtered);
  // Sermons and resources are content catalogs — don't date-filter them.
  // formatResponse also converts dates to locale strings which breaks comparison.
  const sermonReport   = genSermons(reportData);
  const resourceReport = genResources(reportData);
  const monthlyTrends  = getMonthlyTrends();
  const attention      = getNeedsAttention();
  const pipeline       = getPipeline();
  const totalAlerts    = attention.oldPendingDiscipleship + attention.oldPendingMembership
                       + attention.oldPendingFoundation + attention.nearCapSessions.length;

  const BarRow = ({ label, value, total, color }) => (
    <div className="flex items-center gap-3">
      <span className="text-sm text-gray-600 dark:text-gray-400 w-24 shrink-0 capitalize">{label}</span>
      <div className="flex-1 bg-gray-100 dark:bg-gray-700 rounded-full h-2">
        <div className={`h-2 rounded-full transition-all ${color}`}
          style={{ width: total > 0 ? `${(value/total)*100}%` : "0%" }} />
      </div>
      <span className="text-sm font-semibold text-gray-900 dark:text-white w-6 text-right shrink-0">{value}</span>
    </div>
  );

  const Card = ({ label, value, icon: Icon, accent }) => (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-5">
      <div className="flex items-center gap-4">
        <div className={`p-3 rounded-lg ${accent ? "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400" : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"}`}>
          <Icon size={20} />
        </div>
        <div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">{value}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{label}</div>
        </div>
      </div>
    </div>
  );

  const Panel = ({ title, children }) => (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-5">
      <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">{title}</h3>
      {children}
    </div>
  );

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-wrap justify-between items-center gap-3">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Reports & Analytics</h1>
        <div className="flex gap-3">
          <button onClick={fetchReportData}
            className="flex items-center gap-2 bg-gray-900 hover:bg-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 text-white px-4 py-2 rounded-md transition-colors text-sm">
            <RefreshCw size={15} /><span>Refresh</span>
          </button>
          <button onClick={exportReport}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition-colors text-sm">
            <Download size={15} /><span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Date range + tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-5">
        <div className="flex flex-wrap gap-4 items-end mb-5">
          {[["From","start"],["To","end"]].map(([lbl,key]) => (
            <div key={key}>
              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wider">{lbl}</label>
              <input type="date" value={dateRange[key]}
                onChange={e => setDateRange(p=>({...p,[key]:e.target.value}))}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm" />
            </div>
          ))}
        </div>
        <div className="flex flex-wrap border-b border-gray-200 dark:border-gray-700">
          {TABS.map(({id,label,icon:Icon}) => (
            <button key={id} onClick={()=>setActiveReport(id)}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px ${
                activeReport===id ? "border-red-600 text-red-600 dark:text-red-400"
                : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"}`}>
              <Icon size={14} />{label}
              {id==="overview" && totalAlerts > 0 && (
                <span className="ml-1 bg-red-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center leading-none">{totalAlerts}</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* ── OVERVIEW ── */}
      {activeReport === "overview" && <>
        {totalAlerts > 0 && (
          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-lg p-5">
            <div className="flex items-center gap-2 mb-3">
              <AlertCircle size={16} className="text-amber-600 dark:text-amber-400" />
              <h3 className="text-sm font-semibold text-amber-800 dark:text-amber-300 uppercase tracking-wider">Needs Attention</h3>
            </div>
            <div className="flex flex-wrap gap-3">
              {[
                [attention.oldPendingDiscipleship, "discipleship registration"],
                [attention.oldPendingFoundation,   "foundation registration"],
                [attention.oldPendingMembership,   "membership renewal"],
              ].filter(([n])=>n>0).map(([n,type])=>(
                <div key={type} className="flex items-center gap-2 bg-white dark:bg-gray-800 rounded-md px-3 py-2 border border-amber-200 dark:border-amber-700">
                  <Clock size={13} className="text-amber-500 shrink-0" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    <strong>{n}</strong> {type}{n!==1?"s":""} pending &gt;7 days
                  </span>
                </div>
              ))}
              {attention.nearCapSessions.map(s=>(
                <div key={s._id} className="flex items-center gap-2 bg-white dark:bg-gray-800 rounded-md px-3 py-2 border border-amber-200 dark:border-amber-700">
                  <AlertCircle size={13} className="text-amber-500 shrink-0" />
                  <span className="text-sm text-gray-700 dark:text-gray-300"><strong>{s.cohortName}</strong> is near capacity</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card label="Discipleship Classes" value={overviewStats.totalDiscipleshipClasses} icon={GraduationCap} accent />
          <Card label="Active Sessions"       value={overviewStats.activeSessions}           icon={Calendar}       accent={false} />
          <Card label="Total Registrations"   value={overviewStats.totalAllRegistrations}    icon={Users}          accent />
          <Card label="Cell Group Members"    value={overviewStats.totalCellGroupMembers}    icon={MapPin}         accent={false} />
        </div>

        {/* Monthly trends bar chart */}
        <Panel title="Registrations — Last 6 Months">
          {(() => {
            const maxT = Math.max(...monthlyTrends.map(m=>m.discipleship+m.foundation+m.membership+m.events),1);
            return <>
              <div className="flex items-end gap-2 sm:gap-3" style={{height:"100px"}}>
                {monthlyTrends.map(m=>{
                  const total=m.discipleship+m.foundation+m.membership+m.events;
                  return (
                    <div key={m.label} className="flex-1 flex flex-col items-center gap-1">
                      <span className="text-xs text-gray-400">{total||""}</span>
                      <div className="w-full overflow-hidden rounded-t" style={{height:"64px",display:"flex",flexDirection:"column-reverse"}}>
                        <div className="w-full bg-red-600"         style={{height:`${(m.discipleship/maxT)*64}px`}} title={`Discipleship: ${m.discipleship}`}/>
                        <div className="w-full bg-red-300"         style={{height:`${(m.foundation/maxT)*64}px`}}   title={`Foundation: ${m.foundation}`}/>
                        <div className="w-full bg-gray-400"        style={{height:`${(m.membership/maxT)*64}px`}}   title={`Membership: ${m.membership}`}/>
                        <div className="w-full bg-gray-200 dark:bg-gray-600" style={{height:`${(m.events/maxT)*64}px`}} title={`Events: ${m.events}`}/>
                      </div>
                      <span className="text-xs text-gray-400 text-center leading-tight">{m.label}</span>
                    </div>
                  );
                })}
              </div>
              <div className="flex flex-wrap gap-4 mt-4 pt-3 border-t border-gray-100 dark:border-gray-700">
                {[["Discipleship","bg-red-600"],["Foundation","bg-red-300"],["Membership","bg-gray-400"],["Events","bg-gray-200 dark:bg-gray-600"]].map(([l,c])=>(
                  <div key={l} className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-sm ${c}`}/><span className="text-xs text-gray-500 dark:text-gray-400">{l}</span>
                  </div>
                ))}
              </div>
            </>;
          })()}
        </Panel>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Panel title="Request Status">
            <div className="space-y-3">
              {[["Pending",overviewStats.pendingRequests,"bg-yellow-400"],
                ["Approved",overviewStats.approvedRequests,"bg-green-500"],
                ["Completed",overviewStats.completedStudents,"bg-gray-800 dark:bg-gray-300"]
              ].map(([l,v,c])=><BarRow key={l} label={l} value={v} total={overviewStats.totalAllRegistrations} color={c}/>)}
            </div>
          </Panel>
          <Panel title="By Type">
            <div className="space-y-3">
              {Object.entries(overviewStats.requestTypes).map(([l,v])=>(
                <BarRow key={l} label={l} value={v} total={overviewStats.totalAllRegistrations} color="bg-red-600"/>
              ))}
            </div>
          </Panel>
          <Panel title="Key Metrics">
            <div className="space-y-4">
              {[["Completed Students",overviewStats.completedStudents,""],
                ["Avg Attendance",overviewStats.averageAttendance,"%"],
                ["Completion Rate",overviewStats.totalAllRegistrations>0?Math.round((overviewStats.completedStudents/overviewStats.totalAllRegistrations)*100):0,"%"]
              ].map(([l,v,s])=>(
                <div key={l} className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">{l}</span>
                  <span className="text-lg font-bold text-gray-900 dark:text-white">{v}{s}</span>
                </div>
              ))}
            </div>
          </Panel>
        </div>
      </>}

      {/* ── PIPELINE ── */}
      {activeReport === "pipeline" && <div className="space-y-4">
        <Panel title="Discipleship Journey">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">How many people progress through each stage of the programme.</p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {pipeline.map((stage,i)=>(
              <React.Fragment key={stage.label}>
                <div className={`flex flex-col items-center justify-center rounded-xl p-5 min-w-[130px] text-center ${stage.bg}`}>
                  <div className={`text-3xl font-bold ${stage.text}`}>{stage.value}</div>
                  <div className={`text-xs font-medium mt-1 whitespace-pre-line ${stage.text} opacity-80`}>{stage.label}</div>
                  {i > 0 && (
                    <div className="text-xs mt-2 text-gray-400">
                      {pipeline[i-1].value > 0 ? Math.round((stage.value/pipeline[i-1].value)*100) : 0}% of prev
                    </div>
                  )}
                </div>
                {i < pipeline.length-1 && <ArrowRight size={20} className="text-gray-300 dark:text-gray-600 shrink-0"/>}
              </React.Fragment>
            ))}
          </div>
        </Panel>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {[
            ["Foundation Class Status", reportData.foundationRegistrations],
            ["Discipleship Class Status", reportData.discipleshipRegistrations],
          ].map(([title, regs])=>(
            <Panel key={title} title={title}>
              {regs.length === 0 ? <p className="text-sm text-gray-400">No data.</p> : (
                <div className="space-y-3">
                  {Object.entries(regs.reduce((a,r)=>{a[r.status]=(a[r.status]||0)+1;return a;},{})).map(([status,count])=>(
                    <BarRow key={status} label={status} value={count} total={regs.length} color="bg-red-600"/>
                  ))}
                </div>
              )}
            </Panel>
          ))}
        </div>
      </div>}

      {/* ── SESSIONS ── */}
      {activeReport === "sessions" && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="p-5 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Session Performance</h3>
          </div>
          {sessionReport.length === 0
            ? <div className="p-12 text-center text-sm text-gray-400">No sessions in this date range.</div>
            : <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-900/40">
                    <tr>{["Session","Class","Enrolled / Cap.","Completion","Avg Att.","Utilization"].map(h=>(
                      <th key={h} className="px-5 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap">{h}</th>
                    ))}</tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {sessionReport.map(s=>(
                      <tr key={s._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                        <td className="px-5 py-4 text-sm font-medium text-gray-900 dark:text-white whitespace-nowrap">{s.cohortName}</td>
                        <td className="px-5 py-4 text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">{s.classId?.title||"—"}</td>
                        <td className="px-5 py-4 text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">{s.registrationCount} / {s.capacity}</td>
                        <td className="px-5 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 inline-flex text-xs font-semibold rounded-full ${
                            s.completionRate>=80?"bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300"
                            :s.completionRate>=60?"bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300"
                            :"bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300"}`}>{s.completionRate}%</span>
                        </td>
                        <td className="px-5 py-4 text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">{s.averageAttendance}%</td>
                        <td className="px-5 py-4 text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">{s.utilizationRate}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
          }
        </div>
      )}

      {/* ── STUDENTS ── */}
      {activeReport === "students" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Panel title="Status Breakdown">
            {Object.keys(studentReport.statusBreakdown).length===0
              ? <p className="text-sm text-gray-400">No data for this range.</p>
              : <div className="space-y-3">{Object.entries(studentReport.statusBreakdown).map(([s,c])=>(
                  <BarRow key={s} label={s} value={c} total={studentReport.totalStudents}
                    color={s==="completed"?"bg-green-500":s==="attending"?"bg-red-600":s==="approved"?"bg-yellow-400":"bg-gray-400"}/>
                ))}</div>}
          </Panel>
          <Panel title="Attendance Distribution">
            {Object.keys(studentReport.attendanceRanges).length===0
              ? <p className="text-sm text-gray-400">No data for this range.</p>
              : <div className="space-y-3">{[
                  {key:"excellent",label:"90 – 100%",color:"bg-green-500"},
                  {key:"good",     label:"80 – 89%", color:"bg-red-600"},
                  {key:"fair",     label:"70 – 79%", color:"bg-yellow-400"},
                  {key:"poor",     label:"Below 70%",color:"bg-gray-400"},
                ].map(({key,label,color})=>(
                  <BarRow key={key} label={label} value={studentReport.attendanceRanges[key]||0}
                    total={studentReport.totalStudents} color={color}/>
                ))}</div>}
          </Panel>
        </div>
      )}

      {/* ── CELL GROUPS ── */}
      {activeReport === "cellgroups" && <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card label="Total Groups"      value={cellGrpReport.totalGroups}         icon={MapPin} accent />
          <Card label="Total Members"     value={cellGrpReport.totalMembers}        icon={Users}  accent={false} />
          <Card label="Pending Requests"  value={cellGrpReport.pendingJoinRequests} icon={Clock}  accent />
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="p-5 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Groups by Members</h3>
          </div>
          {cellGrpReport.groupsWithCounts.length===0
            ? <div className="p-12 text-center text-sm text-gray-400">No cell groups found.</div>
            : <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-900/40">
                    <tr>{["Group","Leader","Location","Meeting","Members"].map(h=>(
                      <th key={h} className="px-5 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap">{h}</th>
                    ))}</tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {cellGrpReport.groupsWithCounts.map(g=>(
                      <tr key={g._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                        <td className="px-5 py-4 text-sm font-medium text-gray-900 dark:text-white">{g.name}</td>
                        <td className="px-5 py-4 text-sm text-gray-500 dark:text-gray-400">{g.leader}</td>
                        <td className="px-5 py-4 text-sm text-gray-500 dark:text-gray-400">{g.location}</td>
                        <td className="px-5 py-4 text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">
                          {[g.meetingDay,g.meetingTime].filter(Boolean).join(" · ")||"—"}
                        </td>
                        <td className="px-5 py-4 text-sm font-semibold text-gray-900 dark:text-white">{g.memberCount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>}
        </div>
      </div>}

      {/* ── SERMONS ── */}
      {activeReport === "sermons" && <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Card label="Total Sermons"   value={sermonReport.totalSermons}                           icon={BookOpen} accent />
          <Card label="Unique Speakers" value={Object.keys(sermonReport.speakerBreakdown).length}  icon={User}     accent={false} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Panel title="Sermons per Month">
            {(() => {
              const max = Math.max(...sermonReport.monthlyOutput.map(m=>m.count),1);
              return (
                <div className="flex items-end gap-2 sm:gap-3" style={{height:"90px"}}>
                  {sermonReport.monthlyOutput.map(m=>(
                    <div key={m.label} className="flex-1 flex flex-col items-center gap-1">
                      <span className="text-xs text-gray-400">{m.count||""}</span>
                      <div className="w-full flex items-end" style={{height:"56px"}}>
                        <div className="w-full bg-red-600 rounded-t transition-all"
                          style={{height:`${(m.count/max)*100}%`,minHeight:m.count>0?"3px":"0"}}/>
                      </div>
                      <span className="text-xs text-gray-400 text-center">{m.label}</span>
                    </div>
                  ))}
                </div>
              );
            })()}
          </Panel>

          <Panel title="Top Speakers">
            {sermonReport.topSpeakers.length===0
              ? <p className="text-sm text-gray-400">No sermon data.</p>
              : <div className="space-y-3">{sermonReport.topSpeakers.map(([speaker,count])=>(
                  <BarRow key={speaker} label={speaker} value={count} total={sermonReport.totalSermons} color="bg-red-600"/>
                ))}</div>}
          </Panel>
        </div>

        {Object.keys(sermonReport.seriesBreakdown).length > 0 && (
          <Panel title="Sermon Series">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {Object.entries(sermonReport.seriesBreakdown).sort((a,b)=>b[1]-a[1]).map(([series,count])=>(
                <div key={series} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-md">
                  <span className="text-sm text-gray-700 dark:text-gray-300 truncate flex-1 mr-2">{series}</span>
                  <span className="text-sm font-semibold text-gray-900 dark:text-white shrink-0">
                    {count} <span className="font-normal text-gray-400">{count===1?"sermon":"sermons"}</span>
                  </span>
                </div>
              ))}
            </div>
          </Panel>
        )}
      </div>}

      {/* ── RESOURCES ── */}
      {activeReport === "resources" && <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card label="Total Resources"  value={resourceReport.totalResources}                  icon={File}     accent />
          <Card label="Total Views"      value={resourceReport.totalViews.toLocaleString()}     icon={Eye}      accent={false} />
          <Card label="Total Downloads"  value={resourceReport.totalDownloads.toLocaleString()} icon={Download} accent />
          <Card label="Top Downloads"    value={resourceReport.topResources[0]?.downloads||0}   icon={Trophy}   accent={false} />
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="p-5 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Top Downloaded Resources</h3>
          </div>
          {resourceReport.topResources.length===0
            ? <div className="p-12 text-center text-sm text-gray-400">No resources in this date range.</div>
            : <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-900/40">
                    <tr>{["Resource","Category","Type","Downloads","Views"].map(h=>(
                      <th key={h} className="px-5 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{h}</th>
                    ))}</tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {resourceReport.topResources.map(r=>(
                      <tr key={r._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                        <td className="px-5 py-4 text-sm font-medium text-gray-900 dark:text-white">{r.title}</td>
                        <td className="px-5 py-4 text-sm text-gray-500 dark:text-gray-400 capitalize">{r.category.replace(/_/g," ")}</td>
                        <td className="px-5 py-4 text-sm text-gray-500 dark:text-gray-400 capitalize">{r.type}</td>
                        <td className="px-5 py-4 text-sm text-gray-500 dark:text-gray-400">{r.downloads||0}</td>
                        <td className="px-5 py-4 text-sm text-gray-500 dark:text-gray-400">{r.views||0}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>}
        </div>
      </div>}

    </div>
  );
};

export default ReportsAdmin;
