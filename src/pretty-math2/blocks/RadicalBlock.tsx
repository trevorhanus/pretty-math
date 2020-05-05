import React from 'react';
import { between, haveWindow } from 'common';
import { observer } from 'mobx-react';
import { IBlockConfig } from 'pretty-math2/interfaces';
import { Block, BlockList } from 'pretty-math2/model';
import { PrinterOutput } from '../utils/PrinterOutput';

export interface RadicalBlockData {}
export interface RadicalBlockChildren {
    inner: BlockList;
}

export type RadicalBlockChildNames = 'inner';
export type RadicalBlock = Block<RadicalBlockData, RadicalBlockChildNames>;

export const radicalBlockConfig: IBlockConfig<RadicalBlock> = {
    type: 'math:squareRoot',

    render: ({ block, children, style }) => (
        <span
            className='radical'
            style={style}
        >
            <span className='inner'>{children.inner}</span>
            <RadicalSymbol />
        </span>
    ),

    printers: {
        calchub: ({ block, children }) => {
            return PrinterOutput.fromMany([
                { text: '\\sqrt', source: block },
                { text: '{', source: block },
                children.inner,
                { text: '}', source: block }
            ]);
        },
        python: ({ block, children }) => {
            return PrinterOutput.fromMany([
                { text: 'sqrt', source: block },
                { text: '(', source: block },
                children.inner,
                { text: ')', source: block }
            ]);
        }
    },

    composite: {
        children: {
            inner: {
                canBeNull: false,
                childNumber: 0
            }
        },
        cursorOrder: {
            right: {},
            left: {},
            up: {},
            down: {}
        },
        entry: {
            fromLeft: {
                up: [],
                right: ['inner'],
                down: []
            },
            fromRight: {
                up: [],
                left: ['inner'],
                down: []
            }
        }
    }
};

export interface IRadicalSymbolProps {
}

export interface IRadicalSymbolState {
    height: number;
    width: number;
    fontSize: number;
    fill: string;
}

@observer
export class RadicalSymbol extends React.Component<IRadicalSymbolProps, IRadicalSymbolState> {
    span: HTMLSpanElement;
    mutationObserver: MutationObserver;

    constructor(props: IRadicalSymbolProps) {
        super(props);
        this.state = {
            height: 0,
            width: 0,
            fontSize: 16,
            fill: null
        };
    }

    componentDidMount() {
        if (!this.span || !this.span.offsetParent) {
            return;
        }

        if (haveWindow()) {
            require('mutationobserver-shim'); // polyfill for MutationObserver, uses native MutationObserver if it exists
            this.mutationObserver = new (window as any).MutationObserver(this.handleMutation);
            this.mutationObserver.observe(this.span.offsetParent, observerConfig);
            this.updateState();
        }
    }

    componentWillUnmount() {
        this.mutationObserver.disconnect();
    }

    render() {
        const { height, width, fontSize } = this.state;
        const f = fontSize;
        const h = height;
        const w = width;

        const radicalPts = [
            new Point(0, h - (h * 0.395)),
            new Point(0.26 * f, h - (h * 0.5)),
            new Point(0.5 * f, h - (h * 0.137)),
            new Point(f, 0),
            new Point(w, 0),
            new Point(w, between(1, 2, h * 0.029)),
            new Point(f + (f * 0.01), between(1, 2, h * 0.029)),
            new Point(0.48 * f, h),
            new Point(0.446 * f, h),
            new Point(0.174 * f, h - (h * 0.425)),
            new Point(0.023 * f, h - (h * 0.364)),
        ];

        return (
            <span
                className="radical-symbol"
                ref={this.setRef}
            >
                <svg style={{ stroke: 'none', height: '100%', width: '100%', fill: this.state.fill }}>
                    <polygon points={radicalPts.map(p => p.toString()).join(' ')} />
                </svg>
            </span>
        );
    }

    setRef = (ref: HTMLSpanElement) => {
        this.span = ref;
    };

    handleMutation = () => {
        this.updateState();
    };

    updateState = () => {
        if (!this.span) {
            return;
        }

        const offsetParent = this.span.offsetParent as HTMLElement;
        const fontSize = getComputedStyle(offsetParent).fontSize;

        this.setState({
            height: offsetParent.offsetHeight,
            width: offsetParent.offsetWidth,
            fontSize: +fontSize.replace('px', ''),
            fill: window.getComputedStyle(this.span).color
        });
    };
}

export class Point {
    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    toString(): string {
        return [this.x, this.y].join(',');
    }
}

const observerConfig: MutationObserverInit = {
    attributes: true,
    characterData: true,
    childList: true,
    subtree: true,
};
