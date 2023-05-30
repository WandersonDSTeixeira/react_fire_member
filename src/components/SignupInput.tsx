import { TextField } from '@mui/material';

type Props = {
  type: string;
  label: string;
  value: string;
  onChange: (newValue: string) => void;
  disabled: boolean;
  required?: boolean;
  error?: boolean;
  helperText?: string;
}

const SignupInput = (props: Props) => {

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
      sx={{
        mb: 2,
        '& .MuiOutlinedInput-root': {
          color: '#000'
        },
        '& .MuiInputLabel-root.Mui-focused': {
          fontSize: '13px'
        },
        '& .MuiInputLabel-root.Mui-error': {
          fontSize: '13px'
        },
        '& .MuiInputLabel-shrink': {
          fontSize: '13px'
        }
      }}
      fullWidth
    />
  );
}

export default SignupInput;