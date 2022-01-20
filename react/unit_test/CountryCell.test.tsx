import * as React from 'react';
import { render } from '@testing-library/react';
import CountryCell from '../DidNumbers/CountryCell';

describe('render country cell', () => {
    it('should contain two strings', () => {
        const { container } = render(
            <CountryCell country="country" area="are" />,
        );

        const elements = container.getElementsByTagName('span');

        expect(elements).toHaveLength(2);
        expect(elements[0]).toHaveTextContent('country');
        expect(elements[1]).toHaveTextContent('are');
    });
});
