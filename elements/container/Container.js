'use strict'

class Container extends HTMLElement {

    //TODO: change left/right to transform =translate
    infoRender(text, mouseX, mouseY){
        //console.log('INFO:', text, mouseX, mouseY)
        if(text){
            this.view.info.setAttribute('class', 'active');
            this.view.info.hidden = false;
            this.view.info.style.left = (mouseX + 16) + 'px';
            this.view.info.style.top = (mouseY - 48) +'px';
            this.view.info.innerText = text;
        }else{
            this.view.info.removeAttribute('class');
            this.view.info.hidden = true;
        }
    }


    constructor() {
        super();

        //TODO:
        //- Create import[link] from here (js)?
        //- CogniElement that has debug mode and checks for browser compatibility on its props and methods
        //- Handle compatibility errors webkitTransform = transform
        //- Model after UIView: https://developer.apple.com/reference/uikit/uiview
        //- Study DOM events
        this.view = {};
        this._setShadowDOM();
        this._setViewReferences();
        this._setProperties();
        this._setEvents();

        this.style.outline = 'none'

    }

    _setProperties(publicModel){
        this.x = 0;
        this.y = 0;
        this.width = 100;
        this.height = 100;
        this.selected = false;
        //this.parentWidth = parseInt(getComputedStyle(this.parentNode).getPropertyValue('width'));
        //this.parentHeight = parseInt(getComputedStyle(this.parentNode).getPropertyValue('height'));
        //this.showTimes = [0];
        //this.hideTimes = [];
        this._equilateral = false;
        this._attachedShadowDOM = false;

        this.minX = 0;
        this.minY = 0;
        this.minWidth = 44;
        this.minHeight = 44;

    }

    _setShadowDOM(){
        if(this._attachedShadowDOM) { console.warn('Shadow root cannot be created on a host which already hosts a shadow tree'); return; }
        this.view.importSelector = '#CogniContainer';
        this.view.templateSelector = '#cogni-container-template';
        this.view.imports = document.querySelector('#CogniContainer');
        // Select the <cogni-container-template> from the import.
        this.view.template = this.view.imports.import.querySelector(this.view.templateSelector);
        // Create template instance
        this.view.templateInstance = this.view.template.content.cloneNode(true);
        // Allow users to tweak the view?
        this.view.privacyMode = 'open'; //vs 'open';
        this.view.shadowRoot = this.attachShadow({mode: this.view.privacyMode});
        // Append tempalte instance as Shadow DOM
        this.view.shadowRoot.appendChild(this.view.templateInstance);
        this._attachedShadowDOM = true;
    }

    _setViewReferences(){
        //View references
        this.view.container = this.shadowRoot.querySelector('#container');
        //this.view.container.style.left = '100px';
        //this.view.container.style.opacity = '0.5';
        this.view.backgroundLayer = this.shadowRoot.querySelector('#backgroundLayer');
        //this.view.backgroundLayer.style.top = '20px';
        //this.view.backgroundLayer.style.left = '20px';
        this.view.contentLayer = this.shadowRoot.querySelector('#contentLayer');
        //this.view.contentLayer.style.top = '40px';
        //this.view.contentLayer.style.left = '40px';
        this.view.editLayer = this.shadowRoot.querySelector('#editLayer');
        //this.view.editLayer.style.top = '60px';
        //this.view.editLayer.style.left = '60px';
        this.view.handles = this.shadowRoot.querySelectorAll('.handle');


        this.view.info = this.shadowRoot.querySelector('#info');
        this.view.ruler = this.shadowRoot.querySelector('#ruler');
        this.view.circle = this.shadowRoot.querySelector('.circle');
        //TODO: delete
        //this.view.ratio = this.shadowRoot.querySelector('#ratio');
    }

    //REMEMBER: bind this
    _setEvents(){
        this.addEventListener('focus', this.onFocus.bind(this));
        this.addEventListener('blur', this.onBlur.bind(this));
        this.addEventListener('click', this.onClick.bind(this));
        this.addEventListener('keydown', this.onKeyDown.bind(this));
        this.addEventListener('dragstart', this.onDragStart.bind(this));
        this.addEventListener('drag', this.onDrag.bind(this));
        this.addEventListener('dragend', this.onDragEnd.bind(this));
        this.addEventListener('contextmenu', this.onContextMenu.bind(this));
        this.view.handles.forEach(handle => { handle.addEventListener('mousedown', this.onResize.bind(this)) })
        this.focus();
    }




    setRatio(){
        let circleSize = 10;
        let width = this.parentNode.clientWidth;
        let height = this.parentNode.clientHeight;
        let hypotenuse = Math.sqrt(Math.pow(width, 2) + Math.pow(height, 2));
        console.log('height', height, 'width', width, 'hypo', hypotenuse);
        this.view.ruler.style.width = width;
        this.view.ruler.style.height = height;
        this.view.ruler.style.top = '0px';
        this.view.ruler.style.left = '0px';
        let numCircles = parseInt(hypotenuse/circleSize);
        let fragment = document.createDocumentFragment();
        if(numCircles !== this.numCircles){
            for(let i = 0; i < numCircles; i++){
                let clone = this.view.circle.cloneNode(true);
                //let position = i * circleSize;
                //clone.style.left = `${position}px`;
                //clone.style.top = `${position}px`;
                fragment.appendChild(clone);
            }
            this.view.ruler.appendChild(fragment);
        }
        this.numCircles = numCircles;
    }



    updateRatio(event){
        let circleSize = 10;
        let circles = this.view.ruler.children;
        let numCircles = circles.length;
        let startX = this.x - this.width * 2;
        let startY = this.y - this.height * 2;;
        for(let i=0; i < numCircles; i ++){
            let circle = circles[i];
            circle.style.left = startX + 'px';
            circle.style.top = startY + 'px';
            startX += circleSize;
            startY += circleSize;
        }
    }



    displayRatioRulers(event){
        var visibility = {};
        visibility.fadeIn = this.x - this.width/2;
        visibility.start = this.x;
        visibility.fadeOut = this.x + this.width;
        visibility.none = this.x + this.width + this.width/2;

        let circles = this.view.ruler.children;
        let numCircles = circles.length;
        for(let i = 0; i < numCircles; i ++){
            let circle = circles[i];
            let position = parseInt(circle.style.left);
            if(position < visibility.fadeIn){
                circle.style.backgroundColor = 'black';
            } else if(position < visibility.start){
                circle.style.backgroundColor = 'red';
            } else if(position < visibility.fadeOut){
                circle.style.backgroundColor = 'green';
            }else if(position < visibility.none){
                circle.style.backgroundColor = 'red';
            }else {//visibility none
                circle.style.backgroundColor = 'black';
            }
        }
    }


















    //Called every time the element is inserted into the DOM, including into a shadow tree
    //Useful for: element setup (fetching resources, rendering, etc)
    connectedCallback(){
        console.log('CONNECTED');
        this.setRatio()
        //this.view.ratio.style.backgroundColor = `red`;
        //this.view.ratio.style.background = `radial-gradient(circle at 10% 10%, red 1px, transparent 1px);`;

    }


    //Called when the element is removed from a document
    //Useful for: unmounting resources, cleanup (removing event listeners, etc)
    disconnectedCallback(){
        //console.log('DISCONNECTED');
        //console.dir(this)
        //this.removeEventListener('focus', this.onFocus);
        //this.removeEventListener('blur', this.onBlur);
        //this.removeEventListener('mousedown', this.onMousedown);
        //this.removeEventListener('keydown', this.onKeydown);
        //this.removeEventListener('keyup', this.onKeyup);
        //TODO: - Remove aria?
        //this.removeAttribute('tabindex');
    }


    //Attributes that we want to observe for changes must be explicitely declared here
    static get observedAttributes(){
        return ['x', 'y', 'width', 'height', 'selected'];
    }

    get x(){ return Number(this._x); }
    set x(value){
        if(this._x === value) return;
        this._x = value;
        this.view.container.style.left = value + 'px';
        this.setAttribute('x', value);
    }

    get y(){ return Number(this.getAttribute('y')); }
    set y(value){
        if(this._y === value) return;
        this._y = value;
        this.view.container.style.top = value + 'px';
        this.setAttribute('y', value);
    }

    get width(){ return Number(this.getAttribute('width')); }
    set width(value){
        if(this._width === value) return;
        this._widht = value;
        this.view.container.style.width = `${value}px`;
        this.setAttribute('width', value);
        //this.updateRatio();
    }

    get height(){ return Number(this.getAttribute('height')); }
    set height(value){
        if(this._height === value) return;
        this._height = value;
        this.view.container.style.height = `${value}px`;
        this.setAttribute('height', value);
        //this.updateRatio();
    }

    get selected(){ return this.hasAttribute('selected'); }
    set selected(value){
        if(typeof value === 'string'){
            value = (value !== 'false');
        }
        if(this._selected === value) return;
        this._selected = value;
        if(true){
        //if(this._selected){
            this.setAttribute('selected', true);
            this.view.editLayer.hidden = false;
        } else {
            this.removeAttribute('selected');
            this.view.editLayer.hidden = true;
        }
    }


    //console.info(`Changed attribute(${attributeName}):  ${typeof oldValue}(${oldValue}) -> ${typeof newValue}(${newValue})`)
    attributeChangedCallback(attributeName, oldValue, newValue) {
        //console.log('ATTR X: ', oldValue, '-->', newValue, Date.now() - this.start)
        this[attributeName] = newValue;
    }


    /////////////////////////////////
    //EVENT METHODS
    /////////////////////////////////
    onFocus(e){
        //console.log('FOCUS', e.target);
        this.selected = true;
    }
    onBlur(e){
        //console.log('BLUR', e.target);
        this.infoRender(false);
        this.selected = false;
    }
    onContextMenu(e){
        //console.log('CONTEX MENU', e)
        e.preventDefault();
    }
    onClick(e){
        //console.log('CLICK', e.target);
        this.focus();
    }
    onKeyDown(e){
        const delta = 1;
        const origin = !e.shiftKey;
        var match =`origin:${origin}, key:${e.key}`;
        const render = (prop, value) => { this.infoRender(` ${prop}: ${value}px`, this.offsetLeft + this.x - 50, this.offsetTop + this.y + 20) }
        let edits =  new Map();
        edits.set(`origin:true, key:ArrowRight`, delta => { this.x += delta; render('x', this.x)})
        edits.set(`origin:true, key:ArrowLeft`, delta => { this.x -= delta; render('x', this.x)})
        edits.set(`origin:true, key:ArrowUp`, delta => { this.y -= delta; render('y', this.y)})
        edits.set(`origin:true, key:ArrowDown`, delta => { this.y += delta; render('y', this.y)})
        edits.set(`origin:false, key:ArrowRight`, delta => { this.width += delta; render('width', this.width)})
        edits.set(`origin:false, key:ArrowLeft`, delta => { this.width -= delta; render('width', this.width)})
        edits.set(`origin:false, key:ArrowUp`, delta => { this.height -= delta; render('height', this.height)})
        edits.set(`origin:false, key:ArrowDown`, delta => { this.height += delta; render('height', this.height)})
        if(edits.has(match)){ edits.get(match)(delta); }

        this.composedKeys = this.previousKey + e.code;
        match = `key:${e.code} shift:${e.shiftKey} meta:${e.metaKey} alt:${e.altKey} ctrl:${e.ctrlKey}`;
        let shortcuts =  new Map();
        shortcuts.set(`key:Backspace shift:false meta:false alt:false ctrl:false`, () => { e.preventDefault(); this.remove()});
        shortcuts.set(`key:KeyC shift:false meta:true alt:false ctrl:false`, () => { e.preventDefault(); this.copy()})
        shortcuts.set(`key:KeyV shift:false meta:true alt:false ctrl:false`, () => { e.preventDefault(); this.paste()})
        shortcuts.set(`key:KeyZ shift:false meta:true alt:false ctrl:false`, () => { e.preventDefault(); console.log('TODO: Undo')})
        shortcuts.set(`key:KeyA shift:false meta:true alt:false ctrl:false`, () => { e.preventDefault(); console.log('TODO: Select All')})
        if(shortcuts.has(match)){ shortcuts.get(match)(); }
    }

    copy(){
        this.copied = this.cloneNode(true);
        this.copied.classList = this.classList;
        this.copied.style = this.style;
        this.copied.style.outline = 'none';
        this.copied.x = this.x + this.width/2;
        this.copied.y = this.y + this.height/2;
        //console.log(this.offsetLeft, this.offsetTop)
    }

    paste(){
        this.parentNode.appendChild(this.copied);
        this.selected = false;
    }



    /////////////////////////////////
    //
    //        DRAGGING
    //
    ////////////////////////////////
    onDragStart(event){
        //console.log('START', event)
        this.drag = {};
        this.drag.original = {};
        this.drag.current = {};
        this.drag.delta = {};
        this.drag.original.clickX = event.offsetX;
        this.drag.original.clickY = event.offsetY;
        this.drag.original.x = event.clientX + this.drag.original.clickX - this.x;
        this.drag.original.y = event.clientY + this.drag.original.clickY - this.y;
        //hide ghost
        event.dataTransfer.setDragImage(event.target,9000, 9000);
        this.selected = false;

    }
    onDrag(event){
        this.view.container.opacity = 0;
        this.drag.current.x = event.clientX;
        this.drag.current.y = event.clientY;
        this.drag.delta.x = this.drag.current.x - this.drag.original.x;
        this.drag.delta.y = this.drag.current.y - this.drag.original.y;
        if(event.clientX){
            this.x = this.drag.delta.x + this.drag.original.clickX;
            this.y = this.drag.delta.y + this.drag.original.clickY;
            this.infoRender(` x: ${this.x} y: ${this.y}px`, event.offsetX, event.offsetY)
        }
    }
    onDragEnd(event){
        this.infoRender(false);
        this.selected = true;
    }







    /////////////////////////////////
    //
    //        RESIZE
    //
    ////////////////////////////////


    //MOUSEDOWN
    onResize(event){
        var targetHandle = event.target;
        this.updateRatio(event);

        //HANDLES
        var handleClone = this.view.handles[0].cloneNode(true);
        handleClone.classList = targetHandle.classList;
        //this.view.handles.forEach(handle => { if(targetHandle !== handle) handle.setAttribute('hidden', true); })
        targetHandle.parentNode.appendChild(handleClone);
        /////////////////////////////////
        this.view.container.removeAttribute('draggable');
        this.displayRatioRulers(event);
        targetHandle.style.transform = 'scale(100,100)';
        targetHandle.style.opacity = .10;
        targetHandle.style.zIndex = 100;

        const widthRatio = this.width/this.height;
        const heightRatio = this.height/this.width;


        //MOVE
        var edges = {};
        var classes = targetHandle.classList;
        function move(e){
        let mantainRatio = e.shiftKey;
            this.displayRatioRulers(e);
            edges.top = classes.contains('n');
            edges.left = classes.contains('e');
            edges.right = classes.contains('w');
            edges.bottom = classes.contains('s');

            if(mantainRatio){
                //BOTTOM RIGHT
                //console.log('EDGES', edges);
                if(edges.bottom && edges.left){
                    //console.log('BOTTOM LEFT', widthRatio, e.movementX, heightRatio, e.movementY)
                    this.width += e.movementX/2 * widthRatio;
                    this.height += e.movementX/2;
                }
                if(edges.top && edges.left){
                    //console.log('TOP LEFT', widthRatio, e.movementX, heightRatio, e.movementY)
                    this.width += e.movementX/2 * widthRatio;
                    this.height += e.movementX/2;
                    this.y -= e.movementX/2;
                }
                if(edges.top && edges.right){
                    //console.log('TOP RIGHT', widthRatio, e.movementX, heightRatio, e.movementY)
                    this.width -= e.movementX * widthRatio;
                    this.height -= e.movementX;
                    this.x += e.movementX;
                    this.y += e.movementX;
                }
                if(edges.bottom && edges.right){
                    //console.log('BOTTOM RIGHT', widthRatio, e.movementX, heightRatio, e.movementY)
                    this.width -= e.movementX * widthRatio;
                    this.height -= e.movementX;
                    this.x += e.movementX;
                }
            }
            else{
                if(edges.top){ this.y += e.movementY; this.height -= e.movementY; };
                if(edges.left){ this.width += e.movementX; };
                if(edges.right){ this.x += e.movementX; this.width -= e.movementX; };
                if(edges.bottom){ this.height += e.movementY; };
            }
            this.infoRender(` width: ${this.width}px height: ${this.height}px`, targetHandle.clientX - this.x , this.y);
        }
        var boundMove = move.bind(this);
        targetHandle.addEventListener('mousemove', boundMove);






        //UP
        function mouseUp(e){
            //console.log('MOUSE UP')
            this.displayRatioRulers(false);
            //Restore initial state
            targetHandle.style.transform = 'scale(1, 1)';
            this.view.handles.forEach(handle => { handle.removeAttribute('hidden'); })
            targetHandle.style.opacity = 1;
            targetHandle.style.zIndex = 1;
            this.view.container.setAttribute('draggable', true);
            this.view.editLayer.removeAttribute('class');
            //CLEANUP
            targetHandle.parentNode.removeChild(handleClone);
            targetHandle.removeEventListener('mouseup', boundMouseUp);
            targetHandle.removeEventListener('mousemove', boundMove);
        }
        var boundMouseUp = mouseUp.bind(this);
        targetHandle.addEventListener('mouseup', boundMouseUp);
    }
}




///////
//REGISTER ELEMENT
if (!window.customElements.get('cogni-container')) {
    window.customElements.define('cogni-container', Container);
}
