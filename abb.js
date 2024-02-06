const updateStyle = points => points.map(point => `radial-gradient(at ${point.x}% ${point.y}%, ${point.color} 0px, transparent 50%)`).join(",");

const loadNoise = ({
    width,
    height,
    opacity = 0.5,
    baseFrequency = 2,
    numOctaves = 1,
    type = 'fractalNoise',
    grayScale = true
} = {}) => {
    const gs = `%3CfeColorMatrix type='matrix' values='0.33 0.33 0.33 0 0 0.33 0.33 0.33 0 0 0.33 0.33 0.33 0 0 0 0 0 1 0' /%3E`
    return `"data:image/svg+xml,%3Csvg viewBox='0 0 ${width} ${height}' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='${type}' baseFrequency='${baseFrequency}' numOctaves='${numOctaves}' stitchTiles='stitch'/%3E${grayScale ? gs : ''}%3C/filter%3E%3Crect opacity='${opacity}' width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E"`;
}

const round = n => Math.round(n * 10)/10

const updatePosition = points => points.map(p => {
  let {x, y, vx, vy, color} = p
  if(x + vx > 100 || x + vx < 0){
    vx = -vx
  }
  if(y + vy > 100 || y + vy < 0){
    vy = -vy
  }
  return {
    x: round(x + vx),
    y: round(y + vy),
    vx: round(vx), 
    vy: round(vy),
    color
  }
})

export default abb = ({
  element,
  background= "hsla(108,44%,72%,1)",
  colors= [
    "hsla(302,71%,61%,1)",
    "hsla(36,100%,50%,1)",
    "hsla(0,100%,50%,1)",
    "hsla(190,100%,50%,1)",
    "hsla(261,100%,50%,1)"
  ],
  speed= 1,
  opacity = 1,
  grain: {
    opacity:grainOpacity = 0.5,
    strength = 1
  } = {}
} = {}) => {
  if(!element) return;
  
  const stylesheet = new CSSStyleSheet();
  document.adoptedStyleSheets = [stylesheet];
  let points = colors.reverse().map(color => {
    return {
      x: Math.random() * 100,
      y: Math.random() * 100,
      vx: (Math.random() - 0.5) * speed,
      vy: (Math.random() - 0.5) * speed,
      color
    }
  })
   
  const fps = 60;
  const interval = 1000/fps;
  let then;

  abb.store = abb.store || {};

  if(abb.store[element]){
    cancelAnimationFrame(abb.store[element])
  }

  function animate(timestamp){
    abb.store[element] = requestAnimationFrame(animate);
    then = then ? then : timestamp
    const delta = timestamp - then;
    if(delta > interval){
      if(!speed){
        cancelAnimationFrame(abb.store[element])
      }
      then = timestamp - (delta % interval);
      if(opacity || strength){
        const {width, height} = document.querySelector(element).getBoundingClientRect();
        const makeNoise = loadNoise({
          width,
          height,
          opacity: grainOpacity,
          baseFrequency: 2/strength
        });      
        stylesheet.replaceSync(`${element}:after{background: url(${makeNoise});}${element}:before{opacity:${opacity};background-color:${background};background-image:${updateStyle(points)};}`);
      }else{
        stylesheet.replaceSync(`${element}:before{opacity:${opacity};background-color:${background};background-image:${updateStyle(points)};}`);      
      }
      points = updatePosition(points);       
    }
  }    
  animate();  
}
