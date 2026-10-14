export const MAX_BLOCKS = 120;
export const PALETTE = [
  {id:'red',name:'Mohnrot',hex:'#e55150'}, {id:'rose',name:'Rosé',hex:'#f496b6'},
  {id:'orange',name:'Mandarine',hex:'#f29b45'}, {id:'yellow',name:'Sonnengelb',hex:'#f4cc52'},
  {id:'cream',name:'Blütenweiß',hex:'#f4f0de'}, {id:'green',name:'Blattgrün',hex:'#52976b'},
  {id:'darkgreen',name:'Waldgrün',hex:'#31704d'}, {id:'blue',name:'Kornblau',hex:'#73a4e0'},
  {id:'purple',name:'Flieder',hex:'#a68bd0'}, {id:'brown',name:'Erde',hex:'#96705c'},
  {id:'lila',name:'Lila',hex:'#8e44c8'}
];
export const colorOf = id => PALETTE.find(c=>c.id===id)?.hex || id;
export const keyOf = b => `${b.x},${b.y},${b.z}`;
function flower(name,category,description,pattern,colors,extras=[]) {
  const map=new Map();
  const put=(x,y,z,color)=>map.set(`${x},${y},${z}`,{x,y,z,color});
  for(let x=-1;x<=1;x++)for(let z=-1;z<=1;z++)put(x,0,z,'darkgreen');
  for(let y=1;y<=9;y++)put(0,y,0,'green');
  [[-1,4],[-2,4],[-2,5],[-3,5],[1,6],[2,6],[2,7]].forEach(([x,y])=>put(x,y,0,'green'));
  pattern.forEach((row,i)=>[...row].forEach((c,j)=>{if(c!=='.')put(j-Math.floor(row.length/2),10+pattern.length-1-i,0,colors[c]);}));
  extras.forEach(b=>put(...b));
  return {id:name.toLowerCase().replaceAll(' ','-'),name,category,description,blocks:[...map.values()]};
}
const poppy=flower('Pixel-Mohn','pixel','Ein roter Klassiker mit dunklem Blütenherz.',[
  '..RRR..','.RRRRR.','RRRRRRR','RRYYYRR','.RRRRR.','..RRR..','...R...'
],{R:'red',Y:'brown'},[[0,13,1,'brown'],[-1,13,1,'brown'],[1,13,1,'brown']]);
const tulip=flower('Pixel-Tulpe','pixel','Klare Kanten, leuchtende Farbe.',[
  '.R...R.','.RR.RR.','.RRRRR.','.RRRRR.','..RRR..','...R...'
],{R:'orange'});
const daisy=flower('Pixel-Margerite','pixel','Weiße Blütenblätter um eine goldene Mitte.',[
  '...WWW...','...WWW...','..WWWWW..','WWWYYYWWW','WWWYYYWWW','WWWYYYWWW','..WWWWW..','...WWW...','...WWW...'
],{W:'cream',Y:'yellow'});
const blue=flower('Pixel-Kornblume','pixel','Eine kleine Blüte in kühlem Kornblau.',[
  '.B.B.B.','.BBBBB.','BBBBBBB','.BBYBB.','BBBBBBB','..BBB..','...B...'
],{B:'blue',Y:'purple'});
const heart=flower('Herzblüte','creative','Eine Blume mit einer kleinen Liebeserklärung.',[
  '.RR.RR.','RRRRRRR','RRRRRRR','.RRRRR.','..RRR..','...R...'
],{R:'rose'},[[0,13,1,'red'],[-1,14,1,'red'],[1,14,1,'red']]);
const sun=flower('Sonnenkranz','creative','Goldene Strahlen und ein plastisches Blütenherz.',[
  '....Y....','..Y.Y.Y..','.YYYYYYY.','..YBBBY..','YYYBBBYYY','..YBBBY..','.YYYYYYY.','..Y.Y.Y..','....Y....'
],{Y:'yellow',B:'brown'},[[-1,14,1,'brown'],[0,14,1,'brown'],[1,14,1,'brown'],[0,13,1,'brown'],[0,15,1,'brown']]);
const dahlia=flower('Prisma-Dahlie','creative','Eine räumliche Blüte aus Flieder und Rosé.',[
  '..PPP..','.PPPPP.','PPPRPPP','PPRRRPP','PPPRPPP','.PPPPP.','..PPP..'
],{P:'purple',R:'rose'},[[-1,13,1,'rose'],[0,13,1,'yellow'],[1,13,1,'rose'],[0,12,1,'rose'],[0,14,1,'rose'],[0,13,-1,'purple'],[-1,13,-1,'purple'],[1,13,-1,'purple'],[0,12,-1,'purple'],[0,14,-1,'purple']]);
const lotus=(()=>{
  const f=flower('Würfel-Lotus','creative','Eine offene Blüte, die in alle Richtungen wächst.',[],{});
  f.blocks=f.blocks.filter(b=>b.y<8);
  const put=(x,y,z,color)=>{const b={x,y,z,color};const i=f.blocks.findIndex(a=>keyOf(a)===keyOf(b));if(i<0)f.blocks.push(b);else f.blocks[i]=b;};
  for(let x=-2;x<=2;x++)for(let z=-2;z<=2;z++)if(Math.abs(x)+Math.abs(z)<=3)put(x,8,z,'rose');
  for(let x=-2;x<=2;x++)for(let z=-2;z<=2;z++)if(Math.max(Math.abs(x),Math.abs(z))===2&&Math.abs(x)+Math.abs(z)<=3)put(x,9,z,'purple');
  [[-3,0],[3,0],[0,-3],[0,3]].forEach(([x,z])=>{put(x,8,z,'rose');put(x,9,z,'rose');put(x,10,z,'cream');});
  for(let x=-1;x<=1;x++)for(let z=-1;z<=1;z++)put(x,9,z,'yellow');
  put(0,10,0,'yellow');return f;
})();
export const TEMPLATES=[poppy,tulip,daisy,blue,heart,sun,dahlia,lotus];
export function validateBlocks(blocks){
  if(!Array.isArray(blocks)||blocks.length>MAX_BLOCKS)throw new Error('Ein Modell darf höchstens 120 Blöcke enthalten.');
  const seen=new Set();
  for(const b of blocks){if(!b||!['x','y','z'].every(k=>Number.isInteger(b[k]))||Math.abs(b.x)>15||Math.abs(b.z)>15||b.y<0||b.y>30||!PALETTE.some(c=>c.id===b.color))throw new Error('Ungültiger Block: Rastergrenzen oder Farbe prüfen.');const key=keyOf(b);if(seen.has(key))throw new Error('Zwei Blöcke belegen denselben Platz.');seen.add(key);}
  return blocks.map(b=>({x:b.x,y:b.y,z:b.z,color:b.color}));
}
export function dimensions(blocks,size=1.5){if(!blocks.length)return {x:0,y:0,z:0};return Object.fromEntries(['x','y','z'].map(k=>[k,(Math.max(...blocks.map(b=>b[k]))-Math.min(...blocks.map(b=>b[k]))+1)*size]));}
export function translateBlocks(blocks,selection,delta){
  const selected=new Set(selection);
  if(!selected.size)throw new Error('Wähle zuerst mindestens einen Block aus.');
  if(!delta||!['x','y','z'].every(k=>Number.isInteger(delta[k]))||['x','y','z'].every(k=>delta[k]===0))throw new Error('Die Verschiebung braucht ganze Rasterschritte.');
  const existing=new Set(blocks.map(keyOf));
  if([...selected].some(key=>!existing.has(key)))throw new Error('Ein ausgewählter Block existiert nicht mehr.');
  const next=blocks.map(b=>selected.has(keyOf(b))?{...b,x:b.x+delta.x,y:b.y+delta.y,z:b.z+delta.z}:{...b});
  if(next.some(b=>Math.abs(b.x)>15||Math.abs(b.z)>15||b.y<0||b.y>30))throw new Error('Die Auswahl würde das Raster verlassen.');
  const fixed=new Map(blocks.filter(b=>!selected.has(keyOf(b))).map(b=>[keyOf(b),b]));
  const blocked=next.filter((b,i)=>selected.has(keyOf(blocks[i]))&&fixed.has(keyOf(b)));
  if(blocked.length){const b=blocked[0],error=new Error(`Nicht ausgewählter Block bei X ${b.x}, Y ${b.y}, Z ${b.z} blockiert die Bewegung. Wähle mit dem Rahmen auch verdeckte Blöcke aus.`);error.code='collision';error.blockedKeys=blocked.map(keyOf);throw error;}
  validateBlocks(next);
  return {blocks:next,selection:next.filter((b,i)=>selected.has(keyOf(blocks[i]))).map(keyOf)};
}
export function duplicateBlocks(blocks,selection,delta){
  const selected=new Set(selection),chosen=blocks.filter(b=>selected.has(keyOf(b)));
  if(!chosen.length)throw new Error('Wähle zuerst mindestens einen Block aus.');
  if(chosen.length!==selected.size)throw new Error('Ein ausgewählter Block existiert nicht mehr.');
  if(blocks.length+chosen.length>MAX_BLOCKS)throw new Error(`Zum Duplizieren brauchst du ${chosen.length} freie Blöcke; übrig sind ${MAX_BLOCKS-blocks.length}.`);
  const occupied=new Set(blocks.map(keyOf));
  const makeCopy=d=>{
    if(!d||!['x','y','z'].every(k=>Number.isInteger(d[k]))||['x','y','z'].every(k=>d[k]===0))return null;
    const copy=chosen.map(b=>({...b,x:b.x+d.x,y:b.y+d.y,z:b.z+d.z}));
    if(copy.some(b=>Math.abs(b.x)>15||Math.abs(b.z)>15||b.y<0||b.y>30||occupied.has(keyOf(b))))return null;
    return copy;
  };
  let copy,offset=delta;
  if(delta){copy=makeCopy(delta);if(!copy)throw new Error('Die Kopie passt nicht an diesen Platz: Ziel belegt oder außerhalb des Rasters.');}
  else{
    const size=dimensions(chosen,1),offsets=[{x:size.x,y:0,z:0},{x:-size.x,y:0,z:0},{x:0,y:0,z:size.z},{x:0,y:0,z:-size.z},{x:0,y:size.y,z:0}];
    for(let step=1;step<=30;step++)for(const axis of ['x','z','y'])for(const sign of [1,-1])offsets.push({...{x:0,y:0,z:0},[axis]:step*sign});
    for(const d of offsets){copy=makeCopy(d);if(copy){offset=d;break;}}
    if(!copy)throw new Error('Kein freier Platz für diese Kopie im Raster.');
  }
  return {blocks:validateBlocks([...blocks,...copy]),selection:copy.map(keyOf),offset};
}
export function deleteBlocks(blocks,selection){
  const selected=new Set(selection);
  if(!selected.size)throw new Error('Wähle zuerst mindestens einen Block aus.');
  if([...selected].some(key=>!blocks.some(b=>keyOf(b)===key)))throw new Error('Ein ausgewählter Block existiert nicht mehr.');
  return blocks.filter(b=>!selected.has(keyOf(b))).map(b=>({...b}));
}
export function components(blocks){const pending=new Set(blocks.map(keyOf));let count=0;while(pending.size){count++;const stack=[pending.values().next().value];pending.delete(stack[0]);while(stack.length){const [x,y,z]=stack.pop().split(',').map(Number);for(const [dx,dy,dz] of [[1,0,0],[-1,0,0],[0,1,0],[0,-1,0],[0,0,1],[0,0,-1]]){const key=`${x+dx},${y+dy},${z+dz}`;if(pending.delete(key))stack.push(key);}}}return count;}
