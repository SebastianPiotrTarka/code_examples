import { TFunction } from 'react-i18next/*';
import { CustomerDIDNumberType } from '../../store/types/CustomerDIDNumber';
import { ExtensionType } from '../../store/types/Extension';
import { roundUp } from '../../utils/roundUp';

export const getAssignedTo = (
    number: CustomerDIDNumberType,
    t: TFunction<string>,
): string => {
    if (number.extension_name && number.extension_id) {
        return `${number.extension_id} (${number.extension_name})`;
    }

    if (number.extension_id) {
        return number.extension_id;
    }

    if (number.master_account_id) {
        return number.master_account_id?.toString();
    }

    if (number.i_account) {
        return number.did_number;
    }

    return t('screens:didNumbers.undefind');
};

export const mapToName = (
    number: ExtensionType,
    t: TFunction<string>,
): string => {
    if (number.extension_name && number.extension_id) {
        return `${number.extension_id} - ${number.extension_name}`;
    }

    if (number.extension_id) {
        return number.extension_id;
    }

    return number.id?.toString() ?? t('screens:didNumbers.undefind');
};

export const getMonthlyCharges = (
    number: CustomerDIDNumberType,
): { value: any; iso: string } => {
    return {
        value:
            roundUp(number.pricing?.customer_costs?.periodic || 0, 2).toFixed(
                2,
            ) || '0.00',
        iso: number.pricing?.customer_costs?.iso_4217 || '',
    };
};

export const getCountry = (
    number: CustomerDIDNumberType,
): { country: string; area: string } => {
    return {
        country: number.country_name ?? '—',
        area: number.area_name ?? '',
    };
};

export const isAssigned = (number: CustomerDIDNumberType): boolean => {
    return !!(
        number?.extension_id ||
        number?.extension_name ||
        number?.master_account_id
    );
};
