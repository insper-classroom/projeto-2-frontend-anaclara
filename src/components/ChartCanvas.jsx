import { useEffect, useRef } from "react";

export default function ChartCanvas({ data=[] }) {
  const ref = useRef(null);
  useEffect(()=>{
    if (!ref.current || data.length<2) return;
    const c = ref.current, ctx = c.getContext("2d");
    const w=c.width=900, h=c.height=360, P={l:48,r:16,t:14,b:28};
    ctx.clearRect(0,0,w,h);
    const ymin=Math.min(...data), ymax=Math.max(...data);
    ctx.strokeStyle="#e5e7eb"; for(let i=0;i<=4;i++){const y=P.t+(h-P.t-P.b)*(i/4); ctx.beginPath(); ctx.moveTo(P.l,y); ctx.lineTo(w-P.r,y); ctx.stroke();}
    ctx.beginPath(); ctx.strokeStyle="#0b2a6f"; ctx.lineWidth=2;
    data.forEach((v,i)=>{ const x=P.l+(w-P.l-P.r)*(i/(data.length-1)); const y=P.t+(h-P.t-P.b)*(1-(v-ymin)/(ymax-ymin||1)); i?ctx.lineTo(x,y):ctx.moveTo(x,y); });
    ctx.stroke();
  },[data]);
  return <canvas id="chart" ref={ref} />;
}