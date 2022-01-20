import React, { useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ExtensionDetailsFormType, useStyles } from './utils';
import { Grid, Box } from '@material-ui/core';
import TextField from '../../../TextField/TextField';
import IconWithTooltip from '../../../Tooltip/IconWithTooltip';
import { useFormikContext } from 'formik';
import DidNumberSelectField from '../../../DIDNumbers/DidNumberSelectField';
import EmailOptionSelect from '../../../EmailOptionSelect/EmailOptionSelect';
import FaxFormatSelect from '../../../FaxFormatSelect/FaxFormatSelect';
import CustomizedChip from '../../../Chip/Chip';
import classNames from 'classnames';
import { useSelector } from 'react-redux';
import { APIErrorInterface, ReduxState } from '../../../../store/types';

type DetailsFormType = {
    i_account?: number;
    primaryAccountDidNumber?: string;
};

const DetailsForm: React.VFC<DetailsFormType> = ({
    i_account,
    primaryAccountDidNumber,
}) => {
    const classes = useStyles();
    const { t } = useTranslation();

    const {
        values,
        handleChange,
        errors,
        setFieldValue,
        setFieldError,
        validateField,
        dirty,
    } = useFormikContext<ExtensionDetailsFormType>();

    const apiErrors = useSelector<ReduxState, APIErrorInterface | undefined>(
        (state) => state.faxMailboxes.createNewFaxMailboxesErrors,
    );

    const renderDidTags = useCallback(
        (selected: string[]) => {
            return selected.map((v) => (
                <CustomizedChip
                    key={v}
                    label={v}
                    handleDelete={
                        v !== primaryAccountDidNumber
                            ? () => {
                                  setFieldValue(
                                      'didNumber',
                                      values.didNumber.filter((w) => w !== v),
                                  );
                              }
                            : undefined
                    }
                />
            ));
        },
        [primaryAccountDidNumber],
    );

    useEffect(() => {
        if (values.extensionEmail.length > 0 && dirty)
            validateField('extensionEmail');
    }, [values.extensionEmail]);

    useEffect(() => {
        if (
            apiErrors?.faultcode ===
                'Server.Customer.Ext_HG_number_already_in_use' ||
            apiErrors?.faultcode ===
                'Client.Customer.Ext_HG_number_already_in_use'
        ) {
            setFieldError(
                'extensionNumber',
                t('errors:faxMailboxes.numberInUse'),
            );
        } else if (
            apiErrors?.faultcode === 'Server.Customer.duplicate_id' ||
            apiErrors?.faultcode === 'Client.Customer.duplicate_id'
        ) {
            setFieldError(
                'extensionNumber',
                t('errors:faxMailboxes.alreadyExists'),
            );
        }
    }, [apiErrors]);

    return (
        <>
            <Grid
                item
                className={classNames(
                    classes.itemsContainer,
                    classes.marginBottom,
                )}
            >
                <Box className={classNames(classes.rowBox, classes.marginTop0)}>
                    <TextField
                        id="extensionName"
                        label={t('common:name')}
                        onChange={handleChange}
                        value={values.extensionName}
                        setFieldError={setFieldError}
                        icon={
                            <IconWithTooltip
                                dataQa="create-faxMailbox-name-tooltip"
                                tooltipText={t('tooltips:faxMailboxes.name')}
                                copy={false}
                            />
                        }
                        iconPosition="end"
                        dataQa="create-extension-name-input"
                        helperText={errors?.extensionName}
                        required
                        maxLength={32}
                    />
                    <TextField
                        id="extensionNumber"
                        label={t('screens:extensions.extensionNumber')}
                        onChange={handleChange}
                        value={values.extensionNumber}
                        setFieldError={setFieldError}
                        icon={
                            <IconWithTooltip
                                dataQa="create-faxMailbox-number-tooltip"
                                copy={false}
                                tooltipText={t(
                                    'tooltips:faxMailboxes.detailsExtensionNumber',
                                )}
                            />
                        }
                        iconPosition="end"
                        dataQa="create-extension-number-input"
                        helperText={errors?.extensionNumber}
                        required
                        maxLength={5}
                    />
                </Box>
                <Box className={classes.rowBox}>
                    <TextField
                        id="extensionEmail"
                        label={t('common:emailAddress')}
                        onChange={handleChange}
                        value={values.extensionEmail}
                        setFieldError={setFieldError}
                        icon={
                            <IconWithTooltip
                                copy={false}
                                dataQa="edit-fax-mailbox-email-tooltip"
                                tooltipText={t(
                                    'tooltips:faxMailboxes.detailsEmail',
                                )}
                            />
                        }
                        iconPosition="end"
                        dataQa="create-fax-mailbox-email-input"
                        helperText={errors?.extensionEmail}
                        required
                        className={classes.solidHeight}
                        maxLength={128}
                    />
                    <DidNumberSelectField
                        fetchData={true}
                        dataQa={'fax-mailbox-did-numbers-input'}
                        value={values.didNumber}
                        onChange={(e, value) =>
                            setFieldValue('didNumber', value)
                        }
                        tooltipMsg={t('tooltips:faxMailboxes.didNumbers')}
                        copyTooltip={false}
                        tooltipDataQa="fax-mailbox-did-numbers-tooltip"
                        id="didNumber"
                        onlyFree
                        i_account={i_account}
                        getOptionDisabled={(v) => v === primaryAccountDidNumber}
                        renderDidTags={renderDidTags}
                        classes={{ container: classes.marginBottom }}
                    />
                </Box>
                <Box className={classes.rowBox}>
                    <EmailOptionSelect
                        id="action"
                        label={t('screens:extensions.action')}
                        onChange={(e, value) =>
                            setFieldValue('action', value.value)
                        }
                        value={values.action}
                        setFieldError={setFieldError}
                        tooltipDataQa="create-fax-mailbox-email-tooltip"
                        dataQa="create-fax-mailbox-email-input"
                    />

                    <FaxFormatSelect
                        id="format"
                        label={t('common:format')}
                        value={values.format}
                        onChange={(e, value) =>
                            setFieldValue('format', value.value)
                        }
                    />
                </Box>
            </Grid>
        </>
    );
};

export default DetailsForm;
