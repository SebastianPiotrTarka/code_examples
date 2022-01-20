import { makeStyles } from '@material-ui/core/styles';
import { Colors } from '../../../../styles/Colors';
import i18n from '../../../../services/i18n';
import * as Yup from 'yup';
import { EmailOption } from '../../../../store/types/Voicemail';
import { FaxFormat } from '../../AutoAttendants/Incoming/utils';
import { ExtensionPlanFormType } from '../../Extensions/PlanForm.utils';

export const useStyles = makeStyles(() => ({
    itemsContainer: {
        padding: '22px 16px',
        display: 'flex',
        flexDirection: 'column',
        marginBottom: 24,
        '& .MuiInputBase-root': {
            width: 390,
        },
    },
    columnItemsContainer: {
        flexDirection: 'column',
        '& .MuiFormControl-root:first-of-type': {
            marginRight: '15px !important',
        },
    },
    inputs: {
        display: 'flex',
        flexDirection: 'column',
        '& .MuiFormControl-root:first-of-type': {
            marginRight: 24,
        },

        '& .MuiInputLabel-root': {
            marginLeft: 10,
        },
    },
    rowBoxHeader: {
        marginRight: 20,
        fontSize: 16,
    },
    boldHeader: {
        fontWeight: 700,
    },
    musicRowBox: {
        padding: 0 + '!important',
        display: 'flex',
        alignItems: 'flex-end',
        marginTop: 11,

        '& .MuiButton-label': {
            color: Colors.White,
        },

        '& .MuiFormControl-root': {
            flex: 1,
            marginRight: 14,
        },
    },
    sectionSpace: {
        marginTop: 48,
    },
    didNumbers: {
        height: 'auto',
        '& .MuiAutocomplete-inputRoot': {
            paddingTop: 25,
        },
        '& .MuiInput-input': {
            padding: '0 !important',
        },
        '& .MuiInputBase-root': {
            paddingBottom: 5,
        },
        '& .MuiAutocomplete-endAdornment': {
            top: 'unset',
            bottom: 14,
        },
    },
    didNumbersIconContainer: {
        alignItems: 'flex-end',
        paddingBottom: 16,
    },
    solidHeight: {
        maxHeight: 60,
    },
    marginTop0: {
        marginTop: '0px !important',
    },
    marginBottom: {
        marginBottom: 0,
    },
    rowBox: {
        padding: 0 + '!important',
        display: 'flex',
        marginTop: 32,
        '& > :first-child': {
            marginRight: 24,
            maxWidth: 390,
        },
        '& > :last-child': {
            maxWidth: 390,
        },
    },
}));

export type ExtensionDetailsFormType = {
    extensionName?: string;
    extensionNumber: string;
    extensionEmail: string;
    didNumber: string[];
    action?: EmailOption;
    format?: FaxFormat;
};

export const extensionFormDefaultValues: EditFaxMailboxForm = {
    didNumber: [],
    extensionEmail: '',
    extensionName: '',
    extensionNumber: '',
    selectedAddonsProducts: [],
    selectedMainProduct: -1,
};

export type EditFaxMailboxForm = ExtensionDetailsFormType &
    ExtensionPlanFormType;

const requiredFieldError = i18n.t('errors:common.emptyInput');
const numberDigitsError = i18n.t('errors:ringGroups.numberOnlyDigits');
const numberMaxLengthError = i18n.t('errors:ringGroups.numberMaxLength');
const nameMaxLengthError = i18n.t('errors:extensions.max32Length');
const emailError = i18n.t('errors:extensions.emailAddress');

export const ExtensionFaxMailboxValidationSchema = Yup.object().shape({
    extensionNumber: Yup.string()
        .max(5, numberMaxLengthError)
        .matches(/^[0-9]*$/, numberDigitsError)
        .required(requiredFieldError),
    extensionName: Yup.string()
        .max(32, nameMaxLengthError)
        .required(requiredFieldError),
    extensionEmail: Yup.string().email(emailError).required(requiredFieldError),
});
