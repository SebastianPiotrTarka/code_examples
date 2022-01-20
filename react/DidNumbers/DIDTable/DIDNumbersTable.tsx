import React from 'react';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { CustomerDIDNumberType } from '../../../store/types/CustomerDIDNumber';
import { useState } from 'react';
import { DialogButton } from '../../../components/AlertDialog/DialogContainer';
import AlertDialog from '../../../components/AlertDialog/AlertDialog';
import AssignDIDNumberDialog from '../../../components/DIDNumbers/AssignDIDNumberDialog';
import { PaginationMode } from '../../../components/DataGrid/types';
import DataGrid from '../../../components/DataGrid/DataGrid';
import { useDispatch } from 'react-redux';
import { generateColumns, useStyleTable } from './utils';
import { actions } from '../../../store';
import CallHistoryDetails from '../../../views/RingGroups/CallHistoryDetails';
import { RingGroupType } from '../../../store/types/RingGroup';

type DIDNumbersTablePropsType = {
    rows: CustomerDIDNumberType[];
    loading: boolean;
    rowCount: number;
    currentPage: number;
    onPageChange: (params: { pageSize: number; page: number }) => void;
    onPageSizeChange: (params: { pageSize: number; page: number }) => void;
    dataQa?: string;
    isServicesLoading?: boolean;
};

const DIDNumbersTable: React.FC<DIDNumbersTablePropsType> = ({
    rows,
    loading,
    rowCount,
    onPageChange,
    onPageSizeChange,
    dataQa,
    isServicesLoading,
}) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const [
        selectedCallHistoryRow,
        setSelectedRowHistoryRow,
    ] = useState<RingGroupType | null>(null);

    const [callHistoryModalVisible, setCallHistoryModalVisible] = useState(
        false,
    );
    const [removeModal, setRemoveModal] = useState<{
        isOpen: boolean;
        name?: string;
        id?: number;
        i_master_account?: number;
    }>();

    const hideRemovalModal = () => {
        setRemoveModal({ isOpen: false });
    };
    const showRemoveDIDNumberModal = (
        id?: number,
        name?: string,
        i_master_account?: number,
    ) => {
        setRemoveModal({
            isOpen: true,
            id,
            name,
            i_master_account,
        });
    };

    const deleteSelectedDidNumber = () => {
        dispatch(
            actions.deleteDIDNumber.request({
                did_id: removeModal?.id,
                i_master_account: removeModal?.i_master_account,
                callback: hideRemovalModal,
            }),
        );
    };

    const [editDIDModal, setEditDIDModal] = useState<{
        isOpen: boolean;
        itemToEdit?: CustomerDIDNumberType;
    }>({
        isOpen: false,
    });
    const showEditDIDNumberModal = (item?: CustomerDIDNumberType) => {
        setEditDIDModal({ isOpen: true, itemToEdit: item });
    };

    const toggleCallHistoryVisibility = () =>
        setCallHistoryModalVisible(!callHistoryModalVisible);

    const onCallHistoryClick = (param: CustomerDIDNumberType) => {
        //@ts-ignore
        const params: RingGroupType = {
            id: param.i_did_number.toString(),
            name: param.did_number,
        };
        setSelectedRowHistoryRow(params);
        setCallHistoryModalVisible(true);
    };
    const classes = useStyleTable();

    const columns = useMemo(
        () =>
            generateColumns(
                t,
                showRemoveDIDNumberModal,
                showEditDIDNumberModal,
                classes,
                onCallHistoryClick,
                loading,
                isServicesLoading,
            ),
        [loading, rows, isServicesLoading],
    );

    return (
        <div data-qa={dataQa} style={{ display: 'flex', flex: 1 }}>
            <DataGrid<CustomerDIDNumberType>
                columns={columns}
                data={rows}
                rowCount={rowCount}
                loading={loading}
                onPageChange={onPageChange}
                onPageSizeChange={onPageSizeChange}
                paginationMode={PaginationMode.Server}
                centeredRows
                className={classes.table}
                classes={{ tableContainer: classes.tableContainer }}
            />

            <AssignDIDNumberDialog
                item={editDIDModal.itemToEdit}
                isOpen={editDIDModal.isOpen}
                clickOnClose={() => setEditDIDModal({ isOpen: false })}
            />
            <AlertDialog
                isOpen={!!removeModal?.isOpen}
                header={t('screens:didNumbers.deleteDIDNumber')}
                description={t(
                    'screens:didNumbers.deleteDIDNumberDescription',
                    {
                        name: removeModal?.name,
                    },
                )}
                contentClass="medium-width-modal-delete"
                dialogActionsButtons={[
                    <DialogButton
                        key="cancel"
                        label={t('common:cancel')}
                        onClick={() =>
                            setRemoveModal({ ...removeModal, isOpen: false })
                        }
                    />,
                    <DialogButton
                        key="delete"
                        label={t('common:delete')}
                        className={classes.primaryModalButton}
                        onClick={deleteSelectedDidNumber}
                        dataQa={'delete-selected-did-number'}
                    />,
                ]}
                dataQa="remove-did-number-modal"
                dataTestId={'remove-did-number-modal'}
                hideHeader={true}
                className={classes.removeModal}
            />
            <CallHistoryDetails
                isOpen={callHistoryModalVisible}
                toggleVisibility={toggleCallHistoryVisibility}
                form={selectedCallHistoryRow}
                customCld={selectedCallHistoryRow?.name}
            />
        </div>
    );
};

export default DIDNumbersTable;
