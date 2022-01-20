import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import * as actions from '../../store/actions';
import Header from '../../components/ListViewHeader/Header';
import { ReduxState } from '../../store/types';
import DIDNumbersTable from './DIDTable/DIDNumbersTable';
import DIDInventoryDialog from '../../components/DIDNumbers/DIDInventroyDialog';
import usePageTitle from '../../hooks/usePageTitle';
import { useStyles } from './DIDTable/utils';
import DidFilters from './DidFilters';

const DidNumbersList = () => {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const classes = useStyles();
    const [page, setPage] = useState(0);
    usePageTitle();

    const [showInventoryProvider, setShowInventoryProvider] = useState(false);

    const handleInventoryProviderClick = () => {
        setShowInventoryProvider((prev) => !prev);
    };

    const { items, total, allTotal, isServicesLoading } = useSelector(
        (state: ReduxState) => state.didNumbers,
    );

    const { inUseDidNumbers } = useSelector(
        (state: ReduxState) => state.dashboard,
    );

    const { loading } = useSelector((state: ReduxState) => state.didNumbers);

    const fetchData = (
        params?: { pageSize: number; page: number },
        isInitialCall?: boolean,
    ) => {
        dispatch(
            actions.didNumbers.request({
                limit: params?.pageSize || 50,
                offset: params ? params.page * params.pageSize : 0,
                initialCall: isInitialCall,
                area_name: undefined,
                country_name: undefined,
                number: undefined,
            }),
        );
    };

    useEffect(() => {
        fetchData(undefined, true);
    }, []);

    const dataToDisplay = useMemo(
        () => items?.map((o) => ({ id: o?.i_did_number, ...o })) ?? [],
        [items],
    );

    const onPageChange = useCallback((params) => {
        fetchData({
            pageSize: params.pageSize,
            page: params.page,
        });
        setPage(params.page);
    }, []);

    const onPageSizeChange = useCallback(
        (params) => fetchData({ pageSize: params.pageSize, page: 0 }),
        [],
    );

    return (
        <div className={classes.mainContainer}>
            <div className={classes.scrollable}>
                <Header
                    title={t('screens:didNumbers.listTitle')}
                    buttonText={t('common:addNewButton')}
                    totalNumber={allTotal || 0}
                    ofNumber={inUseDidNumbers || 0}
                    dataQa={'did-list-view-header'}
                    plusIcon={true}
                    buttonOnClick={handleInventoryProviderClick}
                    customClass={classes.header}
                    ofText={t('common:used')}
                />
                <DidFilters />

                <DIDInventoryDialog
                    isOpen={showInventoryProvider}
                    clickOnClose={handleInventoryProviderClick}
                />

                <DIDNumbersTable
                    rows={dataToDisplay}
                    loading={loading}
                    currentPage={page}
                    rowCount={total}
                    onPageChange={onPageChange}
                    onPageSizeChange={onPageSizeChange}
                    dataQa={'did-list-table'}
                    isServicesLoading={isServicesLoading}
                />
            </div>
        </div>
    );
};

export default DidNumbersList;
