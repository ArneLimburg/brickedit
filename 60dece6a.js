import{C as t}from"./ce71786a.js";import"./1d9c64ea.js";class e extends HTMLButtonElement{constructor(){super(...arguments),this.state=t._3D}connectedCallback(){this.style.backgroundImage=e.imageUrls[this.state],this.style.backgroundColor="transparent",this.style.margin="18px",this.style.width="60px",this.style.height="60px",this.style.border="none",this.addEventListener("click",this.onClick)}disconnectedCallback(){this.removeEventListener("click",this.onClick)}onClick(){this.state=e.nextStates[this.state],this.style.backgroundImage=e.imageUrls[this.state],this.dispatchEvent(new CustomEvent("cameradirectionchanged",{detail:this.state}))}}e.nextStates={FRONT:t.RIGHT,RIGHT:t.TOP,TOP:t.LEFT,LEFT:t.BOTTOM,BOTTOM:t.BACK,BACK:t._3D,_3D:t.FRONT},e.imageUrls={FRONT:"url('./files/from-front.svg')",RIGHT:"url('./files/from-right.svg')",TOP:"url('./files/from-top.svg')",LEFT:"url('./files/from-left.svg')",BOTTOM:"url('./files/from-bottom.svg')",BACK:"url('./files/from-back.svg')",_3D:"url('./files/cube-3d.svg')"},customElements.define("camera-switch",e,{extends:"button"});
