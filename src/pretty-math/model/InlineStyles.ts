import { action, IObservableArray, observable, ObservableMap, reaction } from 'mobx';
import { CSSProperties } from 'react';
import { IModel } from 'pretty-math/internal';

export type BlockPosition = string;

export interface InlineStyle {
    start: BlockPosition;
    end: BlockPosition;
    style: CSSProperties;
}

export type InlineStylesState = InlineStyle[];

// export class InlineStyles implements IModel<InlineStylesState> {
//     readonly styleMap: ObservableMap<string, CSSProperties>;
//     readonly styles: IObservableArray<InlineStyle>;
//
//     constructor() {
//         this.styles = observable.array<InlineStyle>([], { deep: false });
//         this.styleMap = observable.map<string, CSSProperties>({}, { deep: false });
//     }
//
//     getStyle(pos: BlockPosition): CSSProperties {
//         return this.styleMap.get(pos);
//     }
//
//     @action
//     appendStyle(inlineStyle: InlineStyle) {
//
//     }
//
//     @action
//     applyJS(state: InlineStylesState) {
//         this.styles.replace(state);
//     }
//
// }
