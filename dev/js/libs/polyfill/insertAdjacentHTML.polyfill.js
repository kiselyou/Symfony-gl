export function insertAdjacentElement(position, elem) {
    switch (position.toLowerCase()) {
        case 'beforebegin':
            this.parentNode.insertBefore(elem, this);
            break;
        case 'afterbegin':
            parent.insertBefore(elem, elem.firstChild);
            break;
        case 'beforeend':
            this.appendChild(elem);
            break;
        case 'afterend':
            this.parentNode.insertBefore(elem, this.nextSibling);
            break;
    }
    return elem;
}