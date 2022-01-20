import * as React from 'react';
import { render } from '@testing-library/react';
import AssignedCell from './AssignedCell';

describe('render component', () => {
    it('use style when decore passed', () => {
        const { container } = render(<AssignedCell text={'Hello'} decore />);

        const element = container.getElementsByTagName('span');
        expect(element).not.toBeNull();
        expect(element[0]).toHaveAttribute('style');
    });

    it('no style attribute when decore on false', () => {
        const { container } = render(
            <AssignedCell text={'Hello'} decore={false} />,
        );

        const element = container.getElementsByTagName('span');
        expect(element).not.toBeNull();
        expect(element[0]).not.toHaveAttribute('style');
    });
});
