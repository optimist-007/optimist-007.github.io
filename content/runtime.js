window.studioLoad = async function(path, fallback){
  try{
    const raw = localStorage.getItem('websiteStudioPreview');
    if(raw){
      const preview = JSON.parse(raw);
      if(preview && preview.enabled && preview.files && Object.prototype.hasOwnProperty.call(preview.files,path)){
        return preview.files[path];
      }
    }
  }catch(e){}
  try{
    const r = await fetch('./'+path+'?v='+Date.now(),{cache:'no-store'});
    if(!r.ok) throw new Error('Could not load '+path);
    return await r.json();
  }catch(e){
    console.warn(e);
    return fallback;
  }
};
window.studioTheme = async function(){
  return window.studioLoad('content/site-theme.json',{
    forest:'#244838',forest2:'#37624f',clay:'#a75f49',sand:'#c8aa73',cream:'#f8f7f3',
    paper:'#eef1ec',ink:'#242923',muted:'#667069',serif:'Cormorant Garamond',sans:'DM Sans',mono:'DM Mono'
  });
};
window.applyStudioTheme = async function(){
  const t=await window.studioTheme();
  const root=document.documentElement;
  Object.entries(t||{}).forEach(([k,v])=>root.style.setProperty('--'+k,v));
  return t;
};