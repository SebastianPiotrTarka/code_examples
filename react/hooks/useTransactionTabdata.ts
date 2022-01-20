import { useSelector } from 'react-redux';
import { ReduxState } from '../store/types';
import { useMemo } from 'react';
import { convertFormatFromBackendToDayJs } from '../utils/dateWithTimezoneConversion';

export const useTransactionTabdata = () => {
    const userDateTimeFormat = useSelector<ReduxState, string>(
        (state) =>
            state.generic.globalCustomerInfo?.customer_info
                ?.out_date_time_format || '',
    );
    const timezoneOffset = useSelector<ReduxState, number>(
        (state) => state.generic.sessionData?.tz_offset || 0,
    );

    const tansactionsList = useSelector(
        (state: ReduxState) => state.billing.transactionsTab?.transactionList,
    );

    const isLoading = useSelector(
        (state: ReduxState) => state.billing.transactionsTab?.isLoading,
    );

    const serviceList = useSelector(
        (state: ReduxState) => state.billing.transactionsTab?.serviceList,
    );

    const dataIsLoading = useSelector(
        (state: ReduxState) => state.billing.transactionsTab?.dataIsLoading,
    );

    return useMemo(() => {
        return {
            userDateTimeFormat: convertFormatFromBackendToDayJs(
                userDateTimeFormat,
            ),
            timezoneOffset,
            currency: tansactionsList?.iso_4217 || 'USD',
            tansactionsList,
            isLoading,
            serviceList,
            dataIsLoading,
        };
    }, [
        userDateTimeFormat,
        timezoneOffset,
        tansactionsList,
        isLoading,
        serviceList,
        dataIsLoading,
    ]);
};
