import { unset } from 'lodash';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { Colors } from '../../styles/Colors';

type CountryCellProps = {
    country: string;
    area: string;
};

const CountryCell: React.FC<CountryCellProps> = ({ country, area }) => {
    const { t } = useTranslation();

    return (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ lineHeight: '22px' }}>{country}</span>
            {area &&
                !(
                    country === t('common:notApplicable') &&
                    area === t('common:notApplicable')
                ) && (
                    <span
                        style={{
                            fontSize: '14px',
                            lineHeight: '22px',
                            color: `${Colors.Gray5}`,
                        }}
                    >
                        {area}
                    </span>
                )}
        </div>
    );
};

export default CountryCell;
