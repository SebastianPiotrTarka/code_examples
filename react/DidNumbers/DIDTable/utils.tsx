import { TFunction } from 'react-i18next';
import { CustomerDIDNumberType } from '../../../store/types/CustomerDIDNumber';
import { Column } from 'react-table';
import { Colors } from '../../../styles/Colors';
import { getAssignedTo, getCountry, getMonthlyCharges } from '../helpers';
import CountryCell from '../CountryCell';
import { makeStyles } from '@material-ui/core';
import React from 'react';
import CallerInfo from '../../../components/Calls/CallerInfo';
import EmptyRowContent from '../../../components/DataTable/EmptyRowContent';
import CustomizedIconButton from '../../../components/IconButton/IconButton';
import classNames from 'classnames';
import { ReactComponent as CallHistory } from '../../../assets/call_history.svg';
import DataItemActions from '../../../components/DataTable/DataItemActions';
import StatusIcon from '../../../components/Extensions/StatusIcon';
import { ServiceIcon } from '../../../components/Extensions/ServiceIcon';
import CustomizedTooltip from '../../../components/Tooltip/Tooltip';
import i18n from '../../../services/i18n';
import BarLoader from '../../../components/BarLoader/BarLoader';

export const useStyles = makeStyles(() => ({
    mainContainer: {
        background: Colors.SmokeBackground,
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        position: 'relative',
        '& .MuiButton-label': {
            color: 'white',
        },
        flex: 1,

        '& .MuiDataGrid-cell': {
            alignItems: 'center',
        },
        '& thead tr.MuiTableRow-root th.MuiTableCell-root.MuiTableCell-head:last-child': {
            paddingLeft: '2%',
        },
    },
    scrollable: {
        overflowY: 'auto',
        flex: 1,
        padding: '48px 96px 48px 96px',
    },
    header: {
        '& div:first-child': {
            marginRight: 40,
            '& p': {
                marginBottom: 0,
            },
        },
    },

    filters: {
        display: 'flex',
        alignItems: 'center',
        marginBottom: 17,
    },

    filtersContainer: {
        marginBottom: 16,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
    },

    itemsContainer: {
        display: 'flex',
        flexDirection: 'column',
    },

    filterSeparation: {
        marginRight: 16,
        width: '240px',
    },
    rowBox: {
        padding: 0 + '!important',
        display: 'flex',
        alignItems: 'center',
        height: 56,
        marginTop: 57,
    },

    searchButton: {
        marginLeft: 16,
        width: 96,
    },
}));

export const generateColumns = (
    t: TFunction<string>,
    deleteDIDNumber: (
        id?: number,
        name?: string,
        i_master_account?: number,
    ) => void,
    editDIDNumber: (item?: CustomerDIDNumberType) => void,
    classes: ReturnType<typeof useStyleTable>,
    onCallHistoryClick: (param: CustomerDIDNumberType) => void,
    loading?: boolean,
    isServicesLoading?: boolean,
): Column<CustomerDIDNumberType>[] => {
    return [
        {
            Header: '',
            accessor: 'i_customer',
            width: 1,
            maxWidth: 50,
            minWidth: 50,
            Cell: function Cell(params) {
                //@ts-ignore
                const { mainService } = params.row.original;
                const isUnassigned =
                    getAssignedTo(params.row.original, t) === '-';
                if (isServicesLoading || loading) {
                    return (
                        <div className={classes.iconLoader}>
                            <BarLoader dataQa={'service-bar-loader'} />
                        </div>
                    );
                }
                return isUnassigned ? (
                    <CustomizedTooltip
                        title={i18n.t('tooltips:didNumbers.notAssigned')}
                        dataQa={'unassigned'}
                        dataTestId={'unassigned'}
                        copy={false}
                    >
                        <div className={classes.unassigned}>
                            <StatusIcon state={2} />
                        </div>
                    </CustomizedTooltip>
                ) : mainService !== undefined ? (
                    <ServiceIcon
                        type={mainService}
                        dataQa="auto-attendant-icon"
                        title={
                            mainService === 0
                                ? i18n.t('tooltips:didNumbers.autoAttendant')
                                : i18n.t('tooltips:didNumbers.faxMailbox')
                        }
                    />
                ) : null;
            },
        },
        {
            Header: t<string>('screens:didNumbers.didNumber'),
            accessor: 'did_number',
            width: 1.4,
            Cell: function Cell(params) {
                const show =
                    params.row.original.i_master_account ||
                    !params.row.original.i_account;

                if (show) {
                    return (
                        <a>
                            <span
                                className={classes.didLink}
                                onClick={() =>
                                    editDIDNumber(params.row.original)
                                }
                            >
                                {params.row.original.did_number}
                            </span>
                        </a>
                    );
                }

                return (
                    <span className={classes.didWithoutLink}>
                        {params.row.original.did_number}
                    </span>
                );
            },
        },
        {
            Header: t<string>('screens:didNumbers.countryArea'),
            accessor: 'country_name',
            width: 1.7,
            Cell: function Cell(params) {
                const obj = getCountry(params.row.original);
                if (obj.country === null) {
                    return (
                        <div
                            style={{ display: 'flex', flexDirection: 'column' }}
                        >
                            <EmptyRowContent />
                        </div>
                    );
                }
                if (
                    (obj.country.length > 0 || obj.area.length > 0) &&
                    obj.country !== '—'
                )
                    return (
                        <CountryCell country={obj.country} area={obj.area} />
                    );
                return <EmptyRowContent />;
            },
        },
        {
            Header: t<string>('screens:didNumbers.assignedTo'),
            accessor: 'extension_id',
            width: 2,
            Cell: function Cell(params) {
                const assigned = getAssignedTo(params.row.original, t);
                if (assigned.length > 0 && assigned !== '-')
                    return <CallerInfo caller={assigned} />;
                return <EmptyRowContent />;
            },
        },
        {
            Header: t<string>('screens:didNumbers.monthlyCharges'),
            accessor: 'pricing',
            width: 1.5,
            Cell: function Cell(params) {
                const obj = getMonthlyCharges(params.row.original);

                return (
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'flex-end',
                            flex: 1,
                            maxWidth: 103,
                        }}
                    >
                        <span>
                            {obj.value} {obj.iso}
                        </span>
                    </div>
                );
            },
        },
        {
            Header: t<string>('common:actions'),
            accessor: 'i_did_number',
            Cell: function Cell(params) {
                const show =
                    params.row.original.i_master_account ||
                    !params.row.original.i_account;
                return (
                    <div
                        className={classNames(
                            classes.maxHeightCell,
                            classes.disableOverflow,
                        )}
                    >
                        <div className={classes.actions}>
                            <div className={classes.actionWrapper}>
                                <CustomizedIconButton
                                    onClick={() =>
                                        onCallHistoryClick(params.row.original)
                                    }
                                    data-testid="view-call-history-list-item-button"
                                    data-qa="view-call-history-list-item-button"
                                    tooltipText={t(
                                        'tooltips:ringGroups.viewCallHistory',
                                    )}
                                >
                                    <CallHistory />
                                </CustomizedIconButton>
                            </div>
                            {show && (
                                <DataItemActions
                                    onEdit={() => {
                                        editDIDNumber(
                                            params.row
                                                .original as CustomerDIDNumberType,
                                        );
                                    }}
                                    onDelete={() => {
                                        deleteDIDNumber(
                                            params.row.original.i_did_number,
                                            params.row.original.did_number,
                                            params.row.original
                                                .i_master_account,
                                        );
                                    }}
                                />
                            )}
                        </div>
                    </div>
                );
            },
            minWidth: 140,
            maxWidth: 140,
        },
    ];
};

export const useStyleTable = makeStyles(() => ({
    primaryModalButton: {
        '& .MuiButton-label': {
            color: Colors.Primary,
        },
    },

    tableContainer: {
        maxWidth: 1040,
        overflowX: 'hidden',

        '& .MuiTableRow-head': {
            '& :nth-child(1)': {
                textAlign: 'center',
            },
        },
    },
    table: {
        marginTop: 24,
        '& .MuiTableBody-root': {
            '& tr': {
                maxHeight: 71,
            },
        },
        '& .MuiTableHead-root': {
            height: 64,
            '& .MuiTableRow-root': {
                height: 64,
            },
        },
        '& .MuiTableFooter-root': {
            '& .MuiTableRow-footer': {
                '& .MuiTableCell-footer': {
                    '& .MuiTablePagination-root': {
                        height: '64px !important',
                    },
                },
            },
        },
    },
    maxHeightCell: {
        flex: 1,
        alignItems: 'center',
        display: 'flex',
        overflow: 'hidden',
    },
    centeredRow: {
        display: 'flex',
        justifyContent: 'center',
    },
    disableOverflow: {
        overflow: 'unset',
    },
    actions: {
        display: 'flex',
        paddingLeft: 0,
        marginLeft: '-3.2rem',

        '& .MuiIconButton-root': {
            marginRight: 5,
        },
    },
    actionWrapper: {
        marginRight: 5,
        marginLeft: 5,
    },
    statusContainer: {},
    unassigned: {
        minWidth: 30,
        display: 'flex',
        justifyContent: 'center',
        '& span': {
            background: Colors.BorderDark,
        },
    },
    iconLoader: {
        minWidth: 24,
        '& div': {
            height: 24,
            maxHeight: 24,
        },
    },
    removeModal: {
        '& .MuiPaper-root': {
            maxWidth: 280,
        },
        '& .MuiDialogContent-root': {
            background: Colors.White,
            minWidth: 'unset !important',
            paddingBottom: 3,
        },
    },
    didLink: {
        fontSize: 14,
        color: Colors.Secondary1,
        cursor: 'pointer',
    },
    didWithoutLink: {
        fontSize: 14,
    },
}));

export type FiltersDidNumber = {
    country: string;
    number: string;
    area: string;
};
