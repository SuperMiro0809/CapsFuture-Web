import PropTypes from 'prop-types';
import { useFormContext, Controller } from 'react-hook-form';
// @mui
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import bg from 'date-fns/locale/bg';

export default function RHFDatePicker({ name, ...others }) {
    const { control } = useFormContext();

    return (
        <Controller
            name={name}
            control={control}
            render={({ field, fieldState: { error } }) => (
                <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={bg}>
                    <DatePicker
                        {...field}
                        {...others}
                        slotProps={{
                            textField: {
                                fullWidth: true,
                                error: !!error,
                                helperText: error?.message,
                            },
                        }}
                    />
                </LocalizationProvider>
            )}
        />
    );
}

RHFDatePicker.propTypes = {
    name: PropTypes.string
}