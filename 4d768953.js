class n extends HTMLElement{constructor(){var n,t,i;super();const e=document.createElement("template");e.innerHTML='\n<style>\n\n.menu {\n  display:block;\n  bottom: 0;\n  position: fixed;\n  margin: 1em;\n  right: 0;\n  z-index: 998;\n}\n\n.button, ::slotted(.button) {\n  display: block;\n  width: 56px;\n  height: 56px;\n  border-radius: 50%;\n  text-align: center;\n  color: #FFF;\n  background: #00BCD4;\n  margin: 25px auto 0;\n  box-shadow: 0 0 4px rgba(0, 0, 0, .14), 0 4px 8px rgba(0, 0, 0, .28);\n  cursor: pointer;\n  -webkit-transition: all .1s ease-out;\n  -moz-transition: all .1s ease-out;\n  -o-transition: all .1s ease-out;\n  transition: all .1s ease-out;\n  position: relative;\n  z-index: 998;\n  overflow: hidden;\n}\n\n.button {\n  background-image: url(\'./files/plus.svg\');\n}\n\n::slotted(.menu-item) {\n  width: 0;\n  height: 0;\n  margin: 20px auto 0;\n  opacity: 0;\n  visibility: hidden;\n}\n\n::slotted(.is-visible) {\n  width: 40px;\n  height: 40px;\n  margin: 15px auto 10;\n  opacity: 1;\n  visibility: visible;\n}\n\n::slotted(.menu-item:nth-last-child(1)) {\n  -webkit-transition-delay: 25ms;\n  -moz-transition-delay: 25ms;\n  -o-transition-delay: 25ms;\n  transition-delay: 25ms;\n}\n\n::slotted(.menu-item:nth-last-child(2)) {\n  -webkit-transition-delay: 20ms;\n  -moz-transition-delay: 20ms;\n  -o-transition-delay: 20ms;\n  transition-delay: 20ms;\n}\n\n::slotted(.menu-item:nth-last-child(3)) {\n  -webkit-transition-delay: 40ms;\n  -moz-transition-delay: 40ms;\n  -o-transition-delay: 40ms;\n  transition-delay: 40ms;\n}\n\n::slotted(.menu-item:nth-last-child(4)) {\n  -webkit-transition-delay: 60ms;\n  -moz-transition-delay: 60ms;\n  -o-transition-delay: 60ms;\n  transition-delay: 60ms;\n}\n\n::slotted(.menu-item:nth-last-child(5)) {\n  -webkit-transition-delay: 80ms;\n  -moz-transition-delay: 80ms;\n  -o-transition-delay: 80ms;\n  transition-delay: 80ms;\n}\n\n::slotted(.menu-item:active),\n::slotted(.menu-item:focus),\n::slotted(.menu-item:hover) {\n  box-shadow: 0 0 6px rgba(0, 0, 0, .16), 0 6px 12px rgba(0, 0, 0, .32);\n}\n\n.is-active {\n  -moz-transform: rotate(45deg);\n  -ms-transform: rotate(45deg);\n  -webkit-transform: rotate(45deg);\n  transform: rotate(45deg);\n}\n\n.is-float {\n  box-shadow: 0 0 6px rgba(0, 0, 0, .16), 0 6px 12px rgba(0, 0, 0, .32);\n}\n</style>\n<div class="menu">\n  <slot></slot>\n  <a id="prime" class="button"><i class="prime action"></i></a>\n</div>\n',this.attachShadow({mode:"open"}),null===(n=this.shadowRoot)||void 0===n||n.appendChild(e.content.cloneNode(!0)),this.menuItems=null===(t=this.shadowRoot)||void 0===t?void 0:t.querySelector("slot"),this.menuItems.addEventListener("slotchange",(()=>{this.menuItems.assignedElements().forEach((n=>{const{classList:t}=n;t.add("menu-item"),t.add("button")}))})),this.actionButton=null===(i=this.shadowRoot)||void 0===i?void 0:i.querySelector("#prime"),this.actionButton.addEventListener("click",(()=>{this.toggleMenu()}))}toggleMenu(){var n;this.actionButton.classList.toggle("is-active"),this.actionButton.classList.toggle("is-float"),null===(n=this.actionButton.children.item(0))||void 0===n||n.classList.toggle("is-active"),this.menuItems.assignedElements().forEach((n=>{n.classList.toggle("is-visible")}))}}customElements.define("floating-action",n);