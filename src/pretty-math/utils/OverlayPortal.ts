import { canUseDOM, generateId } from 'common';
import { autorun, computed, IReactionDisposer, observable, ObservableMap } from 'mobx';
import * as React from 'react';
import { render } from 'react-dom';

const PORTAL_DIV_ID = 'pretty-math-overlay-portal';

let portalDiv;
function getPortalDiv(): HTMLDivElement {
    if (canUseDOM && !portalDiv) {
        // append the div
        portalDiv = document.createElement('div');
        portalDiv.setAttribute('id', PORTAL_DIV_ID);
        document.body.appendChild(portalDiv);
    }

    return portalDiv;
}

let portalInstance: Portal;
export function getPortal() {
    if (!portalInstance) {
        portalInstance = new Portal();
    }

    return portalInstance;
}

export type HideFn = () => void;
export type RenderFn = (hide?: HideFn) => JSX.Element;

export interface RenderedContainer {
    id: string;
    hide: () => void;
    renderFn: RenderFn;
}

class Portal {
    _renderedMap: ObservableMap<RenderedContainer>;
    _disposer: IReactionDisposer;

    constructor() {
        this._renderedMap = observable.map<RenderedContainer>();
    }

    @computed
    get rendered(): RenderedContainer[] {
        return this._renderedMap.values();
    }

    renderComponents() {
        const div = getPortalDiv();

        if (!div) {
            return;
        }

        this._disposer = autorun(() => {
            const components = this.rendered.map(container => {
                const { hide, id } = container;
                const component = container.renderFn(hide);
                return React.cloneElement(component, { ...component.props, key: id });
            });

            render(
                components,
                div,
            );
        });
    }

    show(renderFn: RenderFn) {
        const id = generateId();
        const hide = () => {
            this._renderedMap.delete(id);
        };

        this._renderedMap.set(id, {
            id,
            hide,
            renderFn,
        });

        if (!this._disposer) {
            this.renderComponents();
        }
    };

}
