import { useFormik } from 'formik';
import React, { useMemo } from 'react';
import { FiltersDidNumber, useStyles } from './DIDTable/utils';
import * as actions from '../../store/actions';
import SelectField from '../../components/SelectField/SelectField';
import { Box, Grid } from '@material-ui/core';
import TextField from '../../components/TextField/TextField';
import CustomButton from '../../components/Button/Button';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { ReduxState } from '../../store/types';
import { Subdivision } from '../../store/types/Subdivision';
import { Country } from '../../store/types/Country';

const DidFilters = () => {
    const dispatch = useDispatch();
    const classes = useStyles();
    const { t } = useTranslation();

    const countriesList = useSelector<ReduxState, Country[]>(
        (state) => state.generic.countriesList,
    );

    const subdivisionsList = useSelector<ReduxState, Subdivision[]>((state) => [
        {
            i_country_subdivision: 0,
            iso_3166_1_a2: '',
            iso_3166_2: '',
            name: 'Any',
        },
        ...state.generic?.subdivisionsList,
    ]);

    const countries = [
        ...(countriesList || []),
        {
            iso_3166_1_a2: null,
            name: t('common:notSet'),
        },
    ].sort((v, w) => (v.name > w.name ? 1 : -1));

    const countriesOptionsList = [
        {
            iso_3166_1_a2: '',
            name: 'Any',
        },
        ...(countries || []),
    ];

    const initialValues = useMemo(
        () => ({
            country: 'Any',
            number: '',
            area: 'Any',
        }),
        [],
    );

    const {
        values,
        handleSubmit,
        setFieldValue,
        handleChange,
    } = useFormik<FiltersDidNumber>({
        initialValues,
        onSubmit: (form) => {
            dispatch(
                actions.getFilteredDidNumbers.request({
                    country:
                        form.country === t('common:notSet')
                            ? null
                            : form.country,
                    number: form.number,
                    area: form.area,
                }),
            );
        },
        enableReinitialize: true,
    });

    const getSubdivisions = (iso_3166_1_a2?: string | null) => {
        if (iso_3166_1_a2) {
            dispatch(
                actions.getSubdivisionData.request({
                    iso_3166_1_a2,
                }),
            );
        }
    };

    return (
        <div className={classes.filters}>
            <form className={classes.filtersContainer} onSubmit={handleSubmit}>
                <Grid item className={classes.itemsContainer}>
                    <Box className={classes.rowBox}>
                        <TextField
                            id="number"
                            label={t('common:number')}
                            onChange={handleChange}
                            value={values.number}
                            className={classes.filterSeparation}
                            dataQa={'number-filter-input'}
                        />
                        <SelectField
                            id="country"
                            className={classes.filterSeparation}
                            label={t('screens:didNumbers.country')}
                            onChange={(e, value) => {
                                const country = countriesOptionsList?.find(
                                    (v) => v.name === value,
                                )?.iso_3166_1_a2;

                                setFieldValue('country', value),
                                    setFieldValue('area', initialValues.area),
                                    getSubdivisions(country);
                            }}
                            value={values.country}
                            items={
                                countriesOptionsList?.map((v) => v.name) || []
                            }
                            disableClearable
                        />
                        <SelectField
                            onChange={(e, v) => setFieldValue('area', v)}
                            id={'area'}
                            label={t('screens:calls.area')}
                            items={subdivisionsList?.map((v) => v.name) || []}
                            value={values.area}
                            dataQa="area-portal-user"
                            disableClearable
                            className={classes.filterSeparation}
                        />
                        <CustomButton
                            dataQa="search-button"
                            primary
                            accent
                            type="submit"
                        >
                            {t('common:search')}
                        </CustomButton>
                    </Box>
                </Grid>
            </form>
        </div>
    );
};

export default DidFilters;
