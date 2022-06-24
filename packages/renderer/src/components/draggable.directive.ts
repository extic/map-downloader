import { DirectiveBinding } from "vue";

let dragging = false;
let deltaX = 0;
let deltaY = 0;
let lastPosX = 0;
let lastPosY = 0;


const dragStart = (event: MouseEvent, binding: DirectiveBinding) => {
  dragging = true;
  lastPosX = event.x;
  lastPosY = event.y;
  event.preventDefault();
  event.stopPropagation();

  document.onmousemove = (event) => {
    drag(event, binding);
  }
  document.onmouseup = dragEnd;
};

const dragEnd = (event: MouseEvent) => {
  dragging = false;
  event.preventDefault();
  event.stopPropagation();
};

const drag = (event: MouseEvent, binding: DirectiveBinding) => {
  if (dragging) {
    deltaX = event.x - lastPosX;
    deltaY = event.y - lastPosY;
    lastPosX = event.x;
    lastPosY = event.y;

    binding.value(binding.arg, deltaX, deltaY);

    event.preventDefault();
    event.stopPropagation();
  }
};

export default {

  created: (el: HTMLElement) => {
    el.draggable = true;
  },

  mounted: (el: HTMLElement, binding: DirectiveBinding) => {
    el.onmousedown = (event) => dragStart(event, binding);
  }
}

