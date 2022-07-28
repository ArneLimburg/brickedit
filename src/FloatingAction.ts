export class FloatingAction extends HTMLElement {
  menuItems: HTMLSlotElement;

  actionButton: HTMLElement;

  constructor() {
    super();

    const template = document.createElement('template');
    template.innerHTML = `
<style>

.menu {
  display:block;
  bottom: 0;
  position: fixed;
  margin: 1em;
  right: 0;
  z-index: 998;
}

.button, ::slotted(.button) {
  display: block;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  text-align: center;
  color: #FFF;
  background: #00BCD4;
  margin: 25px auto 0;
  box-shadow: 0 0 4px rgba(0, 0, 0, .14), 0 4px 8px rgba(0, 0, 0, .28);
  cursor: pointer;
  -webkit-transition: all .1s ease-out;
  -moz-transition: all .1s ease-out;
  -o-transition: all .1s ease-out;
  transition: all .1s ease-out;
  position: relative;
  z-index: 998;
  overflow: hidden;
}

.button {
  background-image: url('./files/plus.svg');
}

::slotted(.menu-item) {
  width: 0;
  height: 0;
  margin: 20px auto 0;
  opacity: 0;
  visibility: hidden;
}

::slotted(.is-visible) {
  width: 40px;
  height: 40px;
  margin: 15px auto 10;
  opacity: 1;
  visibility: visible;
}

::slotted(.menu-item:nth-last-child(1)) {
  -webkit-transition-delay: 25ms;
  -moz-transition-delay: 25ms;
  -o-transition-delay: 25ms;
  transition-delay: 25ms;
}

::slotted(.menu-item:nth-last-child(2)) {
  -webkit-transition-delay: 20ms;
  -moz-transition-delay: 20ms;
  -o-transition-delay: 20ms;
  transition-delay: 20ms;
}

::slotted(.menu-item:nth-last-child(3)) {
  -webkit-transition-delay: 40ms;
  -moz-transition-delay: 40ms;
  -o-transition-delay: 40ms;
  transition-delay: 40ms;
}

::slotted(.menu-item:nth-last-child(4)) {
  -webkit-transition-delay: 60ms;
  -moz-transition-delay: 60ms;
  -o-transition-delay: 60ms;
  transition-delay: 60ms;
}

::slotted(.menu-item:nth-last-child(5)) {
  -webkit-transition-delay: 80ms;
  -moz-transition-delay: 80ms;
  -o-transition-delay: 80ms;
  transition-delay: 80ms;
}

::slotted(.menu-item:active),
::slotted(.menu-item:focus),
::slotted(.menu-item:hover) {
  box-shadow: 0 0 6px rgba(0, 0, 0, .16), 0 6px 12px rgba(0, 0, 0, .32);
}

.is-active {
  -moz-transform: rotate(45deg);
  -ms-transform: rotate(45deg);
  -webkit-transform: rotate(45deg);
  transform: rotate(45deg);
}

.is-float {
  box-shadow: 0 0 6px rgba(0, 0, 0, .16), 0 6px 12px rgba(0, 0, 0, .32);
}
</style>
<div class="menu">
  <slot></slot>
  <a id="prime" class="button"><i class="prime action"></i></a>
</div>
`;
    this.attachShadow({ mode: 'open' });
    this.shadowRoot?.appendChild(template.content.cloneNode(true));
    this.menuItems = this.shadowRoot?.querySelector('slot') as HTMLSlotElement;
    this.menuItems.addEventListener('slotchange', () => {
      this.menuItems.assignedElements().forEach(element => {
        const { classList } = element;
        classList.add('menu-item');
        classList.add('button');
      });
    });
    this.actionButton = this.shadowRoot?.querySelector(
      '#prime'
    ) as HTMLCanvasElement;
    this.actionButton.addEventListener('click', () => {
      this.toggleMenu();
    });
  }

  toggleMenu() {
    this.actionButton.classList.toggle('is-active');
    this.actionButton.classList.toggle('is-float');
    this.actionButton.children.item(0)?.classList.toggle('is-active');
    this.menuItems.assignedElements().forEach(element => {
      element.classList.toggle('is-visible');
    });
  }
}
