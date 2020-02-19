export interface IScrollIntoViewOptions {
    behavior?: 'auto' | 'smooth',
    block?: 'start' | 'center' | 'end' | 'nearest',
    inline?: 'start' | 'center' | 'end' | 'nearest'
}

export const scrollIntoView = (element: HTMLElement, options: boolean | IScrollIntoViewOptions) => {
    if (element == null) {
        return;
    }

    let viewport = scrollParent(element);

    let deltaX = 0;
    let deltaY = 0;

    let elementRect = element.getBoundingClientRect();
    let viewportRect = viewport.getBoundingClientRect();

    if (typeof options != 'boolean') {

        switch (options.block) {

            case 'start':
                deltaY = elementRect.top - viewportRect.top;
                break;

            case 'center':
                deltaY = elementRect.top + (element.offsetHeight / 2) - viewportRect.top + (viewportRect.offsetHeight / 2);
                break;

            case 'end':
                deltaY = (elementRect.top + element.offsetHeight) - (viewportRect.top + viewport.offsetHeight);
                break;

            case 'nearest':
                if (elementRect.top < viewportRect.top) {
                    deltaY = elementRect.top - viewportRect.top;
                }

                if (elementRect.top + element.offsetHeight > viewportRect.top + viewport.offsetHeight) {
                    deltaY = (elementRect.top + element.offsetHeight) - (viewportRect.top + viewport.offsetHeight);
                }
                break;
        }
    }

    viewport.scroll(viewport.scrollLeft + deltaX, viewport.scrollTop + deltaY)
};

const scrollParent = (element: HTMLElement) => {
    if (element == null) return document.scrollingElement || document;

    let parent = element.parentElement;

    if (
        /(auto|scroll)/.test(getComputedStyle(parent).getPropertyValue('overflow')) ||
        /(auto|scroll)/.test(getComputedStyle(parent).getPropertyValue('overflow-y')) ||
        /(auto|scroll)/.test(getComputedStyle(parent).getPropertyValue('overflow-x'))
    ) {
        return parent;
    }
    return scrollParent(parent);
};
