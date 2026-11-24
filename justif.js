/* Justificatif d'activité 360Learning — TMK Performances
   Actif seulement si l'adresse contient ?360 (iframes 360Learning) : sans effet dans le LMS interne. */
(function(){
const P=new URLSearchParams(location.search);
const J=window.JUSTIF={actif:P.has('360')||P.has('justificatif'),t0:new Date(),sections:[],essais:0,
 vider(){this.sections=[];this.essais=0;this.t0=new Date();document.querySelectorAll('.justif').forEach(e=>e.remove());},
 bouton(cible){if(!this.actif)return;const c=typeof cible==='string'?document.querySelector(cible):cible;if(!c||c.querySelector('.justif'))return;
  c.insertAdjacentHTML('beforeend','<div class="bilan justif" style="background:#F4E6EE;border-left:5px solid #8C1E70;margin-top:12px"><b>Dernière étape : téléchargez votre justificatif et déposez-le dans 360Learning.</b> Sans ce dépôt, l\'activité n\'est pas considérée comme réalisée.<div class="actions"><button type="button" class="btnJustif">Télécharger mon justificatif (PDF)</button></div></div>');
  c.querySelector('.btnJustif').onclick=()=>J.telecharger();},
 telecharger(){
  if(!window.jspdf){alert('Le PDF ne peut pas être créé sur ce poste. Imprimez la page à la place (Ctrl + P) en choisissant « Enregistrer au format PDF ».');return;}
  const sansHtml=s=>String(s??'').replace(/<br\s*\/?>/gi,'\n').replace(/<\/(p|li|div)>/gi,'\n').replace(/<[^>]+>/g,'').replace(/&nbsp;/g,' ').replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&#39;/g,"'").replace(/&quot;/g,'"');
  const net=s=>sansHtml(s).replace(/[  ]/g,' ').replace(/[‘’]/g,"'").replace(/[“”]/g,'"').replace(/→/g,'->').replace(/≤/g,'<=').replace(/≥/g,'>=').replace(/[✔✘✎📅]/gu,'').replace(/[^\x0a\x20-\xffŒœ€–—…]/g,'').replace(/\n{2,}/g,'\n').trim();
  const d=new window.jspdf.jsPDF({unit:'mm',format:'a4'});const W=210,H=297,M=16,L=W-2*M;let y;const fin=new Date();
  const PR=[140,30,112],FO=[94,19,73],CL=[244,230,238],TX=[60,60,60],GR=[138,122,133],VE=[46,125,79],RO=[176,48,48];
  const hm=x=>x.toLocaleTimeString('fr-FR',{hour:'2-digit',minute:'2-digit'});const dur=Math.max(1,Math.round((fin-J.t0)/60000));
  const pied=()=>{d.setFont('helvetica','normal');d.setFontSize(8);d.setTextColor(...GR);d.text('TMK Performances - N° Siret : 49841924100027 - Code NAF : 8559A',W/2,H-9,{align:'center'});};
  const saut=h=>{if(y+h>H-18){pied();d.addPage();y=18;}};
  const k=document.querySelector('header .k'),h1=document.querySelector('header h1');
  d.setFillColor(...FO);d.rect(0,0,W,30,'F');d.setTextColor(234,211,227);d.setFont('helvetica','bold');d.setFontSize(9);d.text(net(k?k.textContent:'').toUpperCase(),M,11);
  d.setTextColor(255,255,255);d.setFontSize(16);d.text(d.splitTextToSize(net(h1?h1.textContent:document.title),L)[0],M,21);
  d.setFontSize(9);d.setFont('helvetica','normal');d.text("Justificatif d'activité à déposer dans 360Learning",M,27);
  y=38;const info=['Réalisé le '+fin.toLocaleDateString('fr-FR')+', de '+hm(J.t0)+' à '+hm(fin)+' (environ '+dur+' min)'];
  if(J.essais)info.push('Vérifications demandées : '+J.essais);
  d.setFillColor(...CL);d.rect(M,y,L,6+info.length*6,'F');d.setTextColor(...FO);d.setFont('helvetica','bold');d.setFontSize(10);info.forEach((t,i)=>d.text(t,M+4,y+6.5+i*6));y+=12+info.length*6;
  const para=(txt,x,larg,coul,style,taille)=>{d.setFont('helvetica',style||'normal');d.setFontSize(taille||9.5);d.setTextColor(...(coul||TX));
   net(txt).split('\n').forEach(p=>{const ls=d.splitTextToSize(p,larg);ls.forEach(l=>{saut(5);d.text(l,x,y);y+=4.4;});});};
  J.sections.forEach(s=>{saut(16);d.setFillColor(...PR);d.rect(M,y,L,8,'F');d.setTextColor(255,255,255);d.setFont('helvetica','bold');d.setFontSize(10.5);
   d.text(d.splitTextToSize(net(s.titre),L-6)[0],M+3,y+5.6);y+=13.5;
   (s.lignes||[]).forEach(l=>{para(l,M+2,L-4);y+=1.2;});
   if(s.commentaires&&s.commentaires.length){y+=1;para('Commentaires de l\'outil :',M+2,L-4,FO,'bold');
    s.commentaires.forEach(c=>{saut(6);d.setFont('helvetica','bold');d.setFontSize(9.5);d.setTextColor(...(c.ok?VE:RO));d.text(c.ok?'OK':'À corriger',M+2,y);
     const ls=d.splitTextToSize(net(c.txt),L-26);d.setFont('helvetica','normal');d.setTextColor(...TX);ls.forEach((l,i)=>{if(i)saut(5);d.text(l,M+24,y);y+=4.4;});y+=0.8;});}
   if(s.bilan){y+=1.5;para(s.bilan,M+2,L-4,GR,'italic');}
   y+=4;});
  pied();d.save(location.pathname.split('/').pop().replace('.html','')+'_justificatif_'+fin.toISOString().slice(0,10)+'.pdf');}
};
document.addEventListener('DOMContentLoaded',()=>{if(!J.actif)return;const m=document.querySelector('main');if(m)m.insertAdjacentHTML('afterbegin','<div class="bilan" style="background:#F4E6EE;border-left:5px solid #8C1E70;margin:0 0 12px">À la fin de l\'activité, vous téléchargerez un <b>justificatif PDF</b> à déposer dans 360Learning : il atteste que vous avez réalisé l\'activité.</div>');});
})();
