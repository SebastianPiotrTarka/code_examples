import React from 'react';
import { render } from '@testing-library/react';
import DetailsForm from '../DetailsForm/DetailsForm';
import { mockStore } from '../../../../store/mockStore';
import { mockDidNumbers } from '../../../../tests/mocks/numbers';
import { Provider } from 'react-redux';
import { I18nextProvider } from 'react-i18next';
import i18n from '../../../../services/i18n';
import { Formik } from 'formik';
import FormActions from '../../FormActions';
import {
    EditFaxMailboxForm,
    ExtensionFaxMailboxValidationSchema,
} from '../DetailsForm/utils';
import { FaxFormat } from '../../AutoAttendants/Incoming/utils';
import { EmailOption } from '../../../../store/types/Voicemail';

describe('Fax mailbox extension details form', () => {
    let store: ReturnType<typeof mockStore>;
    const getView = (onSubmit?: (form: EditFaxMailboxForm) => void) => {
        store = mockStore(mockDidNumbers);

        return render(
            <Provider store={store}>
                <I18nextProvider i18n={i18n}>
                    <Formik<EditFaxMailboxForm>
                        initialValues={{
                            format: FaxFormat.MultipagePDFFile,
                            action: EmailOption.Forward,
                            extensionName: 'Test',
                            extensionEmail: 'test@email.com',
                            extensionNumber: '12345',
                            didNumber: ['380970113'],
                            selectedMainProduct: -1,
                            selectedAddonsProducts: [],
                        }}
                        validationSchema={ExtensionFaxMailboxValidationSchema}
                        onSubmit={
                            onSubmit ||
                            (() => {
                                null;
                            })
                        }
                        enableReinitialize
                        validateOnChange={false}
                    >
                        {({ submitForm }) => (
                            <form>
                                <DetailsForm />
                                <FormActions onSave={submitForm} />
                            </form>
                        )}
                    </Formik>
                </I18nextProvider>
            </Provider>,
        );
    };

    test('it render properly', () => {
        const { getByLabelText, getByText } = getView();

        const inputName = getByLabelText(i18n.t<string>('common:name'), {
            exact: false,
        });

        expect(inputName).toBeInTheDocument();
        expect(inputName.getAttribute('value')).toBe('Test');

        const inputExtensionNumber = getByLabelText(
            i18n.t<string>('screens:extensions.extensionNumber'),
            {
                exact: false,
            },
        );

        expect(inputExtensionNumber).toBeInTheDocument();
        expect(inputExtensionNumber.getAttribute('value')).toBe('12345');

        const inputEmail = getByLabelText(
            i18n.t<string>('common:emailAddress'),
            {
                exact: false,
            },
        );

        expect(inputEmail).toBeInTheDocument();
        expect(inputEmail.getAttribute('value')).toBe('test@email.com');

        expect(getByText('380970113')).toBeInTheDocument();

        const actionSelect = getByLabelText(
            i18n.t<string>('screens:extensions.action'),
        );

        expect(actionSelect).toBeInTheDocument();
        // @ts-ignore
        expect(actionSelect.getAttribute('value').toLowerCase()).toBe(
            EmailOption.Forward.toLowerCase(),
        );

        const format = getByLabelText(i18n.t<string>('common:format'));

        expect(format).toBeInTheDocument();
        // @ts-ignore
        expect(format.getAttribute('value').toLowerCase()).toBe(
            i18n.t<string>('enums:incoming.pdf').toLowerCase(),
        );
    });
});
