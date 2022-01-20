import * as React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react';
import { DidNumbersStateType } from '../../store/reducers/didNumbers/reducer';
import DidNumbersList from '../DidNumbers/DidNumbersList';
import { mockStore } from '../../store/mockStore';
import { Provider } from 'react-redux';
import { I18nextProvider } from 'react-i18next';
import i18n from '../../services/i18n';
import { act } from 'react-dom/test-utils';
import * as faker from 'faker';
import { actions } from '../../store';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';
import { Subdivision } from '../../store/types/Subdivision';
import {didNumberMockState} from "./mockData";

const subdivisions: Subdivision[] = [
    {
        iso_3166_1_a2: faker.lorem.word(1),
        name: faker.lorem.word(2),
        i_country_subdivision: 1,
        iso_3166_2: faker.lorem.word(3),
    },
];

describe('render did list view', () => {
    const initState: DidNumbersStateType = didNumberMockState;

    const callHistory = {
        items: [
            {
                i_xdr: 1,
                call_recording_id: '1',
                cr_download_ids: ['1'],
                connect_time: '2020-10-10 10:10:10',
                CLI: faker.lorem.word(2),
                CLD: faker.lorem.word(4),
                charged_amount: 0.42,
                charged_quantity: 20,
            },
        ],
        isLoading: false,
        total: 1,
    };

    let store: ReturnType<typeof mockStore>;
    const memoryHistory = createMemoryHistory();

    const getView = (
        initialState: DidNumbersStateType,
        customCallHistory?: Object,
    ) => {
        store = mockStore({
            auth: { session_id: faker.lorem.word(6) },
            didNumbers: initialState,
            didProvider: { isLoading: false },
            dashboard: {},
            calls: { callHistory: customCallHistory || callHistory },
            generic: {
                globalCurrency: {
                    name_major: 'dollar',
                    iso_4217: 'USD',
                    iso_4217_num: '840',
                    name: 'US Dollar',
                    decimal_digits: 2,
                    name_minor: 'cent',
                },
                subdivisionsList: subdivisions,
            },
        });

        return render(
            <Router history={memoryHistory}>
                <Provider store={store}>
                    <I18nextProvider i18n={i18n}>
                        <div style={{ height: 350, width: 600 }}>
                            <DidNumbersList />
                        </div>
                    </I18nextProvider>
                </Provider>
            </Router>,
        );
    };

    test('render table with no data text', () => {
        console.error = jest.fn();
        const { getByText } = getView(didNumberMockState);

        expect(getByText(i18n.t<string>('common:noData'))).toBeInTheDocument();
    });

    test('render table with data', () => {
        console.error = jest.fn();
        const { container } = getView(initState);

        const table = container.querySelector('[data-qa="did-list-table"]');
        const rows = table?.getElementsByClassName('MuiTableRow-root');

        expect(
            container.querySelector('[data-qa="did-list-view-header"]'),
        ).toBeInTheDocument();
        expect(table).toBeInTheDocument();
        expect(rows).toHaveLength(5); //with header
        });

    test('it render dialog after click on edit', async () => {
        console.error = jest.fn();
        const { getByTestId } = getView({
            items: [
                {
                    i_did_number: 1111,
                    area_name: 'Not Applicable',
                    country_name: 'Not Applicable',
                    did_number: '000000001111',
                    description: '',
                    is_provisioned: 0,
                    i_customer: 88,
                    pricing: {
                        customer_costs: {
                            activation: 0,
                            periodic: 0,
                            free_of_charge: 'N',
                            iso_4217: 'USD',
                        },
                    },
                },
            ],
            total: 1,
            filters: {},
            loading: false,
            accountsToAssign: { isLoading: false },
        });

        const editButtons = getByTestId('edit-list-item-button');

        act(() => {
            editButtons.dispatchEvent(
                new MouseEvent('click', { bubbles: true }),
            );
        });

        await waitFor(() => {
            expect(getByTestId('modal-container')).toBeInTheDocument();
        });
    });

    test('it render dialog delete after click on delete', async () => {
        console.error = jest.fn();
        const { getByTestId, getByText } = getView({
            items: [
                {
                    i_did_number: 1111,
                    area_name: 'Not Applicable',
                    country_name: 'Not Applicable',
                    did_number: '000000001111',
                    description: '',
                    is_provisioned: 0,
                    i_customer: 88,
                    pricing: {
                        customer_costs: {
                            activation: 0,
                            periodic: 0,
                            free_of_charge: 'N',
                            iso_4217: 'USD',
                        },
                    },
                },
            ],
            total: 1,
            filters: {},
            loading: false,
            accountsToAssign: { isLoading: false },
        });

        const deleteButton = getByTestId('remove-list-item-button');

        act(() => {
            fireEvent.click(deleteButton);
        });

        await waitFor(() => {
            expect(getByTestId('remove-did-number-modal')).toBeInTheDocument();
        });

        act(() => {
            fireEvent.click(getByText(i18n.t<string>('common:delete')));
        });

        expect(store.getActions()[0]).toMatchObject(
            actions.didNumbers.request({ limit: 50, offset: 0 }),
        );
        expect(store.getActions()[1]).toMatchObject(
            actions.deleteDIDNumber.request({}),
        );
    });
});
