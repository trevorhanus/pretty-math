import { observer } from 'mobx-react';
import * as React from 'react';

export interface IFunctionNameProps {
    name: string;
}

export const FunctionName = observer((props: IFunctionNameProps) => {
    const { name } = props;

    return (
        <span className="function-name">
            {name}
        </span>
    );
});
