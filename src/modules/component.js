import * as utils from './utils.js';

const log = console.log;

export function component(type, existingElement=null) {
    //POSSIBILITY:
    //HAVE REFERENCES TO PARENT AND CHILD ELEMENTS IN HERE,
    // THEN .render() CAN DEFAULT TO THE PARENT
    const element = existingElement || document.createElement(type);
    let parentComponent = undefined;    
    const children = [];

    const listeners = [];
    return { 
        element,
        render(parent=null) {
            if(parent) {
                parent.wrap(this);
            } else {
                document.body.appendChild(element);
            };
            return this;
        },
        remove() {
            //NEEDS UPDATING - DOES NOT REMOVE FROM CHILD LISTS/PARENT THINGS
            listeners.forEach(({event, handler}) => {
                element.removeEventListener(event, handler);
            });
            element.remove();
        },
        hide() {
            element.style.display = 'none';
            return this;
        },
        show() {
            element.style.display = '';
            return this;
        },
        clear() {
            element.replaceChildren();
        },
        addClass(...classNames) {
            element.classList.add(...classNames);
            return this;
        },
        removeClass(className) {
            element.classList.remove(className);
        },
        addListener(event, handler) {
            element.addEventListener(event, handler);
            listeners.push({event, handler});
            return this;
        },
        text(str) {
            element.textContent = str;
            return this;
        },
        id(id) {
            element.id = id;
            return this;
        },
        setAttribute(attr, value) {
            element.setAttribute(attr, value);
            return this;
        },
        getAttribute(attr) {
            return element.getAttribute(attr);
        },
        wrap(...childComponents) {
            for (const childComponent of childComponents) {
                children.push(childComponent);
                element.appendChild(childComponent.element);
                childComponent.parentComponent = this;
            }
            return this;
        },
        get value() {
            return element.value;
        },
        get children() {
            return children;
        },
        get parentComponent() {
            return parentComponent;
        },
        set parentComponent(component) {
            parentComponent = component;
        }
    }
}