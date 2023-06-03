import { TextField } from '@mui/material';
import { useAppContext } from '../context';

type Props = {
  type: string;
  label: string;
  value: string;
  onChange: (newValue: string) => void;
  disabled: boolean;
  required?: boolean;
  error?: boolean;
  helperText?: string;
  InputLabelProps?: {
    shrink: boolean
  };
  autoFocus?: boolean;
}

const ProfileInput = (props: Props) => {
  const { darkMode } = useAppContext();

  return (
    <TextField
      type={props.type}
      label={props.label}
      value={props.value}
      onChange={e => props.onChange(e.target.value)}
      disabled={props.disabled}
      required={props.required}
      error={props.error}
      helperText={props.helperText}
      InputLabelProps={props.InputLabelProps}
      autoFocus={props.autoFocus}
      sx={{
        mb: 2,
        '& .MuiInputLabel-root': {
          fontSize: '12px'
        },
        '&:hover .MuiOutlinedInput-root': {
          '& fieldset': {
          borderColor: darkMode ? '#CCC' : '#777',
          }
        },
        '& .MuiOutlinedInput-root.Mui-focused': {
          '& fieldset': {
            borderColor: '#EF8700'
          }
        },
        '& .MuiInputLabel-root.Mui-focused': {
          color: '#EF8700',
          fontSize: '13px'
        },
        '& .MuiInputLabel-root.Mui-error': {
          fontSize: '13px'
        }
      }}
      fullWidth
    />
  );
}

export default ProfileInput;